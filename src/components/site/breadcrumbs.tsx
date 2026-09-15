import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** Migas de pan con enlaces reales (antes eran botones que cambiaban estado). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan" className="mb-6 text-xs text-zinc-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-pink-400">
                {item.label}
              </Link>
            ) : (
              <span className="line-clamp-1 text-zinc-300">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
