"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { ArticleGridView } from "@/components/site/article-grid-view";
import { useHydrated } from "@/components/site/use-hydrated";
import type { SearchIndexEntry } from "@/lib/article-view";
import {
  MIN_QUERY_LENGTH,
  prepareSearchDoc,
  rankPreparedSearches,
} from "@/lib/search";

/**
 * Buscador del navegador.
 *
 * El sitio es estático, así que `/buscar` no puede filtrar en el servidor: esta
 * página se genera una vez y es este componente el que lee `?q=` y busca. El
 * texto de los artículos se descarga aparte, de `/buscar/indice.json` (un
 * fichero estático), y **solo cuando hay una consulta**: quien entra a mirar no
 * se descarga el índice.
 *
 * El motor es el mismo que usa el servidor (`@/lib/search`), así que los
 * resultados y su orden coinciden con los de las pruebas.
 */
export function SearchResults({
  trending,
  categories,
}: {
  trending: { slug: string; title: string }[];
  categories: { slug: string; name: string }[];
}) {
  const searchParams = useSearchParams();
  const hydrated = useHydrated();
  const [index, setIndex] = useState<SearchIndexEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  // El primer render (el que se genera en el build) no puede depender de la
  // URL: si dependiera, el HTML estático y el hidratado no coincidirían.
  const query = hydrated ? (searchParams.get("q") ?? "").trim() : "";
  const searching = query.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!searching || index !== null || failed) return;
    let cancelled = false;

    fetch("/buscar/indice.json")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<SearchIndexEntry[]>;
      })
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [searching, index, failed]);

  // Normalizar 96 artículos es trabajo de una sola vez; se reutiliza en cada
  // pulsación de tecla.
  const prepared = useMemo(
    () => (index ?? []).map(prepareSearchDoc),
    [index]
  );
  const results = useMemo(
    () => rankPreparedSearches(prepared, query, 40),
    [prepared, query]
  );

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white sm:text-4xl">
          {searching ? "Resultados de búsqueda" : "Buscar noticias"}
        </h1>
        {searching ? (
          <p className="mt-2 text-sm text-zinc-400">
            {index === null && !failed
              ? `Buscando «${query}»…`
              : failed
                ? `No se ha podido cargar el índice de búsqueda. Prueba a recargar la página.`
                : results.length === 0
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
        <ArticleGridView views={results} prioritizeFirst={3} />
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
          {trending.length > 0 && (
            <>
              <h2 className="mt-8 text-sm font-bold uppercase tracking-widest text-pink-400">
                Tendencias
              </h2>
              <ul className="mt-3 space-y-2">
                {trending.map((article) => (
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
    </>
  );
}
