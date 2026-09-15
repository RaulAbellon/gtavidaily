/**
 * Página legal: contacto.
 *
 * Componente de servidor extraído del antiguo StaticPage.tsx (1.153 líneas con
 * las seis páginas mezcladas). Los metadatos de la ruta viven en
 * `src/app/contacto/page.tsx`.
 */
import { Mail } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/site/contact-form";
import { LegalHeader } from "@/components/legal/legal-header";
import {
  CONTACT_EMAIL,
} from "@/lib/site";

export function LegalContact() {
  return (
  <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
    <LegalHeader badge="Contacto" title="Contacta con nosotros" intro="¿Tienes una noticia, una filtración, una consulta legal o simplemente quieres saludar? Escríbenos y te responderemos lo antes posible." />

    <ContactForm contactEmail={CONTACT_EMAIL} />

    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <a
        href="mailto:contacto@gtavidaily.com"
        className="flex items-center gap-3 rounded-lg border border-white/5 bg-zinc-900/40 p-4 transition-colors hover:border-pink-500/40"
      >
        <Mail className="h-5 w-5 text-pink-500" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Email
          </p>
          <p className="text-sm text-white">{CONTACT_EMAIL}</p>
        </div>
      </a>
    </div>

    <div className="mt-8 text-center">
      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-pink-400"
      >
        ← Volver al inicio
      </Link>
    </div>
  </div>
  );
}
