"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/components/consent/use-consent";
import {
  DEFAULT_CONSENT_STATE,
  toConsentModeSignals,
} from "@/lib/consent";
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/lib/site";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

/**
 * Aplica el consentimiento a Google Consent Mode v2 y carga el script de
 * AdSense **solo** cuando la persona usuaria ha aceptado publicidad.
 *
 * El código original inyectaba el script en el `<head>` de forma
 * incondicional, así que la publicidad se servía antes de cualquier
 * consentimiento, y el banner emitía un evento que nadie escuchaba.
 */
export function ConsentScripts() {
  const consent = useConsent();
  const sentDefault = useRef(false);
  const adsAllowed = ADSENSE_ENABLED && consent?.marketing === true;

  useEffect(() => {
    if (!sentDefault.current) {
      // Consent Mode v2 arranca denegado: nada se activa por defecto.
      gtag("consent", "default", DEFAULT_CONSENT_STATE);
      sentDefault.current = true;
    }
    gtag(
      "consent",
      "update",
      toConsentModeSignals({
        analytics: consent?.analytics ?? false,
        marketing: consent?.marketing ?? false,
      })
    );
  }, [consent]);

  useEffect(() => {
    if (!adsAllowed) return;
    if (document.querySelector("script[data-adsense-loader]")) return;

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.adsenseLoader = "true";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    document.head.appendChild(script);
  }, [adsAllowed]);

  return null;
}
