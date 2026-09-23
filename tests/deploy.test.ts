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

describe("Cloudflare (adaptador de OpenNext)", () => {
  const wrangler = readFileSync(
    fileURLToPath(new URL("../wrangler.jsonc", import.meta.url)),
    "utf8"
  );
  const cloudflareHeaders = readFileSync(
    fileURLToPath(new URL("../public/_headers", import.meta.url)),
    "utf8"
  );

  it("apunta al Worker que genera el adaptador", () => {
    expect(wrangler).toContain('"main": ".open-next/worker.js"');
    expect(wrangler).toContain('"directory": ".open-next/assets"');
  });

  it("activa nodejs_compat, que Next.js 16 necesita", () => {
    expect(wrangler).toContain('"nodejs_compat"');
  });

  it("usa una fecha de compatibilidad posterior a nodejs_compat", () => {
    const date = /"compatibility_date":\s*"(\d{4}-\d{2}-\d{2})"/.exec(wrangler)?.[1];
    expect(date, "falta compatibility_date").toBeTruthy();
    expect(new Date(date as string).getTime()).toBeGreaterThan(
      new Date("2024-09-23").getTime()
    );
  });

  it("el binding de auto-referencia se llama como el Worker", () => {
    const name = /"name":\s*"([^"]+)"/.exec(wrangler)?.[1];
    const service = /"service":\s*"([^"]+)"/.exec(wrangler)?.[1];
    expect(name).toBeTruthy();
    expect(service).toBe(name);
  });

  it("deja los activos estáticos al CDN para no gastar la cuota diaria del Worker", () => {
    // Sin `run_worker_first` se perderían la CSP del HTML y la reescritura de
    // `/.well-known/security.txt`, que las aplica Next (ver next.config.ts).
    expect(wrangler).toContain('"run_worker_first": false');
  });

  it("replica exactamente la misma CSP que next.config.ts", () => {
    // En Cloudflare, `_headers` no se aplica a lo que genera el Worker, así que
    // la CSP vive en dos sitios y no pueden divergir.
    expect(cloudflareHeaders).toContain(CSP);
  });

  it("declara las cabeceras de seguridad de los activos estáticos", () => {
    for (const header of [
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Strict-Transport-Security",
    ]) {
      expect(cloudflareHeaders, `falta ${header}`).toContain(header);
    }
  });

  it("no deja los activos con hash sin caché larga", () => {
    expect(cloudflareHeaders).toMatch(
      /\/_next\/static\/\*[\s\S]*?Cache-Control:\s*public,\s*max-age=\d+,\s*immutable/
    );
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
