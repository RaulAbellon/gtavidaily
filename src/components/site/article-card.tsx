import { Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getAuthorBySlug, getCategoryBySlug, type Article } from "@/lib/data";
import { coverUrl } from "@/lib/cover";
import { EDITORIAL_NAME } from "@/lib/site";

type ArticleCardProps = {
  article: Article;
  variant?: "default" | "featured" | "compact" | "horizontal";
  priority?: boolean;
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function authorName(slug: string): string {
  return getAuthorBySlug(slug)?.name ?? EDITORIAL_NAME;
}

/**
 * Tarjeta de artículo. Es un componente de servidor y navega con `<Link>`, así
 * que cada noticia tiene una URL real, se puede abrir en otra pestaña y entra
 * en el índice de buscadores.
 */
export function ArticleCard({
  article,
  variant = "default",
  priority = false,
}: ArticleCardProps) {
  const category = getCategoryBySlug(article.category);
  const href = `/articulo/${article.slug}`;
  const published = formatDate(article.publishedAt);
  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : "auto";

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex w-full items-start gap-3 text-left">
        <span className="relative block h-16 w-20 flex-shrink-0 overflow-hidden rounded-md bg-zinc-900">
          <img
            src={coverUrl(article)}
            alt={article.coverAlt}
            width={1200}
            height={675}
            loading={loading}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </span>
        <span className="flex-1">
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: category?.color }}
          >
            {category?.name}
          </span>
          <span className="mt-0.5 line-clamp-2 block text-sm font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-pink-400">
            {article.title}
          </span>
          <span className="mt-1 block text-[11px] text-zinc-500">
            {published} · {article.readingTime} min
          </span>
        </span>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group overflow-hidden rounded-lg border border-white/5 bg-zinc-900/40 transition-colors hover:border-pink-500/40">
        <Link
          href={href}
          className="grid grid-cols-[120px_1fr] gap-4 sm:grid-cols-[160px_1fr]"
        >
          <span className="relative block h-full min-h-[120px] overflow-hidden bg-zinc-900">
            <img
              src={coverUrl(article)}
              alt={article.coverAlt}
              width={1200}
              height={675}
              loading={loading}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </span>
          <span className="flex flex-col justify-center py-2 pr-4">
            <span className="line-clamp-2 text-sm font-bold leading-snug text-zinc-100 transition-colors group-hover:text-pink-400 sm:text-base">
              {article.title}
            </span>
            <span className="mt-1.5 line-clamp-2 text-xs text-zinc-400 sm:text-sm">
              {article.excerpt}
            </span>
            <span className="mt-2 flex items-center gap-3 text-[11px] text-zinc-500">
              <span>{authorName(article.author)}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt}>{published}</time>
            </span>
          </span>
        </Link>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className="group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900">
        <Link href={href} className="block">
          <span className="relative block aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
            <img
              src={coverUrl(article)}
              alt={article.coverAlt}
              width={1200}
              height={675}
              loading={loading}
              fetchPriority={fetchPriority}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span
              className="absolute left-4 top-4 rounded px-2 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
              style={{ backgroundColor: category?.color }}
            >
              {category?.name}
            </span>
            {article.trending && (
              <span className="absolute right-4 top-4 rounded bg-pink-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                Trending
              </span>
            )}
          </span>
          <span className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent p-4 pt-10 sm:p-6 sm:pt-16">
            <span className="line-clamp-2 block max-w-3xl text-xl font-black leading-tight text-white drop-shadow-lg sm:text-2xl lg:text-3xl">
              {article.title}
            </span>
            <span className="mt-2 hidden max-w-2xl text-sm text-zinc-300 sm:line-clamp-2 sm:block">
              {article.excerpt}
            </span>
            <span className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
              <span className="font-medium text-white">
                {authorName(article.author)}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt}>{published}</time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {article.readingTime} min
              </span>
            </span>
          </span>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-white/5 bg-zinc-900/40 transition-all hover:border-pink-500/40 hover:bg-zinc-900">
      <Link href={href} className="flex flex-1 flex-col">
        <span className="relative block aspect-[16/10] overflow-hidden bg-zinc-900">
          <img
            src={coverUrl(article)}
            alt={article.coverAlt}
            width={1200}
            height={675}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: category?.color }}
          >
            {category?.name}
          </span>
        </span>
        <span className="flex flex-1 flex-col p-4">
          <span className="line-clamp-2 text-base font-bold leading-snug text-zinc-100 transition-colors group-hover:text-pink-400">
            {article.title}
          </span>
          <span className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-400">
            {article.excerpt}
          </span>
          <span className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-zinc-500">
            <time dateTime={article.publishedAt}>{published}</time>
            <span className="inline-flex items-center gap-1 font-medium text-pink-400">
              Leer <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </span>
        </span>
      </Link>
    </article>
  );
}
