import type { Metadata } from "next";
import { LegalCorrections } from "@/components/legal/correcciones";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Correcciones",
  description: `Cómo pedir una corrección a ${SITE_NAME}, qué plazo de respuesta asumimos y el registro público de los errores ya corregidos, con fecha y fuente.`,
  alternates: { canonical: "/correcciones" },
};

export default function CorreccionesPage() {
  return <LegalCorrections />;
}
