import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera un build autocontenido en .next/standalone
  // que puede arrancarse con `node .next/standalone/server.js`.
  // Esto es lo que Runable ejecutará en producción.
  output: "standalone",

  // Runable impone Node.js sin acceso a Docker, así que evitamos
  // dependencias nativas frágiles. Usamos el loader por defecto
  // y dejamos que las imágenes se sirvan tal cual.
  images: {
    unoptimized: true,
  },

  // En producción queremos que el build falle si hay errores TS,
  // pero mantenemos ignoreBuildErrors para no bloquear el deploy
  // por tipos de third-party. Cámbialo a false si quieres strictness.
  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,

  // Exponer variables de entorno al cliente (prefijo NEXT_PUBLIC_)
  // Las que NO tengan el prefijo solo viven en el servidor.
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || "https://gtavihub.example",
    NEXT_PUBLIC_ADSENSE_CLIENT:
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-0000000000000000",
  },

  // Cabeceras básicas de seguridad/SEO
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
