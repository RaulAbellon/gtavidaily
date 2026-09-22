import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { articles, authors, categories, getCategoryBySlug } from "@/lib/data";
import {
  citableSources,
  countWords,
  findArticlesWithUnknownAuthor,
  findArticlesWithUnknownCategory,
} from "@/lib/queries";

describe("integridad del contenido", () => {
  it("tiene artículos publicados", () => {
    expect(articles.length).toBeGreaterThan(0);
  });

  it("no repite slugs ni títulos", () => {
    const slugs = articles.map((article) => article.slug);
    const titles = articles.map((article) => article.title);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("usa slugs seguros para URL", () => {
    for (const article of articles) {
      expect(article.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
    for (const category of categories) {
      expect(category.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("referencia solo categorías existentes", () => {
    expect(findArticlesWithUnknownCategory()).toEqual([]);
  });

  it("referencia solo autores existentes", () => {
    expect(findArticlesWithUnknownAuthor()).toEqual([]);
  });

  it("tiene una identidad editorial sin fotos de terceros", () => {
    expect(authors.length).toBeGreaterThan(0);
    for (const author of authors) {
      expect(author.avatar.startsWith("data:image/svg+xml")).toBe(true);
      expect(author.avatar).not.toMatch(/pravatar|gravatar|unsplash/);
    }
  });

  it("usa fechas ISO 8601 válidas y no futuras", () => {
    const now = Date.now();
    for (const article of articles) {
      expect(article.publishedAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/
      );
      const published = new Date(article.publishedAt).getTime();
      expect(Number.isNaN(published)).toBe(false);
      expect(published).toBeLessThanOrEqual(now + 86_400_000);

      if (article.updatedAt) {
        expect(new Date(article.updatedAt).getTime()).toBeGreaterThanOrEqual(
          published
        );
      }
    }
  });

  it("tiene cuerpo y extracto con contenido real", () => {
    for (const article of articles) {
      expect(article.excerpt.length).toBeGreaterThan(40);
      expect(article.content.length).toBeGreaterThan(0);
      for (const paragraph of article.content) {
        expect(paragraph.trim().length).toBeGreaterThan(0);
      }
      expect(article.tags.length).toBeGreaterThan(0);
      expect(article.coverAlt.length).toBeGreaterThan(10);
    }
  });

  it("declara un tiempo de lectura plausible", () => {
    for (const article of articles) {
      const words = countWords(article);
      expect(article.readingTime).toBeGreaterThan(0);
      expect(article.readingTime).toBeLessThanOrEqual(60);
      // 200 palabras/minuto con margen amplio.
      expect(article.readingTime).toBeLessThanOrEqual(
        Math.ceil(words / 80) + 2
      );
    }
  });

  it("genera las portadas localmente (sin hotlinking)", () => {
    for (const article of articles) {
      // La ilustración se sirve desde nuestra propia ruta /cover: nada de
      // enlazar imágenes de terceros.
      expect(article.cover.startsWith("/cover?"), article.slug).toBe(true);
      expect(article.cover, article.slug).not.toMatch(/^https?:/);
      expect(article.cover, article.slug).not.toContain("data:");
    }
  });

  it("solo publica fuentes con enlace permanente", () => {
    for (const article of articles) {
      for (const source of citableSources(article)) {
        expect(source.url).toMatch(/^https?:\/\//);
        expect(new URL(source.url).pathname.replace(/\/+$/, "").length).toBeGreaterThan(0);
        expect(source.name.length).toBeGreaterThan(2);
      }
    }
  });
});

describe("codificación del contenido", () => {
  const contentDir = path.join(process.cwd(), "src", "content", "articles");
  const files = readdirSync(contentDir).filter((file) => file.endsWith(".json"));
  const all = files
    .map((file) => readFileSync(path.join(contentDir, file), "utf8"))
    .join("\n");

  it("hay un fichero por artículo", () => {
    expect(files.length).toBe(articles.length);
  });

  it("no contiene texto con la codificación rota", () => {
    // Mojibake típico de leer UTF-8 como cp1252 y volver a escribirlo.
    expect(all).not.toMatch(/Ã|Â«|Â»|â€|ï¿½/);
  });

  it("conserva los acentos y símbolos en español", () => {
    expect(all).toMatch(/[áéíóúñÁÉÍÓÚÑ]/);
    expect(all).toMatch(/«/);
  });

  it("cada artículo declara un rótulo de portada corto", () => {
    for (const file of files) {
      const article = JSON.parse(
        readFileSync(path.join(contentDir, file), "utf8")
      ) as { coverLabel?: string; slug: string };
      expect(article.coverLabel, article.slug).toBeTruthy();
      expect(article.coverLabel!.length, article.slug).toBeLessThanOrEqual(32);
    }
  });

  it("el módulo de datos ya no contiene el texto de los artículos", () => {
    // El contenido vive en src/content/articles; data.ts solo lo ensambla.
    const dataModule = readFileSync(
      path.join(process.cwd(), "src", "lib", "data.ts"),
      "utf8"
    );
    expect(dataModule.length).toBeLessThan(12_000);
  });
});

describe("categorías", () => {
  it("cada categoría tiene color y descripción", () => {
    for (const category of categories) {
      expect(category.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(category.description.length).toBeGreaterThan(20);
    }
  });

  it("resuelve categorías por slug", () => {
    expect(getCategoryBySlug("noticias")?.name).toBe("Noticias");
    expect(getCategoryBySlug("no-existe")).toBeUndefined();
  });
});
