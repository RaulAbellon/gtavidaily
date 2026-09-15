"use client";

import { useSyncExternalStore } from "react";
import {
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  parseStoredConsent,
  type ConsentState,
} from "@/lib/consent";

/**
 * Estado de consentimiento como fuente externa de React.
 *
 * Se lee `localStorage` mediante `useSyncExternalStore` en lugar de un efecto
 * con `setState`: evita renders en cascada y mantiene un único origen de
 * verdad para el banner, los anuncios y las señales de Consent Mode.
 *
 * Devuelve:
 *  - `undefined` en el servidor y durante la hidratación (aún no se puede leer)
 *  - `null` cuando no hay ninguna decisión guardada
 *  - el estado guardado cuando la persona usuaria ya decidió
 */

let cachedRaw: string | null = null;
let cachedState: ConsentState | null = null;

function getSnapshot(): ConsentState | null {
  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState = parseStoredConsent(raw);
  }
  return cachedState;
}

function getServerSnapshot(): ConsentState | null | undefined {
  return undefined;
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useConsent(): ConsentState | null | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
