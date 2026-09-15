import { Menu } from "lucide-react";
import { NavLink } from "@/components/site/nav-link";
import { SearchForm } from "@/components/site/search-form";
import { Brand } from "@/components/site/brand";
import { getPopulatedCategories } from "@/lib/queries";

/**
 * Cabecera. Todo se renderiza en el servidor: la navegación son enlaces reales
 * (`<Link>`), el buscador es un formulario GET y el menú móvil usa `<details>`,
 * así que no necesita JavaScript.
 */
export function Header() {
  const categories = getPopulatedCategories().slice(0, 5);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-pink-500/20 bg-zinc-950/90 backdrop-blur-md">
      <div className="bg-gradient-to-r from-pink-600/20 via-zinc-950 to-cyan-500/20 px-4 py-1.5 text-center">
        <p className="text-[11px] leading-tight text-zinc-300">
          <span className="font-semibold text-pink-400">
            Sitio fan no oficial
          </span>{" "}
          · No afiliado con Rockstar Games ni Take-Two Interactive · Las
          imágenes son ilustraciones conceptuales generadas localmente
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Brand />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navegación principal"
        >
          <NavLink
            href="/"
            exact
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
            Inicio
          </NavLink>
          {categories.map((category) => (
            <NavLink
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {category.name}
            </NavLink>
          ))}
          <NavLink
            href="/noticias"
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
            Todas las noticias
          </NavLink>
        </nav>
      </div>

      <div className="hidden border-t border-white/5 px-4 py-2.5 lg:block">
        <div className="mx-auto max-w-7xl">
          <SearchForm />
        </div>
      </div>

      <details className="border-t border-white/5 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-zinc-200">
          <Menu className="h-4 w-4" aria-hidden="true" />
          Menú y búsqueda
        </summary>
        <nav
          className="flex flex-col gap-1 px-4 pb-4"
          aria-label="Navegación móvil"
        >
          <NavLink
            href="/"
            exact
            className="rounded-md px-3 py-2.5 text-sm font-medium"
          >
            Inicio
          </NavLink>
          {categories.map((category) => (
            <NavLink
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium"
            >
              {category.name}
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </NavLink>
          ))}
          <NavLink
            href="/noticias"
            className="rounded-md px-3 py-2.5 text-sm font-medium"
          >
            Todas las noticias
          </NavLink>
          <NavLink
            href="/sobre"
            className="rounded-md px-3 py-2.5 text-sm font-medium"
          >
            Sobre nosotros
          </NavLink>
          <NavLink
            href="/contacto"
            className="rounded-md px-3 py-2.5 text-sm font-medium"
          >
            Contacto
          </NavLink>
          <div className="mt-2 border-t border-white/5 pt-3">
            <SearchForm />
          </div>
        </nav>
      </details>
    </header>
  );
}
