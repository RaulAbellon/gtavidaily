import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, FileText, Tag, User } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleGrid } from "@/components/site/article-grid";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ShareButton } from "@/components/site/share-button";
import {
  getArticleBySlug,
  getCategoryBySlug,
  getRelatedArticles,
  type Article,
} from "@/lib/data";
import { countWords, citableSources, getAllArticleSlugs } from "@/lib/queries";
import { coverUrl } from "@/lib/cover";
import { EDITORIAL_NAME, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Artículo no encontrado" };

  const url = `/articulo/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    keywords: article.tags,
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [EDITORIAL_NAME],
      tags: article.tags,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: article.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: ["/og-image.png"],
    },
  };
}

function buildJsonLd(article: Article) {
  const category = getCategoryBySlug(article.category);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/articulo/${article.slug}`) },
    headline: article.title,
    description: article.excerpt,
    image: [`${SITE_URL}/og-image.png`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Organization", name: EDITORIAL_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
    articleSection: category?.name,
    keywords: article.tags.join(", "),
    wordCount: countWords(article),
    inLanguage: "es",
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategoryBySlug(article.category);
  const related = getRelatedArticles(article.slug, article.category, 3);
  const sources = citableSources(article);
  const published = new Date(article.publishedAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(article)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
              {
                "@type": "ListItem",
                position: 2,
                name: category?.name ?? "Noticias",
                item: absoluteUrl(`/categoria/${article.category}`),
              },
              { "@type": "ListItem", position: 3, name: article.title },
            ],
          }),
        }}
      />

      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: category?.name ?? "Noticias", href: `/categoria/${article.category}` },
          { label: article.title },
        ]}
      />

      <header className="mb-6">
        <Link
          href={`/categoria/${article.category}`}
          className="inline-block rounded px-2 py-1 text-xs font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: category?.color }}
        >
          {category?.name}
        </Link>
        <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-300">
          {article.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-white/5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15 text-pink-400">
              <User className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{EDITORIAL_NAME}</p>
              <p className="text-xs text-zinc-500">Equipo editorial</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={article.publishedAt}>{published}</time>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {article.readingTime} min de lectura
            </span>
            <ShareButton
              url={absoluteUrl(`/articulo/${article.slug}`)}
              title={article.title}
            />
          </div>
        </div>
      </header>

      <figure className="mb-8 overflow-hidden rounded-xl">
        <img
          src={coverUrl(article)}
          alt={article.coverAlt}
          width={1200}
          height={675}
          fetchPriority="high"
          decoding="async"
          className="aspect-[16/9] w-full object-cover"
        />
        <figcaption className="mt-2 text-xs text-zinc-500">
          {article.coverAlt}
        </figcaption>
      </figure>

      <AdSlot slot="1111111111" format="horizontal" className="my-8" minHeight={100} />

      <div className="prose-article space-y-5 text-[17px] leading-relaxed text-zinc-200">
        {article.content.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {index === 0 ? (
              <span className="float-left mr-2 mt-1 text-5xl font-black leading-none text-pink-500">
                {paragraph.charAt(0)}
              </span>
            ) : null}
            {index === 0 ? paragraph.slice(1) : paragraph}
          </p>
        ))}
      </div>

      <AdSlot slot="2222222222" format="horizontal" className="my-10" minHeight={100} />

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Tag className="h-4 w-4 text-zinc-500" aria-hidden="true" />
        {article.tags.map((tag) => (
          <Link
            key={tag}
            href={`/buscar?q=${encodeURIComponent(tag)}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 hover:border-pink-500/40 hover:text-white"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {sources.length > 0 && (
        <section className="mt-8 rounded-xl border border-white/5 bg-zinc-900/40 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-pink-400">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Fuentes citadas
          </h2>
          <ul className="space-y-2.5">
            {sources.map((source) => (
              <li key={source.url} className="flex items-start gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-pink-500/20 text-[10px] font-bold text-pink-400"
                >
                  ↗
                </span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="break-all text-cyan-400 underline-offset-2 hover:underline"
                >
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-white/5 pt-3 text-xs text-zinc-500">
            Este artículo se basa en información pública de las fuentes citadas.
            Los análisis y opiniones son propios de {SITE_NAME}.
          </p>
        </section>
      )}

      <aside className="mt-10 rounded-xl border border-white/5 bg-zinc-900/40 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-pink-400">
          Equipo editorial
        </p>
        <h2 className="mt-1 text-lg font-bold text-white">{EDITORIAL_NAME}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Cobertura en español de Grand Theft Auto VI: tráileres, mapa de
          Leonida, personajes y novedades de Rockstar Games y Take-Two. Cada
          artículo indica sus fuentes.
        </p>
      </aside>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
            <span aria-hidden="true" className="h-6 w-1.5 rounded bg-pink-500" />
            Artículos relacionados
          </h2>
          <ArticleGrid articles={related} />
        </section>
      )}

      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-pink-500/40 hover:text-pink-400"
        >
          Volver al inicio
        </Link>
      </div>
    </article>
  );
}
