import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { CORRECCIONES, getCorreccionesDesc } from "@/lib/correcciones";
import { getArticleBySlug } from "@/lib/data";
import { SITE_URL, STATIC_ROUTES, TRUST_ROUTES } from "@/lib/site";
import { matchesKnownRoute, readSource } from "./helpers/routes";

const read = (...segments: string[]) =>
  readSource(path.join(process.cwd(), ...segments));

const TRUST_PAGES = [
  "/politica-editorial",
  "/correcciones",
  "/financiacion",
  "/equipo",
];

describe("páginas de confianza", () => {
  it("existen como rutas estáticas y están en STATIC_ROUTES y en el sitemap", () => {
    const paths = STATIC_ROUTES.map((route) => route.path);
    const urls = sitemap().map((entry) => entry.url);

    for (const route of TRUST_PAGES) {
      expect(matchesKnownRoute(route), route).toBe(true);
      expect(paths, route).toContain(route);
      expect(urls, route).toContain(`${SITE_URL}${route}`);
    }
  });

  it("cada ruta declara su canonical y su propio componente de servidor", () => {
    for (const route of TRUST_PAGES) {
      const slug = route.replace(/^\//, "");
      const page = read("src", "app", slug, "page.tsx");
      expect(page, slug).toContain('alternates: { canonical: "/' + slug + '" }');
    }
  });

  it("se enlazan desde el pie de página", () => {
    const footer = read("src", "components", "site", "footer.tsx");
    for (const route of [...TRUST_PAGES, "/sobre"]) {
      expect(footer, `pie → ${route}`).toContain(`href="${route}"`);
    }
  });

  it("se enlazan desde /sobre", () => {
    const sobre = read("src", "components", "legal", "sobre.tsx");
    for (const route of TRUST_PAGES) {
      // En `/sobre` los enlaces salen de la lista `COMPROMISOS` (`href: "..."`).
      expect(sobre, `sobre → ${route}`).toContain(`"${route}"`);
    }
  });

  it("la ruta de confianza declarada en site.ts apunta a páginas que existen", () => {
    for (const route of TRUST_ROUTES) {
      expect(matchesKnownRoute(route.path), route.path).toBe(true);
    }
  });
});

describe("registro de correcciones", () => {
  it("solo contiene correcciones con fecha ISO, título, detalle y fuente", () => {
    for (const correction of CORRECCIONES) {
      expect(correction.date, correction.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(correction.date)), correction.id).toBe(false);
      expect(correction.dateLabel.length, correction.id).toBeGreaterThan(6);
      expect(correction.title.length, correction.id).toBeGreaterThan(20);
      expect(correction.what.length, correction.id).toBeGreaterThan(60);
      expect(correction.fix.length, correction.id).toBeGreaterThan(60);
      expect(correction.articles.length, correction.id).toBeGreaterThan(0);
      expect(correction.sources.length, correction.id).toBeGreaterThan(0);
      for (const source of correction.sources) {
        expect(source.name.length, correction.id).toBeGreaterThan(10);
        expect(source.url, correction.id).toMatch(/^https:\/\/[^\s]+$/);
      }
    }
  });

  it("todos los artículos corregidos existen de verdad", () => {
    for (const correction of CORRECCIONES) {
      for (const slug of correction.articles) {
        expect(
          getArticleBySlug(slug),
          `corrección ${correction.id} → ${slug}`,
        ).toBeTruthy();
      }
    }
  });

  it("no repite entradas y va de la más reciente a la más antigua", () => {
    const ids = CORRECCIONES.map((correction) => correction.id);
    expect(new Set(ids).size).toBe(ids.length);

    const desc = getCorreccionesDesc();
    for (let index = 1; index < desc.length; index += 1) {
      expect(desc[index - 1].date >= desc[index].date).toBe(true);
    }
  });

  it("la nota de corrección se pinta al pie del artículo afectado", () => {
    const article = read("src", "app", "articulo", "[slug]", "page.tsx");
    expect(article).toContain("getCorreccionesDeArticulo");
    expect(article).toContain("Correcciones de este artículo");
    expect(article).toContain('href="/correcciones"');
  });

  it("la página explica cómo pedir una corrección y el plazo comprometido", () => {
    const page = read("src", "components", "legal", "correcciones.tsx");
    expect(page).toContain("CORRECCION_PLAZO");
    expect(page).toContain("CORRECCION_CIERRE");
    expect(page).toContain("getCorreccionesDesc");
  });
});

describe("los dos activos propios", () => {
  it("están en la navegación principal de la cabecera, no solo en el pie", () => {
    const header = read("src", "components", "site", "header.tsx");
    // `CONSULTAS` alimenta la barra principal, la franja de consulta y el menú
    // móvil: las dos rutas tienen que estar ahí con su etiqueta corta.
    expect(header).toContain('href: "/cronologia"');
    expect(header).toContain('href: "/desbloqueo"');
    expect(header).toContain("Navegación principal");
  });

  it("tienen un bloque propio en la portada", () => {
    const home = read("src", "app", "page.tsx");
    expect(home).toContain('href="/cronologia"');
    expect(home).toContain('href="/desbloqueo"');
    // Las cifras se calculan desde los datos, no se escriben a mano.
    expect(home).toContain("getCronologiaResumen");
    expect(home).toContain("getUnlockTable");
  });
});
