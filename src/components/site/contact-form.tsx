"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { CONTACT_FORM_NAME, toFormBody, validateContact } from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20";

/**
 * Formulario de contacto real.
 *
 * El envío va a **Netlify Forms**, que es nativo del hosting: no hay terceros de
 * por medio, no hace falta exponer ninguna clave en el HTML y las respuestas se
 * guardan en el panel de Netlify además de notificarse por correo.
 *
 * Antes enviaba a un proveedor externo a través de `/api/contacto`. Ese camino
 * se retiró porque el proveedor está detrás de la protección anti-bots de
 * Cloudflare y rechazaba (403) cualquier envío hecho desde un servidor.
 *
 * Lo que se mantiene del original: la validación de verdad y que la interfaz
 * nunca finge un envío correcto.
 */
export function ContactForm({ contactEmail }: { contactEmail: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const { values, errors } = validateContact(raw);

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus({ kind: "error", message: "Revisa los campos marcados." });
      return;
    }

    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: toFormBody(values),
      });

      if (!response.ok) throw new Error(`Netlify respondió ${response.status}`);

      form.reset();
      setStatus({ kind: "ok" });
    } catch {
      setStatus({
        kind: "error",
        message: `No hemos podido enviar el mensaje. Escríbenos a ${contactEmail}.`,
      });
    }
  }

  return (
    <form
      name={CONTACT_FORM_NAME}
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-white/5 bg-zinc-900/40 p-6"
      noValidate
    >
      {/* La declaración del formulario para Netlify vive en `public/forms.html`:
          con Next.js su detector no analiza este HTML, porque se sirve desde la
          caché de rutas. Aquí solo hace falta enviar el nombre y el campo trampa
          con los mismos nombres que en esa declaración. */}
      <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
      <p className="hidden" aria-hidden="true">
        <label>
          No rellenes este campo <input name="bot-field" tabIndex={-1} />
        </label>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            Nombre
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            aria-invalid={Boolean(fieldErrors.name)}
            className={inputClass}
            placeholder="Tu nombre"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            aria-invalid={Boolean(fieldErrors.email)}
            className={inputClass}
            placeholder="tu@email.com"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
        >
          Asunto
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          className={inputClass}
          placeholder="Sobre qué nos escribes"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
        >
          Mensaje
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          aria-invalid={Boolean(fieldErrors.message)}
          className={inputClass}
          placeholder="Cuéntanos en qué podemos ayudarte..."
        />
        {fieldErrors.message && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.message}</p>
        )}
      </div>

      <p className="text-xs text-zinc-500">
        Al enviar este formulario aceptas que tratemos tus datos con la única
        finalidad de responderte, según nuestra{" "}
        <Link href="/privacidad" className="underline hover:text-zinc-300">
          Política de Privacidad
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {status.kind === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>

      <p role="status" aria-live="polite" className="min-h-5 text-sm">
        {status.kind === "ok" && (
          <span className="inline-flex items-center gap-2 text-green-400">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Mensaje enviado. Te responderemos lo antes posible.
          </span>
        )}
        {status.kind === "error" && (
          <span className="inline-flex items-start gap-2 text-amber-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {status.message}
          </span>
        )}
      </p>
    </form>
  );
}
