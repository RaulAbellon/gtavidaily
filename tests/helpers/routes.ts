import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
export const SRC_DIR = path.join(ROOT, "src");
const APP_DIR = path.join(SRC_DIR, "app");

const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "coverage",
  "out",
  "dist",
]);

export function listFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .filter(
      (entry) =>
        !entry.parentPath
          ?.split(path.sep)
          .some((segment) => IGNORED_DIRS.has(segment))
    )
    .map((entry) => path.join(entry.parentPath ?? dir, entry.name));
}

export function sourceFiles(): string[] {
  return listFiles(SRC_DIR).filter((file) => /\.(ts|tsx)$/.test(file));
}

export function readSource(file: string): string {
  return readFileSync(file, "utf8").replace(/\\/g, "/");
}

/**
 * Código sin comentarios. Los comentarios que documentan un cambio suelen
 * mencionar justo lo que se ha eliminado, así que los análisis de "restos de la
 * versión anterior" deben mirar solo el código.
 */
export function readCode(file: string): string {
  return readSource(file)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

/** Rutas estáticas reales del App Router, p. ej. "/noticias" o "/cookies". */
export function getStaticRoutes(): Set<string> {
  const routes = new Set<string>();
  for (const file of listFiles(APP_DIR)) {
    const relative = path.relative(APP_DIR, file).replace(/\\/g, "/");
    if (!/(^|\/)(page|route)\.tsx?$/.test(relative)) continue;
    const segments = relative.split("/").slice(0, -1);
    if (segments.some((segment) => segment.startsWith("["))) continue;
    routes.add(`/${segments.join("/")}`.replace(/\/$/, "") || "/");
  }
  return routes;
}

/** Patrones con segmentos dinámicos, p. ej. "/articulo/[slug]". */
export function getDynamicRoutePatterns(): string[] {
  const patterns: string[] = [];
  for (const file of listFiles(APP_DIR)) {
    const relative = path.relative(APP_DIR, file).replace(/\\/g, "/");
    if (!/(^|\/)(page|route)\.tsx?$/.test(relative)) continue;
    const segments = relative.split("/").slice(0, -1);
    if (!segments.some((segment) => segment.startsWith("["))) continue;
    patterns.push(`/${segments.join("/")}`);
  }
  return patterns;
}

/** ¿La ruta existe en el App Router (estática o dinámica)? */
export function matchesKnownRoute(href: string): boolean {
  const pathname = (href.split("?")[0].split("#")[0] || "/").replace(/\/+$/, "") || "/";
  if (getStaticRoutes().has(pathname)) return true;

  const parts = pathname.split("/").filter(Boolean);
  for (const pattern of getDynamicRoutePatterns()) {
    const patternParts = pattern.split("/").filter(Boolean);
    if (patternParts.length !== parts.length) continue;
    const fits = patternParts.every(
      (segment, index) => segment.startsWith("[") || segment === parts[index]
    );
    if (fits) return true;
  }
  return false;
}

/** Enlaces internos literales encontrados en el código. */
export function internalLinks(): { href: string; file: string }[] {
  const found: { href: string; file: string }[] = [];
  const patterns = [/href="(\/[^"]*)"/g, /href=\{`(\/[^`]*)`\}/g];

  for (const file of sourceFiles()) {
    const content = readSource(file);
    for (const pattern of patterns) {
      for (const match of content.matchAll(pattern)) {
        found.push({
          href: match[1].replace(/\$\{[^}]*\}/g, "X"),
          file: path.relative(ROOT, file),
        });
      }
    }
  }
  return found;
}
