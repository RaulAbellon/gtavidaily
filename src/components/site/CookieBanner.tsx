"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { useNav } from "@/lib/nav";

const CONSENT_KEY = "gtavidaily-cookie-consent-v1";

type Consent = {
  necessary: boolean; // siempre true
  analytics: boolean;
  marketing: boolean;
  acceptedAt: string;
  version: string;
};

const CURRENT_VERSION = "1.0.0";

function getStoredConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function storeConsent(consent: Consent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  // Disparar evento para que otros componentes (AdSense, Analytics) reaccionen
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: consent }));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const nav = useNav();

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Pequeño delay para no aparecer instantáneamente
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    } else {
      // Disparar evento con consentimiento previo para que Ads/Analytics se inicien
      window.dispatchEvent(
        new CustomEvent("cookie-consent-change", { detail: stored })
      );
    }
  }, []);

  const acceptAll = () => {
    const consent: Consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      acceptedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
    storeConsent(consent);
    setVisible(false);
  };

  const rejectAll = () => {
    const consent: Consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      acceptedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
    storeConsent(consent);
    setVisible(false);
  };

  const savePreferences = () => {
    const consent: Consent = {
      necessary: true,
      analytics,
      marketing,
      acceptedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
    storeConsent(consent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
    >
      <div className="w-full max-w-2xl rounded-t-2xl border border-pink-500/30 bg-zinc-950 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/5 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-500/20">
              <Cookie className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <h2
                id="cookie-banner-title"
                className="text-lg font-bold text-white"
              >
                Tu privacidad es importante
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Usamos cookies para mejorar tu experiencia, analizar el tráfico
                y mostrar anuncios relevantes. Puedes aceptar todo, rechazar
                todo o personalizar tus preferencias.
              </p>
            </div>
          </div>
          <button
            onClick={rejectAll}
            className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Cerrar banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!showDetails ? (
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-end sm:p-6">
            <button
              onClick={() => nav.goPrivacy()}
              className="text-center text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-300 sm:mr-auto sm:text-left"
            >
              Política de cookies
            </button>
            <button
              onClick={rejectAll}
              className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
            >
              Rechazar todo
            </button>
            <button
              onClick={() => setShowDetails(true)}
              className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
            >
              Personalizar
            </button>
            <button
              onClick={acceptAll}
              className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-400"
            >
              Aceptar todo
            </button>
          </div>
        ) : (
          <div className="border-t border-white/5 p-5 sm:p-6">
            <div className="space-y-3">
              {/* Cookies necesarias */}
              <div className="flex items-start justify-between gap-4 rounded-lg border border-white/5 bg-white/5 p-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Cookies necesarias{" "}
                    <span className="ml-1 text-xs font-normal text-pink-400">
                      (siempre activas)
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Permiten el funcionamiento básico del sitio. No se pueden
                    desactivar.
                  </p>
                </div>
                <div className="flex h-6 w-11 items-center rounded-full bg-pink-500 p-0.5">
                  <div className="ml-auto h-5 w-5 rounded-full bg-white" />
                </div>
              </div>

              {/* Cookies analíticas */}
              <div className="flex items-start justify-between gap-4 rounded-lg border border-white/5 p-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Cookies analíticas
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Nos ayudan a entender cómo usas el sitio (estadísticas
                    anónimas).
                  </p>
                </div>
                <button
                  onClick={() => setAnalytics((v) => !v)}
                  className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                    analytics ? "bg-pink-500" : "bg-zinc-700"
                  }`}
                  aria-pressed={analytics}
                  aria-label="Toggle cookies analíticas"
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white transition-transform ${
                      analytics ? "ml-auto" : "ml-0"
                    }`}
                  />
                </button>
              </div>

              {/* Cookies de marketing */}
              <div className="flex items-start justify-between gap-4 rounded-lg border border-white/5 p-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Cookies de marketing
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Usadas por Google AdSense para mostrar anuncios
                    personalizados según tus intereses.
                  </p>
                </div>
                <button
                  onClick={() => setMarketing((v) => !v)}
                  className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                    marketing ? "bg-pink-500" : "bg-zinc-700"
                  }`}
                  aria-pressed={marketing}
                  aria-label="Toggle cookies de marketing"
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white transition-transform ${
                      marketing ? "ml-auto" : "ml-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => nav.goPrivacy()}
                className="text-center text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-300 sm:mr-auto sm:text-left"
              >
                Ver política completa
              </button>
              <button
                onClick={rejectAll}
                className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
              >
                Rechazar todo
              </button>
              <button
                onClick={savePreferences}
                className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-400"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-white/5 p-4 text-center text-xs text-zinc-600">
          Al continuar usando este sitio, aceptas nuestra{" "}
          <button
            onClick={() => nav.goPrivacy()}
            className="underline hover:text-zinc-400"
          >
            Política de Privacidad
          </button>
          .
        </div>
      </div>
    </div>
  );
}
