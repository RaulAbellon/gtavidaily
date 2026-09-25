import { articles } from "@/lib/data";
import { renderCoverSvg } from "@/lib/cover";

/**
 * Portadas de reserva, **como ficheros SVG estáticos**.
 *
 * Antes esto era la ruta dinámica `/cover?c=categoria&t=rotulo`, que el Worker
 * de Cloudflare tenía que ejecutar en cada petición (y que en Netlify llegó a
 * compartir una única entrada de caché entre los 66 artículos).
 *
 * Ahora cada artículo tiene su propio fichero, generado en `next build` a partir
 * de `generateStaticParams`:
 *
 *     /portadas/<slug>.svg
 *
 * Ventajas: el CDN lo sirve sin despertar a nadie, se puede cachear para
 * siempre, funciona igual en los tres hostings y no hay parámetros de consulta
 * que puedan confundir a una caché intermedia.
 *
 * **La portada propia en JPEG manda.** Todos los artículos tienen ya su imagen
 * de 1200×675 en `public/imagenes/` y es la que se muestra en las tarjetas, en
 * el artículo y en las previsualizaciones sociales (ver `src/lib/images.ts`).
 * Este SVG solo entra en juego si algún día se publica una pieza sin imagen
 * propia: así ninguna página se queda sin portada.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

/**
 * Un fichero por artículo, con la extensión incluida en el propio parámetro.
 *
 * El App Router no admite segmentos parcialmente dinámicos (`[slug].svg`), así
 * que la extensión viaja dentro del valor: el build escribe
 * `out/portadas/<slug>.svg`, que es exactamente la URL que se publica, con su
 * `content-type` correcto por extensión (`image/svg+xml`) y cacheable para
 * siempre sin tocar cabeceras.
 */
export function generateStaticParams() {
  return articles.map((article) => ({ slug: `${article.slug}.svg` }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params;
  const articleSlug = slug.replace(/\.svg$/, "");
  const article = articles.find((entry) => entry.slug === articleSlug);

  // `dynamicParams = false` garantiza que el build no genera slugs que no
  // existan, pero el tipo obliga a cubrir el caso.
  if (!article) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(renderCoverSvg(article.category, article.coverLabel), {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
