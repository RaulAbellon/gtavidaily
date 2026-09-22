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

/**
 * Cuerpo que espera Netlify Forms: `application/x-www-form-urlencoded` con el
 * nombre del formulario entre los campos.
 */
export function toFormBody(values: ContactInput): string {
  const body = new URLSearchParams({
    "form-name": CONTACT_FORM_NAME,
    name: values.name,
    email: values.email,
    subject: values.subject,
    message: values.message,
  });
  return body.toString();
}
