#!/usr/bin/env node
/**
 * Avisa a los buscadores compatibles con IndexNow (Bing, Yandex y otros) de que
 * hay URLs nuevas o actualizadas.
 *
 *   node scripts/indexnow.mjs                 → avisa de los artículos de la última semana
 *   node scripts/indexnow.mjs <url> [url...]  → avisa de esas URLs
 *   node scripts/indexnow.mjs --all           → avisa de todo el sitemap
 *
 * IndexNow hace que Bing indexe en horas en vez de días. El protocolo exige una
 * clave pública en el dominio: el fichero `public/<clave>.txt` que contiene la
 * propia clave. Es gratis y no necesita cuenta.
 *
 * Se lanza después de desplegar: las URLs tienen que estar ya publicadas.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE = process.env.SITE_URL ?? "https://gtavidaily.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** La clave se lee del fichero público que la declara, para que no se desincronicen. */
function readKey() {
  const publicDir = path.join(ROOT, "public");
  const file = readdirSync(publicDir).find((name) => /^[0-9a-f]{32}\.txt$/.test(name));
  if (!file) throw new Error("No se ha encontrado la clave de IndexNow en public/");
  const key = readFileSync(path.join(publicDir, file), "utf8").trim();
  return { key, keyFile: file };
}

async function recentArticleUrls(days = 7) {
  const dir = path.join(ROOT, "src", "content", "articles");
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(path.join(dir, name), "utf8")))
    .filter((article) => new Date(article.publishedAt).getTime() >= since)
    .map((article) => `${SITE}/articulo/${article.slug}`);
}

async function sitemapUrls() {
  const response = await fetch(`${SITE}/sitemap.xml`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const { key, keyFile } = readKey();

let urls;
if (args.length > 0) urls = args;
else if (process.argv.includes("--all")) urls = await sitemapUrls();
else urls = await recentArticleUrls();

if (urls.length === 0) {
  console.log("No hay URLs nuevas que anunciar (ningún artículo en la última semana).");
  process.exit(0);
}

console.log(`IndexNow: ${urls.length} URL(s) · clave ${key.slice(0, 8)}…`);

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key,
    keyLocation: `${SITE}/${keyFile}`,
    urlList: urls,
  }),
});

// 200 = aceptado, 202 = aceptado (clave pendiente de validar).
console.log(
  response.status === 200 || response.status === 202
    ? `✓ Aceptado por IndexNow (${response.status}). Bing y Yandex rastrearán en breve.`
    : `✖ Respuesta ${response.status}: ${(await response.text()).slice(0, 200)}`
);
process.exit(response.ok ? 0 : 1);
