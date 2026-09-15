"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/components/consent/use-consent";
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/lib/site";

type AdSlotProps = {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  minHeight?: number;
};

/**
 * Bloque publicitario condicionado al consentimiento.
 *
 * Si no hay consentimiento de publicidad o no hay un identificador de cliente
 * real configurado, **no se renderiza nada**: ni anuncio, ni hueco vacío con
 * borde discontinuo (antes se pintaban nueve). Solo cuando el hueco ya está en
 * el DOM y tiene ancho suficiente se empuja el anuncio, evitando el error
 * clásico de AdSense "No slot size for availableWidth=0" y el doble push que
 * provoca React en modo estricto.
 */
export function AdSlot({
  slot,
  format = "auto",
  className,
  minHeight = 90,
}: AdSlotProps) {
  const consent = useConsent();
  const insRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);
  const allowed = ADSENSE_ENABLED && consent?.marketing === true;

  useEffect(() => {
    if (!allowed) {
      pushed.current = false;
      return;
    }
    if (pushed.current) return;

    const element = insRef.current;
    if (!element) return;

    const width = element.offsetWidth || element.parentElement?.offsetWidth || 0;
    if (width < 100) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // El script de AdSense aún no está disponible; se reintentará en el
      // siguiente render sin marcarlo como enviado.
    }
  }, [allowed]);

  if (!allowed) return null;

  return (
    <aside className={className} aria-label="Publicidad">
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-zinc-500">
        Publicidad
      </span>
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: "block", minHeight }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
