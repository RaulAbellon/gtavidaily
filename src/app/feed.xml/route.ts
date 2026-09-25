import { FEED_LIMIT, buildFeed } from "@/lib/feed";

/**
 * Feed RSS 2.0 con las últimas noticias.
 *
 * Se genera **una vez, en el build**, como fichero estático
 * (`out/feed.xml`): el CDN lo sirve sin ejecutar nada. Antes era una ruta
 * dinámica que el Worker renderizaba en cada petición fría.
 *
 * `force-static` es redundante con `output: "export"` (todo es estático), pero
 * se declara a propósito: deja claro en el propio fichero que este handler no
 * puede leer la petición ni el reloj, y evita que alguien lo convierta en
 * dinámico sin darse cuenta.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildFeed(FEED_LIMIT), {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
