/**
 * Sirve el build estático (`out/`) en local, como lo hará el CDN.
 *
 * Antes arrancaba el servidor standalone de Next (`.next/standalone/server.js`).
 * Con `output: "export"` ya no hay servidor que arrancar: el sitio son ficheros.
 * Este script los sirve con Node, sin dependencias, **aplicando `public/_headers`**
 * (la CSP y el resto de cabeceras de seguridad) para que la prueba de humo y la
 * comprobación de Cloudflare midan lo mismo que medirán en producción.
 *
 * No pretende ser un servidor de producción —para eso está el CDN— sino una
 * forma fiel y barata de revisar el resultado del build:
 *
 *   npm run build
 *   npm start                 # http://127.0.0.1:3000 (respeta PORT y HOSTNAME)
 *   BASE_URL=http://127.0.0.1:3000 npm run test:e2e
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const port = Number(process.env.PORT ?? "3000");
const hostname = process.env.HOSTNAME ?? "0.0.0.0";

/** Tipos que sirve el sitio. Cualquier otro va como binario. */
const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

function contentType(file) {
  return CONTENT_TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
}

/**
 * Reglas de `public/_headers`, en el mismo formato que entiende Cloudflare
 * (ruta, y debajo las cabeceras indentadas). Se admiten `*` al final del patrón.
 */
async function readHeaderRules() {
  let raw;
  try {
    raw = await readFile(path.join(root, "public", "_headers"), "utf8");
  } catch {
    return [];
  }

  const rules = [];
  let current = null;

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (!/^\s/.test(line)) {
      current = { pattern: line.trim(), headers: {} };
      rules.push(current);
      continue;
    }
    if (!current) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    current.headers[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }

  return rules;
}

function ruleMatches(pattern, pathname) {
  if (pattern.endsWith("*")) return pathname.startsWith(pattern.slice(0, -1));
  return pathname === pattern;
}

function headersFor(rules, pathname) {
  const headers = {};
  for (const rule of rules) {
    if (ruleMatches(rule.pattern, pathname)) Object.assign(headers, rule.headers);
  }
  return headers;
}

async function fileExists(target) {
  try {
    const info = await stat(target);
    return info.isFile();
  } catch {
    return false;
  }
}

/**
 * Traduce una URL a un fichero de `out/`, como hace el CDN:
 * `/` → `index.html`, `/noticias` y `/noticias/` → `noticias.html`.
 */
async function resolveFile(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/+$/, "");
  const candidates = clean === "" ? ["index.html"] : [clean.slice(1), `${clean.slice(1)}/index.html`, `${clean.slice(1)}.html`];

  for (const candidate of candidates) {
    const target = path.join(out, candidate);
    // Nunca salir de `out/`.
    if (!target.startsWith(out)) continue;
    if (await fileExists(target)) return target;
  }
  return null;
}

async function main() {
  if (!(await fileExists(path.join(out, "index.html")))) {
    console.error(
      "No se ha encontrado out/index.html. Ejecuta `npm run build` antes de `npm start`."
    );
    process.exit(1);
  }

  const rules = await readHeaderRules();
  const notFoundPage = path.join(out, "404.html");

  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const pathname = url.pathname;
    const headers = headersFor(rules, pathname);

    // Cloudflare no sirve `_headers` como fichero: aquí tampoco.
    const file = pathname === "/_headers" ? null : await resolveFile(pathname);

    if (file) {
      const body = await readFile(file);
      response.writeHead(200, {
        "content-type": contentType(file),
        "content-length": body.length,
        ...headers,
      });
      response.end(request.method === "HEAD" ? undefined : body);
      return;
    }

    if (await fileExists(notFoundPage)) {
      const body = await readFile(notFoundPage);
      response.writeHead(404, {
        "content-type": "text/html; charset=utf-8",
        "content-length": body.length,
        ...headers,
      });
      response.end(request.method === "HEAD" ? undefined : body);
      return;
    }

    response.writeHead(404, { "content-type": "text/plain; charset=utf-8", ...headers });
    response.end("Not found");
  });

  server.listen(port, hostname, () => {
    console.log(`Sitio estático en http://${hostname}:${port} (sirviendo out/)`);
  });
}

main().catch((error) => {
  console.error("Error al arrancar el servidor estático:", error);
  process.exit(1);
});
