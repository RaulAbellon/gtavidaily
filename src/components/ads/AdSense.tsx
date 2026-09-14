"use client";

import { useEffect, useRef } from "react";

type AdSenseProps = {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Componente de bloque publicitario de Google AdSense.
 *
 * El ID de cliente (ca-pub-XXXX) se inyecta una sola vez desde el <head>
 * mediante el script de AdSense en layout.tsx. Aquí solo se define el slot
 * y el formato, que son los que cambian entre posiciones.
 *
 * Nota: en desarrollo no se renderiza el anuncio real, pero sí el contenedor
 * para que el layout se vea correctamente. Cuando el sitio sea aprobado por
 * AdSense y el script cargue con un ca-pub real, los anuncios aparecerán.
 */
export function AdSense({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style,
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // AdSense no inicializado todavía (entorno de desarrollo)
    }
  }, []);

  return (
    <div
      className={`ad-container relative overflow-hidden rounded-lg border border-dashed border-pink-500/30 bg-zinc-950/60 ${className}`}
      style={style}
      aria-label="Espacio publicitario"
    >
      <ins
        ref={adRef}
        className="adsbygoogle block min-h-[90px]"
        style={{ display: "block", width: "100%", ...style }}
        data-ad-client={
          process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-0000000000000000"
        }
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
      <span className="pointer-events-none absolute left-2 top-1 text-[10px] uppercase tracking-widest text-zinc-500">
        Publicidad
      </span>
    </div>
  );
}
