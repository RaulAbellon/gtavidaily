import { describe, expect, it } from "vitest";
import {
  ALLOW_ALL,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  DEFAULT_CONSENT_STATE,
  DENY_ALL,
  buildConsentState,
  canLoadAdvertising,
  canLoadAnalytics,
  parseStoredConsent,
  toConsentModeSignals,
} from "@/lib/consent";

describe("consentimiento", () => {
  it("empieza denegado por defecto (Consent Mode v2)", () => {
    expect(DEFAULT_CONSENT_STATE).toEqual({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  });

  it("traduce la decisión a señales de Consent Mode", () => {
    expect(toConsentModeSignals(ALLOW_ALL)).toEqual({
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
    expect(toConsentModeSignals(DENY_ALL)).toEqual(DEFAULT_CONSENT_STATE);
    expect(toConsentModeSignals({ analytics: true, marketing: false })).toEqual({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
  });

  it("no carga publicidad sin consentimiento de marketing", () => {
    expect(canLoadAdvertising(null)).toBe(false);
    expect(canLoadAdvertising(buildConsentState(DENY_ALL))).toBe(false);
    expect(canLoadAdvertising(buildConsentState({ analytics: true, marketing: false }))).toBe(false);
    expect(canLoadAdvertising(buildConsentState(ALLOW_ALL))).toBe(true);
  });

  it("no carga analítica sin consentimiento de medición", () => {
    expect(canLoadAnalytics(null)).toBe(false);
    expect(canLoadAnalytics(buildConsentState({ analytics: false, marketing: true }))).toBe(false);
    expect(canLoadAnalytics(buildConsentState(ALLOW_ALL))).toBe(true);
  });

  it("guarda la versión y la fecha de la decisión", () => {
    const state = buildConsentState(ALLOW_ALL);
    expect(state.version).toBe(CONSENT_VERSION);
    expect(state.necessary).toBe(true);
    expect(Number.isNaN(Date.parse(state.decidedAt))).toBe(false);
  });

  it("descarta datos corruptos, incompletos o de otra versión", () => {
    expect(parseStoredConsent(null)).toBeNull();
    expect(parseStoredConsent("")).toBeNull();
    expect(parseStoredConsent("no es json")).toBeNull();
    expect(parseStoredConsent("{}")).toBeNull();
    expect(
      parseStoredConsent(
        JSON.stringify({ version: "1.0.0", analytics: true, marketing: true })
      )
    ).toBeNull();
    expect(
      parseStoredConsent(
        JSON.stringify({ version: CONSENT_VERSION, analytics: "sí", marketing: true })
      )
    ).toBeNull();
  });

  it("acepta un consentimiento válido y normaliza los campos", () => {
    const parsed = parseStoredConsent(
      JSON.stringify({
        version: CONSENT_VERSION,
        analytics: false,
        marketing: true,
        decidedAt: "2026-09-15T10:00:00.000Z",
      })
    );
    expect(parsed).toEqual({
      necessary: true,
      analytics: false,
      marketing: true,
      version: CONSENT_VERSION,
      decidedAt: "2026-09-15T10:00:00.000Z",
    });
  });

  it("usa una clave de almacenamiento estable", () => {
    expect(CONSENT_STORAGE_KEY).toBe("gtavidaily-consent");
  });
});
