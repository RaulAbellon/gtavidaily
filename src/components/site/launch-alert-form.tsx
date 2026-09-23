"use client";

import { useState } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";
import {
  sendToWeb3Forms,
  toLaunchAlertPayload,
  validateLaunchAlert,
  web3formsKey,
} from "@/lib/contact";

type Status = "idle" | "sending" | "ok";

/**
 * Aviso por correo el día del lanzamiento.
 *
 * Es la única pieza del sitio que construye algo que no depende de Google: quien
 * deja su correo vuelve aunque no nos encuentre en el buscador. Se envía desde el
 * navegador con Web3Forms, igual que el formulario de contacto, así que no
 * depende del alojamiento.
 *
 * Se pide solo el correo: cada campo de más reduce las suscripciones, y aquí no
 * hace falta nada más para poder avisar.
 */
export function LaunchAlertForm({ origin = "pie" }: { origin?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { email: value, error: validationError } = validateLaunchAlert(email);
    setError(validationError);
    if (validationError) return;

    setStatus("sending");
    try {
      const key = web3formsKey();
      if (!key) {
        setStatus("idle");
        setError("El aviso no está configurado todavía. Inténtalo más tarde.");
        return;
      }

      const result = await sendToWeb3Forms(toLaunchAlertPayload(value, key, origin));
      if (!result.ok) throw new Error(result.detail);

      setEmail("");
      setStatus("ok");
    } catch {
      setStatus("idle");
      setError("No hemos podido registrar tu correo. Inténtalo más tarde.");
    }
  }

  if (status === "ok") {
    return (
      <p className="flex items-center gap-2 text-sm text-green-400">
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        Apuntado. Te avisaremos el día del lanzamiento.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      <p className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
        <BellRing className="h-4 w-4 shrink-0 text-pink-400" aria-hidden="true" />
        Avísame el día del lanzamiento
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="alert-email">
          Tu correo electrónico
        </label>
        <input
          id="alert-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          aria-invalid={Boolean(error)}
          className="w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Apuntando…" : "Avísame"}
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        Solo para avisarte del lanzamiento. Nada de publicidad ni de compartir tu
        correo con terceros.
      </p>
      {error && (
        <p role="status" aria-live="polite" className="text-xs text-amber-400">
          {error}
        </p>
      )}
    </form>
  );
}
