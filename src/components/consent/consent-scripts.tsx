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
 * AdSense.
 *
 * Dos etapas, y conviene no confundirlas:
 *
 * 1. **Antes** este componente no cargaba el script hasta que hubiera
 *    consentimiento. Ya no puede ser así: el mensaje de consentimiento de
 *    Google (la CMP certificada que exige el marco europeo en el EEE, Reino
 *    Unido y Suiza) **se sirve precisamente desde el script de AdSense**. Sin
 *    script no hay mensaje, y sin mensaje no hay cadena de consentimiento: los
 *    anuncios llegarían como "limited ads" o no llegarían.
 * 2. Lo que sí se mantiene intacto es la parte que importa: **Consent Mode v2
 *    arranca en `denied`**, así que no se escribe ninguna cookie publicitaria ni
 *    se personaliza nada hasta que la persona usuaria decide. La decisión la
 *    recoge la CMP de Google (en el EEE) o nuestro propio banner (fuera).
 *
 * El código original inyectaba el script sin ninguna señal de consentimiento:
 * eso sí era servir publicidad antes de preguntar.
 */
export function ConsentScripts() {
  const consent = useConsent();
  const sentDefault = useRef(false);

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
    if (!ADSENSE_ENABLED) return;
    if (document.querySelector("script[data-adsense-loader]")) return;

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.adsenseLoader = "true";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    document.head.appendChild(script);
  }, []);

  return null;
}
