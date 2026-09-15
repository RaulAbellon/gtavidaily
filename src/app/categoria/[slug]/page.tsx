import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleGrid } from "@/components/site/article-grid";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { getArticlesByCategory, getCategoryBySlug } from "@/lib/data";
import { getAllCategorySlugs } from "@/lib/queries";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Categoría no encontrada" };

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categoria/${category.slug}` },
    openGraph: {
      type: "website",
      title: `${category.name} · ${SITE_NAME}`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description: category.description,
            url: absoluteUrl(`/categoria/${category.slug}`),
            isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
          }),
        }}
      />

      <Breadcrumbs
        items={[{ label: "Inicio", href: "/" }, { label: category.name }]}
      />

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
          {articles.length} artículo{articles.length === 1 ? "" : "s"} en esta
          sección
        </p>
      </header>

      <AdSlot slot="7777777777" format="horizontal" className="mb-8" minHeight={100} />

      {articles.length === 0 ? (
        <div className="rounded-lg border border-white/5 bg-zinc-900/40 p-12 text-center">
          <p className="text-zinc-400">
            Todavía no hay artículos en esta categoría.
          </p>
          <Link
            href="/noticias"
            className="mt-4 inline-block text-sm font-semibold text-pink-400 hover:text-pink-300"
          >
            Ver todas las noticias
          </Link>
        </div>
      ) : (
        <ArticleGrid articles={articles} prioritizeFirst={3} />
      )}

    </div>
  );
}
