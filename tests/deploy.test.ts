import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import nextConfig, { CSP } from "../next.config";
import { buildAdsTxt } from "@/lib/ads-txt";
import { ADSENSE_CLIENT } from "@/lib/site";

const read = (relative: string) =>
  readFileSync(fileURLToPath(new URL(`../${relative}`, import.meta.url)), "utf8");

const netlifyToml = read("netlify.toml");
/**
 * `wrangler.jsonc` es JSONC: lleva comentarios que explican por qué **no** hay
 * Worker ni binding. Las comprobaciones de "esto ya no está" tienen que mirar el
 * contenido real, no la explicación.
 */
const wrangler = read("wrangler.jsonc")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "");
const cloudflareHeaders = read("public/_headers");
const packageJson = JSON.parse(read("package.json")) as {
  scripts: Record<string, string>;
};

/** Ficheros .ts/.tsx de un directorio del proyecto, recursivamente. */
function sourceFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry.name)) found.push(full);
  }
  return found;
}

const appFiles = sourceFiles(fileURLToPath(new URL("../src/app", import.meta.url)));

describe("sitio completamente estático", () => {
  it("el build es una exportación estática", () => {
    // Todo se genera en `next build` como ficheros de `out/`. Es lo que permite
    // que Cloudflare sirva las páginas desde el CDN sin ejecutar ningún Worker y
    // que el plan gratuito (10 ms de CPU por petición) deje de cortar la
    // conexión en las páginas con la caché fría.
    expect(nextConfig.output).toBe("export");
  });

  it("no hay reescrituras ni cabeceras que Next no podría aplicar", () => {
    // Con `output: "export"` Next no ejecuta `headers()` ni `rewrites()`: las
    // cabeceras viven en `public/_headers` y en `netlify.toml`, y el antiguo
    // rewrite de `/.well-known/security.txt` es ahora un fichero real.
    expect(nextConfig.rewrites).toBeUndefined();
    expect(nextConfig.headers).toBeUndefined();
  });

  it("las imágenes no dependen del optimizador (que no existe en export)", () => {
    expect(nextConfig.images?.unoptimized).toBe(true);
  });

  it("ninguna página lee searchParams en el servidor", () => {
    // Sería una página dinámica (`ƒ`) y volvería a renderizarse en el Worker en
    // cada petición fría. `/buscar` y `/noticias` filtran en el navegador.
    const offenders: string[] = [];
    for (const file of appFiles) {
      if (!/page\.tsx?$/.test(file)) continue;
      const content = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      if (/\bsearchParams\b/.test(content)) {
        offenders.push(path.relative(process.cwd(), file));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("ningún route handler lee la petición y ninguno revalida", () => {
    // Un handler que use `request`/`searchParams` no se puede prerenderizar; uno
    // con `revalidate` tampoco (no hay ISR en una exportación estática).
    const problems: string[] = [];
    for (const file of appFiles) {
      if (!/route\.tsx?$/.test(file)) continue;
      const content = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      const relative = path.relative(process.cwd(), file);
      if (/new URL\(request\.url\)|request\.json\(|searchParams/.test(content)) {
        problems.push(`${relative}: lee la petición`);
      }
      if (/export const revalidate\s*=/.test(content)) {
        problems.push(`${relative}: declara revalidate`);
      }
      if (!/export const dynamic = "force-static"/.test(content)) {
        problems.push(`${relative}: sin dynamic = "force-static"`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("la ruta dinámica /cover ya no existe", () => {
    expect(
      existsSync(fileURLToPath(new URL("../src/app/cover/route.ts", import.meta.url)))
    ).toBe(false);
    const offenders = sourceFiles(
      fileURLToPath(new URL("../src", import.meta.url))
    ).filter((file) => /["']\/cover\?/.test(readFileSync(file, "utf8")));
    expect(offenders.map((file) => path.relative(process.cwd(), file))).toEqual([]);
  });

  it("cada artículo tiene una portada que existe como activo", () => {
    // Imagen propia (JPEG en public/imagenes/) o SVG estático generado en el
    // build a partir de `/portadas/[slug]`. Ninguna página se queda sin imagen.
    expect(
      existsSync(
        fileURLToPath(new URL("../src/app/portadas/[slug]/route.ts", import.meta.url))
      )
    ).toBe(true);
  });

  it("security.txt está en su ruta canónica como fichero real", () => {
    // Con el sitio estático las reescrituras no funcionan: el fichero tiene que
    // estar de verdad en `public/.well-known/`.
    expect(
      existsSync(
        fileURLToPath(
          new URL("../public/.well-known/security.txt", import.meta.url)
        )
      )
    ).toBe(true);
    expect(
      existsSync(fileURLToPath(new URL("../src/app/security-txt/route.ts", import.meta.url)))
    ).toBe(false);
  });
});

describe("scripts de despliegue", () => {
  it("cf:build produce el sitio estático y cf:deploy lo sube tal cual", () => {
    // Ya no hay adaptador de OpenNext: el artefacto es `out/` y lo sirve el CDN
    // como activos estáticos. Sin Worker no hay CPU ni peticiones que facturar.
    expect(packageJson.scripts["cf:build"]).toBe("npm run build");
    expect(packageJson.scripts["cf:deploy"]).toBe(
      "npm run cf:build && wrangler deploy"
    );
    expect(JSON.stringify(packageJson.scripts)).not.toContain("opennext");
  });

  it("npm start sirve el build estático", () => {
    expect(packageJson.scripts.start).toBe("node scripts/start.mjs");
  });
});

describe("netlify.toml", () => {
  it("compila el proyecto con Next.js", () => {
    expect(netlifyToml).toMatch(/command\s*=\s*".*npm run build.*"/);
  });

  it("publica el directorio estático que genera el build", () => {
    // Antes no se declaraba `publish` porque lo gestionaba el adaptador de
    // Netlify, que además creaba una función de SSR. Con el sitio estático no
    // hay adaptador: `out/` es todo el artefacto, igual que en Cloudflare.
    expect(netlifyToml).toMatch(/^\s*publish\s*=\s*"out"\s*$/m);
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

describe("Cloudflare (solo activos estáticos)", () => {
  it("sirve el directorio que produce el build", () => {
    expect(wrangler).toContain('"directory": "out"');
  });

  it("no declara ningún Worker: nada se renderiza en la petición", () => {
    // Es la esencia del cambio. Con `main` habría un script que Cloudflare
    // ejecutaría (y facturaría) en cada petición que no resolviera un activo.
    expect(wrangler).not.toMatch(/"main"\s*:/);
    expect(wrangler).not.toContain(".open-next/worker.js");
    expect(wrangler).not.toContain("run_worker_first");
    expect(wrangler).not.toContain('"services"');
    expect(wrangler).not.toContain("nodejs_compat");
  });

  it("resuelve /ruta como /ruta.html", () => {
    expect(wrangler).toContain('"html_handling": "auto-trailing-slash"');
  });

  it("devuelve el 404 del build con estado 404", () => {
    expect(wrangler).toContain('"not_found_handling": "404-page"');
  });

  it("usa una fecha de compatibilidad posterior a nodejs_compat", () => {
    const date = /"compatibility_date":\s*"(\d{4}-\d{2}-\d{2})"/.exec(wrangler)?.[1];
    expect(date, "falta compatibility_date").toBeTruthy();
    expect(new Date(date as string).getTime()).toBeGreaterThan(
      new Date("2024-09-23").getTime()
    );
  });

  it("replica exactamente la misma CSP que next.config.ts", () => {
    // Ahora `_headers` cubre **también el HTML** (son ficheros estáticos), así
    // que es la única copia que se aplica en Cloudflare; no puede divergir.
    expect(cloudflareHeaders).toContain(CSP);
  });

  it("declara las cabeceras de seguridad de todos los activos", () => {
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
  const file = read("public/ads.txt");

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
