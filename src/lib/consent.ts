/**
 * Consentimiento de cookies: tipos, claves y funciones puras.
 *
 * El fallo original era que el banner guardaba la elección y emitía un evento
 * que nadie escuchaba: la publicidad se cargaba igual. Aquí vive la lógica
 * compartida entre el banner (cliente) y la carga condicional de scripts.
 */

export const CONSENT_STORAGE_KEY = "gtavidaily-consent";
export const CONSENT_VERSION = "2.0.0";
export const CONSENT_EVENT = "consent-change";

export type ConsentCategory = "analytics" | "marketing";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: string;
  decidedAt: string;
};

export type ConsentDecision = {
  analytics: boolean;
  marketing: boolean;
};

export const DENY_ALL: ConsentDecision = { analytics: false, marketing: false };
export const ALLOW_ALL: ConsentDecision = { analytics: true, marketing: true };

/**
 * Estado inicial: todo denegado. Es lo que exige el RGPD (nada se activa antes
 * de que la persona usuaria decida) y lo que se envía a Google Consent Mode v2.
 */
export const DEFAULT_CONSENT_STATE = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

/** Traduce la decisión del usuario a señales de Consent Mode v2. */
export function toConsentModeSignals(decision: ConsentDecision) {
  return {
    ad_storage: decision.marketing ? "granted" : "denied",
    ad_user_data: decision.marketing ? "granted" : "denied",
    ad_personalization: decision.marketing ? "granted" : "denied",
    analytics_storage: decision.analytics ? "granted" : "denied",
  } as const;
}

export function buildConsentState(decision: ConsentDecision): ConsentState {
  return {
    necessary: true,
    analytics: decision.analytics,
    marketing: decision.marketing,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  };
}

/** Valida el contenido leído de localStorage. Devuelve null si no es válido. */
export function parseStoredConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      parsed.version !== CONSENT_VERSION ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean"
    ) {
      return null;
    }
    return {
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      version: CONSENT_VERSION,
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : "",
    };
  } catch {
    return null;
  }
}

/** ¿Se puede cargar publicidad (y por tanto el script de AdSense)? */
export function canLoadAdvertising(state: ConsentState | null): boolean {
  return state?.marketing === true;
}

/**
 * Quién gestiona el consentimiento de este visitante.
 *
 * En el Espacio Económico Europeo, el Reino Unido y Suiza es obligatorio usar
 * una CMP certificada por Google, que emite la cadena de consentimiento del
 * marco IAB TCF. Nuestro banner no lo es, así que allí manda el mensaje de
 * Google y el nuestro no debe aparecer.
 */
export type ConsentRegion = "unknown" | "google" | "own";

/**
 * ¿Se puede pintar el hueco publicitario?
 *
 * - Con la CMP de Google, sí: decide Google según la decisión registrada. Si no
 *   pintáramos el hueco, esos visitantes —la mayoría de nuestra audiencia— no
 *   tendrían anuncios nunca.
 * - Con nuestro banner, solo si hay consentimiento de publicidad explícito.
 * - Mientras no se sabe quién gestiona el consentimiento (`unknown`, durante la
 *   hidratación), no se pinta nada.
 */
export function canShowAdSlot(
  state: ConsentState | null | undefined,
  region: ConsentRegion
): boolean {
  if (region === "google") return true;
  if (region !== "own") return false;
  return state?.marketing === true;
}

/** ¿Se puede cargar analítica? */
export function canLoadAnalytics(state: ConsentState | null): boolean {
  return state?.analytics === true;
}
