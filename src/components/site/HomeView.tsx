"use client";

import { useState } from "react";
import { TrendingUp, Flame, Newspaper, ChevronRight } from "lucide-react";
import {
  categories,
  getFeaturedArticles,
  getLatestArticles,
  getTrendingArticles,
} from "@/lib/data";
import { useNav } from "@/lib/nav";
import { ArticleCard } from "./ArticleCard";
import { AdSense } from "@/components/ads/AdSense";

export function HomeView() {
  const nav = useNav();
  const [visibleCount, setVisibleCount] = useState(6);

  const featured = getFeaturedArticles();
  const trending = getTrendingArticles();
  const latest = getLatestArticles();

  // El hero es el primer featured; el resto van al grid secundario
  const heroArticle = featured[0] || latest[0];
  const secondaryFeatured = featured.slice(1, 3);
  const gridArticles = latest
    .filter((a) => a.slug !== heroArticle?.slug)
    .slice(0, visibleCount);

  const handleLoadMore = () => setVisibleCount((c) => c + 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      {/* Hero + sidebar */}
      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {heroArticle && (
            <ArticleCard article={heroArticle} variant="featured" priority />
          )}
          {secondaryFeatured.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {secondaryFeatured.map((a) => (
                <ArticleCard key={a.slug} article={a} priority />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar con trending + ad */}
        <aside className="space-y-6">
          <AdSense
            slot="3333333333"
            format="rectangle"
            style={{ minHeight: "300px" }}
          />

          <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
              <Flame className="h-4 w-4 text-pink-500" />
              Tendencias
            </h2>
            <ol className="space-y-4">
              {trending.slice(0, 5).map((a, i) => (
                <li key={a.slug} className="flex gap-3">
                  <span className="text-2xl font-black leading-none text-pink-500/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArticleCard article={a} variant="compact" />
                </li>
              ))}
            </ol>
          </div>

          <AdSense
            slot="4444444444"
            format="rectangle"
            style={{ minHeight: "300px" }}
          />
        </aside>
      </section>

      {/* Anuncio horizontal */}
      <AdSense
        slot="5555555555"
        format="horizontal"
        className="my-8"
        style={{ minHeight: "120px" }}
      />

      {/* Categorías */}
      <section className="mb-8">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-white">
          <Newspaper className="h-5 w-5 text-pink-500" />
          Explora por categorías
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => nav.goCategory(cat.slug)}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2 text-sm font-medium text-zinc-200 transition-all hover:border-pink-500/40 hover:bg-zinc-900"
            >
              <span
                className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
              <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </section>

      {/* Últimas noticias */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-black text-white">
            <span className="h-6 w-1.5 rounded bg-pink-500" />
            Últimas noticias
          </h2>
          <span className="text-xs text-zinc-500">
            {latest.length} artículos publicados
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridArticles.map((a, i) => (
            <ArticleCard key={a.slug} article={a} priority={i < 3} />
          ))}
        </div>

        {visibleCount < latest.length - 1 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 rounded-md border border-pink-500/40 bg-pink-500/10 px-6 py-3 text-sm font-semibold text-pink-300 transition-colors hover:bg-pink-500/20"
            >
              Cargar más noticias
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {/* Anuncio inferior */}
      <AdSense
        slot="6666666666"
        format="horizontal"
        className="my-8"
        style={{ minHeight: "120px" }}
      />

      {/* Bloque trending */}
      <section className="rounded-xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 via-zinc-900/40 to-cyan-500/10 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
          <TrendingUp className="h-6 w-6 text-pink-500" />
          Lo más leído esta semana
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {trending.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="horizontal" />
          ))}
        </div>
      </section>
    </div>
  );
}
