import type { Metadata } from "next";
import { LegalCookies } from "@/components/legal/cookies";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Qué cookies usa GTA VI Daily, con qué finalidad, durante cuánto tiempo y cómo aceptarlas, rechazarlas o retirar el consentimiento en cualquier momento.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return <LegalCookies />;
}
