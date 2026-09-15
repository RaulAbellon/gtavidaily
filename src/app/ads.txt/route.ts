import { buildAdsTxt } from "@/lib/ads-txt";
import { ADSENSE_CLIENT } from "@/lib/site";

/**
 * Sirve `/ads.txt`, que es donde Google espera la declaración de vendedores
 * autorizados de este inventario.
 *
 * Sin AdSense configurado responde 404: es la respuesta honesta (no hay
 * inventario) y evita dejar publicado un fichero obsoleto si algún día se
 * retira la publicidad.
 */
export function GET(): Response {
  const body = buildAdsTxt(ADSENSE_CLIENT);

  if (!body) {
    return new Response(
      "ads.txt no está disponible: AdSense no está configurado en este sitio.\n",
      {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
        },
      }
    );
  }

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, s-maxage=86400",
    },
  });
}
