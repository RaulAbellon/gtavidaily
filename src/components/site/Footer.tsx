"use client";

import { useNav } from "@/lib/nav";
import { categories, authors } from "@/lib/data";

export function Footer() {
  const nav = useNav();

  return (
    <footer className="mt-auto border-t border-pink-500/20 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Marca */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-pink-500 to-purple-600 font-black text-white">
                VI
              </span>
              <span className="text-lg font-black tracking-tight text-white">
                GTA <span className="text-pink-400">VI</span> HUB
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              Tu fuente independiente de noticias, análisis y rumores sobre
              Grand Theft Auto VI. Cubrimos todo lo relacionado con el regreso a
              Vice City, los protagonistas Lucia y Jason, y el lanzamiento en
              PS5, Xbox Series y PC.
            </p>
            <p className="mt-4 text-xs text-zinc-500">
              Sitio fan no oficial. Grand Theft Auto y Rockstar Games son
              marcas registradas de Take-Two Interactive. No estamos afiliados
              con Rockstar Games ni Take-Two. Las imágenes son ilustraciones
              conceptuales generadas localmente y no representan arte oficial
              del juego. Todo el contenido editorial es propio y se publica
              bajo fair use con propósito informativo.
            </p>
          </div>

          {/* Categorías */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-pink-400">
              Secciones
            </h2>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => nav.goCategory(cat.slug)}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipo */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-pink-400">
              Equipo
            </h2>
            <ul className="space-y-2.5 text-sm">
              {authors.map((author) => (
                <li key={author.slug}>
                  <span className="text-zinc-400">{author.name}</span>
                  <span className="ml-2 text-xs text-zinc-600">
                    {author.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-pink-400">
              Legal
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => nav.goAbout()}
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Sobre nosotros
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav.goContact()}
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Contacto
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav.goPrivacy()}
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Política de privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav.goPrivacy()}
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Política de cookies
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav.goPrivacy()}
                  className="text-zinc-400 transition-colors hover:text-white"
                >
                  Aviso legal
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} GTA VI Daily. Todos los derechos
            reservados.
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Sitio optimizado para SEO y Google AdSense
          </p>
        </div>
      </div>
    </footer>
  );
}
