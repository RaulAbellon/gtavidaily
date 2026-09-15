/**
 * Generación de `ads.txt` (especificación del IAB Tech Lab).
 *
 * El identificador se deriva de `NEXT_PUBLIC_ADSENSE_CLIENT` en lugar de
 * escribirse a mano en `public/ads.txt`. Así el fichero no puede quedar
 * desincronizado con el `client` que carga el script de anuncios: si AdSense
 * está configurado, `ads.txt` es correcto; si no lo está, no se publica nada
 * que Google pueda interpretar como inventario autorizado.
 */

/** Dominio del sistema de publicidad autorizado a vender este inventario. */
const ADSENSE_TAG_ID = "f08c47fec0942fa0";

/** Formato válido de cliente AdSense: `ca-pub-` + 16 dígitos. */
const VALID_CLIENT = /^ca-pub-(\d{16})$/;

/**
 * Devuelve el contenido de `ads.txt` para un cliente AdSense, o `null` si el
 * valor no tiene el formato esperado (en cuyo caso no debe publicarse nada).
 */
export function buildAdsTxt(client: string): string | null {
  const match = VALID_CLIENT.exec(client.trim());
  if (!match) return null;

  return [
    "# ads.txt — GTA VI Daily",
    "# Generado desde NEXT_PUBLIC_ADSENSE_CLIENT: no editar a mano.",
    `google.com, pub-${match[1]}, DIRECT, ${ADSENSE_TAG_ID}`,
    "",
  ].join("\n");
}
