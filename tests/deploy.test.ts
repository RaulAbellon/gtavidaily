import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CSP, outputMode } from "../next.config";
import { buildAdsTxt } from "@/lib/ads-txt";
import { ADSENSE_CLIENT } from "@/lib/site";

const netlifyToml = readFileSync(
  fileURLToPath(new URL("../netlify.toml", import.meta.url)),
  "utf8"
);

describe("modo de salida del build", () => {
  it("genera un bundle autocontenido al autoalojar (VPS, Docker)", () => {
    expect(outputMode({})).toBe("standalone");
  });

  it("no lo genera en plataformas con adaptador propio", () => {
    // Duplicar el artefacto standalone confunde al adaptador, que ya construye
    // su propio paquete a partir de `.next`.
    expect(outputMode({ NETLIFY: "true" })).toBeUndefined();
    expect(outputMode({ VERCEL: "1" })).toBeUndefined();
  });
});

describe("netlify.toml", () => {
  it("compila el proyecto con Next.js", () => {
    expect(netlifyToml).toMatch(/command\s*=\s*".*npm run build.*"/);
  });

  it("no fija `publish`: lo gestiona el adaptador de Next", () => {
    expect(netlifyToml).not.toMatch(/^\s*publish\s*=/m);
  });

  it("no fija la versión del adaptador de Next", () => {
    // Netlify actualiza el adaptador en cada build para dar soporte a la última
    // versión de Next; fijarlo deja el soporte congelado.
    expect(netlifyToml).not.toContain("@netlify/plugin-nextjs");
  });

  it("fija una versión de Node compatible con Next.js 16", () => {
    const version = /NODE_VERSION\s*=\s*"(\d+)/.exec(netlifyToml)?.[1];
    expect(version, "falta NODE_VERSION").toBeTruthy();
    expect(Number(version)).toBeGreaterThanOrEqual(20);
  });

  it("aplica exactamente la misma CSP que next.config.ts", () => {
    expect(netlifyToml).toContain(CSP);
  });

  it("declara las cabeceras de seguridad en el CDN", () => {
    for (const header of [
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Strict-Transport-Security",
    ]) {
      expect(netlifyToml, `falta ${header}`).toContain(header);
    }
  });
});

describe("ads.txt", () => {
  // El fichero se sirve como **estático** desde `public/`, que es la forma
  // canónica que describe Google: sin función de por medio, con el tipo de
  // contenido y las cabeceras del CDN. Antes lo generaba una ruta dinámica.
  const file = readFileSync(
    fileURLToPath(new URL("../public/ads.txt", import.meta.url)),
    "utf8"
  );

  it("declara el vendedor autorizado de AdSense", () => {
    expect(file).toMatch(
      /^google\.com, pub-\d{16}, DIRECT, f08c47fec0942fa0$/m
    );
    expect(file.endsWith("\n")).toBe(true);
  });

  it("va en UTF-8 sin BOM y sin caracteres invisibles al principio", () => {
    const bytes = readFileSync(
      fileURLToPath(new URL("../public/ads.txt", import.meta.url))
    );
    expect([...bytes.slice(0, 3)]).not.toEqual([0xef, 0xbb, 0xbf]);
    expect(bytes[0]).toBe(0x23); // "#"
  });

  it("coincide con lo que genera la librería para el cliente configurado", () => {
    const expected = buildAdsTxt(ADSENSE_CLIENT);
    if (expected) {
      // Si algún día cambia el identificador, esta prueba falla y recuerda que
      // hay que regenerar `public/ads.txt`.
      expect(file).toBe(expected);
    }
  });

  it("no declara más de un vendedor", () => {
    const sellers = file
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"));
    expect(sellers).toHaveLength(1);
  });
});
