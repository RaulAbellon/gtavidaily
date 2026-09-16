import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const PUBLIC = path.join(process.cwd(), "public");
const read = (file: string) => readFileSync(path.join(PUBLIC, file));
const exists = (file: string) => existsSync(path.join(PUBLIC, file));

/** Lee ancho y alto de un PNG desde su cabecera IHDR (sin dependencias). */
function pngSize(file: string): { width: number; height: number } {
  const buffer = read(file);
  expect(buffer.subarray(1, 4).toString("ascii"), `${file} no es PNG`).toBe("PNG");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/** Lee el número de imágenes y sus tamaños declarados en un .ico. */
function icoEntries(file: string): number[] {
  const buffer = read(file);
  expect(buffer.readUInt16LE(0), `${file} no es ICO`).toBe(0);
  expect(buffer.readUInt16LE(2), `${file} no es ICO`).toBe(1);
  const count = buffer.readUInt16LE(4);
  const sizes: number[] = [];
  for (let index = 0; index < count; index += 1) {
    sizes.push(buffer.readUInt8(6 + index * 16) || 256);
  }
  return sizes;
}

describe("identidad visual", () => {
  it("publica todos los iconos que declara el manifiesto", () => {
    const manifest = JSON.parse(readFileSync(path.join(PUBLIC, "manifest.json"), "utf8"));
    expect(manifest.icons.length).toBeGreaterThan(0);
    for (const icon of manifest.icons) {
      const file = icon.src.replace(/^\//, "");
      expect(exists(file), `${icon.src} no existe en public/`).toBe(true);
    }
  });

  it("publica los iconos que declara el layout", () => {
    for (const file of [
      "favicon.svg",
      "favicon.ico",
      "icon-192.png",
      "apple-touch-icon.png",
      "icon-512.png",
    ]) {
      expect(exists(file), `${file} no existe en public/`).toBe(true);
    }
  });

  it("respeta los tamaños que se anuncian", () => {
    expect(pngSize("icon-192.png")).toEqual({ width: 192, height: 192 });
    expect(pngSize("icon-512.png")).toEqual({ width: 512, height: 512 });
    expect(pngSize("icon-maskable-512.png")).toEqual({ width: 512, height: 512 });
    expect(pngSize("apple-touch-icon.png")).toEqual({ width: 180, height: 180 });
    expect(pngSize("og-image.png")).toEqual({ width: 1200, height: 630 });
  });

  it("el favicon incluye 16, 32 y 48", () => {
    expect(icoEntries("favicon.ico")).toEqual([16, 32, 48]);
  });

  it("mantiene los lockups y la marca", () => {
    for (const file of ["logo.svg", "logo-compact.svg", "logo-mark.svg", "icon.svg"]) {
      const svg = read(file).toString("utf8");
      expect(svg.startsWith("<svg"), `${file} no es un SVG`).toBe(true);
      expect(svg).toContain('aria-label="GTA VI Daily"');
    }
  });

  it("no queda ningún resto del logotipo de la herramienta original", () => {
    // El andamiaje con el que se generó el sitio dejó su propio logotipo en
    // public/logo.svg, con estas clases y esta animación.
    for (const file of ["logo.svg", "logo-compact.svg", "logo-mark.svg", "icon.svg"]) {
      const svg = read(file).toString("utf8");
      expect(svg, `${file} parece contener el logotipo ajeno`).not.toMatch(
        /st194|st23|z-breathe|enable-background/
      );
    }
  });
});
