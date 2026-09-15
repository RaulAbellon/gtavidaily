import type { Metadata } from "next";
import { LegalNotice } from "@/components/legal/aviso-legal";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Datos identificativos del titular, condiciones de uso y responsabilidad del sitio GTA VI Daily, conforme a la LSSI-CE.",
  alternates: { canonical: "/aviso-legal" },
};

export default function AvisoLegalPage() {
  return <LegalNotice />;
}
