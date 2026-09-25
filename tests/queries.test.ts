import { describe, expect, it } from "vitest";
import { GET as getSearchIndex } from "@/app/buscar/indice.json/route";
import { toSearchIndexEntry } from "@/lib/article-view";
import { articles, getLatestArticles } from "@/lib/data";
import {
  countWords,
  estimateReadingTime,
  getCategoriesWithCount,
  getPopulatedCategories,
  normalize,
  searchArticles,
} from "@/lib/queries";
import { rankSearches } from "@/lib/search";

describe("buscador", () => {
  it("ignora consultas demasiado cortas", () => {
    expect(searchArticles("")).toEqual([]);
    expect(searchArticles("a")).toEqual([]);
    expect(searchArticles("  ")).toEqual([]);
  });

  it("encuentra por título", () => {
    const results = searchArticles("Lucia");
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some((article) => article.title.toLowerCase().includes("lucia"))
    ).toBe(true);
  });

  it("ignora acentos y mayúsculas", () => {
    expect(normalize("Tráiler")).toBe("trailer");
    expect(searchArticles("TRAILER").length).toBeGreaterThan(0);
    expect(searchArticles("trailer").length).toBe(searchArticles("tráiler").length);
  });

  it("respeta el límite de resultados", () => {
    const results = searchArticles("gta", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("no devuelve nada para términos inexistentes", () => {
    expect(searchArticles("zxqwvbnm")).toEqual([]);
  });
});

describe("buscador en el navegador (/buscar)", () => {
  // `/buscar` es una página estática: el índice viaja como fichero
  // (`/buscar/indice.json`) y el filtrado ocurre en el cliente. Estas pruebas
  // garantizan que ese índice existe, está completo y **puntúa igual** que el
  // servidor: si divergieran, el buscador daría resultados distintos según dónde
  // se ejecutara.
  const queries = ["lucia", "trailer", "tráiler", "gta", "vice city", "mapa", "zxqwvbnm"];

  it("el índice estático se sirve como JSON con todos los artículos", async () => {
    const response = await getSearchIndex();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");

    const entries = JSON.parse(await response.text()) as { slug: string }[];
    expect(entries.length).toBe(articles.length);
    expect(new Set(entries.map((entry) => entry.slug)).size).toBe(articles.length);
  });

  it("el índice lleva lo que necesitan la búsqueda y la tarjeta", async () => {
    const entries = JSON.parse(await (await getSearchIndex()).text()) as Record<
      string,
      unknown
    >[];
    for (const entry of entries) {
      for (const field of [
        "slug",
        "title",
        "excerpt",
        "tags",
        "content",
        "image",
        "imageAlt",
        "categoryName",
        "categoryColor",
        "dateLabel",
        "publishedAt",
        "readingTime",
      ]) {
        expect(entry[field], `${entry.slug as string} sin ${field}`).toBeDefined();
      }
    }
  });

  it("da exactamente los mismos resultados que el buscador del servidor", () => {
    const index = articles.map(toSearchIndexEntry);
    for (const query of queries) {
      expect(
        rankSearches(index, query, 40).map((entry) => entry.slug),
        `consulta «${query}»`
      ).toEqual(searchArticles(query, 40).map((article) => article.slug));
    }
  });
});

describe("utilidades de contenido", () => {
  it("cuenta palabras sin contar huecos", () => {
    expect(countWords({ content: ["hola  mundo", "  ", "tres"] })).toBe(3);
    expect(countWords({ content: [] })).toBe(0);
  });

  it("estima al menos un minuto de lectura", () => {
    expect(estimateReadingTime({ content: ["dos palabras"] })).toBe(1);
    expect(
      estimateReadingTime({ content: [Array(400).fill("palabra").join(" ")] })
    ).toBe(2);
  });

  it("ordena las noticias de más reciente a más antigua", () => {
    const latest = getLatestArticles();
    for (let i = 1; i < latest.length; i += 1) {
      expect(
        new Date(latest[i - 1].publishedAt).getTime()
      ).toBeGreaterThanOrEqual(new Date(latest[i].publishedAt).getTime());
    }
  });

  it("no muta el array original al ordenar", () => {
    const firstBefore = getLatestArticles()[0].slug;
    getLatestArticles();
    expect(getLatestArticles()[0].slug).toBe(firstBefore);
  });

  it("cuenta los artículos por categoría", () => {
    const withCount = getCategoriesWithCount();
    const total = withCount.reduce((sum, category) => sum + category.count, 0);
    const population = getPopulatedCategories();
    expect(total).toBeGreaterThan(0);
    expect(population.every((category) => category.count > 0)).toBe(true);
    expect(population.length).toBeLessThanOrEqual(withCount.length);
  });
});
