import { NextResponse } from "next/server";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

/**
 * Endpoint del formulario de contacto.
 *
 * El formulario original mostraba un `alert()` de éxito sin enviar nada. Aquí
 * se valida de verdad y, si no hay proveedor de envío configurado
 * (CONTACT_WEBHOOK_URL), se responde con un error explícito indicando el email
 * directo en lugar de fingir que el mensaje ha salido.
 *
 * El proveedor por defecto es Web3Forms, que exige una clave en el cuerpo
 * (CONTACT_WEBHOOK_KEY). El código no la da por supuesta: sin ella el cuerpo
 * sigue siendo válido para cualquier webhook propio.
 */

const MAX = { name: 120, email: 200, subject: 160, message: 4000 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function readString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "La petición no es válida." },
      { status: 400 }
    );
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const name = readString(body.name, MAX.name);
  const email = readString(body.email, MAX.email);
  const subject = readString(body.subject, MAX.subject);
  const message = readString(body.message, MAX.message);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Indica tu nombre.";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Indica un email válido.";
  if (message.length < 10) errors.message = "El mensaje es demasiado corto.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!webhook) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: `El formulario aún no está conectado. Escríbenos directamente a ${CONTACT_EMAIL}.`,
      },
      { status: 503 }
    );
  }

  try {
    const key = process.env.CONTACT_WEBHOOK_KEY?.trim();

    const response = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        // Web3Forms exige la clave en el cuerpo; otros webhooks la ignoran.
        ...(key ? { access_key: key } : {}),
        name,
        email,
        subject: subject || `Mensaje desde ${SITE_NAME}`,
        message,
        from_name: SITE_NAME,
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error(`El proveedor respondió ${response.status}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: `No hemos podido entregar el mensaje. Inténtalo más tarde o escríbenos a ${CONTACT_EMAIL}.`,
      },
      { status: 502 }
    );
  }
}
