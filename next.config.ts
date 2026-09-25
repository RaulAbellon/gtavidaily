import type { NextConfig } from "next";

// Política de seguridad de contenido. Es deliberadamente permisiva con los
// dominios de Google porque AdSense inyecta scripts e iframes propios, pero
// cierra todo lo demás (object-src, base-uri, frame-ancestors) y no permite
// eval. Documentada en el README para poder endurecerla o migrarla a nonces
// cuando se integre un CMP con soporte completo.
//
// Desde la conversión a sitio estático, esta constante **no se aplica desde
// aquí** (con `output: "export"` Next no ejecuta `headers()`): es la fuente de
// verdad que consumen las pruebas y que está copiada literalmente en
// `public/_headers` (Cloudflare) y en `netlify.toml` (Netlify). Hay una prueba
// que falla si los tres divergen.
export const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagservices.com https://adservice.google.com https://fundingchoicesmessages.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.web3forms.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com",
  "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://fundingchoicesmessages.google.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  /**
   * Sitio **completamente estático**.
   *
   * Antes el Worker de Cloudflare renderizaba las rutas dinámicas (`/buscar`,
   * `/noticias`, `/cover`, los sitemaps y el feed). En el plan gratuito cada
   * petición tiene 10 ms de CPU: al renderizar una página que no estaba en la
   * caché del borde, Cloudflare cortaba la conexión, así que los artículos
   * recién publicados no cargaban y Google no podía rastrearlos.
   *
   * Con `output: "export"` **todo** se genera en `next build` como ficheros
   * (`out/`): HTML, RSC, sitemaps, feed, robots.txt y security.txt. Cloudflare
   * los sirve desde su CDN como activos estáticos, sin ejecutar ningún Worker y
   * sin gastar CPU ni peticiones. Ver `wrangler.jsonc` y
   * `CONVERSION-ESTATICA.md`.
   *
   * Consecuencias que conviene tener presentes:
   * · No hay `headers()` ni `rewrites()`: las cabeceras de seguridad viven en
   *   `public/_headers` (y en `netlify.toml`) y `security.txt` es un fichero
   *   real en `public/.well-known/`.
   * · Nada puede leer `searchParams` en el servidor: `/buscar` y `/noticias`
   *   filtran en el navegador (ver `src/app/buscar` y `src/app/noticias`).
   * · No hay ISR ni revalidación: `news-sitemap.xml` se calcula en cada build.
   */
  output: "export",

  // Las portadas propias de cada artículo se preparan ya recortadas y
  // comprimidas a 1200×675 en `public/imagenes/` (ver
  // work/assets/prepare-image.mjs) y las de reserva se generan como SVG
  // estáticos en `/portadas/<slug>.svg`. No hay nada que optimizar en caliente
  // —y con `output: "export"` el optimizador de imágenes no existe.
  images: {
    unoptimized: true,
  },

  // Los errores de tipo rompen el build. Es la red de seguridad que faltaba.
  typescript: {
    ignoreBuildErrors: false,
  },

  // Detección temprana de efectos y renders duplicados.
  reactStrictMode: true,

  // Sin bloque `env`: Next ya expone las variables NEXT_PUBLIC_* y así se evita
  // inyectar literales de reserva en el bundle. La única fuente de verdad de la
  // configuración del sitio es src/lib/site.ts.
  poweredByHeader: false,
};

export default nextConfig;
