import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { articles, categories } from "@/lib/data";
import { SITE_URL, STATIC_ROUTES } from "@/lib/site";
import { matchesKnownRoute } from "./helpers/routes";

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it("usa la URL pública configurada como única base", () => {
    for (const url of urls) {
      expect(url.startsWith(SITE_URL)).toBe(true);
    }
  });

  it("no publica URLs duplicadas", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("publica exactamente un artículo por artículo existente", () => {
    const articleUrls = urls.filter((url) => url.includes("/articulo/"));
    expect(articleUrls.length).toBe(articles.length);
    for (const article of articles) {
      expect(urls).toContain(`${SITE_URL}/articulo/${article.slug}`);
    }
  });

  it("publica todas las categorías", () => {
    for (const category of categories) {
      expect(urls).toContain(`${SITE_URL}/categoria/${category.slug}`);
    }
  });

  it("incluye las páginas estáticas y el listado", () => {
    expect(urls).toContain(SITE_URL);
    expect(urls).toContain(`${SITE_URL}/noticias`);
    for (const route of STATIC_ROUTES) {
      expect(urls).toContain(`${SITE_URL}${route.path}`);
    }
  });

  it("solo publica rutas que existen de verdad", () => {
    const unknown = urls
      .map((url) => new URL(url).pathname)
      .filter((pathname) => !matchesKnownRoute(pathname));
    expect(unknown).toEqual([]);
  });

  it("no publica el buscador ni el endpoint de contacto", () => {
    expect(urls.some((url) => url.includes("/buscar"))).toBe(false);
    expect(urls.some((url) => url.includes("/api/"))).toBe(false);
  });
});

describe("robots.txt", () => {
  const rules = robots();

  it("declara el sitemap general y el de noticias", () => {
    const declared = Array.isArray(rules.sitemap) ? rules.sitemap : [rules.sitemap];
    expect(declared).toContain(`${SITE_URL}/sitemap.xml`);
    // El de noticias es el que usa Google para detectar contenido fresco.
    expect(declared).toContain(`${SITE_URL}/news-sitemap.xml`);
  });

  it("bloquea la API y permite el rastreador de AdSense", () => {
    const list = Array.isArray(rules.rules) ? rules.rules : [rules.rules];
    const wildcard = list.find((rule) => rule.userAgent === "*");
    expect(wildcard?.disallow).toContain("/api/");
    expect(list.some((rule) => rule.userAgent === "Mediapartners-Google")).toBe(
      true
    );
  });

  it("no bloquea el buscador (sus páginas llevan noindex)", () => {
    const list = Array.isArray(rules.rules) ? rules.rules : [rules.rules];
    const disallow = list.flatMap((rule) =>
      Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow ?? ""]
    );
    expect(disallow.some((entry) => entry.includes("/buscar"))).toBe(false);
  });
});
