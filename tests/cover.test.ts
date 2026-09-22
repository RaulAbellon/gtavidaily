import { describe, expect, it } from "vitest";
import { GET } from "@/app/cover/route";
import { articles } from "@/lib/data";
import {
  COVER_HEIGHT,
  COVER_VERSION,
  COVER_WIDTH,
  coverUrl,
  renderCoverSvg,
} from "@/lib/cover";

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

  it("reparte los artículos reales entre las cinco escenas", () => {
    const escenas = new Set(
      articles.map((article) => {
        const svg = renderCoverSvg(article.category, article.coverLabel);
        return /id="sky(\d)"/.exec(svg)?.[1];
      })
    );
    expect([...escenas].sort()).toEqual(["0", "1", "2", "3", "4"]);
  });

  it("no depende de recursos externos: todo es arte propio", () => {
    const svg = renderCoverSvg("guias", "Guía de compra");
    expect(svg).not.toMatch(/(href|src)="https?:/);
    expect(svg).not.toContain("<image");
  });

  it("usa la paleta por defecto en categorías desconocidas", () => {
    // El color principal por defecto se usa en el logotipo y en el neón.
    expect(renderCoverSvg("no-existe", "x")).toContain("#EC4899");
  });

  it("recorta los rótulos demasiado largos", () => {
    const svg = renderCoverSvg("noticias", "a".repeat(120));
    expect(svg).toContain("a".repeat(60));
    expect(svg).not.toContain("a".repeat(61));
  });
});

describe("URL de la portada", () => {
  it("construye URLs cortas y cacheables en lugar de incrustar el SVG", () => {
    for (const article of articles) {
      const url = coverUrl(article);
      expect(url.startsWith("/cover?")).toBe(true);
      expect(url).toContain(`v=${COVER_VERSION}`);
      expect(url).not.toContain("data:");
      expect(url.length).toBeLessThan(160);
    }
  });

  it("el campo cover de cada artículo ya es esa URL y el rótulo viaja aparte", () => {
    for (const article of articles) {
      expect(article.cover).toBe(coverUrl(article));
      expect(article.cover).not.toContain("data:");
      expect(article.coverLabel.length).toBeGreaterThan(0);
      // Antes el SVG entero (~2,5 KB) viajaba dentro de los datos.
      expect(article.cover.length).toBeLessThan(160);
    }
  });
});

describe("ruta /cover", () => {
  it("sirve el SVG con caché larga", async () => {
    const response = await GET(
      new Request("http://localhost/cover?v=2&c=trailers&t=Prueba")
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/svg+xml");
    expect(response.headers.get("cache-control")).toContain("immutable");

    expect(await response.text()).toContain("Prueba");
  });

  it("neutraliza texto malicioso en los parámetros", async () => {
    const response = await GET(
      new Request(
        `http://localhost/cover?c=noticias&t=${encodeURIComponent("<script>x</script>")}`
      )
    );
    expect(await response.text()).not.toContain("<script>");
  });

  it("no falla sin parámetros", async () => {
    const response = await GET(new Request("http://localhost/cover"));
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("<svg");
  });
});
