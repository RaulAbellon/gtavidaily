import { ArticleCardView } from "@/components/site/article-card-view";
import { toArticleView } from "@/lib/article-view";
import type { Article } from "@/lib/data";

/**
 * Tarjeta de artículo para componentes de servidor.
 *
 * Sigue recibiendo el artículo completo (la API no ha cambiado y la usan la
 * portada, las categorías, los artículos relacionados y el 404), pero todo el
 * marcado vive en `ArticleCardView`, que solo necesita la vista aplanada. Así el
 * mismo diseño se puede pintar desde el servidor y desde el navegador sin
 * duplicarlo.
 */
export function ArticleCard({
  article,
  variant = "default",
  priority = false,
}: {
  article: Article;
  variant?: "default" | "featured" | "compact" | "horizontal";
  priority?: boolean;
}) {
  return (
    <ArticleCardView
      view={toArticleView(article)}
      variant={variant}
      priority={priority}
    />
  );
}
