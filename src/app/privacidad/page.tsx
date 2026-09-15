import type { Metadata } from "next";
import { LegalPrivacy } from "@/components/legal/privacidad";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Información sobre el tratamiento de datos personales, base jurídica, derechos y responsable del tratamiento en GTA VI Daily.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return <LegalPrivacy />;
}
