import { buildSecurityTxt } from "@/lib/security-txt";

/**
 * Contenido de `/.well-known/security.txt`.
 *
 * La carpeta `.well-known` no se puede usar en el App Router (Next ignora los
 * directorios que empiezan por punto), así que esta ruta se publica en la URL
 * correcta mediante un rewrite declarado en `next.config.ts`.
 */
export function GET(): Response {
  return new Response(buildSecurityTxt(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, s-maxage=86400",
    },
  });
}
