import { describe, expect, it } from "vitest";
import {
  CONTACT_FORM_NAME,
  CONTACT_LIMITS,
  toFormBody,
  validateContact,
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
