"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import {
  getCategoryBySlug,
  getArticlesByCategory,
} from "@/lib/data";
import { useNav } from "@/lib/nav";
import { ArticleCard } from "./ArticleCard";
import { AdSense } from "@/components/ads/AdSense";

type CategoryViewProps = {
  slug: string;
};

export function CategoryView({ slug }: CategoryViewProps) {
  const nav = useNav();
  const category = getCategoryBySlug(slug);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    if (category) {
      document.title = `${category.name} de GTA VI | GTA VI Hub`;
    }
  }, [category]);

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white">
          Categoría no encontrada
        </h1>
        <button
          onClick={() => nav.goHome()}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-400"
        >
          <ChevronLeft className="h-4 w-4" /> Volver al inicio
        </button>
      </div>
    );
  }

  const allArticles = getArticlesByCategory(slug);
  const articles = allArticles.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Migas de pan"
        className="mb-6 flex items-center gap-1.5 text-xs text-zinc-500"
      >
        <button onClick={() => nav.goHome()} className="hover:text-pink-400">
          Inicio
        </button>
        <span>/</span>
        <span className="text-zinc-300">{category.name}</span>
      </nav>

      {/* Header de categoría */}
      <header
        className="mb-8 rounded-xl border border-white/5 p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, ${category.color}22 0%, rgba(24, 24, 27, 0.4) 100%)`,
        }}
      >
        <span
          className="inline-block rounded px-2 py-1 text-xs font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: category.color }}
        >
          Categoría
        </span>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
          {category.description}
        </p>
        <p className="mt-3 text-xs text-zinc-500">
          {allArticles.length} artículo{allArticles.length !== 1 ? "s" : ""} en
          esta sección
        </p>
      </header>

      {/* Anuncio superior */}
      <AdSense
        slot="7777777777"
        format="horizontal"
        className="mb-8"
        style={{ minHeight: "120px" }}
      />

      {/* Grid de artículos */}
      {articles.length === 0 ? (
        <div className="rounded-lg border border-white/5 bg-zinc-900/40 p-12 text-center">
          <p className="text-zinc-400">
            No hay artículos en esta categoría todavía. ¡Vuelve pronto!
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <ArticleCard key={a.slug} article={a} priority={i < 3} />
            ))}
          </div>

          {visibleCount < allArticles.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + 6)}
                className="inline-flex items-center gap-2 rounded-md border border-pink-500/40 bg-pink-500/10 px-6 py-3 text-sm font-semibold text-pink-300 hover:bg-pink-500/20"
              >
                Cargar más
              </button>
            </div>
          )}
        </>
      )}

      {/* Anuncio inferior */}
      <AdSense
        slot="8888888888"
        format="horizontal"
        className="mt-8"
        style={{ minHeight: "120px" }}
      />
    </div>
  );
}
