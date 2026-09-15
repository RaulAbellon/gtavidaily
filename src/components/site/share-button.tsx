"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/**
 * Compartir el artículo concreto (antes compartía siempre la raíz del sitio,
 * porque no existían URLs por artículo) y con confirmación visible al copiar.
 */
export function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // La persona usuaria canceló: no hay nada que hacer.
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1.5 font-medium text-zinc-200 transition-colors hover:bg-white/10"
      aria-label="Compartir artículo"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
          Copiado
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          Compartir
        </>
      )}
    </button>
  );
}
