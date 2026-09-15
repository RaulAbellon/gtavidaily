import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { ArticleGrid } from "@/components/site/article-grid";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { getPopulatedCategories, searchArticles } from "@/lib/queries";
import { getTrendingArticles } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  return {
    title: query ? `Búsqueda: ${query}` : "Buscar noticias",
    description: query
      ? `Resultados de búsqueda para «${query}» en ${SITE_NAME}.`
      : `Busca noticias, análisis y rumores sobre Grand Theft Auto VI en ${SITE_NAME}.`,
    alternates: { canonical: "/buscar" },
    // Las páginas de resultados no aportan valor en el índice.
    robots: query ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function BuscarPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query.length >= 2 ? searchArticles(query, 40) : [];
  const suggestions = getTrendingArticles().slice(0, 4);
  const categories = getPopulatedCategories().slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Búsqueda" }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-black text-white sm:text-4xl">
          {query ? "Resultados de búsqueda" : "Buscar noticias"}
        </h1>
        {query ? (
          <p className="mt-2 text-sm text-zinc-400">
            {results.length === 0
              ? `No hay resultados para «${query}».`
              : `${results.length} resultado${results.length === 1 ? "" : "s"} para «${query}».`}
          </p>
        ) : (
          <p className="mt-2 text-sm text-zinc-400">
            Escribe al menos dos caracteres en el buscador de la cabecera.
          </p>
        )}
      </header>

      {results.length > 0 ? (
        <ArticleGrid articles={results} prioritizeFirst={3} />
      ) : (
        <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-8">
          <p className="flex items-center gap-2 text-zinc-300">
            <SearchX className="h-5 w-5 text-pink-400" aria-hidden="true" />
            {query
              ? "Prueba con otro término o explora estas secciones:"
              : "Explora estas secciones:"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categoria/${category.slug}`}
                className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:border-pink-500/40 hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
          {suggestions.length > 0 && (
            <>
              <h2 className="mt-8 text-sm font-bold uppercase tracking-widest text-pink-400">
                Tendencias
              </h2>
              <ul className="mt-3 space-y-2">
                {suggestions.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/articulo/${article.slug}`}
                      className="text-sm text-zinc-300 underline-offset-2 hover:text-white hover:underline"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
