import type { MetadataRoute } from "next";
import { articles, categories } from "@/lib/data";
import { articleImageUrl, hasOwnImage } from "@/lib/images";
import { SITE_URL, STATIC_ROUTES } from "@/lib/site";

/**
 * Sitemap con las rutas que existen de verdad.
 *
 * El anterior publicaba `/articulo/...` y `/categoria/...` cuando esas rutas no
 * estaban implementadas: 54 de 55 URLs devolvían 404.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const latestArticleDate = articles.reduce<Date>((newest, article) => {
    const date = new Date(article.updatedAt ?? article.publishedAt);
    return date > newest ? date : newest;
  }, new Date(0));

  const siteEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: latestArticleDate,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/noticias`,
      lastModified: latestArticleDate,
      changeFrequency: "hourly",
      priority: 0.8,
    },
  ];

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: "yearly",
    priority: route.path === "/sobre" ? 0.4 : 0.3,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categoria/${category.slug}`,
    lastModified: latestArticleDate,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/articulo/${article.slug}`,
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    changeFrequency: "weekly",
    priority: 0.9,
    // Solo se declaran las imágenes propias: las portadas generadas se sirven
    // desde /cover y no aportan nada al índice de imágenes.
    ...(hasOwnImage(article) ? { images: [articleImageUrl(article)] } : {}),
  }));

  return [
    ...siteEntries,
    ...categoryEntries,
    ...articleEntries,
    ...staticEntries,
  ];
}
