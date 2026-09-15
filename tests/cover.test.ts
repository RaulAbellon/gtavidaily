import { describe, expect, it } from "vitest";
import { GET } from "@/app/cover/route";
import { articles } from "@/lib/data";
import {
  COVER_HEIGHT,
  COVER_VERSION,
  COVER_WIDTH,
  coverDataUri,
  coverLabelFromDataUri,
  coverUrl,
  renderCoverSvg,
} from "@/lib/cover";

describe("generación de portadas", () => {
  it("genera un SVG con las dimensiones declaradas", () => {
    const svg = renderCoverSvg("trailers", "Tráiler 2");
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain(`width="${COVER_WIDTH}"`);
    expect(svg).toContain(`height="${COVER_HEIGHT}"`);
    expect(svg).toContain("Tráiler 2");
    expect(svg).toContain("GTA VI Daily");
  });

  it("escapa el texto que se inyecta en el SVG", () => {
    const svg = renderCoverSvg("noticias", '<script>alert("x")</script>');
    expect(svg).not.toContain("<script>");
    expect(svg).toContain("&lt;script&gt;");
  });

  it("usa el gradiente por defecto en categorías desconocidas", () => {
    expect(renderCoverSvg("no-existe", "x")).toContain("#EC4899");
  });

  it("genera un data URI válido y recupera su etiqueta", () => {
    const uri = coverDataUri("mapa", "Estado de Leonida");
    expect(uri.startsWith("data:image/svg+xml;utf8,")).toBe(true);
    expect(coverLabelFromDataUri(uri)).toBe("Estado de Leonida");
  });

  it("devuelve null si el data URI no tiene el formato esperado", () => {
    expect(coverLabelFromDataUri("no-es-un-data-uri")).toBeNull();
    expect(coverLabelFromDataUri("data:image/svg+xml;utf8,")).toBeNull();
  });

  it("recupera la etiqueta de las 44 portadas reales", () => {
    for (const article of articles) {
      const label = coverLabelFromDataUri(article.cover);
      expect(label, article.slug).toBeTruthy();
      expect(label!.length).toBeGreaterThan(0);
    }
  });

  it("construye URLs cortas y cacheables en lugar de incrustar el SVG", () => {
    for (const article of articles) {
      const url = coverUrl(article);
      expect(url.startsWith("/cover?")).toBe(true);
      expect(url).toContain(`v=${COVER_VERSION}`);
      expect(url).not.toContain("data:");
      expect(url.length).toBeLessThan(160);
      // Antes cada portada ocupaba ~2,5 KB dentro del HTML.
      expect(url.length).toBeLessThan(article.cover.length / 10);
    }
  });
});

describe("ruta /cover", () => {
  it("sirve el SVG con caché larga", async () => {
    const response = await GET(
      new Request("http://localhost/cover?v=1&c=trailers&t=Prueba")
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/svg+xml");
    expect(response.headers.get("cache-control")).toContain("immutable");

    const body = await response.text();
    expect(body).toContain("Prueba");
  });

  it("neutraliza texto malicioso en los parámetros", async () => {
    const response = await GET(
      new Request(
        `http://localhost/cover?c=noticias&t=${encodeURIComponent('<script>x</script>')}`
      )
    );
    const body = await response.text();
    expect(body).not.toContain("<script>");
  });

  it("no falla sin parámetros", async () => {
    const response = await GET(new Request("http://localhost/cover"));
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("<svg");
  });
});
