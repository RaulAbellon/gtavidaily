import { articles } from "@/lib/data";
import { SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Sitemap de Google News.
 *
 * Es la vía por la que Google detecta que una noticia es **fresca**: el sitemap
 * de noticias solo puede contener piezas de las últimas 48 horas.
 *
 * **Cómo se recalcula con el build estático.** Antes era una ruta dinámica con
 * `revalidate = 3600`: se recalculaba sola cada hora en el Worker. Eso ya no
 * existe —no hay ISR ni reloj en tiempo de petición—, así que la ventana de 48
 * horas se evalúa **en el momento del build** y el fichero (`out/news-sitemap.xml`)
 * queda congelado hasta el siguiente despliegue.
 *
 * En la práctica el ciclo encaja: cada noticia nueva se publica con
 * `npm run deploy`, que vuelve a compilar y desplegar, y ese build recalcula la
 * ventana con las piezas de las últimas 48 horas. Lo que hay que tener presente
 * es la contrapartida: si el sitio pasa más de 48 horas **sin desplegarse**, el
 * fichero seguirá listando artículos que ya han salido de la ventana. Google
 * ignora las entradas de más de dos días, así que no rompe nada, pero deja de
 * aportar frescura. Está documentado en `CONVERSION-ESTATICA.md`, con la
 * alternativa (un build programado con un cron externo) por si algún día se
 * quiere desacoplar la frescura del sitemap de la publicación.
 *
 * Formato: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 */
export const dynamic = "force-static";

/** Ventana que admite Google: las últimas 48 horas. */
const WINDOW_HOURS = 48;

export function GET(): Response {
  // `Date.now()` en tiempo de build es determinista para este build: el fichero
  // generado es siempre el mismo. Es justo lo que se busca.
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
      // El fichero solo cambia cuando hay un despliegue nuevo, pero se deja una
      // caché corta para que un build reciente se propague rápido.
      "cache-control": "public, max-age=1800",
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
