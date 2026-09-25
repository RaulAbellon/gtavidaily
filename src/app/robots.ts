import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Reglas para crawlers. Un solo sitio donde se definen (antes convivían un
 * `public/robots.txt` y esta ruta, con reglas distintas y un 500 en desarrollo).
 *
 * Se genera **en el build** como `out/robots.txt`: es un activo estático más,
 * servido por el CDN sin despertar a ningún Worker.
 *
 * `/buscar` se deja rastreable a propósito: esas páginas llevan `noindex`, y
 * bloquearlas impediría que el buscador leyera esa directiva.
 *
 * El sitemap de noticias se declara aparte del general: solo contiene piezas de
 * las últimas 48 horas, que es lo que usa Google para detectar frescura.
 */
export const dynamic = "force-static";

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
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/news-sitemap.xml`],
  };
}
