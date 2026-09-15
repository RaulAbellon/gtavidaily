import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleGrid } from "@/components/site/article-grid";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { getLatestArticles } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";

const PER_PAGE = 12;

type PageProps = {
  searchParams: Promise<{ pagina?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { pagina } = await searchParams;
  const page = Math.max(1, Number.parseInt(pagina ?? "1", 10) || 1);
  const canonical = page > 1 ? `/noticias?pagina=${page}` : "/noticias";

  return {
    title: page > 1 ? `Todas las noticias · página ${page}` : "Todas las noticias",
    description: `Listado completo de noticias sobre Grand Theft Auto VI publicadas en ${SITE_NAME}.`,
    alternates: { canonical },
  };
}

export default async function NoticiasPage({ searchParams }: PageProps) {
  const { pagina } = await searchParams;
  const requested = Math.max(1, Number.parseInt(pagina ?? "1", 10) || 1);

  const all = getLatestArticles();
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const current = Math.min(requested, totalPages);
  const articles = all.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Noticias" }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-black text-white sm:text-4xl">
          Todas las noticias
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {all.length} artículos publicados · página {current} de {totalPages}
        </p>
      </header>

      <AdSlot slot="1212121212" format="horizontal" className="mb-8" minHeight={100} />

      <ArticleGrid articles={articles} prioritizeFirst={3} />

      {totalPages > 1 && (
        <nav
          aria-label="Paginación"
          className="mt-10 flex items-center justify-center gap-3"
        >
          {current > 1 && (
            <Link
              href={current - 1 === 1 ? "/noticias" : `/noticias?pagina=${current - 1}`}
              className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-pink-500/40 hover:text-pink-400"
            >
              Anterior
            </Link>
          )}
          <span className="text-sm text-zinc-500">
            {current} / {totalPages}
          </span>
          {current < totalPages && (
            <Link
              href={`/noticias?pagina=${current + 1}`}
              className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-pink-500/40 hover:text-pink-400"
            >
              Siguiente
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
