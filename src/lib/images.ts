import { coverUrl } from "@/lib/cover";
import type { Article } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

/**
 * Imágenes de los artículos.
 *
 * Criterio: cada artículo puede llevar su propia imagen, pero **nunca enlazada a
 * un tercero**. Si el medio que la publicó la retira, el artículo se queda roto
 * y con una imagen que ya no controlamos; además, enlazar en caliente consume el
 * ancho de banda de otro y complica la trazabilidad de la licencia. Por eso la
 * imagen se guarda siempre en `public/imagenes/` y en los datos solo se apunta
 * a esa copia local.
 *
 * Mientras un artículo no tenga imagen propia, se sigue sirviendo la portada
 * generada (`/cover`), que es SVG, pesa poco y no depende de nadie.
 */

/** Imagen social por defecto del sitio (marca, no de un artículo). */
export const DEFAULT_OG_IMAGE = "/og-image.png";

/** Carpeta pública donde viven las imágenes de los artículos. */
export const ARTICLE_IMAGES_DIR = "public/imagenes";

/**
 * Prefijo de URL de esas imágenes. Se mantiene aparte de la ruta de disco para
 * no confundirlos: la primera es `public/imagenes`, la segunda `/imagenes`.
 */
export const ARTICLE_IMAGES_URL_PREFIX = "/imagenes";

/** Medidas a las que se preparan las imágenes de artículo (16:9). */
export const ARTICLE_IMAGE_WIDTH = 1200;
export const ARTICLE_IMAGE_HEIGHT = 675;

const REMOTE = /^https?:/i;

/** ¿El artículo tiene imagen propia? */
export function hasOwnImage(article: Pick<Article, "image">): boolean {
  return Boolean(article.image?.trim());
}

/** Imagen que se muestra en el artículo y en las tarjetas. */
export function articleImage(
  article: Pick<Article, "image" | "category" | "coverLabel">
): string {
  const own = article.image?.trim();
  return own ? own : coverUrl(article);
}

/** Texto alternativo: el de la imagen propia o el de la portada generada. */
export function articleImageAlt(
  article: Pick<Article, "image" | "imageAlt" | "coverAlt">
): string {
  return article.imageAlt?.trim() || article.coverAlt;
}

/** Pie de foto: autoría o cesión de la imagen, si se ha documentado. */
export function articleImageCredit(
  article: Pick<Article, "image" | "imageCredit" | "imageSource">
): string | null {
  const credit = article.imageCredit?.trim();
  if (!credit) return null;
  const source = article.imageSource?.trim();
  return source ? `${credit} (${source})` : credit;
}

/** URL absoluta de la imagen del artículo, para `og:image` y datos estructurados. */
export function articleImageUrl(
  article: Pick<Article, "image" | "category" | "coverLabel">
): string {
  return absoluteUrl(articleImage(article));
}

/**
 * Imagen para las previsualizaciones sociales.
 *
 * Si el artículo tiene imagen propia se usa esa; si no, la del sitio con la
 * marca. Nunca se usa la portada generada aquí: lleva el rótulo del artículo
 * incrustado y en una tarjeta social se lee mal.
 */
export function articleOgImage(article: Pick<Article, "image">): string {
  const own = article.image?.trim();
  return own && !REMOTE.test(own) ? own : DEFAULT_OG_IMAGE;
}
