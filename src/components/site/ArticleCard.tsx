"use client";

import { Clock, ArrowUpRight } from "lucide-react";
import { useNav } from "@/lib/nav";
import {
  type Article,
  getCategoryBySlug,
  getAuthorBySlug,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: Article;
  variant?: "default" | "featured" | "compact" | "horizontal";
  priority?: boolean;
};

export function ArticleCard({
  article,
  variant = "default",
  priority = false,
}: ArticleCardProps) {
  const nav = useNav();
  const category = getCategoryBySlug(article.category);
  const author = getAuthorBySlug(article.author);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "es-ES",
    { year: "numeric", month: "short", day: "numeric" }
  );

  const handleClick = () => nav.goArticle(article.slug);

  // Variant compact: lista lateral / trending
  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        className="group flex w-full items-start gap-3 text-left"
      >
        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md bg-zinc-900">
          { }
          <img
            src={article.cover}
            alt={article.coverAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="flex-1">
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: category?.color }}
          >
            {category?.name}
          </span>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-pink-400">
            {article.title}
          </h3>
          <span className="mt-1 block text-[11px] text-zinc-500">
            {formattedDate} · {article.readingTime} min
          </span>
        </div>
      </button>
    );
  }

  // Variant horizontal: grid de noticias
  if (variant === "horizontal") {
    return (
      <article
        itemScope
        itemType="https://schema.org/NewsArticle"
        className="group grid cursor-pointer grid-cols-[120px_1fr] gap-4 overflow-hidden rounded-lg border border-white/5 bg-zinc-900/40 transition-colors hover:border-pink-500/40 sm:grid-cols-[160px_1fr]"
        onClick={handleClick}
      >
        <div className="relative h-full min-h-[120px] overflow-hidden bg-zinc-900">
          { }
          <img
            src={article.cover}
            alt={article.coverAlt}
            loading={priority ? "eager" : "lazy"}
            itemProp="image"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: category?.color }}
          >
            {category?.name}
          </span>
        </div>
        <div className="flex flex-col justify-center py-2 pr-4">
          <h3
            itemProp="headline"
            className="line-clamp-2 text-sm font-bold leading-snug text-zinc-100 transition-colors group-hover:text-pink-400 sm:text-base"
          >
            {article.title}
          </h3>
          <p
            itemProp="description"
            className="mt-1.5 line-clamp-2 text-xs text-zinc-400 sm:text-sm"
          >
            {article.excerpt}
          </p>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-500">
            <span itemProp="author">{author?.name}</span>
            <span>·</span>
            <time itemProp="datePublished" dateTime={article.publishedAt}>
              {formattedDate}
            </time>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readingTime} min
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Variant featured: hero
  if (variant === "featured") {
    return (
      <article
        itemScope
        itemType="https://schema.org/NewsArticle"
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-zinc-900"
        onClick={handleClick}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
          { }
          <img
            src={article.cover}
            alt={article.coverAlt}
            loading={priority ? "eager" : "lazy"}
            itemProp="image"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <span
            className="absolute left-4 top-4 rounded px-2 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
            style={{ backgroundColor: category?.color }}
          >
            {category?.name}
          </span>
          {article.trending && (
            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded bg-pink-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Trending
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <h2
            itemProp="headline"
            className="line-clamp-2 max-w-3xl text-xl font-black leading-tight text-white drop-shadow-lg sm:text-2xl lg:text-3xl"
          >
            {article.title}
          </h2>
          <p
            itemProp="description"
            className="mt-2 line-clamp-2 hidden max-w-2xl text-sm text-zinc-300 sm:block"
          >
            {article.excerpt}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
            <span
              itemProp="author"
              className="inline-flex items-center gap-1.5 font-medium text-white"
            >
              { }
              <img
                src={author?.avatar}
                alt={`Foto de ${author?.name}`}
                className="h-5 w-5 rounded-full object-cover"
              />
              {author?.name}
            </span>
            <span>·</span>
            <time itemProp="datePublished" dateTime={article.publishedAt}>
              {formattedDate}
            </time>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readingTime} min
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Variant default: grid estándar
  return (
    <article
      itemScope
      itemType="https://schema.org/NewsArticle"
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-white/5 bg-zinc-900/40 transition-all hover:border-pink-500/40 hover:bg-zinc-900"
      )}
      onClick={handleClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
        { }
        <img
          src={article.cover}
          alt={article.coverAlt}
          loading={priority ? "eager" : "lazy"}
          itemProp="image"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: category?.color }}
        >
          {category?.name}
        </span>
        {article.trending && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-pink-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            Trending
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3
          itemProp="headline"
          className="line-clamp-2 text-base font-bold leading-snug text-zinc-100 transition-colors group-hover:text-pink-400"
        >
          {article.title}
        </h3>
        <p
          itemProp="description"
          className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-400"
        >
          {article.excerpt}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-zinc-500">
          <time itemProp="datePublished" dateTime={article.publishedAt}>
            {formattedDate}
          </time>
          <span className="inline-flex items-center gap-1 font-medium text-pink-400 opacity-0 transition-opacity group-hover:opacity-100">
            Leer <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </article>
  );
}
