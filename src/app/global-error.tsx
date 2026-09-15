"use client";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center text-zinc-100 antialiased">
        <h1 className="text-2xl font-black text-white">
          El sitio no ha podido cargarse
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
          Ha ocurrido un error grave. Vuelve a intentarlo en unos segundos.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-400"
        >
          Reintentar
        </button>
        {error.digest && (
          <p className="mt-6 text-xs text-zinc-600">
            Referencia: {error.digest}
          </p>
        )}
      </body>
    </html>
  );
}
