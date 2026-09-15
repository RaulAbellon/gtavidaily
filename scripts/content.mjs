#!/usr/bin/env node
/**
 * Gestión del contenido editorial.
 *
 *   node scripts/content.mjs index          Valida y regenera el índice
 *   node scripts/content.mjs check          Solo valida (para CI)
 *   node scripts/content.mjs new <slug>     Crea la plantilla de un artículo
 *
 * Cada artículo es un fichero JSON en `src/content/articles/`. Este comando es
 * el único sitio donde se genera `index.ts`, así que añadir una noticia es
 * crear el fichero y ejecutar `npm run content`.
 */
import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content", "articles");
const DATA_FILE = path.join(ROOT, "src", "lib", "data.ts");

const COMMAND = process.argv[2] ?? "index";
const ARG = process.argv[3];

const REQUIRED_FIELDS = [
  "slug",
  "title",
  "excerpt",
  "content",
  "category",
  "author",
  "publishedAt",
  "coverLabel",
  "coverAlt",
  "tags",
  "readingTime",
];

const ALLOWED_FIELDS = new Set([
  ...REQUIRED_FIELDS,
  "updatedAt",
  "featured",
  "trending",
  "sources",
]);

const MOJIBAKE = /Ã|Â«|Â»|â€|ï¿½/;
const errors = [];
const warnings = [];

function categorySlugs() {
  const source = readFileSync(DATA_FILE, "utf8");
  const block = source.slice(
    source.indexOf("export const categories"),
    source.indexOf("export const authors")
  );
  return [...block.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

function countWords(content) {
  return content.join(" ").split(/\s+/).filter(Boolean).length;
}

function isPermalink(url) {
  try {
    return new URL(url).pathname.replace(/\/+$/, "").length > 0;
  } catch {
    return false;
  }
}

function validate(file, article, categories) {
  const label = file.replace(/\.json$/, "");

  for (const field of REQUIRED_FIELDS) {
    if (article[field] === undefined || article[field] === null) {
      errors.push(`${label}: falta el campo obligatorio «${field}»`);
    }
  }
  for (const field of Object.keys(article)) {
    if (!ALLOWED_FIELDS.has(field)) {
      errors.push(`${label}: campo desconocido «${field}»`);
    }
  }

  if (article.slug !== label) {
    errors.push(`${label}: el slug del fichero y el campo «slug» no coinciden`);
  }
  if (article.author !== "redaccion") {
    errors.push(`${label}: el autor debe ser «redaccion»`);
  }
  if (!categories.includes(article.category)) {
    errors.push(
      `${label}: la categoría «${article.category}» no existe (válidas: ${categories.join(", ")})`
    );
  }

  const raw = JSON.stringify(article);
  if (MOJIBAKE.test(raw)) errors.push(`${label}: contiene mojibake`);

  if (!Array.isArray(article.content) || article.content.length === 0) {
    errors.push(`${label}: el contenido está vacío`);
  } else if (article.content.some((p) => typeof p !== "string" || !p.trim())) {
    errors.push(`${label}: hay párrafos vacíos`);
  }

  if (typeof article.title === "string") {
    if (article.title.length > 90) errors.push(`${label}: título de ${article.title.length} caracteres (máx 90)`);
    else if (article.title.length > 75) warnings.push(`${label}: título de ${article.title.length} caracteres (recomendado ≤75)`);
  }
  if (typeof article.excerpt === "string") {
    if (article.excerpt.length > 260) errors.push(`${label}: entradilla de ${article.excerpt.length} caracteres (máx 260)`);
    else if (article.excerpt.length > 200) warnings.push(`${label}: entradilla de ${article.excerpt.length} caracteres (recomendado ≤200)`);
  }
  if (typeof article.coverLabel === "string" && article.coverLabel.length > 32) {
    errors.push(`${label}: coverLabel de ${article.coverLabel.length} caracteres (máx 32)`);
  }
  if (typeof article.coverAlt !== "string" || article.coverAlt.length < 10) {
    warnings.push(`${label}: coverAlt demasiado corto`);
  }

  const published = Date.parse(article.publishedAt);
  if (Number.isNaN(published)) errors.push(`${label}: publishedAt no es una fecha válida`);
  if (article.updatedAt) {
    const updated = Date.parse(article.updatedAt);
    if (Number.isNaN(updated)) errors.push(`${label}: updatedAt no es una fecha válida`);
    else if (updated < published) errors.push(`${label}: updatedAt es anterior a publishedAt`);
  }

  const words = Array.isArray(article.content) ? countWords(article.content) : 0;
  const expected = Math.max(1, Math.round(words / 200));
  if (article.readingTime !== expected) {
    warnings.push(
      `${label}: readingTime es ${article.readingTime} y con ${words} palabras debería ser ${expected}`
    );
  }
  if (words < 400) warnings.push(`${label}: solo ${words} palabras`);
  if (words > 900) warnings.push(`${label}: ${words} palabras, quizá demasiado largo`);

  if (!Array.isArray(article.tags) || article.tags.length < 3 || article.tags.length > 6) {
    warnings.push(`${label}: conviene entre 3 y 6 etiquetas`);
  }

  const sources = article.sources ?? [];
  for (const source of sources) {
    if (!isPermalink(source.url)) {
      errors.push(`${label}: fuente sin enlace permanente (${source.url})`);
    }
  }
  if (sources.length < 2) {
    warnings.push(`${label}: menos de dos fuentes`);
  }
}

function load() {
  const categories = categorySlugs();
  const files = readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort();

  const articles = [];
  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(path.join(CONTENT_DIR, file), "utf8"));
    } catch (error) {
      errors.push(`${file}: no es un JSON válido (${error.message})`);
      continue;
    }
    validate(file, parsed, categories);
    articles.push(parsed);
  }

  const slugs = articles.map((a) => a.slug);
  if (new Set(slugs).size !== slugs.length) errors.push("hay slugs duplicados");

  articles.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  return { categories, files, articles };
}

