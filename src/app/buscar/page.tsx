import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/app/buscar/search-results";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { getTrendingArticles } from "@/lib/data";
import { getPopulatedCategories } from "@/lib/queries";
import { SITE_NAME } from "@/lib/site";

/**
 * Buscador.
 *
 * **Antes** esta página era dinámica (`ƒ`): leía `?q=` en el servidor y
 * renderizaba los resultados. Con el plan gratuito de Cloudflare eso era
 * exactamente lo que rompía —cada búsqueda con la caché fría se pasaba de los
 * 10 ms de CPU y Cloudflare cortaba la conexión—.
 *
 * **Ahora** la página es un fichero estático y el filtrado ocurre en el
 * navegador (`SearchResults`), con el índice de `/buscar/indice.json`, que
 * también es estático. No hay nada que renderizar en el servidor: el mismo HTML
 * sirve para cualquier consulta y funciona igual en los tres hostings.
 *
 * `robots: noindex` se aplica a **toda** la ruta, no solo a las URLs con `?q=`:
 * el HTML es el mismo para todas las consultas, así que no hay forma de marcar
 * unas sí y otras no. El buscador sigue siendo rastreable a propósito (si se
 * bloqueara en `robots.txt`, Google no podría leer este `noindex`).
 */
export const metadata: Metadata = {
  title: "Buscar noticias",
  description: `Busca noticias, análisis y rumores sobre Grand Theft Auto VI en ${SITE_NAME}.`,
  alternates: { canonical: "/buscar" },
  // Las páginas de resultados no aportan valor en el índice.
  robots: { index: false, follow: true },
};

export default function BuscarPage() {
  const trending = getTrendingArticles()
    .slice(0, 4)
    .map((article) => ({ slug: article.slug, title: article.title }));
  const categories = getPopulatedCategories()
    .slice(0, 6)
    .map((category) => ({ slug: category.slug, name: category.name }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Búsqueda" }]} />

      {/* `useSearchParams` obliga a envolver el componente en un límite de
          Suspense: sin él, Next no puede prerenderizar la página. */}
      <Suspense
        fallback={
          <header className="mb-8">
            <h1 className="text-3xl font-black text-white sm:text-4xl">
              Buscar noticias
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Escribe al menos dos caracteres en el buscador de la cabecera.
            </p>
          </header>
        }
      >
        <SearchResults trending={trending} categories={categories} />
      </Suspense>
    </div>
  );
}
