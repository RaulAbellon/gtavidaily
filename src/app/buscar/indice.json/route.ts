import { toSearchIndexEntry } from "@/lib/article-view";
import { articles } from "@/lib/data";

/**
 * Índice de búsqueda, **como fichero estático** en `/buscar/indice.json`.
 *
 * `/buscar` ya no puede filtrar en el servidor (el sitio es estático y no hay
 * Worker que renderice), así que el navegador hace la búsqueda con el mismo
 * motor de siempre. Para eso necesita el texto de los artículos. En vez de
 * meterlo en el HTML de la página —viajaría en cada visita al buscador, aunque
 * nadie escriba nada— se publica aparte y el cliente lo pide **solo cuando hay
 * una consulta**.
 *
 * `force-static` es redundante con `output: "export"`, pero deja claro que este
 * handler se ejecuta en el build y que no puede leer la petición.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const index = articles.map(toSearchIndexEntry);

  return new Response(JSON.stringify(index), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Cambia en cada publicación; una hora de caché es de sobra.
      "cache-control": "public, max-age=3600",
    },
  });
}
