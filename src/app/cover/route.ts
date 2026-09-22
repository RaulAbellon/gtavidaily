import { renderCoverSvg } from "@/lib/cover";

/**
 * Sirve las ilustraciones de portada como SVG cacheable.
 *
 * Se generan aquí (y no incrustadas en el HTML) para no engordar las páginas:
 * el navegador las cachea, no viajan en el payload de React y Google Imágenes
 * puede rastrearlas.
 *
 * **Aviso importante sobre la caché.** El adaptador oficial de Next.js en
 * Netlify añade a esta ruta su propia cabecera `Netlify-Vary`, que limita la
 * clave de caché a sus parámetros internos (`__nextDataReq`, `_rsc`). Con esa
 * clave, `c` y `t` no cuentan: **las 66 portadas acabaron compartiendo una única
 * entrada de caché y todas se veían iguales en producción**. Por eso la respuesta
 * declara aquí sus propios parámetros. Si algún día se añade otro, hay que
 * sumarlo a esta lista o volverá a pasar lo mismo.
 */
export function GET(request: Request): Response {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("c") ?? "").slice(0, 40);
  const label = (searchParams.get("t") ?? "")
    .replace(/[\u0000-\u001f]/g, "")
    .slice(0, 60);

  return new Response(renderCoverSvg(category, label), {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
      "netlify-vary": "query=c|t|v",
    },
  });
}
