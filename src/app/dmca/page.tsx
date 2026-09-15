import type { Metadata } from "next";
import { LegalDmca } from "@/components/legal/dmca";

export const metadata: Metadata = {
  title: "DMCA y derechos de autor",
  description:
    "Procedimiento para notificar infracciones de derechos de autor sobre contenidos publicados en GTA VI Daily.",
  alternates: { canonical: "/dmca" },
};

export default function DmcaPage() {
  return <LegalDmca />;
}
