/**
 * Enlazado interno dentro del texto de los artículos.
 *
 * Los párrafos son texto plano, así que para enlazar otra pieza se escribe la
 * ruta entre corchetes y paréntesis: `[la comparativa de tiendas](/articulo/donde-reservar-gta-vi-comparativa)`.
 *
 * Solo se admiten enlaces **internos** (que empiezan por `/`): las fuentes
 * externas van en el campo `sources`, con su nombre y su enlace permanente, y no
 * mezcladas en el cuerpo. Así el cuerpo nunca manda al lector fuera del sitio sin
 * avisar, y el validador puede comprobar que cada destino existe.
 */

export type RichSegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string };

/** `[texto](/ruta)`: texto de 2 a 90 caracteres y ruta interna. */
const LINK_PATTERN = /\[([^\]\n]{2,90})\]\((\/[^)\s]{1,180})\)/g;

/** Divide un párrafo en texto y enlaces. */
export function parseRichText(text: string): RichSegment[] {
  const segments: RichSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    segments.push({ type: "link", value: match[1], href: match[2] });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: "text", value: text }];
}

/** Rutas enlazadas dentro de un texto. Lo usa el validador de contenido. */
export function extractLinks(text: string): string[] {
  return [...text.matchAll(LINK_PATTERN)].map((match) => match[2]);
}

/** Slug del artículo al que apunta una ruta, o `null` si no es un artículo. */
export function articleSlugFromHref(href: string): string | null {
  const match = /^\/articulo\/([a-z0-9-]+)$/.exec(href);
  return match ? match[1] : null;
}
