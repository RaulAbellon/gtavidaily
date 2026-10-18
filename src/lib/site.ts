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
  process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL,
);

export const SITE_NAME = "GTA VI Daily";
export const SITE_TAGLINE = "Noticias de Grand Theft Auto VI en español";
export const SITE_DESCRIPTION =
  "Las últimas noticias, análisis, tráileres y rumores sobre Grand Theft Auto VI (GTA 6) de Rockstar Games. Cobertura en español de Vice City, Leonida, Lucia y Jason, fecha de lanzamiento y mucho más.";
export const SITE_LOCALE = "es_ES";
export const SITE_LANGUAGE = "es";

/**
 * Email de contacto real mostrado en las páginas legales y en el formulario.
 *
 * Ojo con el valor por defecto: `gtavidaily.com` **no tiene registro MX**, así
 * que `contacto@gtavidaily.com` rebota. La dirección que funciona de verdad es
 * la de Gmail, y es la única que se publica en todo el sitio (legales, pie,
 * contacto, DMCA y `security.txt`). Para tener correo propio en el dominio hay
 * que configurar MX (y SPF/DKIM) en el DNS primero; hasta entonces, no se
 * anuncia ninguna dirección del dominio.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "gtavidaily.contacto@gmail.com";

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
 * RGPD). Son datos públicos del medio: van aquí como valor por defecto para que
 * cualquier build los incluya, se construya donde se construya. Estuvieron solo
 * en variables de entorno y un build sin ellas (el del CI) publicó el sitio sin
 * ellos, lo que además tumbó la verificación de Search Console.
 */
export const LEGAL_OWNER = {
  name: process.env.NEXT_PUBLIC_LEGAL_NAME || "Raul Abellon Losa",
  taxId: process.env.NEXT_PUBLIC_LEGAL_TAX_ID || "71183429F",
  address:
    process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "Calle Esla 8 3B, 47140 Valladolid",
  email: process.env.NEXT_PUBLIC_LEGAL_EMAIL || CONTACT_EMAIL,
};

export const isLegalOwnerComplete = Boolean(
  LEGAL_OWNER.name && LEGAL_OWNER.taxId && LEGAL_OWNER.address,
);

/**
 * AdSense: solo se activa con un ID de cliente con formato válido. El valor va
 * por defecto en el código porque es público (viaja en el HTML): así un build
 * sin variables de entorno no publica el sitio sin el cliente configurado.
 */
export const ADSENSE_CLIENT = (
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-6098877112141110"
).trim();
export const ADSENSE_ENABLED = /^ca-pub-\d{16}$/.test(ADSENSE_CLIENT);

/**
 * Token de Google Search Console. También público (va en una meta del <head>).
 * Sin este valor por defecto, un build sin variables publica el sitio sin la
 * etiqueta y Google termina retirando la verificación de la propiedad.
 */
export const GOOGLE_SITE_VERIFICATION = (
  process.env.GOOGLE_SITE_VERIFICATION ||
  "L5mhV_ec7wXJGWr6yV5DdFAVXbxkhj1A6HPX5oUhCVI"
).trim();

/** ¿Se ha configurado la URL pública explícitamente? */
export const IS_SITE_URL_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

/** Construye una URL absoluta a partir de una ruta interna. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Rutas de las páginas legales y estáticas, en un solo sitio. */
export const STATIC_ROUTES = [
  { path: "/cronologia", title: "Cronología de GTA VI" },
  { path: "/desbloqueo", title: "Hora de desbloqueo por países" },
  { path: "/sobre", title: "Sobre nosotros" },
  { path: "/politica-editorial", title: "Política editorial" },
  { path: "/correcciones", title: "Correcciones" },
  { path: "/financiacion", title: "Cómo nos financiamos" },
  { path: "/equipo", title: "Quién hace el sitio" },
  { path: "/contacto", title: "Contacto" },
  { path: "/aviso-legal", title: "Aviso legal" },
  { path: "/privacidad", title: "Política de privacidad" },
  { path: "/cookies", title: "Política de cookies" },
  { path: "/dmca", title: "DMCA y derechos de autor" },
] as const;

export type StaticRoutePath = (typeof STATIC_ROUTES)[number]["path"];

/**
 * Páginas de confianza: quién está detrás del medio, con qué criterio publica,
 * cómo se financia y cómo se corrige. Se enlazan juntas en el pie y desde
 * `/sobre` porque no tienen sentido sueltas.
 */
export const TRUST_ROUTES: { path: StaticRoutePath; title: string }[] = [
  { path: "/sobre", title: "Sobre nosotros" },
  { path: "/politica-editorial", title: "Política editorial" },
  { path: "/correcciones", title: "Correcciones" },
  { path: "/financiacion", title: "Cómo nos financiamos" },
  { path: "/equipo", title: "Quién hace el sitio" },
];

/** Título público de una ruta estática, para los enlaces del pie. */
export function staticRouteTitle(path: StaticRoutePath): string {
  return STATIC_ROUTES.find((route) => route.path === path)?.title ?? path;
}
