/**
 * Reglas del formulario de contacto.
 *
 * Antes esto vivía en el endpoint `/api/contacto`, que reenviaba el mensaje a un
 * proveedor externo. Ese camino ya no existe: el formulario se envía a Netlify
 * Forms, que es nativo del hosting, no depende de terceros ni exige exponer
 * claves en el HTML. La validación se hace en el navegador con estas mismas
 * funciones, que siguen siendo puras y comprobables.
 */

export const CONTACT_LIMITS = {
  name: 120,
  email: 200,
  subject: 160,
  message: 4000,
} as const;

/** Nombre del formulario tal y como lo detecta Netlify en el build. */
export const CONTACT_FORM_NAME = "contacto";

/**
 * Segundo formulario: aviso por correo el día del lanzamiento.
 *
 * Captar el correo es la única forma de traer de vuelta a alguien que ya nos
 * leyó sin depender de Google. También vive en `public/__forms.html`.
 */
export const LAUNCH_ALERT_FORM_NAME = "avisos";

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export type ContactValidation = {
  values: ContactInput;
  errors: Partial<Record<keyof ContactInput, string>>;
};

/** Normaliza lo que llega del formulario y devuelve los errores por campo. */
export function validateContact(raw: Partial<Record<keyof ContactInput, unknown>>): ContactValidation {
  const values: ContactInput = {
    name: text(raw.name, CONTACT_LIMITS.name),
    email: text(raw.email, CONTACT_LIMITS.email),
    subject: text(raw.subject, CONTACT_LIMITS.subject),
    message: text(raw.message, CONTACT_LIMITS.message),
  };

  const errors: ContactValidation["errors"] = {};
  if (values.name.length < 2) errors.name = "Indica tu nombre.";
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Indica un email válido.";
  if (values.message.length < 10) errors.message = "El mensaje es demasiado corto.";

  return { values, errors };
}

/** Valida el correo del aviso de lanzamiento. */
export function validateLaunchAlert(raw: unknown): {
  email: string;
  error: string | null;
} {
  const email = text(raw, CONTACT_LIMITS.email);
  if (!EMAIL_PATTERN.test(email)) return { email, error: "Indica un email válido." };
  return { email, error: null };
}

/** Endpoint público de Web3Forms. */
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Clave pública, incrustada en el build desde NEXT_PUBLIC_WEB3FORMS_KEY. */
export function web3formsKey(): string {
  return process.env.NEXT_PUBLIC_WEB3FORMS_KEY?.trim() ?? "";
}

/**
 * Cuerpo del formulario de contacto para Web3Forms.
 *
 * El envío sale **del navegador del visitante**, no del servidor: Web3Forms está
 * detrás de la protección anti-bots de Cloudflare y rechaza con 403 las
 * peticiones hechas desde un servidor (incluidas las funciones de Netlify). Como
 * el envío es del lado del cliente, el formulario funciona igual en Netlify que
 * en Cloudflare: eso es lo que permite migrar de alojamiento sin perder mensajes.
 */
export function toContactPayload(values: ContactInput, key: string) {
  return {
    access_key: key,
    from_name: "GTA VI Daily",
    subject: values.subject
      ? `Contacto: ${values.subject}`
      : "Contacto desde gtavidaily.com",
    name: values.name,
    email: values.email,
    message: values.message,
  };
}

/** Cuerpo del aviso de lanzamiento para Web3Forms. */
export function toLaunchAlertPayload(email: string, key: string, origin = "pie") {
  return {
    access_key: key,
    from_name: "GTA VI Daily",
    subject: "Nuevo aviso de lanzamiento",
    email,
    origen: origin,
  };
}

/** Envía un cuerpo a Web3Forms. `ok` solo si el servicio lo ha aceptado. */
export async function sendToWeb3Forms(
  payload: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch
): Promise<{ ok: boolean; detail: string }> {
  const response = await fetchImpl(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
  } | null;

  return {
    ok: response.ok && body?.success !== false,
    detail: body?.message ?? `HTTP ${response.status}`,
  };
}
