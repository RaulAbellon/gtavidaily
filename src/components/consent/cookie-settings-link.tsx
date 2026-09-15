"use client";

import { OPEN_CONSENT_SETTINGS_EVENT } from "@/components/consent/cookie-banner";

/** Enlace para revisar o retirar el consentimiento en cualquier momento. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new Event(OPEN_CONSENT_SETTINGS_EVENT))
      }
      className={className}
    >
      Configurar cookies
    </button>
  );
}
