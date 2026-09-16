"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/components/consent/use-consent";
import { useConsentRegion } from "@/components/consent/use-consent-region";
import { canShowAdSlot } from "@/lib/consent";
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/lib/site";

type AdSlotProps = {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  minHeight?: number;
};

/**
 * Bloque publicitario.
 *
 * Se muestra en dos situaciones:
 *
 * - La persona usuaria ha aceptado publicidad en **nuestro** banner (fuera del
 *   EEE: es nuestro criterio, y sin aceptar no se muestra nada).
 * - El consentimiento lo gestiona la **CMP certificada de Google** (EEE, Reino
 *   Unido y Suiza). Ahí el hueco se pinta siempre y es Google quien decide qué
 *   sirve según la decisión registrada; si no se ha aceptado, no sirve anuncios
 *   personalizados. Si no pintáramos el hueco, esos visitantes no tendrían
 *   anuncios nunca.
 *
 * Sin un identificador de cliente real configurado no se renderiza nada: ni
 * anuncio ni hueco vacío con borde discontinuo. Solo se empuja el anuncio cuando
 * el hueco ya está en el DOM y tiene ancho suficiente, evitando el error clásico
 * "No slot size for availableWidth=0" y el doble push de React en modo estricto.
 */
export function AdSlot({
  slot,
  format = "auto",
  className,
  minHeight = 90,
}: AdSlotProps) {
  const consent = useConsent();
  const region = useConsentRegion();
  const insRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);
  const allowed = ADSENSE_ENABLED && canShowAdSlot(consent, region);

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
