import type { Metadata } from "next";
import { Suspense } from "react";
import { NoticiasList } from "@/app/noticias/noticias-list";
import { ArticleGridView } from "@/components/site/article-grid-view";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { toArticleView } from "@/lib/article-view";
import { getLatestArticles } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";

const PER_PAGE = 12;

/**
 * Listado completo de noticias.
 *
 * **Antes** era dinámica (`ƒ`): leía `?pagina=` en el servidor y renderizaba la
 * página que tocara. En Cloudflare eso significaba renderizar en el Worker cada
 * vez que la URL no estaba en la caché del borde, con el límite de 10 ms de CPU
 * del plan gratuito.
 *
 * **Ahora** se genera una sola vez en el build con todas las tarjetas aplanadas
 * y la paginación la hace el navegador (`NoticiasList`). El HTML de la primera
 * página —la que enlaza el sitemap y la que ven los rastreadores— sale completo
 * del build, sin JavaScript de por medio.
 *
 * Nota de SEO: el canonical es siempre `/noticias`, también en
 * `/noticias?pagina=N`. Antes cada página se declaraba canónica de sí misma, pero
 * con un único fichero estático no hay forma de emitir metadatos distintos por
 * consulta; lo importante (que las 96 noticias sean rastreables) se resuelve con
 * el sitemap, las categorías y la propia página 1, no con las páginas de
 * paginación.
 */
export const metadata: Metadata = {
  title: "Todas las noticias",
  description: `Listado completo de noticias sobre Grand Theft Auto VI publicadas en ${SITE_NAME}.`,
  alternates: { canonical: "/noticias" },
};

export default function NoticiasPage() {
  const views = getLatestArticles().map(toArticleView);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Noticias" }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-black text-white sm:text-4xl">
          Todas las noticias
        </h1>
      </header>

      {/* `useSearchParams` obliga a envolver el componente en un límite de
          Suspense: sin él, Next no puede prerenderizar la página. El respaldo es
          la **primera página completa** ya renderizada, así que el HTML estático
          siempre lleva las 12 primeras tarjetas aunque Next decida renderizar
          este árbol en el cliente. */}
      <Suspense
        fallback={
          <>
            <p className="mb-8 text-sm text-zinc-400">
              {views.length} artículos publicados · página 1 de{" "}
              {Math.max(1, Math.ceil(views.length / PER_PAGE))}
            </p>
            <ArticleGridView views={views.slice(0, PER_PAGE)} prioritizeFirst={3} />
          </>
        }
      >
        <NoticiasList views={views} perPage={PER_PAGE} />
      </Suspense>
    </div>
  );
}
