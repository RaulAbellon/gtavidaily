/**
 * Cabecera común de las páginas legales.
 *
 * Estaba copiada seis veces dentro de `StaticPage.tsx`, con tres variantes de
 * párrafo final (ninguno, "Última actualización" o una entradilla).
 */
export function LegalHeader({
  badge,
  title,
  updatedAt,
  intro,
}: {
  badge: string;
  title: string;
  updatedAt?: string;
  intro?: string;
}) {
  return (
    <header className="mb-8">
      <span className="inline-block rounded bg-pink-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
        {badge}
      </span>
      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
        {title}
      </h1>
      {updatedAt && (
        <p className="mt-2 text-sm text-zinc-500">
          {`Última actualización: ${updatedAt}`}
        </p>
      )}
      {intro && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{intro}</p>
      )}
    </header>
  );
}
