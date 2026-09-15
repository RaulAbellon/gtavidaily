/**
 * Configuración del sitio: única fuente de verdad.
 *
 * Antes había tres identidades distintas para el mismo sitio (el canonical
 * apuntaba a `gtavihub.example`, el sitemap a `gtavidaily.com` y el README a
 * un tercer nombre), lo que rompía el SEO y el aviso legal. Todo lo que
 * necesite la URL, la marca o los datos de contacto pasa por aquí.
 */

const FALLBACK_SITE_URL = "https://gtavidaily.com";

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  return trimmed.replace(/\/+$/, "");
}

export const SITE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
);

export const SITE_NAME = "GTA VI Daily";
export const SITE_TAGLINE = "Noticias de Grand Theft Auto VI en español";
export const SITE_DESCRIPTION =
  "Las últimas noticias, análisis, tráileres y rumores sobre Grand Theft Auto VI (GTA 6) de Rockstar Games. Cobertura en español de Vice City, Leonida, Lucia y Jason, fecha de lanzamiento y mucho más.";
export const SITE_LOCALE = "es_ES";
export const SITE_LANGUAGE = "es";

/** Email de contacto real mostrado en las páginas legales y en el formulario. */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@gtavidaily.com";

/**
 * Identidad editorial. Antes había cuatro autores inventados con fotografías
 * de personas reales servidas por un tercero, lo que es un riesgo de derechos
 * de imagen y una señal de baja confianza para Google. Ahora hay una única
 * identidad editorial, configurable por variable de entorno, sin caras ajenas.
 */
export const EDITORIAL_NAME =
  process.env.NEXT_PUBLIC_EDITORIAL_NAME || "Redacción GTA VI Daily";

/**
 * Identificación del responsable del tratamiento (art. 10 LSSI-CE y art. 13
 * RGPD). Son datos que solo el titular puede aportar: si no se configuran,
 * la página legal lo dice explícitamente en lugar de fingir una identidad.
 */
export const LEGAL_OWNER = {
  name: process.env.NEXT_PUBLIC_LEGAL_NAME || "",
  taxId: process.env.NEXT_PUBLIC_LEGAL_TAX_ID || "",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "",
  email: process.env.NEXT_PUBLIC_LEGAL_EMAIL || CONTACT_EMAIL,
};

export const isLegalOwnerComplete = Boolean(
  LEGAL_OWNER.name && LEGAL_OWNER.taxId && LEGAL_OWNER.address
);

/** AdSense: solo se activa con un ID de cliente con formato válido. */
export const ADSENSE_CLIENT = (
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ""
).trim();
export const ADSENSE_ENABLED = /^ca-pub-\d{16}$/.test(ADSENSE_CLIENT);

/** Token de Google Search Console (opcional, pero ahora sí se usa de verdad). */
export const GOOGLE_SITE_VERIFICATION = (
  process.env.GOOGLE_SITE_VERIFICATION || ""
).trim();

/** ¿Se ha configurado la URL pública explícitamente? */
export const IS_SITE_URL_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SITE_URL
);

/** Construye una URL absoluta a partir de una ruta interna. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Rutas de las páginas legales y estáticas, en un solo sitio. */
export const STATIC_ROUTES = [
  { path: "/sobre", title: "Sobre nosotros" },
  { path: "/contacto", title: "Contacto" },
  { path: "/aviso-legal", title: "Aviso legal" },
  { path: "/privacidad", title: "Política de privacidad" },
  { path: "/cookies", title: "Política de cookies" },
  { path: "/dmca", title: "DMCA y derechos de autor" },
] as const;
