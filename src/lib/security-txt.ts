import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

/**
 * Contenido de `/.well-known/security.txt` (RFC 9116).
 *
 * **Desde la conversión a sitio estático es un fichero real** en
 * `public/.well-known/security.txt`, que el build copia a
 * `out/.well-known/security.txt` y el CDN sirve sin ejecutar nada. Antes lo
 * generaba la ruta `/security-txt` y se publicaba en su URL canónica con una
 * reescritura de `next.config.ts`; con `output: "export"` las reescrituras no
 * existen, así que el fichero tiene que estar de verdad en esa ruta.
 *
 * Esta función sigue siendo la **fuente de verdad del formato** (la usan las
 * pruebas) y `scripts/postbuild.mjs` refresca el campo `Expires` del fichero
 * generado en cada build: la RFC exige una fecha futura y así no caduca en
 * silencio entre despliegues.
 */
export const SECURITY_TXT_PATH = ".well-known/security.txt";

export function buildSecurityTxt(now = new Date()): string {
  const expires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  return [
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Expires: ${expires.toISOString()}`,
    `Canonical: ${SITE_URL}/${SECURITY_TXT_PATH}`,
    "Preferred-Languages: es, en",
    `Policy: ${SITE_URL}/aviso-legal`,
  ].join("\n").concat("\n");
}

/** Fecha del campo `Expires` de un security.txt, o `null` si falta o no es válida. */
export function securityTxtExpires(content: string): Date | null {
  const match = /^Expires: (.+)$/m.exec(content);
  if (!match) return null;
  const date = new Date(match[1].trim());
  return Number.isNaN(date.getTime()) ? null : date;
}