function writeIndex(articles) {
  const source = `// GENERADO por scripts/content.mjs. No editar a mano:
// añade o edita los ficheros .json de esta carpeta y ejecuta \`npm run content\`.
${articles.map((a, i) => `import a${i} from "./${a.slug}.json";`).join("\n")}

export const articlesRaw = [
${articles.map((_, i) => `  a${i},`).join("\n")}
];
`;
  writeFileSync(path.join(CONTENT_DIR, "index.ts"), source, "utf8");
}

function report() {
  for (const error of errors) console.error(`  ✗ ${error}`);
  for (const warning of warnings.slice(0, 15)) console.warn(`  · ${warning}`);
  if (warnings.length > 15) console.warn(`  · … y ${warnings.length - 15} avisos más`);
}

if (COMMAND === "new") {
  if (!ARG) {
    console.error("Uso: node scripts/content.mjs new <slug>");
    process.exit(1);
  }
  const target = path.join(CONTENT_DIR, `${ARG}.json`);
  if (existsSync(target)) {
    console.error(`Ya existe ${target}`);
    process.exit(1);
  }
  const now = new Date().toISOString();
  const template = {
    slug: ARG,
    title: "Titular de la noticia (máximo 75 caracteres)",
    excerpt: "Entradilla de una o dos frases con el dato que falta en el titular.",
    content: ["Primer párrafo: el dato más importante, sin preámbulos.", "Segundo párrafo."],
    category: categorySlugs()[0],
    author: "redaccion",
    publishedAt: now,
    updatedAt: now,
    coverLabel: "Rótulo corto",
    coverAlt: "Descripción de la imagen de portada",
    tags: ["etiqueta1", "etiqueta2", "etiqueta3"],
    readingTime: 1,
    featured: false,
    trending: false,
    sources: [{ name: "Medio — Titular", url: "https://ejemplo.com/ruta/permanente" }],
  };
  writeFileSync(target, `${JSON.stringify(template, null, 2)}\n`, "utf8");
  console.log(`Plantilla creada: src/content/articles/${ARG}.json`);
  console.log("Edítala, verifica los datos y ejecuta `npm run content`.");
  process.exit(0);
}

const { articles, files } = load();

console.log(`Artículos: ${articles.length} (${files.length} ficheros)`);
console.log(`Errores: ${errors.length} | avisos: ${warnings.length}`);
report();

if (errors.length > 0) {
  console.error("\nCorrige los errores antes de continuar.");
  process.exit(1);
}

if (COMMAND === "check") {
  console.log("\nContenido válido.");
  process.exit(0);
}

writeIndex(articles);
console.log(`\nÍndice regenerado con ${articles.length} artículos.`);
console.log("Siguiente paso: `npm run check` y publicar.");
