/**
 * Remata el build estático (`out/`).
 *
 * Antes este script copiaba `.next/static` y `public/` dentro de
 * `.next/standalone` para el arranque autocontenido. Con `output: "export"`
 * Next ya deja **todo** en `out/` (HTML, RSC, activos, sitemaps, feed y
 * robots.txt), así que aquí solo quedan dos tareas:
 *
 * 1. Comprobar que los ficheros que no genera Next y de los que depende el
 *    despliegue están donde deben: el `security.txt` estático, `ads.txt`,
 *    `robots.txt`, `sitemap.xml`, `news-sitemap.xml` y `feed.xml`.
 * 2. Refrescar el campo `Expires` de `security.txt` con la fecha del build: la
 *    RFC 9116 exige una fecha futura y así el fichero publicado nunca caduca en
 *    silencio. El fichero versionado (`public/.well-known/security.txt`) se
 *    mantiene como fuente; aquí solo se actualiza la copia que se despliega.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");

async function exists(target) {
  try {
    await readFile(target);
    return true;
  } catch {
    return false;
  }
}

/** Ficheros que el despliegue necesita y que no siempre son obvios. */
const REQUIRED = [
  "index.html",
  "404.html",
  "ads.txt",
  "robots.txt",
  "sitemap.xml",
  "news-sitemap.xml",
  "feed.xml",
  "_headers",
  path.join(".well-known", "security.txt"),
];

async function main() {
  if (!(await exists(path.join(out, "index.html")))) {
    console.error(
      "No se ha encontrado out/index.html. Comprueba que next.config.ts mantiene output: \"export\"."
    );
    process.exit(1);
  }

  const missing = [];
  for (const file of REQUIRED) {
    if (!(await exists(path.join(out, file)))) missing.push(file);
  }
  if (missing.length > 0) {
    console.error(
      `Faltan ficheros en out/: ${missing.join(", ")}. El despliegue quedaría incompleto.`
    );
    process.exit(1);
  }

  // `Expires` nuevo en cada build, a un año vista.
  const securityPath = path.join(out, ".well-known", "security.txt");
  const current = await readFile(securityPath, "utf8");
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const refreshed = current.replace(/^Expires: .*$/m, `Expires: ${expires}`);
  if (refreshed !== current) {
    await writeFile(securityPath, refreshed, "utf8");
    console.log(`· security.txt: Expires actualizado a ${expires}`);
  }

  console.log(`Build estático listo en out/ (${REQUIRED.length} ficheros clave comprobados)`);
}

main().catch((error) => {
  console.error("Error al rematar el build estático:", error);
  process.exit(1);
});
