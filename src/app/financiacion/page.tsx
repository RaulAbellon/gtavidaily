import type { Metadata } from "next";
import { LegalFunding } from "@/components/legal/financiacion";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cómo nos financiamos",
  description: `De dónde sale el dinero de ${SITE_NAME}: publicidad display, sin contenido patrocinado sin señalar ni enlaces pagados, y la separación entre publicidad y redacción.`,
  alternates: { canonical: "/financiacion" },
};

export default function FinanciacionPage() {
  return <LegalFunding />;
}
