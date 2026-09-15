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

/**
 * Consultas derivadas del contenido. Se mantienen aparte de `data.ts` para no
 * tocar el fichero de datos (200 KB generados) y poder probarlas por separado.
 */

/** Normaliza texto para búsquedas: minúsculas y sin acentos. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Busca artículos por título, extracto, etiquetas y cuerpo.
 * Devuelve resultados ordenados por relevancia (título > etiquetas > cuerpo).
 */
export function searchArticles(query: string, limit = 30): Article[] {
  const needle = normalize(query.trim());
  if (needle.length < 2) return [];

  const scored = articles
    .map((article) => {
      const title = normalize(article.title);
      const excerpt = normalize(article.excerpt);
      const tags = normalize(article.tags.join(" "));
      const body = normalize(article.content.join(" "));

      let score = 0;
      if (title.includes(needle)) score += 10;
      if (tags.includes(needle)) score += 5;
      if (excerpt.includes(needle)) score += 3;
      if (body.includes(needle)) score += 1;

      return { article, score };
    })
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.article.publishedAt).getTime() -
          new Date(a.article.publishedAt).getTime()
    );

  return scored.slice(0, limit).map((row) => row.article);
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
