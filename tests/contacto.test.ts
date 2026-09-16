import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contacto/route";
import { CONTACT_EMAIL } from "@/lib/site";

/** Construye la petición que envía el formulario. */
function request(body: unknown): Request {
  return new Request("https://gtavidaily.com/api/contacto", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const VALID = {
  name: "Ana Pérez",
  email: "ana@ejemplo.com",
  subject: "Consulta",
  message: "Escribo para preguntar por la fecha de lanzamiento.",
};

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.CONTACT_WEBHOOK_URL;
  delete process.env.CONTACT_WEBHOOK_KEY;
});

describe("formulario de contacto", () => {
  it("rechaza una petición que no es JSON", async () => {
    const bad = new Request("https://gtavidaily.com/api/contacto", {
      method: "POST",
      body: "no soy json",
    });
    expect((await POST(bad)).status).toBe(400);
  });

  it("valida los campos obligatorios", async () => {
    const response = await POST(request({ name: "A", email: "no-es-email", message: "corto" }));
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(Object.keys(body.errors).sort()).toEqual(["email", "message", "name"]);
  });

  it("avisa con el email directo cuando no hay proveedor configurado", async () => {
    const response = await POST(request(VALID));
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.configured).toBe(false);
    expect(body.error).toContain(CONTACT_EMAIL);
  });

  it("envía el mensaje al proveedor y responde ok", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://api.web3forms.com/submit";
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(request(VALID));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    const sent = JSON.parse(init.body);
    expect(sent).toMatchObject({
      name: VALID.name,
      email: VALID.email,
      subject: VALID.subject,
      message: VALID.message,
    });
    // Sin clave configurada no se inventa una.
    expect(sent.access_key).toBeUndefined();
  });

  it("incluye la clave del proveedor cuando está configurada", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://api.web3forms.com/submit";
    process.env.CONTACT_WEBHOOK_KEY = "clave-de-prueba";
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    expect((await POST(request(VALID))).status).toBe(200);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.access_key).toBe("clave-de-prueba");
    expect(sent.from_name).toBeTruthy();
  });

  it("no miente si el proveedor falla", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://api.web3forms.com/submit";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 500 })));

    const response = await POST(request(VALID));
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.error).toContain(CONTACT_EMAIL);
  });

  it("usa un asunto por defecto si el visitante no lo escribe", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://api.web3forms.com/submit";
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await POST(request({ ...VALID, subject: "" }));
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.subject).toContain("GTA VI Daily");
  });
});
