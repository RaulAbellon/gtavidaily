import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Flame, Newspaper, TrendingUp } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleCard } from "@/components/site/article-card";
import { ArticleGrid } from "@/components/site/article-grid";
import {
  getFeaturedArticles,
  getLatestArticles,
  getTrendingArticles,
} from "@/lib/data";
import { getPopulatedCategories } from "@/lib/queries";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} · ${SITE_TAGLINE}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const HOME_ARTICLES = 9;

export default function HomePage() {
  const featured = getFeaturedArticles();
  const latest = getLatestArticles();
  const trending = getTrendingArticles();
  const categories = getPopulatedCategories();

  const hero = featured[0] ?? latest[0];
  const secondary = featured.slice(1, 3);
  const grid = latest
    .filter((article) => article.slug !== hero?.slug)
    .slice(0, HOME_ARTICLES);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <h1 className="sr-only">
        {SITE_NAME} · {SITE_TAGLINE}
      </h1>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {hero && <ArticleCard article={hero} variant="featured" priority />}
          {secondary.length > 0 && (
            <ArticleGrid articles={secondary} columns={2} prioritizeFirst={2} />
          )}
        </div>

        <aside className="space-y-6">
          <AdSlot slot="3333333333" format="rectangle" minHeight={250} />

          <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
              <Flame className="h-4 w-4 text-pink-500" aria-hidden="true" />
              Tendencias
            </h2>
            <ol className="space-y-4">
              {trending.slice(0, 5).map((article, index) => (
                <li key={article.slug} className="flex gap-3">
                  <span className="text-2xl font-black leading-none text-pink-500/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ArticleCard article={article} variant="compact" />
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>

      <AdSlot slot="5555555555" format="horizontal" className="my-8" minHeight={100} />

      <section className="mb-8" aria-labelledby="secciones">
        <h2
          id="secciones"
          className="mb-5 flex items-center gap-2 text-xl font-black text-white"
        >
          <Newspaper className="h-5 w-5 text-pink-500" aria-hidden="true" />
          Explora por categorías
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/40 px-4 py-2 text-sm font-medium text-zinc-200 transition-all hover:border-pink-500/40 hover:bg-zinc-900"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
              <span className="text-xs text-zinc-500">{category.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="ultimas">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2
            id="ultimas"
            className="flex items-center gap-2 text-2xl font-black text-white"
          >
            <span aria-hidden="true" className="h-6 w-1.5 rounded bg-pink-500" />
            Últimas noticias
          </h2>
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1 text-sm font-semibold text-pink-400 hover:text-pink-300"
          >
            Ver todas ({latest.length})
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ArticleGrid articles={grid} prioritizeFirst={3} />
      </section>

      <section className="rounded-xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 via-zinc-900/40 to-cyan-500/10 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
          <TrendingUp className="h-6 w-6 text-pink-500" aria-hidden="true" />
          Lo más leído esta semana
        </h2>
        <ArticleGrid articles={trending} columns={2} />
      </section>
    </div>
  );
}
