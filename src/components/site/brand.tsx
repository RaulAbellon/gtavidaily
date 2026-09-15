import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/** Marca del sitio: un único nombre en todo el producto (antes convivían
 *  "GTA VI Daily" y "GTA VI HUB" en el mismo header). */
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2"
      aria-label={`Ir al inicio de ${SITE_NAME}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-pink-500 to-purple-600 font-black text-white shadow-[0_0_20px_-2px] shadow-pink-500/50 transition-transform group-hover:scale-105">
        VI
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-tight text-white">
            GTA <span className="text-pink-400">VI</span> Daily
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400">
            {SITE_TAGLINE.replace("Noticias de ", "").slice(0, 24)}
          </span>
        </span>
      )}
    </Link>
  );
}
