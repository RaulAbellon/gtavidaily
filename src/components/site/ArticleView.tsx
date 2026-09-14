"use client";

import { useEffect } from "react";
import {
  Clock,
  Calendar,
  ChevronLeft,
  Share2,
  Tag,
  User,
} from "lucide-react";
import { useNav } from "@/lib/nav";
import {
  getArticleBySlug,
  getCategoryBySlug,
  getAuthorBySlug,
  getRelatedArticles,
} from "@/lib/data";
import { ArticleCard } from "./ArticleCard";
import { AdSense } from "@/components/ads/AdSense";

type ArticleViewProps = {
  slug: string;
};

export function ArticleView({ slug }: ArticleViewProps) {
  const nav = useNav();
  const article = getArticleBySlug(slug);

  useEffect(() => {
    if (article) {
      // Actualizar título de la página para SEO
      document.title = `${article.title} | GTA VI Hub`;

      // JSON-LD dinámico para el artículo
      const existing = document.getElementById("article-jsonld");
      if (existing) existing.remove();

      const category = getCategoryBySlug(article.category);
      const author = getAuthorBySlug(article.author);

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.excerpt,
        image: [article.cover],
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: {
          "@type": "Person",
          name: author?.name,
          jobTitle: author?.role,
          description: author?.bio,
        },
        publisher: {
          "@type": "Organization",
          name: "GTA VI Hub",
          logo: {
            "@type": "ImageObject",
            url: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
          },
        },
        articleSection: category?.name,
        keywords: article.tags.join(", "),
        wordCount: article.content.join(" ").split(" ").length,
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "article-jsonld";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);

      return () => {
        const el = document.getElementById("article-jsonld");
        if (el) el.remove();
      };
    }
  }, [article, slug]);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white">Artículo no encontrado</h1>
        <p className="mt-2 text-zinc-400">
          El artículo que buscas no existe o ha sido movido.
        </p>
        <button
          onClick={() => nav.goHome()}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-400"
        >
          <ChevronLeft className="h-4 w-4" /> Volver al inicio
        </button>
      </div>
    );
  }

  const category = getCategoryBySlug(article.category);
  const author = getAuthorBySlug(article.author);
  const related = getRelatedArticles(article.slug, article.category, 3);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "es-ES",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch {
        // cancelado
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article
      itemScope
      itemType="https://schema.org/NewsArticle"
      className="mx-auto max-w-3xl px-4 py-6 sm:py-10"
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Migas de pan"
        className="mb-6 flex items-center gap-1.5 text-xs text-zinc-500"
      >
        <button onClick={() => nav.goHome()} className="hover:text-pink-400">
          Inicio
        </button>
        <span>/</span>
        <button
          onClick={() => nav.goCategory(article.category)}
          className="hover:text-pink-400"
        >
          {category?.name}
        </button>
        <span>/</span>
        <span className="line-clamp-1 text-zinc-300">{article.title}</span>
      </nav>

      {/* Cabecera del artículo */}
      <header className="mb-6">
        <button
          onClick={() => nav.goCategory(article.category)}
          className="inline-block rounded px-2 py-1 text-xs font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: category?.color }}
        >
          {category?.name}
        </button>
        <h1
          itemProp="headline"
          className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl"
        >
          {article.title}
        </h1>
        <p
          itemProp="description"
          className="mt-4 text-lg leading-relaxed text-zinc-300"
        >
          {article.excerpt}
        </p>

        {/* Meta info */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-white/5 py-4">
          <div className="flex items-center gap-3">
            {author && (
              <>
                { }
                <img
                  src={author.avatar}
                  alt={`Foto de ${author.name}`}
                  className="h-10 w-10 rounded-full object-cover"
                  itemProp="image"
                />
                <div>
                  <p
                    itemProp="author"
                    className="flex items-center gap-1.5 text-sm font-semibold text-white"
                  >
                    <User className="h-3 w-3 text-pink-400" />
                    {author.name}
                  </p>
                  <p className="text-xs text-zinc-500">{author.role}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <time itemProp="datePublished" dateTime={article.publishedAt}>
                {formattedDate}
              </time>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.readingTime} min de lectura
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1.5 font-medium text-zinc-200 hover:bg-white/10"
              aria-label="Compartir artículo"
            >
              <Share2 className="h-3.5 w-3.5" />
              Compartir
            </button>
          </div>
        </div>
      </header>

      {/* Imagen destacada */}
      <figure className="mb-8 overflow-hidden rounded-xl">
        { }
        <img
          src={article.cover}
          alt={article.coverAlt}
          itemProp="image"
          className="aspect-[16/9] w-full object-cover"
        />
        <figcaption className="mt-2 text-xs text-zinc-500">
          {article.coverAlt}
        </figcaption>
      </figure>

      {/* Anuncio dentro del contenido (top) */}
      <AdSense
        slot="1111111111"
        format="horizontal"
        className="my-8"
        style={{ minHeight: "120px" }}
      />

      {/* Cuerpo del artículo */}
      <div
        itemProp="articleBody"
        className="prose-article space-y-5 text-[17px] leading-relaxed text-zinc-200"
      >
        {article.content.map((paragraph, i) => (
          <p key={i} className="leading-relaxed">
            {i === 0 ? (
              <span className="float-left mr-2 mt-1 text-5xl font-black leading-none text-pink-500">
                {paragraph.charAt(0)}
              </span>
            ) : null}
            {i === 0 ? paragraph.slice(1) : paragraph}
          </p>
        ))}
      </div>

      {/* Anuncio dentro del contenido (bottom) */}
      <AdSense
        slot="2222222222"
        format="horizontal"
        className="my-10"
        style={{ minHeight: "120px" }}
      />

      {/* Tags */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Tag className="h-4 w-4 text-zinc-500" />
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Bio del autor */}
      {author && (
        <aside className="mt-10 rounded-xl border border-white/5 bg-zinc-900/40 p-6">
          <div className="flex items-start gap-4">
            { }
            <img
              src={author.avatar}
              alt={`Foto de ${author.name}`}
              className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-pink-400">
                {author.role}
              </p>
              <h3 className="mt-1 text-lg font-bold text-white">
                {author.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {author.bio}
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* Artículos relacionados */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
            <span className="h-6 w-1.5 rounded bg-pink-500" />
            Artículos relacionados
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* Volver */}
      <div className="mt-10">
        <button
          onClick={() => nav.goHome()}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-pink-500/40 hover:text-pink-400"
        >
          <ChevronLeft className="h-4 w-4" /> Volver al inicio
        </button>
      </div>
    </article>
  );
}
