import { describe, expect, it } from "vitest";
import { articles } from "@/lib/data";
import { articleSlugFromHref, extractLinks, parseRichText } from "@/lib/text";

const slugs = new Set(articles.map((article) => article.slug));

/** Rutas que existen aunque no sean artículos. */
const OTHER_ROUTES = new Set(["/", "/noticias", "/sobre", "/contacto"]);

describe("analizador de enlaces internos", () => {
  it("deja el texto intacto cuando no hay enlaces", () => {
    expect(parseRichText("Un párrafo normal.")).toEqual([
      { type: "text", value: "Un párrafo normal." },
    ]);
  });

  it("separa texto y enlaces", () => {
    const segments = parseRichText(
      "Mira [la comparativa](/articulo/donde-reservar-gta-vi-comparativa) antes de comprar."
    );
    expect(segments).toEqual([
      { type: "text", value: "Mira " },
      {
        type: "link",
        value: "la comparativa",
        href: "/articulo/donde-reservar-gta-vi-comparativa",
      },
      { type: "text", value: " antes de comprar." },
    ]);
  });

  it("no interpreta corchetes sueltos ni enlaces externos", () => {
    expect(extractLinks("Un [dato] entre corchetes.")).toEqual([]);
    expect(extractLinks("Una fuente (https://ejemplo.com/nota).")).toEqual([]);
  });
});

describe("enlaces del contenido publicado", () => {
  const withLinks = articles.filter((article) =>
    article.content.some((paragraph) => extractLinks(paragraph).length > 0)
  );

  it("todos los destinos internos existen", () => {
    const broken: string[] = [];
    for (const article of articles) {
      for (const paragraph of article.content) {
        for (const href of extractLinks(paragraph)) {
          const slug = articleSlugFromHref(href);
          if (slug) {
            if (!slugs.has(slug)) broken.push(`${article.slug} → ${href}`);
          } else if (!OTHER_ROUTES.has(href)) {
            broken.push(`${article.slug} → ${href} (ruta no reconocida)`);
          }
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it("ningún artículo se enlaza a sí mismo", () => {
    const selfLinks: string[] = [];
    for (const article of articles) {
      for (const paragraph of article.content) {
        for (const href of extractLinks(paragraph)) {
          if (articleSlugFromHref(href) === article.slug) selfLinks.push(article.slug);
        }
      }
    }
    expect(selfLinks).toEqual([]);
  });

  it("el cuerpo no manda fuera del sitio", () => {
    const external: string[] = [];
    for (const article of articles) {
      for (const paragraph of article.content) {
        // Un enlace externo escrito como markdown no lo reconoce el analizador y
        // se vería en crudo; las fuentes van en su propio campo.
        if (/\]\(https?:/i.test(paragraph) || /https?:\/\/[^\s)]+\)/.test(paragraph)) {
          external.push(article.slug);
        }
      }
    }
    expect(external).toEqual([]);
  });

  it("hay enlaces internos de verdad en el contenido", () => {
    // Si esta prueba falla, es que el enlazado interno se ha perdido: es lo que
    // reparte autoridad entre las piezas del sitio.
    expect(withLinks.length).toBeGreaterThanOrEqual(9);
  });
});
