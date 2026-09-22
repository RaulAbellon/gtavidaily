import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CONTACT_FORM_NAME,
  CONTACT_LIMITS,
  LAUNCH_ALERT_FORM_NAME,
  toFormBody,
  toLaunchAlertBody,
  validateContact,
  validateLaunchAlert,
} from "@/lib/contact";

const VALID = {
  name: "Ana Pérez",
  email: "ana@ejemplo.com",
  subject: "Consulta",
  message: "Escribo para preguntar por la fecha de lanzamiento del juego.",
};

describe("formulario de contacto", () => {
  it("acepta un mensaje correcto", () => {
    const { values, errors } = validateContact(VALID);
    expect(errors).toEqual({});
    expect(values).toEqual(VALID);
  });

  it("exige nombre, email válido y un mensaje con cuerpo", () => {
    const { errors } = validateContact({
      name: " A ",
      email: "no-es-email",
      subject: "",
      message: "corto",
    });
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
  });

  it("recorta los campos demasiado largos en lugar de rechazarlos", () => {
    const { values, errors } = validateContact({
      ...VALID,
      name: "n".repeat(400),
      message: "m".repeat(9000),
    });
    expect(errors).toEqual({});
    expect(values.name.length).toBe(CONTACT_LIMITS.name);
    expect(values.message.length).toBe(CONTACT_LIMITS.message);
  });

  it("ignora lo que no sea texto", () => {
    const { values } = validateContact({ name: 42, email: null, message: {} });
    expect(values).toEqual({ name: "", email: "", subject: "", message: "" });
  });

  it("construye el cuerpo que espera Netlify Forms", () => {
    const body = new URLSearchParams(toFormBody(VALID));
    expect(body.get("form-name")).toBe(CONTACT_FORM_NAME);
    expect(body.get("name")).toBe(VALID.name);
    expect(body.get("email")).toBe(VALID.email);
    expect(body.get("message")).toBe(VALID.message);
  });
});

/**
 * Netlify detecta el formulario en el HTML estático del despliegue y valida los
 * nombres de los campos contra esa declaración. Si se añade un campo al
 * formulario real y no al esqueleto (o al revés), los envíos fallan en silencio.
 */
describe("esqueleto estático para Netlify Forms", () => {
  const skeleton = readFileSync(
    path.join(process.cwd(), "public", "__forms.html"),
    "utf8"
  );

  it("declara el formulario con el mismo nombre que envía la web", () => {
    expect(skeleton).toContain(`name="${CONTACT_FORM_NAME}"`);
    expect(skeleton).toContain('data-netlify="true"');
    expect(skeleton).toContain(`value="${CONTACT_FORM_NAME}"`);
  });

  it("incluye exactamente los campos que se envían", () => {
    for (const field of ["name", "email", "subject", "message", "bot-field"]) {
      expect(skeleton, `falta el campo ${field}`).toContain(`name="${field}"`);
    }
    // Y el cuerpo que construimos no lleva ningún campo de más.
    const sent = [...new URLSearchParams(toFormBody(VALID)).keys()].sort();
    expect(sent).toEqual(["email", "form-name", "message", "name", "subject"]);
  });

  it("el campo trampa está declarado como honeypot", () => {
    expect(skeleton).toContain('netlify-honeypot="bot-field"');
  });

  it("no se indexa ni se enlaza desde el sitio", () => {
    expect(skeleton).toContain('name="robots" content="noindex');
  });

  it("declara también el formulario de avisos, con los mismos campos", () => {
    expect(skeleton).toContain(`name="${LAUNCH_ALERT_FORM_NAME}"`);
    expect(skeleton).toContain(`value="${LAUNCH_ALERT_FORM_NAME}"`);

    const sent = [...new URLSearchParams(toLaunchAlertBody("ana@ejemplo.com", "pie")).keys()].sort();
    expect(sent).toEqual(["email", "form-name", "origen"]);
    for (const field of sent) {
      expect(skeleton, `falta el campo ${field} en el esqueleto`).toContain(
        field === "form-name" ? `name="form-name"` : `name="${field}"`
      );
    }
  });
});

describe("aviso de lanzamiento", () => {
  it("valida el correo", () => {
    expect(validateLaunchAlert("").error).toBeTruthy();
    expect(validateLaunchAlert("no-es-email").error).toBeTruthy();
    expect(validateLaunchAlert("ana@ejemplo.com")).toEqual({
      email: "ana@ejemplo.com",
      error: null,
    });
  });

  it("recorta un correo absurdamente largo", () => {
    const { email } = validateLaunchAlert(`${"a".repeat(400)}@ejemplo.com`);
    expect(email.length).toBeLessThanOrEqual(CONTACT_LIMITS.email);
  });

  it("deja constancia del origen de la suscripción", () => {
    expect(new URLSearchParams(toLaunchAlertBody("ana@ejemplo.com", "articulo")).get("origen")).toBe(
      "articulo"
    );
  });
});
