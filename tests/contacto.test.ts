import { describe, expect, it, vi } from "vitest";
import {
  CONTACT_LIMITS,
  WEB3FORMS_ENDPOINT,
  sendToWeb3Forms,
  toContactPayload,
  toLaunchAlertPayload,
  validateContact,
  validateLaunchAlert,
} from "@/lib/contact";

const VALID = {
  name: "Ana Pérez",
  email: "ana@ejemplo.com",
  subject: "Consulta",
  message: "Escribo para preguntar por la fecha de lanzamiento del juego.",
};

/** Respuesta falsa de Web3Forms, para no depender de la red en las pruebas. */
function fakeFetch(status: number, body: unknown) {
  return vi.fn(
    async () => new Response(JSON.stringify(body), { status })
  ) as unknown as typeof fetch;
}

describe("validación del formulario", () => {
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

  it("valida el correo del aviso de lanzamiento", () => {
    expect(validateLaunchAlert("").error).toBeTruthy();
    expect(validateLaunchAlert("no-es-email").error).toBeTruthy();
    expect(validateLaunchAlert("ana@ejemplo.com")).toEqual({
      email: "ana@ejemplo.com",
      error: null,
    });
  });
});

describe("envío a Web3Forms", () => {
  it("manda la clave, el remitente y los campos del mensaje", () => {
    const payload = toContactPayload(VALID, "clave-de-prueba");
    expect(payload.access_key).toBe("clave-de-prueba");
    expect(payload.email).toBe(VALID.email);
    expect(payload.name).toBe(VALID.name);
    expect(payload.message).toBe(VALID.message);
    expect(payload.subject).toContain("Consulta");
  });

  it("el aviso de lanzamiento lleva el correo, el remitente y su origen", () => {
    const payload = toLaunchAlertPayload("ana@ejemplo.com", "k", "articulo");
    expect(Object.keys(payload).sort()).toEqual([
      "access_key",
      "email",
      "from_name",
      "origen",
      "subject",
    ]);
    expect(payload.origen).toBe("articulo");
  });

  it("considera correcto el envío cuando el servicio responde success", async () => {
    const result = await sendToWeb3Forms(
      toContactPayload(VALID, "k"),
      fakeFetch(200, { success: true, message: "Email sent" })
    );
    expect(result.ok).toBe(true);
    expect(result.detail).toBe("Email sent");
  });

  it("no lo considera correcto si el servicio rechaza la petición", async () => {
    // Es el caso real con el que nos encontramos: 403 de la protección anti-bots.
    const result = await sendToWeb3Forms(
      toContactPayload(VALID, "k"),
      fakeFetch(403, { success: false, message: "Forbidden" })
    );
    expect(result.ok).toBe(false);
  });

  it("no lo considera correcto si el servicio responde success falso", async () => {
    const result = await sendToWeb3Forms(
      toContactPayload(VALID, "k"),
      fakeFetch(200, { success: false, message: "Invalid access key" })
    );
    expect(result.ok).toBe(false);
    expect(result.detail).toBe("Invalid access key");
  });

  it("apunta al endpoint público del servicio", () => {
    expect(WEB3FORMS_ENDPOINT).toBe("https://api.web3forms.com/submit");
  });
});
