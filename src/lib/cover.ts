/**
 * Generación de las portadas.
 *
 * Antes cada artículo llevaba su portada incrustada como `data:` URI dentro del
 * HTML: ~2,5 KB por imagen, duplicadas en el marcado y en el payload de React,
 * sin caché posible. Ahora se sirven desde `/cover?c=…&t=…`, lo que reduce el
 * HTML, permite que el navegador las cachee y no impide que Google Imágenes las
 * rastree.
 */

export const COVER_VERSION = "1";
export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 675;

const COLORS: Record<string, [string, string]> = {
  noticias: ["#EC4899", "#8B5CF6"],
  trailers: ["#06B6D4", "#3B82F6"],
  gameplay: ["#A855F7", "#EC4899"],
  personajes: ["#F59E0B", "#EF4444"],
  mapa: ["#10B981", "#06B6D4"],
  rumores: ["#EF4444", "#8B5CF6"],
  "fecha-lanzamiento": ["#8B5CF6", "#EC4899"],
  guias: ["#22C55E", "#06B6D4"],
};

const DEFAULT_COLORS: [string, string] = ["#EC4899", "#8B5CF6"];

/** Escapa el texto que se inserta en el SVG. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderCoverSvg(category: string, label: string): string {
  const [c1, c2] = COLORS[category] ?? DEFAULT_COLORS;
  const safeLabel = escapeXml(label.slice(0, 60));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${COVER_WIDTH}" height="${COVER_HEIGHT}" viewBox="0 0 ${COVER_WIDTH} ${COVER_HEIGHT}" role="img">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="${c2}" stop-opacity="0.6"/>
      </linearGradient>
      <pattern id="p" patternUnits="userSpaceOnUse" width="40" height="40">
        <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.15"/>
      </pattern>
    </defs>
    <rect width="${COVER_WIDTH}" height="${COVER_HEIGHT}" fill="#0a0a0b"/>
    <rect width="${COVER_WIDTH}" height="${COVER_HEIGHT}" fill="url(#g)"/>
    <rect width="${COVER_WIDTH}" height="${COVER_HEIGHT}" fill="url(#p)"/>
    <text x="600" y="320" font-family="Arial Black, sans-serif" font-size="64" font-weight="900" fill="white" text-anchor="middle" opacity="0.95">GTA VI</text>
    <text x="600" y="380" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="middle" opacity="0.85">${safeLabel}</text>
    <text x="600" y="600" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.5">GTA VI Daily · Noticia</text>
  </svg>`;
}

/** Portada como data URI (lo que guardan los datos actuales). */
export function coverDataUri(category: string, label: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(renderCoverSvg(category, label))}`;
}

/**
 * Recupera la etiqueta que se usó al generar la portada. Los datos actuales
 * guardan el SVG completo, así que se lee de ahí en lugar de duplicar el campo.
 */
export function coverLabelFromDataUri(uri: string): string | null {
  const comma = uri.indexOf(",");
  if (comma === -1) return null;
  try {
    const svg = decodeURIComponent(uri.slice(comma + 1));
    const match = svg.match(/<text x="600" y="380"[^>]*>([^<]*)<\/text>/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/** URL pública y cacheable de la portada de un artículo. */
export function coverUrl(article: { category: string; cover: string }): string {
  const label = coverLabelFromDataUri(article.cover) ?? article.category;
  const params = new URLSearchParams({
    v: COVER_VERSION,
    c: article.category,
    t: label,
  });
  return `/cover?${params.toString()}`;
}
