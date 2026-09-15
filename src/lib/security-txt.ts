import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

/**
 * Contenido de `/.well-known/security.txt` (RFC 9116).
 *
 * Next no enruta carpetas que empiezan por punto, así que se sirve como fichero
 * estático desde `public/` y `scripts/postbuild.mjs` lo regenera en cada build:
 * la RFC exige un campo `Expires` en el futuro, y así nunca caduca en silencio.
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
