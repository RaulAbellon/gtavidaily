/**
 * Página: sobre nosotros.
 *
 * Componente de servidor extraído del antiguo StaticPage.tsx (1.153 líneas con
 * las seis páginas mezcladas). Los metadatos de la ruta viven en
 * `src/app/sobre/page.tsx`.
 *
 * La historia del sitio tiene que ser comprobable contra el propio archivo: el
 * primer artículo es del 6 de mayo de 2026 y hasta julio se publicaron once
 * piezas. Cualquier fecha de nacimiento que no cuadre con esa lista es una
 * inexactitud que el lector puede detectar en dos clics.
 */
import Link from "next/link";
import { BadgeCheck, FileCheck2, Users } from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import { EDITORIAL_NAME } from "@/lib/site";

/** Enlaces a las páginas de confianza, para no repetirlos en el texto. */
const COMPROMISOS = [
  {
    href: "/politica-editorial",
    title: "Política editorial",
    text: "Cómo se verifica un dato, qué no se publica nunca y cómo se etiqueta lo que no está confirmado.",
  },
  {
    href: "/correcciones",
    title: "Correcciones",
    text: "Cómo pedirnos una corrección, qué plazo asumimos y el registro público de las que ya se han hecho.",
  },
  {
    href: "/financiacion",
    title: "Cómo nos financiamos",
    text: "Sin contenido patrocinado sin señalar ni enlaces pagados, y publicidad separada de la redacción.",
  },
  {
    href: "/equipo",
    title: "Quién hace el sitio",
    text: "El reparto de tareas —documentación, redacción y verificación— detrás de la firma «Redacción».",
  },
] as const;

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
          El primer artículo del sitio es del{" "}
          <strong className="font-semibold text-white">6 de mayo de 2026</strong>
          , sobre la Florida real que hay detrás de Leonida. De mayo a julio
          publicamos once piezas, despacio y sin calendario fijo: anuncios de
          Rockstar, datos de las fichas de tienda, la historia del estudio y las
          declaraciones de sus responsables. El sitio creció a partir de agosto,
          con la campaña de marketing del juego ya en marcha, y en septiembre el
          ritmo se disparó hasta publicar varias piezas al día.
        </p>
        <p>
          Eso último no fue una virtud. Un medio que publica en tandas sobre lo
          mismo acaba repitiéndose y obliga al lector a leer dos veces el mismo
          hecho en dos URLs distintas. Desde octubre trabajamos con el criterio
          contrario:{" "}
          <strong className="font-semibold text-white">
            menos piezas y mejor documentadas
          </strong>
          , un hecho por artículo, sin publicar en tandas ni por cuota diaria.
          Cuando un día no hay nada que aporte algo que no esté ya publicado, no
          se publica nada.
        </p>
        <p>
          El sitio lo edita una redacción independiente con sede en España y
          publica bajo una única firma editorial,{" "}
          <strong className="font-semibold text-white">
            Redacción GTA VI Daily
          </strong>
          . No publicamos nombres ni fichas de redactores: preferimos decirlo
          antes que fingir una plantilla que no existe. Lo que sí publicamos es
          cómo se trabaja —quién documenta, quién escribe y quién verifica antes
          de dar por bueno un dato—, en la{" "}
          <Link
            href="/equipo"
            className="font-semibold text-pink-400 underline-offset-2 hover:underline"
          >
            página de equipo
          </Link>
          . Del contenido responde la redacción; del sitio, su titular, que está
          identificado con nombre, NIF y domicilio en el{" "}
          <Link
            href="/aviso-legal"
            className="font-semibold text-pink-400 underline-offset-2 hover:underline"
          >
            aviso legal
          </Link>
          .
        </p>
        <p>
          Nuestra línea editorial se basa en tres pilares: rigor informativo,
          análisis profundo y respeto por la comunidad. Solo publicamos noticias
          con fuente comprobable, distinguimos en el propio texto entre hechos y
          rumores, y citamos siempre las fuentes originales. En el análisis,
          privilegiamos la profundidad sobre la inmediatez, y siempre damos
          contexto suficiente para que el lector entienda el porqué de cada
          noticia. El método completo está en la{" "}
          <Link
            href="/politica-editorial"
            className="font-semibold text-pink-400 underline-offset-2 hover:underline"
          >
            política editorial
          </Link>
          .
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
          Y cuando nos equivocamos, lo decimos. Cualquiera puede señalar un error
          desde la{" "}
          <Link
            href="/contacto"
            className="font-semibold text-pink-400 underline-offset-2 hover:underline"
          >
            página de contacto
          </Link>
          : el error se corrige, deja una nota visible al pie del artículo
          afectado y se anota en el{" "}
          <Link
            href="/correcciones"
            className="font-semibold text-pink-400 underline-offset-2 hover:underline"
          >
            registro público de correcciones
          </Link>
          . El sitio no acepta contenido patrocinado sin señalar ni enlaces
          pagados; cómo se sostiene está explicado en{" "}
          <Link
            href="/financiacion"
            className="font-semibold text-pink-400 underline-offset-2 hover:underline"
          >
            cómo nos financiamos
          </Link>
          .
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
                fuentes citadas en cada artículo, marcamos lo que es rumor,
                mantenemos la cronología con su fuente y corregimos los errores
                que nos señaláis. El reparto de tareas está en la{" "}
                <Link
                  href="/equipo"
                  className="font-semibold text-pink-400 underline-offset-2 hover:underline"
                >
                  página de equipo
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
          <FileCheck2 className="h-6 w-6 text-pink-500" aria-hidden="true" />
          Nuestros compromisos, por escrito
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {COMPROMISOS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full flex-col rounded-xl border border-white/5 bg-zinc-900/40 p-4 transition-colors hover:border-pink-500/40"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <BadgeCheck
                    className="h-4 w-4 flex-shrink-0 text-pink-400"
                    aria-hidden="true"
                  />
                  {item.title}
                </span>
                <span className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  {item.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
