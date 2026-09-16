"use client";

import { useEffect, useState } from "react";
import type { ConsentRegion } from "@/lib/consent";

/**
 * ¿Quién gestiona el consentimiento de este visitante?
 *
 * Desde 2026 Google exige a los editores que sirven anuncios en el Espacio
 * Económico Europeo, Reino Unido y Suiza una CMP certificada que emita la cadena
 * de consentimiento del marco IAB TCF. La web tiene su propio banner, que está
 * bien construido pero no es una CMP certificada, así que en esas regiones el
 * consentimiento lo lleva el mensaje de Google (configurado con tres opciones:
 * consentir, no consentir y gestionar opciones).
 *
 * Para no mostrar dos banners a la vez hace falta saber en qué caso estamos. No
 * geolocalizamos por IP: Google solo inicializa el marco TCF —y por tanto expone
 * `__tcfapi`— allí donde su mensaje aplica, así que **su presencia es la señal**.
 *
 * Estados:
 *  - `unknown`: aún no se sabe (el script de la CMP tarda unas décimas)
 *  - `google` : lo gestiona la CMP certificada; nuestro banner no debe salir
 *  - `own`    : no hay CMP de Google; seguimos con nuestro banner y criterio
 */

declare global {
  interface Window {
    __tcfapi?: (...args: unknown[]) => void;
    googlefc?: {
      showRevocationMessage?: () => void;
      callbackQueue?: unknown[];
    };
  }
}

export type { ConsentRegion };

/** Milisegundos que esperamos a que aparezca el marco TCF antes de decidir. */
export const CONSENT_REGION_TIMEOUT_MS = 2000;

export function useConsentRegion(
  timeoutMs = CONSENT_REGION_TIMEOUT_MS
): ConsentRegion {
  const [region, setRegion] = useState<ConsentRegion>("unknown");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const started = Date.now();
    let resolved = false;

    const finish = (value: ConsentRegion) => {
      if (resolved) return;
      resolved = true;
      window.clearTimeout(first);
      window.clearInterval(timer);
      setRegion(value);
    };

    const check = () => {
      if (window.__tcfapi) finish("google");
      else if (Date.now() - started >= timeoutMs) finish("own");
    };

    // La primera comprobación va dentro de un temporizador, no en el cuerpo del
    // efecto: llamar a setState de forma sincrónica al montar provoca renders en
    // cascada (y el linter tiene razón en quejarse).
    const first = window.setTimeout(check, 0);
    const timer = window.setInterval(check, 150);

    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [timeoutMs]);

  return region;
}

/**
 * Reabre el mensaje de consentimiento de Google, que es la forma de retirar el
 * consentimiento en las regiones donde lo gestiona su CMP. Devuelve `true` si
 * se ha podido delegar en Google.
 */
export function openGoogleConsentSettings(): boolean {
  if (typeof window === "undefined") return false;
  const show = window.googlefc?.showRevocationMessage;
  if (typeof show !== "function") return false;
  try {
    show();
    return true;
  } catch {
    return false;
  }
}
