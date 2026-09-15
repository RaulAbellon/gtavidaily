/**
 * Página legal: sobre.
 *
 * Componente de servidor extraído del antiguo StaticPage.tsx (1.153 líneas con
 * las seis páginas mezcladas). Los metadatos de la ruta viven en
 * `src/app/sobre/page.tsx`.
 */
import { Users } from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import {
  EDITORIAL_NAME,
} from "@/lib/site";

export function LegalAbout() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <LegalHeader badge="Sobre nosotros" title="Sobre GTA VI Daily" />

      <div className="prose-article space-y-5 text-[17px] leading-relaxed text-zinc-200">
        <p>
          GTA VI Daily es un medio digital independiente dedicado a cubrir todo
          lo relacionado con Grand Theft Auto VI, el próximo gran lanzamiento
          de Rockstar Games. Nuestro equipo de periodistas y analistas sigue
          de cerca cada anuncio, filtración y rumor para ofrecer a la
          comunidad hispanohablante la información más completa y rigurosa.
        </p>
        <p>
          Nacimos en agosto de 2026 con la ilusión de crear un espacio de
          referencia para los fans de la saga en español. Tras años consumiendo
          contenidos en inglés y frustrados por la falta de medios de calidad
          en nuestro idioma, decidimos dar el paso y construir el sitio que
          nos habría gustado leer. Hoy somos un equipo de cuatro personas
          apasionadas por los videojuegos, los mundos abiertos y la saga GTA
          en particular.
        </p>
        <p>
          Nuestra línea editorial se basa en tres pilares: rigor informativo,
          análisis profundo y respeto por la comunidad. Solo publicamos
          noticias verificadas, distinguimos claramente entre hechos y rumores,
          y citamos siempre las fuentes originales. En el análisis,
          privilegiamos la profundidad sobre la inmediatez, y siempre damos
          contexto suficiente para que el lector entienda el porqué de cada
          noticia.
        </p>
        <p>
          No estamos afiliados con Rockstar Games ni con Take-Two Interactive.
          Grand Theft Auto y todos los nombres relacionados son marcas
          registradas de sus propietarios. Nuestro contenido se publica bajo
          fair use y con propósito informativo y crítico, en línea con la
          tradición del periodismo de videojuegos.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
          <Users className="h-6 w-6 text-pink-500" aria-hidden="true" />
          Quién está detrás
        </h2>
        <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-5">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-pink-500/15 text-lg font-black text-pink-400"
            >
              VI
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-pink-400">
                Equipo editorial
              </p>
              <h3 className="mt-1 font-bold text-white">{EDITORIAL_NAME}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                Cobertura en español de Grand Theft Auto VI. Publicamos con las
                fuentes citadas en cada artículo, marcamos lo que es rumor y
                corregimos los errores que nos señaláis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
