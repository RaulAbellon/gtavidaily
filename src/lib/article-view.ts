import { getAuthorBySlug, getCategoryBySlug, type Article } from "@/lib/data";
import { articleImage, articleImageAlt } from "@/lib/images";
import type { SearchFields } from "@/lib/search";
import { EDITORIAL_NAME } from "@/lib/site";

/**
 * Vista de un artículo lista para pintar.
 *
 * Existe por la conversión a sitio estático: `/noticias` y `/buscar` filtran en
 * el navegador, y un componente de cliente **no puede** importar
 * `@/lib/data` (200 KB de contenido en el bundle, y hay una prueba que lo
 * impide). En vez de mandar el artículo entero al cliente, el componente de
 * servidor lo "aplana" con `toArticleView` y le pasa solo lo que se pinta:
 * titular, entradilla, URL de la imagen, nombre y color de la categoría, fecha
 * ya formateada y minutos de lectura.
 *
 * La fecha se formatea **en el servidor** a propósito: `toLocaleDateString`
 * depende de la zona horaria y del idioma del entorno, y si se calculara en el
 * cliente el HTML hidratado no coincidiría con el del build.
 *
 * Solo el **tipo** puede importarse desde un componente de cliente
 * (`import type`): este módulo toca `@/lib/data`.
 */
export type ArticleView = {
  slug: string;
  title: string;
  excerpt: string;
  /** URL de la imagen que se muestra (JPEG propio o SVG estático de reserva). */
  image: string;
  imageAlt: string;
  categoryName: string;
  categoryColor: string;
  /** Fecha ya formateada en español, para no depender del entorno del cliente. */
  dateLabel: string;
  /** Fecha ISO, para el atributo `dateTime` de `<time>`. */
  publishedAt: string;
  readingTime: number;
  authorName: string;
  trending: boolean;
};

/** Fecha legible y estable: mismo texto en el build y en el navegador. */
export function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Aplana un artículo en los campos que necesitan las tarjetas. */
export function toArticleView(article: Article): ArticleView {
  const category = getCategoryBySlug(article.category);

  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    image: articleImage(article),
    imageAlt: articleImageAlt(article),
    categoryName: category?.name ?? article.category,
    categoryColor: category?.color ?? "#EC4899",
    dateLabel: formatArticleDate(article.publishedAt),
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
    authorName: getAuthorBySlug(article.author)?.name ?? EDITORIAL_NAME,
    trending: Boolean(article.trending),
  };
}

/**
 * Entrada del índice de búsqueda que sirve `/buscar/indice.json`.
 *
 * Es la vista de la tarjeta **más** los campos sobre los que se puntúa. Se
 * genera en el build como fichero estático, así que el navegador no necesita
 * descargarse los 200 KB de `@/lib/data`: pide el índice (una sola vez, y solo
 * si se busca algo) y puntúa en local con el mismo motor que el servidor.
 */
export type SearchIndexEntry = ArticleView & SearchFields;

export function toSearchIndexEntry(article: Article): SearchIndexEntry {
  return {
    ...toArticleView(article),
    tags: article.tags,
    content: article.content,
  };
}
