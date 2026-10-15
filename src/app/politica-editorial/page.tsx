import type { Metadata } from "next";
import { LegalEditorialPolicy } from "@/components/legal/politica-editorial";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política editorial",
  description: `Cómo verifica ${SITE_NAME} cada dato que publica, qué no publica nunca, cómo etiqueta lo que no está confirmado y cómo se corrigen los errores.`,
  alternates: { canonical: "/politica-editorial" },
};

export default function PoliticaEditorialPage() {
  return <LegalEditorialPolicy />;
}
