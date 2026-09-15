import type { Metadata } from "next";
import { LegalContact } from "@/components/legal/contacto";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos para enviar una noticia, una filtración, una consulta legal o una solicitud de corrección.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return <LegalContact />;
}
