import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { articles, type Article } from "@/lib/data";
import {
  ARTICLE_IMAGES_DIR,
  DEFAULT_OG_IMAGE,
  articleImage,
  articleImageAlt,
  articleImageCredit,
  articleImageUrl,
  articleOgImage,
  hasOwnImage,
} from "@/lib/images";

/** Campos que consume la capa de imágenes, para construir casos de prueba. */
type Sample = Pick<
  Article,
  | "category"
  | "coverLabel"
  | "coverAlt"
  | "image"
  | "imageAlt"
  | "imageCredit"
  | "imageSource"
>;

const sinImagen: Sample = {
  category: "noticias",
  coverLabel: "Rótulo de prueba",
  coverAlt: "Ilustración conceptual generada para el artículo",
};

const conImagen: Sample = {
  ...sinImagen,
  image: "/imagenes/ejemplo.jpg",
  imageAlt: "Una imagen propia de ejemplo",
  imageCredit: "Rockstar Games",
  imageSource: "https://example.com/fuente/permanente",
};

describe("imágenes de artículo", () => {
  const conImagenPropia = articles.filter(hasOwnImage);

  it("nunca enlaza imágenes de terceros", () => {
    for (const article of articles) {
      if (!article.image) continue;
      expect(article.image.startsWith(`/${ARTICLE_IMAGES_DIR}/`), article.slug).toBe(true);
      expect(/^https?:/i.test(article.image), article.slug).toBe(false);
    }
  });

  it("declara ficheros que existen de verdad", () => {
    for (const article of conImagenPropia) {
      const file = path.join(process.cwd(), "public", article.image!.replace(/^\//, ""));
      expect(existsSync(file), `${article.slug} → ${article.image}`).toBe(true);
    }
  });

  it("usa extensiones admitidas", () => {
    for (const article of conImagenPropia) {
      expect(article.image, article.slug).toMatch(/\.(jpe?g|png|webp|avif)$/i);
    }
  });

  it("no repite la misma imagen en dos artículos", () => {
    const usadas = new Map<string, string>();
    for (const article of conImagenPropia) {
      const previo = usadas.get(article.image!);
      expect(previo, `${article.image} lo usan ${previo} y ${article.slug}`).toBeUndefined();
      usadas.set(article.image!, article.slug);
    }
  });

  it("documenta la autoría de cada imagen propia", () => {
    for (const article of conImagenPropia) {
      expect(article.imageCredit, `${article.slug} sin imageCredit`).toBeTruthy();
      expect(article.imageAlt?.length ?? 0, `${article.slug} sin imageAlt`).toBeGreaterThan(14);
    }
  });

  it("cae en la portada generada cuando el artículo no tiene imagen", () => {
    expect(hasOwnImage(sinImagen)).toBe(false);
    expect(articleImage(sinImagen)).toContain("/cover?");
    expect(articleImage(conImagen)).toBe("/imagenes/ejemplo.jpg");
  });

  it("usa el texto alternativo de la imagen o el de la portada", () => {
    expect(articleImageAlt(sinImagen)).toBe(sinImagen.coverAlt);
    expect(articleImageAlt(conImagen)).toBe("Una imagen propia de ejemplo");
  });

  it("compone el pie de foto con la autoría y la fuente", () => {
    expect(articleImageCredit(sinImagen)).toBeNull();
    expect(articleImageCredit(conImagen)).toBe(
      "Rockstar Games (https://example.com/fuente/permanente)"
    );
  });

  it("reserva la imagen de marca para los artículos sin imagen propia", () => {
    expect(articleOgImage(sinImagen)).toBe(DEFAULT_OG_IMAGE);
    expect(articleOgImage(conImagen)).toBe("/imagenes/ejemplo.jpg");
    // Una URL remota colada en los datos nunca debe acabar en og:image.
    expect(articleOgImage({ image: "https://ejemplo.com/foto.jpg" })).toBe(
      DEFAULT_OG_IMAGE
    );
  });

  it("construye URLs absolutas para datos estructurados", () => {
    expect(articleImageUrl(conImagen)).toMatch(/^https:\/\/gtavidaily\.com\/imagenes\//);
  });

  it("el sitemap solo declara las imágenes propias", () => {
    const entries = sitemap();
    const conImagenes = entries.filter((entry) => entry.images?.length);

    expect(conImagenes.length).toBe(conImagenPropia.length);
    for (const entry of conImagenes) {
      expect(entry.url).toContain("/articulo/");
      expect(entry.images?.[0]).toMatch(/^https:\/\/gtavidaily\.com\/imagenes\//);
    }
  });
});
