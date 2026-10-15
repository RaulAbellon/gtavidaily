import type { Metadata } from "next";
import { LegalTeam } from "@/components/legal/equipo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quién hace el sitio",
  description: `Quién está detrás de ${SITE_NAME}: cómo se reparte el trabajo de documentación, redacción y verificación bajo la firma «Redacción» y quién responde del contenido.`,
  alternates: { canonical: "/equipo" },
};

export default function EquipoPage() {
  return <LegalTeam />;
}
