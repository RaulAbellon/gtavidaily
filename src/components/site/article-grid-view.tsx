import type { ArticleView } from "@/lib/article-view";
import { ArticleCardView } from "@/components/site/article-card-view";

/**
 * Rejilla de artículos a partir de vistas ya resueltas.
 *
 * Es la versión que pueden usar los componentes de cliente (paginación de
 * `/noticias`, resultados de `/buscar`). `ArticleGrid` sigue existiendo para el
 * resto del sitio y no ha cambiado de API.
 */
export function ArticleGridView({
  views,
  columns = 3,
  prioritizeFirst = 0,
}: {
  views: ArticleView[];
  columns?: 2 | 3;
  prioritizeFirst?: number;
}) {
  const gridClass =
    columns === 2
      ? "grid gap-6 sm:grid-cols-2"
      : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClass}>
      {views.map((view, index) => (
        <ArticleCardView
          key={view.slug}
          view={view}
          priority={index < prioritizeFirst}
        />
      ))}
    </div>
  );
}
