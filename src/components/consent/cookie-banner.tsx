"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useConsent } from "@/components/consent/use-consent";
import {
  ALLOW_ALL,
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  DENY_ALL,
  buildConsentState,
  type ConsentDecision,
  type ConsentState,
} from "@/lib/consent";

export const OPEN_CONSENT_SETTINGS_EVENT = "consent-open-settings";

/**
 * Banner de consentimiento.
 *
 * Diferencias con el original: las casillas empiezan **desactivadas**, la
 * decisión se emite de verdad (evento que sí se escucha), se puede volver a
 * abrir desde el pie de página, y cerrar sin decidir no equivale a aceptar:
 * simplemente no se carga nada.
 */
export function CookieBanner() {
  const consent = useConsent();
  const [forceOpen, setForceOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [overrides, setOverrides] = useState<Partial<ConsentDecision>>({});

  const analytics = overrides.analytics ?? consent?.analytics ?? false;
  const marketing = overrides.marketing ?? consent?.marketing ?? false;

  // Sin decisión guardada (null) el banner aparece; en el servidor y durante la
  // hidratación `consent` es undefined y no se renderiza nada.
  const visible = forceOpen || consent === null;

  useEffect(() => {
    const open = () => {
      setOverrides({});
      setShowDetails(true);
      setForceOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_SETTINGS_EVENT, open);
  }, []);

  function persist(decision: ConsentDecision) {
    const state = buildConsentState(decision);
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(
      new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state })
    );
    setOverrides({});
    setForceOpen(false);
    setShowDetails(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-banner-title"
        className="mx-auto w-full max-w-3xl rounded-2xl border border-pink-500/30 bg-zinc-950/95 shadow-2xl backdrop-blur"
      >
        <div className="flex items-start gap-3 p-4 sm:p-5">
          <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-pink-500/15">
            <Cookie className="h-4 w-4 text-pink-400" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 id="cookie-banner-title" className="text-base font-bold text-white">
              Tu privacidad es importante
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">
              Usamos cookies necesarias para que el sitio funcione y, solo si lo
              aceptas, cookies de publicidad (Google AdSense) y de medición. Sin
              tu consentimiento no se carga ningún anuncio. Puedes cambiar de
              opinión cuando quieras desde la{" "}
              <Link
                href="/cookies"
                className="text-pink-400 underline underline-offset-2"
              >
                Política de cookies
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={() => setForceOpen(false)}
            aria-label="Cerrar y decidir más tarde (no se cargará publicidad)"
            className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {showDetails && (
          <div className="space-y-2 border-t border-white/5 px-4 py-4 sm:px-5">
            <ConsentRow
              title="Cookies necesarias"
              description="Imprescindibles para el funcionamiento del sitio. No se pueden desactivar."
              enabled
              locked
            />
            <ConsentRow
              title="Cookies de medición"
              description="Estadísticas agregadas de uso para saber qué contenidos funcionan."
              enabled={analytics}
              onChange={(value) =>
                setOverrides((current) => ({ ...current, analytics: value }))
              }
            />
            <ConsentRow
              title="Cookies de publicidad"
              description="Permiten mostrar anuncios de Google AdSense y financiar el sitio."
              enabled={marketing}
              onChange={(value) =>
                setOverrides((current) => ({ ...current, marketing: value }))
              }
            />
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-white/5 p-4 sm:flex-row sm:items-center sm:justify-end sm:px-5">
          {!showDetails && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 sm:mr-auto"
            >
              Personalizar
            </button>
          )}
          <button
            type="button"
            onClick={() => persist(DENY_ALL)}
            className="rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            Rechazar todo
          </button>
          <button
            type="button"
            onClick={() =>
              persist(showDetails ? { analytics, marketing } : ALLOW_ALL)
            }
            className="rounded-md border border-white/15 bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-400"
          >
            {showDetails ? "Guardar preferencias" : "Aceptar todo"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConsentRow({
  title,
  description,
  enabled,
  locked = false,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  locked?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.03] p-3">
      <div>
        <p className="text-sm font-semibold text-white">
          {title}
          {locked && (
            <span className="ml-2 text-xs font-normal text-pink-400">
              (siempre activas)
            </span>
          )}
        </p>
        <p className="mt-1 text-xs text-zinc-400">{description}</p>
      </div>
      {locked ? (
        <span
          aria-hidden="true"
          className="mt-1 flex h-6 w-11 flex-shrink-0 items-center rounded-full bg-pink-500/60 p-0.5"
        >
          <span className="ml-auto h-5 w-5 rounded-full bg-white" />
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={title}
          onClick={() => onChange?.(!enabled)}
          className={`mt-1 flex h-6 w-11 flex-shrink-0 items-center rounded-full p-0.5 transition-colors ${
            enabled ? "bg-pink-500" : "bg-zinc-700"
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white transition-transform ${
              enabled ? "ml-auto" : "ml-0"
            }`}
          />
        </button>
      )}
    </div>
  );
}
