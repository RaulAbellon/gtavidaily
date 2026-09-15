import Link from "next/link";
import { Brand } from "@/components/site/brand";
import { CookieSettingsLink } from "@/components/consent/cookie-settings-link";
import { getPopulatedCategories } from "@/lib/queries";
import {
  CONTACT_EMAIL,
  EDITORIAL_NAME,
  LEGAL_OWNER,
  SITE_NAME,
  STATIC_ROUTES,
} from "@/lib/site";

export function Footer() {
  const categories = getPopulatedCategories();
  const year = new Date().getFullYear();
  const owner = LEGAL_OWNER.name || SITE_NAME;

  return (
    <footer className="mt-auto border-t border-pink-500/20 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <Brand />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              Cobertura en español de Grand Theft Auto VI: tráileres, mapa de
              Leonida, personajes y novedades de Rockstar Games y Take-Two.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              Sitio fan no oficial. Grand Theft Auto, GTA, Vice City y Rockstar
              Games son marcas registradas de Take-Two Interactive Software,
              Inc. No estamos afiliados ni patrocinados por Rockstar Games ni
              Take-Two. Las imágenes son ilustraciones conceptuales generadas
              localmente y no representan arte oficial del juego.
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

          <nav aria-label="Información legal">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-pink-400">
              Legal
            </h2>
            <ul className="space-y-2.5 text-sm">
              {STATIC_ROUTES.filter((route) => route.path !== "/contacto").map(
                (route) => (
                  <li key={route.path}>
                    <Link
                      href={route.path}
                      className="text-zinc-400 transition-colors hover:text-white"
                    >
                      {route.title}
                    </Link>
                  </li>
                )
              )}
              <li>
                <CookieSettingsLink className="text-zinc-400 transition-colors hover:text-white" />
              </li>
            </ul>
          </nav>

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
