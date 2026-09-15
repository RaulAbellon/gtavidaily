import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { getLatestArticles } from "@/lib/data";
import { ArticleGrid } from "@/components/site/article-grid";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const latest = getLatestArticles(3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="flex justify-center">
        <SearchX className="h-10 w-10 text-pink-400" aria-hidden="true" />
      </p>
      <h1 className="mt-4 text-3xl font-black text-white">
        No hemos encontrado esa página
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
        Puede que el enlace esté mal escrito o que el contenido se haya movido.
        Prueba a buscar o vuelve al inicio.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-400"
        >
          Ir al inicio
        </Link>
        <Link
          href="/noticias"
          className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-pink-500/40 hover:text-pink-400"
        >
          Ver todas las noticias
        </Link>
      </div>

      <div className="mt-12 text-left">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-pink-400">
          Últimas noticias
        </h2>
        <ArticleGrid articles={latest} />
      </div>
    </div>
  );
}
