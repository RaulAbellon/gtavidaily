// Datos de artículos para el sitio de noticias de GTA VI.
// Estructura optimizada para SEO con campos para JSON-LD NewsArticle.
//
// AVISO SOBRE EL CONTENIDO: los artículos heredados de la primera etapa se
// verificaron afirmación por afirmación y se reescribieron (ver el informe de
// verificación en el historial del proyecto). Cada pieza declara sus fuentes y
// distingue lo confirmado por Rockstar de lo que solo es un rumor. Aun así, el
// sector se mueve: antes de dar por buena una cifra, conviene reabrir la fuente
// enlazada al final del artículo.
//
// Las portadas son SVG generados localmente (ver `src/lib/cover.ts`): no hay
// material con copyright de Rockstar/Take-Two.

import { coverUrl } from "@/lib/cover";
import { articlesRaw } from "@/content/articles";

export type Category = {
  slug: string;
  name: string;
  description: string;
  color: string;
};

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[]; // párrafos
  category: string; // slug de categoría
  author: string; // slug de autor
  publishedAt: string; // ISO date
  updatedAt?: string;
  cover: string; // URL de la ilustración generada (ver src/lib/cover.ts)
  coverLabel: string; // rótulo corto que se dibuja dentro de la ilustración
  coverAlt: string;
  tags: string[];
  readingTime: number; // minutos
  featured?: boolean;
  trending?: boolean;
  /** Imagen propia del artículo, siempre una copia local en `public/imagenes/`. */
  image?: string;
  /** Texto alternativo de esa imagen (si falta, se usa `coverAlt`). */
  imageAlt?: string;
  /** Autoría o cesión de la imagen; se muestra en el pie de foto. */
  imageCredit?: string;
  /** Enlace a la fuente original de la imagen, para trazabilidad. */
  imageSource?: string;
  sources?: { name: string; url: string }[]; // fuentes reales citadas
};

export const categories: Category[] = [
  {
    slug: "noticias",
    name: "Noticias",
    description:
      "Últimas noticias y actualizaciones oficiales sobre Grand Theft Auto VI de Rockstar Games.",
    color: "#EC4899",
  },
  {
    slug: "trailers",
    name: "Tráileres",
    description:
      "Análisis frame a frame de todos los tráileres, avances y vídeos promocionales de GTA VI.",
    color: "#06B6D4",
  },
  {
    slug: "gameplay",
    name: "Gameplay",
    description:
      "Mecánicas, sistemas de juego, mundo abierto y novedades en la jugabilidad de GTA VI.",
    color: "#A855F7",
  },
  {
    slug: "personajes",
    name: "Personajes",
    description:
      "Todo sobre Lucia, Jason y el resto del elenco de personajes de Vice City.",
    color: "#F59E0B",
  },
  {
    slug: "mapa",
    name: "Mapa y Mundo",
    description:
      "Exploración del mapa de Leonida, Vice City y todos los lugares de GTA VI.",
    color: "#10B981",
  },
  {
    slug: "rumores",
    name: "Rumores y Filtros",
    description:
      "Filtraciones, rumores y datos no confirmados sobre GTA VI, analizados con cautela.",
    color: "#EF4444",
  },
  {
    slug: "fecha-lanzamiento",
    name: "Fecha de Lanzamiento",
    description:
      "Todo lo que sabemos sobre la fecha de salida, retrasos y disponibilidad de GTA VI.",
    color: "#8B5CF6",
  },
  {
    slug: "guias",
    name: "Guías y práctica",
    description:
      "Guías de compra y preparación para GTA VI: ediciones, idiomas, clasificación por edades, almacenamiento, seguridad de la cuenta y rendimiento por consola.",
    color: "#22C55E",
  },
];

// Identidad editorial única. Antes había cuatro autores inventados con
// fotografías de personas reales servidas por un servicio externo de avatares:
// un riesgo de derechos de imagen y de datos personales, además de una señal
// de baja confianza (E-E-A-T) para Google. El avatar es un SVG local.
export const authors: Author[] = [
  {
    slug: "redaccion",
    name: "Redacción GTA VI Daily",
    role: "Equipo editorial",
    bio: "Cobertura en español de Grand Theft Auto VI: tráileres, mapa de Leonida, personajes y novedades de Rockstar Games y Take-Two. Cada artículo indica sus fuentes.",
    avatar: `data:image/svg+xml;utf8,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#18181b"/><text x="48" y="61" font-family="Arial Black, sans-serif" font-size="34" font-weight="900" fill="#EC4899" text-anchor="middle">VI</text></svg>'
    )}`,
  },
];

/**
 * Los artículos viven en `src/content/articles/`, un fichero JSON por pieza,
 * para poder editarlos sin tocar un módulo gigante. Aquí solo se les añade la
 * URL de la ilustración, que se genera a partir de la categoría y el rótulo.
 *
 * Antes el campo `cover` guardaba el SVG entero como `data:` URI (unos 2,5 KB
 * por artículo, 165 KB en total) solo para poder recuperar de ahí el rótulo. La
 * etiqueta ya viaja como campo propio, así que ese rodeo sobra.
 */
export const articles: Article[] = articlesRaw.map((article) => ({
  ...article,
  cover: coverUrl(article),
}));

// Utilidades de acceso a datos
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.category === categorySlug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

export function getTrendingArticles(): Article[] {
  return articles.filter((a) => a.trending);
}

export function getLatestArticles(limit?: number): Article[] {
  const sorted = [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getRelatedArticles(
  slug: string,
  category: string,
  limit = 3
): Article[] {
  return articles
    .filter((a) => a.slug !== slug && a.category === category)
    .slice(0, limit);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getArticleUrl(slug: string): string {
  return `/articulo/${slug}`;
}

export function getCategoryUrl(slug: string): string {
  return `/categoria/${slug}`;
}
