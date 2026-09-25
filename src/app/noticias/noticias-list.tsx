"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleGridView } from "@/components/site/article-grid-view";
import { useHydrated } from "@/components/site/use-hydrated";
import type { ArticleView } from "@/lib/article-view";

/**
 * Listado paginado en el navegador.
 *
 * Con el sitio estático no hay servidor que lea `?pagina=N`: la página se
 * genera una vez con **todas** las tarjetas aplanadas y este componente corta la
 * página que toca. Se conserva la URL de siempre (`/noticias?pagina=2`), así que
 * los enlaces, el botón "atrás" del navegador y lo que ya estuviera indexado
 * siguen funcionando igual.
 *
 * La primera página se ve en el HTML generado en el build (y en el primer
 * render), así que los rastreadores que no ejecutan JavaScript siguen viendo
 * contenido real, no un hueco vacío.
 */
export function NoticiasList({
  views,
  perPage,
}: {
  views: ArticleView[];
  perPage: number;
}) {
  const searchParams = useSearchParams();
  const hydrated = useHydrated();

  // El primer render (el del build) es siempre la página 1: si dependiera de la
  // URL, el HTML estático y el hidratado no coincidirían.
  const requested = hydrated
    ? Math.max(1, Number.parseInt(searchParams.get("pagina") ?? "1", 10) || 1)
    : 1;

  const totalPages = Math.max(1, Math.ceil(views.length / perPage));
  const current = Math.min(requested, totalPages);
  const page = views.slice((current - 1) * perPage, current * perPage);

  return (
    <>
      <p className="mb-8 text-sm text-zinc-400">
        {views.length} artículos publicados · página {current} de {totalPages}
      </p>

      <AdSlot slot="1212121212" format="horizontal" className="mb-8" minHeight={100} />

      <ArticleGridView views={page} prioritizeFirst={3} />

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
    </>
  );
}
