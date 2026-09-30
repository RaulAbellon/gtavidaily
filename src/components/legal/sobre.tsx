/**
 * Página legal: sobre.
 *
 * Componente de servidor extraído del antiguo StaticPage.tsx (1.153 líneas con
 * las seis páginas mezcladas). Los metadatos de la ruta viven en
 * `src/app/sobre/page.tsx`.
 */
import Link from "next/link";
import { Users } from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import { EDITORIAL_NAME } from "@/lib/site";

export function LegalAbout() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <LegalHeader badge="Sobre nosotros" title="Sobre GTA VI Daily" />

      <div className="prose-article space-y-5 text-[17px] leading-relaxed text-zinc-200">
        <p>
          GTA VI Daily es un medio digital independiente en español dedicado a
          cubrir todo lo relacionado con Grand Theft Auto VI, el próximo gran
          lanzamiento de Rockstar Games. Seguimos de cerca cada anuncio,
          filtración y rumor para ofrecer a la comunidad hispanohablante la
          información más completa y rigurosa posible.
        </p>
        <p>
          Nacimos en agosto de 2026 con la intención de cubrir en español lo que
          hasta ahora solo se contaba en inglés: los anuncios de Rockstar, los
          datos de las fichas de tienda, las declaraciones del estudio y todo lo
          que rodea al lanzamiento del 19 de noviembre. El sitio lo edita una
          redacción independiente con sede en España y publica bajo una única
          firma editorial,{" "}
          <strong className="font-semibold text-white">
            Redacción GTA VI Daily
          </strong>
          . No publicamos nombres ni fichas de redactores: preferimos decirlo
          antes que fingir una plantilla que no existe.
        </p>
        <p>
          Nuestra línea editorial se basa en tres pilares: rigor informativo,
          análisis profundo y respeto por la comunidad. Solo publicamos noticias
          verificadas, distinguimos claramente entre hechos y rumores, y citamos
          siempre las fuentes originales. En el análisis, privilegiamos la
          profundidad sobre la inmediatez, y siempre damos contexto suficiente
          para que el lector entienda el porqué de cada noticia.
        </p>
        <p>
          Eso incluye decir lo que no se sabe. Cuando no hay fuente oficial para
          un dato —el tamaño de la descarga, la hora exacta de la precarga, el
          reparto de voces— lo escribimos como lo que es, en lugar de rellenarlo
          con una cifra que suene bien. Hay dos páginas que existen justo para
          eso: la{" "}
          <Link
            href="/cronologia"
            className="font-semibold text-pink-400 underline-offset-2 hover:underline"
          >
            cronología de confirmaciones
          </Link>
          , con la fuente primaria de cada línea, y la{" "}
          <Link
            href="/desbloqueo"
            className="font-semibold text-pink-400 underline-offset-2 hover:underline"
          >
            tabla de desbloqueo por países
          </Link>
          , con lo que está calculado y lo que está sin confirmar, separado.
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
