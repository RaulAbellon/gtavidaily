import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Política de seguridad de contenido. Es deliberadamente permisiva con los
// dominios de Google porque AdSense inyecta scripts e iframes propios, pero
// cierra todo lo demás (object-src, base-uri, frame-ancestors) y no permite
// eval. Documentada en el README para poder endurecerla o migrarla a nonces
// cuando se integre un CMP con soporte completo.
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
  "connect-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com",
  "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://fundingchoicesmessages.google.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Modo de salida del build.
 *
 * Netlify y Vercel compilan con su propio adaptador y generan su artefacto a
 * partir de `.next`: pedir además `standalone` duplica trabajo y puede
 * confundir al adaptador. Para autoalojamiento (VPS, Docker) el bundle
 * autocontenido es justo lo que hace falta, así que se mantiene por defecto.
 */
export function outputMode(
  env: Record<string, string | undefined> = process.env
): "standalone" | undefined {
  return env.NETLIFY || env.VERCEL ? undefined : "standalone";
}

const nextConfig: NextConfig = {
  output: outputMode(),

  // Las portadas se generan como SVG en /cover y las imágenes propias de cada
  // artículo se preparan ya recortadas y comprimidas a 1200×675 en
  // `public/imagenes/` (ver work/assets/prepare-image.mjs). No hay nada que
  // optimizar en caliente, así que se sirven tal cual y se ahorra una capa de
  // transformación en el CDN.
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

  async rewrites() {
    return [
      {
        // El App Router no admite carpetas que empiecen por punto, así que
        // `security.txt` se sirve en su URL canónica (RFC 9116) desde aquí.
        source: "/.well-known/security.txt",
        destination: "/security-txt",
      },
    ];
  },

  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      { key: "Content-Security-Policy", value: CSP },
    ];

    if (!isDev) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
    }

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
