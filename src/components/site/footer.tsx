import Link from "next/link";
import { Brand } from "@/components/site/brand";
import { CookieSettingsLink } from "@/components/consent/cookie-settings-link";
import { LaunchAlertForm } from "@/components/site/launch-alert-form";
import { getPopulatedCategories } from "@/lib/queries";
import { CONTACT_EMAIL, EDITORIAL_NAME, LEGAL_OWNER, SITE_NAME } from "@/lib/site";

export function Footer() {
  const categories = getPopulatedCategories();
  const year = new Date().getFullYear();
  const owner = LEGAL_OWNER.name || SITE_NAME;

  return (
    <footer className="mt-auto border-t border-pink-500/20 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-7">
          <div className="col-span-2 lg:col-span-2">
            <Brand />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              Cobertura en español de Grand Theft Auto VI: tráileres, mapa de
              Leonida, personajes y novedades de Rockstar Games y Take-Two.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              Sitio fan no oficial. Grand Theft Auto, GTA, Vice City y Rockstar
              Games son marcas registradas de Take-Two Interactive Software,
              Inc. No estamos afiliados ni patrocinados por Rockstar Games ni
              Take-Two. Las ilustraciones propias son ilustraciones
              conceptuales generadas por el motor de portadas del sitio a partir
              de una escena descrita para cada artículo: no son capturas del
              juego. Cuando una pieza se ilustra con material oficial de Rockstar
              se indica en el pie de la imagen con su crédito.
            </p>
          </div>

          <nav aria-label="Secciones">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-pink-400">
              Secciones
            </h2>
            <ul className="space-y-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categoria/${category.slug}`}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/noticias"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Todas las noticias
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Sobre el medio">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-pink-400">
              El medio
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/sobre"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-editorial"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Política editorial
                </Link>
              </li>
              <li>
                <Link
                  href="/correcciones"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Correcciones
                </Link>
              </li>
              <li>
                <Link
                  href="/financiacion"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Cómo nos financiamos
                </Link>
              </li>
              <li>
                <Link
                  href="/equipo"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Quién hace el sitio
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Información legal">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-pink-400">
              Legal
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/aviso-legal"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/dmca"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  DMCA y derechos de autor
                </Link>
              </li>
              <li>
                <CookieSettingsLink className="text-zinc-400 transition-colors hover:text-white" />
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-pink-400">
              Consulta
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/cronologia"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Cronología de confirmaciones
                </Link>
              </li>
              <li>
                <Link
                  href="/desbloqueo"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Hora de desbloqueo por países
                </Link>
              </li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">
              Cada dato con su fuente. Lo no confirmado, marcado como tal.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-pink-400">
              Contacto
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/contacto"
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Escríbenos
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="break-all text-zinc-400 transition-colors hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            <p className="mt-3 text-xs text-zinc-500">{EDITORIAL_NAME}</p>
          </div>
        </div>

        {/* Captar el correo es la única vía de recuperar lectores sin depender
            del buscador, así que vive en el pie: aparece en todas las páginas. */}
        <div className="mt-10 max-w-md rounded-xl border border-white/5 bg-zinc-900/40 p-4">
          <LaunchAlertForm origin="pie" />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>
            © {year} {owner}. Todos los derechos reservados.
          </p>
          <p>Contenido editorial propio · Sitio fan no oficial</p>
        </div>
      </div>
    </footer>
  );
}
