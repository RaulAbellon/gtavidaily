"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20";

/**
 * Formulario de contacto real: envía los datos al endpoint `/api/contacto` y
 * muestra el resultado verdadero. El original se limitaba a un `alert()` de
 * éxito sin enviar nada, descartando el mensaje y el consentimiento RGPD que
 * recogía.
 */
export function ContactForm({ contactEmail }: { contactEmail: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus({ kind: "sending" });
    setFieldErrors({});

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !payload.ok) {
        if (payload.errors) setFieldErrors(payload.errors);
        setStatus({
          kind: "error",
          message:
            payload.error ??
            `No hemos podido enviar el mensaje. Escríbenos a ${contactEmail}.`,
        });
        return;
      }

      form.reset();
      setStatus({ kind: "ok" });
    } catch {
      setStatus({
        kind: "error",
        message: `No hay conexión con el servidor. Escríbenos a ${contactEmail}.`,
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-white/5 bg-zinc-900/40 p-6"
      noValidate
    >
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
