"use client";

import { useState } from "react";
import { Menu, X, Search, Flame } from "lucide-react";
import { useNav } from "@/lib/nav";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const nav = useNav();

  const handleNavHome = () => {
    nav.goHome();
    setMobileOpen(false);
  };

  const handleNavCategory = (slug: string) => {
    nav.goCategory(slug);
    setMobileOpen(false);
  };

  const handleNavAbout = () => {
    nav.goAbout();
    setMobileOpen(false);
  };

  const handleNavContact = () => {
    nav.goContact();
    setMobileOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Búsqueda simple: ir a la categoría "noticias" como fallback
    if (query.trim()) {
      nav.goCategory("noticias");
      setQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-pink-500/20 bg-zinc-950/90 backdrop-blur-md">
      {/* Banner de disclaimer fan-site */}
      <div className="bg-gradient-to-r from-pink-600/20 via-zinc-950 to-cyan-500/20 px-4 py-1.5 text-center">
        <p className="text-[11px] text-zinc-300">
          <span className="font-semibold text-pink-400">Sitio fan no oficial</span>{" "}
          · No afiliado con Rockstar Games ni Take-Two Interactive · Las
          imágenes son ilustraciones conceptuales generadas localmente
        </p>
      </div>

      {/* Barra superior con marca y fecha */}
      <div className="border-b border-white/5 bg-gradient-to-r from-pink-600/10 via-zinc-950 to-cyan-500/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs text-zinc-400">
          <span className="hidden sm:inline">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-pink-400">
            <Flame className="h-3 w-3" />
            Contenido no oficial · Fans de Rockstar Games
          </span>
          <span className="hidden sm:inline">Edición digital</span>
        </div>
      </div>

      {/* Logo y navegación principal */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <button
          onClick={handleNavHome}
          className="group flex items-center gap-2"
          aria-label="Ir al inicio de GTA VI Hub"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-pink-500 to-purple-600 font-black text-white shadow-[0_0_20px_-2px] shadow-pink-500/50 transition-transform group-hover:scale-105">
            VI
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tight text-white">
              GTA <span className="text-pink-400">VI</span> HUB
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400">
              Noticias Vice City
            </span>
          </span>
        </button>

        {/* Nav desktop */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navegación principal"
        >
          <button
            onClick={handleNavHome}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white",
              nav.view.type === "home" && "bg-white/5 text-white"
            )}
          >
            Inicio
          </button>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleNavCategory(cat.slug)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white",
                nav.view.type === "category" &&
                  nav.view.slug === cat.slug &&
                  "bg-white/5 text-white"
              )}
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={handleNavAbout}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white",
              nav.view.type === "about" && "bg-white/5 text-white"
            )}
          >
            About
          </button>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-md p-2 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Buscar"
            aria-expanded={searchOpen}
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Barra de búsqueda desplegable */}
      {searchOpen && (
        <div className="border-t border-white/5 bg-zinc-950">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3"
          >
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar noticias de GTA VI..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-pink-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-pink-400"
            >
              Buscar
            </button>
          </form>
        </div>
      )}

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-zinc-950 lg:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3"
            aria-label="Navegación móvil"
          >
            <button
              onClick={handleNavHome}
              className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-zinc-200 hover:bg-white/5"
            >
              Inicio
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleNavCategory(cat.slug)}
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium text-zinc-200 hover:bg-white/5"
              >
                {cat.name}
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              </button>
            ))}
            <button
              onClick={handleNavAbout}
              className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-zinc-200 hover:bg-white/5"
            >
              About
            </button>
            <button
              onClick={handleNavContact}
              className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-zinc-200 hover:bg-white/5"
            >
              Contacto
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
