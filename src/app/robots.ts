import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Reglas para crawlers. Un solo sitio donde se definen (antes convivían un
 * `public/robots.txt` y esta ruta, con reglas distintas y un 500 en desarrollo).
 *
 * `/buscar` se deja rastreable a propósito: esas páginas llevan `noindex`, y
 * bloquearlas impediría que el buscador leyera esa directiva.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
