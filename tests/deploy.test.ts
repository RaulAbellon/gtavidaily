import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CSP, outputMode } from "../next.config";
import { GET as getAdsTxt } from "@/app/ads.txt/route";
import { buildAdsTxt } from "@/lib/ads-txt";
import { ADSENSE_ENABLED } from "@/lib/site";

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
  it("declara el vendedor autorizado de AdSense", () => {
    const body = buildAdsTxt("ca-pub-1234567890123456");
    expect(body).toContain(
      "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0"
    );
    expect(body?.endsWith("\n")).toBe(true);
  });

  it("no publica nada si el identificador no es válido", () => {
    expect(buildAdsTxt("")).toBeNull();
    expect(buildAdsTxt("ca-pub-123")).toBeNull();
    expect(buildAdsTxt("pub-1234567890123456")).toBeNull();
  });

  it("responde 404 mientras AdSense no esté configurado", async () => {
    const response = await getAdsTxt();
    if (ADSENSE_ENABLED) {
      expect(response.status).toBe(200);
      expect(await response.text()).toContain("DIRECT");
    } else {
      expect(response.status).toBe(404);
    }
  });
});
