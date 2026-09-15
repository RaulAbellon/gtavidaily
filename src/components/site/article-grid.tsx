import { ArticleCard } from "@/components/site/article-card";
import type { Article } from "@/lib/data";

/** Rejilla de artículos reutilizable. */
export function ArticleGrid({
  articles,
  columns = 3,
  prioritizeFirst = 0,
}: {
  articles: Article[];
  columns?: 2 | 3;
  prioritizeFirst?: number;
}) {
  const gridClass =
    columns === 2
      ? "grid gap-6 sm:grid-cols-2"
      : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClass}>
      {articles.map((article, index) => (
        <ArticleCard
          key={article.slug}
          article={article}
          priority={index < prioritizeFirst}
        />
      ))}
    </div>
  );
}
