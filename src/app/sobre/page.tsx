import type { Metadata } from "next";
import { LegalAbout } from "@/components/legal/sobre";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: `Quién publica ${SITE_NAME}: alcance editorial, fuentes y política de correcciones de nuestro sitio fan no oficial sobre Grand Theft Auto VI.`,
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return <LegalAbout />;
}
