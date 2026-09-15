"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sin servicio de telemetría configurado: dejamos rastro en consola.
    console.error("Error de render:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-black text-white">Algo ha ido mal</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        Se ha producido un error inesperado al cargar esta sección. Puedes
        reintentarlo o volver al inicio.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-400"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-pink-500/40 hover:text-pink-400"
        >
          Ir al inicio
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-zinc-600">
          Referencia del error: {error.digest}
        </p>
      )}
    </div>
  );
}
