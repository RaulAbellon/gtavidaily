import {
  articles,
  authors,
  categories,
  getArticleBySlug,
  getArticlesByCategory,
  getCategoryBySlug,
  type Article,
  type Category,
} from "@/lib/data";
import { normalize, rankSearches } from "@/lib/search";

/**
 * Consultas derivadas del contenido. Se mantienen aparte de `data.ts` para no
 * tocar el fichero de datos (200 KB generados) y poder probarlas por separado.
 *
 * El motor de búsqueda vive en `@/lib/search` porque desde la conversión a sitio
 * estático también lo usa el navegador: `/buscar` es una página estática y
 * filtra en el cliente sobre un índice JSON. Aquí se reexporta para no romper a
 * quien ya lo importaba desde este módulo.
 */

export { normalize };

/**
 * Busca artículos por título, extracto, etiquetas y cuerpo.
 * Devuelve resultados ordenados por relevancia (título > etiquetas > cuerpo).
 */
export function searchArticles(query: string, limit = 30): Article[] {
  return rankSearches(articles, query, limit);
}

/**
 * Cuenta de palabras del cuerpo, ignorando fragmentos vacíos. El original
 * hacía `content.join(" ").split(" ").length`, que cuenta los huecos.
 */
export function countWords(article: Pick<Article, "content">): number {
  return article.content
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Estimación de minutos de lectura a 200 palabras por minuto (mínimo 1). */
export function estimateReadingTime(
  article: Pick<Article, "content">
): number {
  return Math.max(1, Math.round(countWords(article) / 200));
}

export type CategoryWithCount = Category & { count: number };

export function getCategoriesWithCount(): CategoryWithCount[] {
  return categories.map((category) => ({
    ...category,
    count: getArticlesByCategory(category.slug).length,
  }));
}

/** Categorías que tienen al menos un artículo publicado. */
export function getPopulatedCategories(): CategoryWithCount[] {
  return getCategoriesWithCount().filter((category) => category.count > 0);
}

/** Todos los slugs, para generateStaticParams y para el sitemap. */
export function getAllArticleSlugs(): string[] {
  return articles.map((article) => article.slug);
}

export function getAllCategorySlugs(): string[] {
  return categories.map((category) => category.slug);
}

/**
 * Una fuente con ruta es una cita verificable; una portada de dominio
 * (`https://medio.com`) no lo es. El contenido generado mezcla ambas, así que
 * solo se muestran las primeras.
 */
export function isCitableSource(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.pathname.replace(/\/+$/, "").length > 0;
  } catch {
    return false;
  }
}

export function citableSources(
  article: Pick<Article, "sources">
): { name: string; url: string }[] {
  return (article.sources ?? []).filter((source) => isCitableSource(source.url));
}

/** Artículos cuyo autor no existe en la lista de autores (debe estar vacío). */
export function findArticlesWithUnknownAuthor(): Article[] {
  const known = new Set(authors.map((author) => author.slug));
  return articles.filter((article) => !known.has(article.author));
}

/** Artículos cuya categoría no existe (debe estar vacío). */
export function findArticlesWithUnknownCategory(): Article[] {
  const known = new Set(categories.map((category) => category.slug));
  return articles.filter((article) => !known.has(article.category));
}

export { getArticleBySlug, getArticlesByCategory, getCategoryBySlug };
