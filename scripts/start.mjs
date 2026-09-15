/**
 * Arranca el servidor standalone de forma multiplataforma.
 *
 * El script original era `NODE_ENV=production node .next/standalone/server.js`,
 * sintaxis que no funciona en Windows.
 */
import { access } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const serverPath = path.join(root, ".next", "standalone", "server.js");
const port = process.env.PORT ?? "3000";
const hostname = process.env.HOSTNAME ?? "0.0.0.0";

try {
  await access(serverPath);
} catch {
  console.error(
    "No se ha encontrado .next/standalone/server.js. Ejecuta `npm run build` antes de `npm start`."
  );
  process.exit(1);
}

process.env.NODE_ENV = "production";
process.env.PORT = port;
process.env.HOSTNAME = hostname;

console.log(`Servidor de producción en http://${hostname}:${port}`);

await import(pathToFileURL(serverPath).href);
