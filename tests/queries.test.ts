import { describe, expect, it } from "vitest";
import { getLatestArticles } from "@/lib/data";
import {
  countWords,
  estimateReadingTime,
  getCategoriesWithCount,
  getPopulatedCategories,
  normalize,
  searchArticles,
} from "@/lib/queries";

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
