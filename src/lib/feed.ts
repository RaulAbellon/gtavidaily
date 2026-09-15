import { getLatestArticles, type Article } from "@/lib/data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * Generador del feed RSS 2.0.
 *
 * El sitio no tenía feed: para un medio de noticias es un canal de distribución
 * estándar (lectores, agregadores, sindicación) y su ausencia obligaba a
 * depender solo de los buscadores.
 */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function itemXml(article: Article): string {
  const url = absoluteUrl(`/articulo/${article.slug}`);
  const categories = article.tags
    .map((tag) => `      <category>${escapeXml(tag)}</category>`)
    .join("\n");

  return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
${categories}
    </item>`;
}

export function buildFeed(limit = 30): string {
  const articles = getLatestArticles(limit);
  const items = articles.map(itemXml).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>es-ES</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

/** Número de elementos que publica el feed. */
export const FEED_LIMIT = 30;
