import { Search } from "lucide-react";

/**
 * Buscador real: un formulario GET que lleva a /buscar?q=...
 * Antes el botón ignoraba el texto y navegaba siempre a la misma categoría.
 */
export function SearchForm({
  defaultValue = "",
  autoFocus = false,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
}) {
  return (
    <form action="/buscar" method="get" role="search" className="flex items-center gap-2">
      <label htmlFor="site-search" className="sr-only">
        Buscar noticias
      </label>
      <Search className="h-4 w-4 text-zinc-500" aria-hidden="true" />
      <input
        id="site-search"
        type="search"
        name="q"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder="Buscar noticias de GTA VI..."
        className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md bg-pink-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-pink-400"
      >
        Buscar
      </button>
    </form>
  );
}
