import { articles } from "@/lib/data";
import { SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Sitemap de Google News.
 *
 * Es la vía por la que Google detecta que una noticia es **fresca**: el sitemap
 * de noticias solo puede contener piezas de las últimas 48 horas, así que se
 * recalcula en cada petición y va vaciándose solo. Sin él, una noticia de hoy
 * compite en igualdad con una de hace un mes.
 *
 * Formato: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 */
export const revalidate = 3600;

/** Ventana que admite Google: las últimas 48 horas. */
const WINDOW_HOURS = 48;

export function GET(): Response {
  const since = Date.now() - WINDOW_HOURS * 60 * 60 * 1000;

  const recent = articles
    .filter((article) => new Date(article.publishedAt).getTime() >= since)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const entries = recent
    .map(
      (article) => `  <url>
    <loc>${SITE_URL}/articulo/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${SITE_NAME}</news:name>
        <news:language>${SITE_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.publishedAt).toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      // Se recalcula a menudo porque su contenido depende del reloj.
      "cache-control": "public, s-maxage=1800, max-age=600",
    },
  });
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
