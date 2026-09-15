import { renderCoverSvg } from "@/lib/cover";

/**
 * Sirve las portadas como SVG estático y cacheable.
 *
 * Se generan aquí (no en el HTML) para no incrustar ~2,5 KB de SVG por imagen
 * en cada página. La ruta es rastreable a propósito, así que Google Imágenes
 * puede indexarlas.
 */
export function GET(request: Request): Response {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("c") ?? "").slice(0, 40);
  const label = (searchParams.get("t") ?? "").replace(/[\u0000-\u001f]/g, "").slice(0, 60);

  return new Response(renderCoverSvg(category, label), {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
