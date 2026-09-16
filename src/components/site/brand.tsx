import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

/**
 * Marca del sitio, con el logotipo propio (`public/logo-compact.svg`, generado
 * por `work/assets/build-brand.mjs`). Antes era un badge con texto en CSS y el
 * fichero `logo.svg` era un resto del andamiaje original (el logotipo de la
 * herramienta con la que se generó el sitio, que no pintaba nada aquí).
 *
 * Se usa `<img>` y no `next/image` a propósito: es un SVG vectorial, ya pesa
 * menos de 4 KB y no necesita optimización ni pasar por el CDN de imágenes.
 */
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center"
      aria-label={`Ir al inicio de ${SITE_NAME}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={compact ? "/logo-mark.svg" : "/logo-compact.svg"}
        alt={SITE_NAME}
        width={compact ? 36 : 248}
        height={36}
        className="h-9 w-auto transition-transform group-hover:scale-[1.03]"
      />
    </Link>
  );
}
