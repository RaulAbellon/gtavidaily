/**
 * Motor de búsqueda del sitio.
 *
 * Vive aparte de `queries.ts` a propósito: este módulo **no importa el
 * contenido** (`@/lib/data`), así que lo pueden usar tanto el servidor como el
 * navegador. Desde la conversión a sitio estático eso es imprescindible:
 * `/buscar` es una página estática y filtra en el cliente, pero la puntuación
 * tiene que ser exactamente la misma que la de las pruebas y la del servidor.
 *
 * La búsqueda es la misma de siempre: coincidencia por subcadena sobre el texto
 * normalizado (minúsculas y sin acentos), con más peso en el titular
 * (10) que en las etiquetas (5), la entradilla (3) y el cuerpo (1).
 */

/** Longitud mínima de una consulta para que valga la pena buscar. */
export const MIN_QUERY_LENGTH = 2;

/** Normaliza texto para búsquedas: minúsculas y sin acentos. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Campos de los que se alimenta el motor. */
export type SearchFields = {
  title: string;
  excerpt: string;
  tags: string[];
  content: string[];
};

/** Documento ya normalizado: se calcula una vez y se reutiliza por consulta. */
export type PreparedSearch = {
  title: string;
  tags: string;
  excerpt: string;
  body: string;
};

/** Documento listo para puntuar, junto al dato original que se devolverá. */
export type PreparedSearchDoc<T> = {
  doc: T;
  text: PreparedSearch;
};

/**
 * Normaliza un documento. En el navegador esto se hace **una sola vez**, al
 * cargar el índice: normalizar 96 artículos en cada pulsación de tecla sería
 * tirar el trabajo por la borda.
 */
export function prepareSearchDoc<T extends SearchFields>(
  doc: T
): PreparedSearchDoc<T> {
  return {
    doc,
    text: {
      title: normalize(doc.title),
      tags: normalize(doc.tags.join(" ")),
      excerpt: normalize(doc.excerpt),
      body: normalize(doc.content.join(" ")),
    },
  };
}

/** Puntuación de un documento ya normalizado frente a una consulta normalizada. */
export function scorePreparedSearch(
  text: PreparedSearch,
  needle: string
): number {
  let score = 0;
  if (text.title.includes(needle)) score += 10;
  if (text.tags.includes(needle)) score += 5;
  if (text.excerpt.includes(needle)) score += 3;
  if (text.body.includes(needle)) score += 1;
  return score;
}

/**
 * Ordena los documentos por relevancia y antigüedad.
 *
 * `prepared` viene de `prepareSearchDoc`; la consulta se normaliza aquí.
 */
export function rankPreparedSearches<T extends { publishedAt: string }>(
  prepared: PreparedSearchDoc<T>[],
  query: string,
  limit = 30
): T[] {
  const needle = normalize(query.trim());
  if (needle.length < MIN_QUERY_LENGTH) return [];

  return prepared
    .map((entry) => ({
      entry,
      score: scorePreparedSearch(entry.text, needle),
    }))
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.entry.doc.publishedAt).getTime() -
          new Date(a.entry.doc.publishedAt).getTime()
    )
    .slice(0, limit)
    .map((row) => row.entry.doc);
}

/** Atajo para el servidor: prepara y puntúa en una sola llamada. */
export function rankSearches<
  T extends SearchFields & { publishedAt: string },
>(docs: T[], query: string, limit = 30): T[] {
  return rankPreparedSearches(docs.map(prepareSearchDoc), query, limit);
}
