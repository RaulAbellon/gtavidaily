import { describe, expect, it } from "vitest";
import { GET, generateStaticParams } from "@/app/portadas/[slug]/route";
import { articles } from "@/lib/data";
import {
  COVER_HEIGHT,
  COVER_WIDTH,
  coverUrl,
  renderCoverSvg,
} from "@/lib/cover";
import { articleImage, staticCoverUrl } from "@/lib/images";

/** Distancia entre dos tonos, en grados. Sirve para comparar familias de color. */
function hueDistance(a: string, b: string): number {
  const hue = (hex: string) => {
    const value = hex.replace("#", "");
    const [r, g, bl] = [0, 2, 4].map(
      (index) => parseInt(value.slice(index, index + 2), 16) / 255
    );
    const max = Math.max(r, g, bl);
    const min = Math.min(r, g, bl);
    const delta = max - min;
    if (delta === 0) return 0;
    if (max === r) return (((g - bl) / delta) % 6) * 60;
    if (max === g) return ((bl - r) / delta + 2) * 60;
    return ((r - g) / delta + 4) * 60;
  };
  const difference = Math.abs(hue(a) - hue(b)) % 360;
  return difference > 180 ? 360 - difference : difference;
}

describe("ilustraciones de portada", () => {
  it("genera un SVG con las dimensiones declaradas y el rótulo", () => {
    const svg = renderCoverSvg("trailers", "Tráiler 2");
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain(`width="${COVER_WIDTH}"`);
    expect(svg).toContain(`height="${COVER_HEIGHT}"`);
    expect(svg).toContain("Tráiler 2");
    expect(svg.trimEnd().endsWith("</svg>")).toBe(true);
  });

  it("escapa el texto que se inyecta en el SVG", () => {
    const svg = renderCoverSvg("noticias", '<script>alert("x")</script>');
    expect(svg).not.toContain("<script>");
    expect(svg).toContain("&lt;script&gt;");
  });

  it("es determinista: el mismo artículo produce siempre la misma ilustración", () => {
    expect(renderCoverSvg("mapa", "Estado de Leonida")).toBe(
      renderCoverSvg("mapa", "Estado de Leonida")
    );
  });

  it("varía entre artículos distintos", () => {
    expect(renderCoverSvg("noticias", "Uno")).not.toBe(
      renderCoverSvg("noticias", "Dos")
    );
  });

  it("reparte los artículos reales entre las siete escenas", () => {
    const escenas = new Set(
      articles.map((article) => {
        const svg = renderCoverSvg(article.category, article.coverLabel);
        return /id="sky(\d)"/.exec(svg)?.[1];
      })
    );
    expect([...escenas].sort()).toEqual(["0", "1", "2", "3", "4", "5", "6"]);
  });

  it("varía la composición dentro de la misma escena", () => {
    // Sin variación interna, dos artículos de la misma categoría y escena
    // saldrían clavados; el espejo y las disposiciones lo evitan.
    const noticias = articles
      .filter((article) => article.category === "noticias")
      .slice(0, 24)
      .map((article) => renderCoverSvg(article.category, article.coverLabel));
    expect(new Set(noticias).size).toBe(noticias.length);
  });

  it("no depende de recursos externos: todo es arte propio", () => {
    const svg = renderCoverSvg("guias", "Guía de compra");
    expect(svg).not.toMatch(/(href|src)="https?:/);
    expect(svg).not.toContain("<image");
  });

  it("usa la paleta por defecto en categorías desconocidas", () => {
    const svg = renderCoverSvg("no-existe", "x");
    // El color principal se usa en el degradado de neón. La deriva de tono lo
    // mueve unos grados por artículo, así que se compara el tono, no el valor.
    const color = /id="neon\d"[\s\S]*?stop-color="(#[0-9a-fA-F]{6})"/.exec(svg)?.[1];
    expect(color, "no se ha encontrado el color principal").toBeTruthy();
    expect(hueDistance(color!, "#EC4899")).toBeLessThan(30);
  });

  it("recorta los rótulos demasiado largos", () => {
    const svg = renderCoverSvg("noticias", "a".repeat(120));
    expect(svg).toContain("a".repeat(60));
    expect(svg).not.toContain("a".repeat(61));
  });
});

describe("URL de la portada", () => {
  it("el generador sigue construyendo URLs cortas y deterministas", () => {
    // `coverUrl` se conserva como utilidad del generador, pero **ya no se
    // publica ninguna ruta que la sirva**: la portada que se muestra es el JPEG
    // propio del artículo y, si falta, el SVG estático `/portadas/<slug>.svg`.
    for (const article of articles) {
      const url = coverUrl(article);
      expect(url.startsWith("/cover?")).toBe(true);
      expect(url).not.toContain("data:");
      expect(url.length).toBeLessThan(160);
    }
  });

  it("cada artículo apunta a una imagen real, nunca a la ruta retirada", () => {
    for (const article of articles) {
      expect(article.cover).not.toContain("/cover?");
      expect(article.cover).toBe(articleImage(article));
      expect(article.coverLabel.length).toBeGreaterThan(0);
      // Antes el SVG entero (~2,5 KB) viajaba dentro de los datos.
      expect(article.cover.length).toBeLessThan(160);
    }
  });
});

describe("portadas estáticas /portadas/[slug].svg", () => {
  it("genera un fichero por artículo, sin dejar ninguno fuera", () => {
    // El valor del parámetro incluye la extensión: así el build escribe
    // `out/portadas/<slug>.svg` (el App Router no admite `[slug].svg`).
    const slugs = generateStaticParams().map((params) => params.slug);
    expect(slugs.sort()).toEqual(
      articles.map((article) => `${article.slug}.svg`).sort()
    );
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("sirve el SVG del artículo con caché larga", async () => {
    const article = articles[0];
    const response = await GET(new Request("http://localhost/portadas/x.svg"), {
      params: Promise.resolve({ slug: `${article.slug}.svg` }),
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/svg+xml");
    expect(response.headers.get("cache-control")).toContain("immutable");

    const svg = await response.text();
    expect(svg).toContain("<svg");
    expect(svg).toBe(renderCoverSvg(article.category, article.coverLabel));
  });

  it("la URL pública coincide con el fichero que se genera", () => {
    const article = articles[0];
    expect(staticCoverUrl(article.slug)).toBe(`/portadas/${article.slug}.svg`);
  });

  it("devuelve 404 para un slug que no existe", async () => {
    const response = await GET(new Request("http://localhost/portadas/x.svg"), {
      params: Promise.resolve({ slug: "no-existe-este-articulo.svg" }),
    });
    expect(response.status).toBe(404);
  });
});
