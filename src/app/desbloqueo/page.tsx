import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Download,
  Globe2,
  HelpCircle,
} from "lucide-react";
import { UnlockTable } from "@/app/desbloqueo/unlock-table";
import { ArticleGrid } from "@/components/site/article-grid";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import {
  REFERENCE_LABEL,
  UNLOCK_EXTREMES,
  UNLOCK_FAQ,
  UNLOCK_PENDIENTE,
  getUnlockTable,
} from "@/lib/desbloqueo";
import { getArticleBySlug, type Article } from "@/lib/data";
import { EDITORIAL_NAME, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "GTA VI: hora de desbloqueo por países el 19 de noviembre",
  description:
    "El juego se abre a medianoche hora local del 19 de noviembre de 2026, no a una hora única: hasta 19 horas de diferencia entre Nueva Zelanda y México. Tabla por país y región con la referencia UTC, la hora en España y lo que sigue sin confirmar.",
  alternates: { canonical: "/desbloqueo" },
  keywords: [
    "hora de desbloqueo GTA VI",
    "GTA VI 19 de noviembre hora",
    "a qué hora sale GTA 6",
    "desbloqueo por países GTA VI",
    "GTA VI medianoche local",
  ],
  openGraph: {
    type: "article",
    url: "/desbloqueo",
    title: "GTA VI: hora de desbloqueo por países el 19 de noviembre",
    description:
      "Tabla consultable con la hora de apertura de GTA VI en cada huso horario, la referencia UTC y la hora peninsular española, más lo que no está confirmado.",
    publishedTime: "2026-09-30T08:00:00.000Z",
    modifiedTime: "2026-09-30T08:00:00.000Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA VI: hora de desbloqueo por países el 19 de noviembre",
    description:
      "Medianoche local en cada país, hasta 19 horas de diferencia. Tabla por husos con referencia UTC y hora en España.",
  },
};

/** Artículos propios que se enlazan desde la página. */
const ARTICULOS_RELACIONADOS = [
  "gta-vi-como-evitar-spoilers-desbloqueo-por-paises",
  "jugar-gta-vi-medianoche-19-noviembre-guia",
  "gta-vi-pre-carga-12-noviembre-confirmada",
  "gta-vi-precarga-12-noviembre-que-preparar-antes",
  "checklist-antes-de-la-predescarga",
  "comunidad-gta-vi-en-espanol-y-antispolier",
];

const FUENTES_HORA = [
  {
    name: "NME — «Grand Theft Auto 6: what time does it launch worldwide?»",
    url: "https://www.nme.com/news/gaming-news/grand-theft-auto-6-what-time-launch-worldwide-3967520",
  },
  {
    name: "Vandal — GTA 6 confirma la hora exacta de su lanzamiento",
    url: "https://vandal.elespanol.com/noticia/2026250032/gta-6-confirma-la-hora-exacta-para-su-lanzamiento-en-espana-y-el-resto-del-mundo/",
  },
  {
    name: "Gematsu — comunicado de reservas: la precarga abre el 12 de noviembre",
    url: "https://www.gematsu.com/2026/06/grand-theft-auto-vi-pricing-ultimate-edition-and-pre-order-bonuses-announced",
  },
  {
    name: "Rockstar Games — página oficial de GTA VI",
    url: "https://www.rockstargames.com/VI",
  },
];

/**
 * Datos estructurados.
 *
 * `WebPage` + `ItemList` para la tabla (cada fila con su hora en ISO 8601, que
 * es lo que puede leer un asistente) y `FAQPage` con exactamente las mismas
 * respuestas que se ven en pantalla.
 */
function buildJsonLd(rows: ReturnType<typeof getUnlockTable>) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/desbloqueo"),
        url: absoluteUrl("/desbloqueo"),
        name: "GTA VI: hora de desbloqueo por países el 19 de noviembre",
        description:
          "Tabla de la hora de desbloqueo de Grand Theft Auto VI por país y región el 19 de noviembre de 2026, con la referencia UTC y la hora peninsular española.",
        inLanguage: "es",
        datePublished: "2026-09-30T08:00:00.000Z",
        dateModified: "2026-09-30T08:00:00.000Z",
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: EDITORIAL_NAME },
        citation: FUENTES_HORA.map((source) => source.url),
        isBasedOn: ARTICULOS_RELACIONADOS.map((slug) =>
          absoluteUrl(`/articulo/${slug}`),
        ),
        mainEntity: {
          "@type": "ItemList",
          name: "Hora de desbloqueo de GTA VI por huso horario",
          numberOfItems: rows.length,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: rows.map((row, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `${row.region} — desbloqueo de GTA VI`,
            description: `El juego se abre a las 00:00 del 19 de noviembre de 2026 en ${row.region} (${row.offsetLabel}). Equivale a ${row.utc}: ${row.advantageLabel} respecto a ${REFERENCE_LABEL}.`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: UNLOCK_FAQ.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer },
        })),
      },
    ],
  };
}

export default function DesbloqueoPage() {
  const rows = getUnlockTable();
  const articulos = ARTICULOS_RELACIONADOS.map((slug) =>
    getArticleBySlug(slug),
  ).filter((article): article is Article => Boolean(article));
  const verificado = rows.filter(
    (row) => row.offsetStatus === "verificado",
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(rows)) }}
      />

      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Hora de desbloqueo" },
        ]}
      />

      <header className="mb-8">
        <span className="inline-block rounded bg-pink-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Consulta
        </span>
        <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
          GTA VI: hora de desbloqueo por países el 19 de noviembre
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-300">
          El juego no se abre a una hora única mundial: se abre a las{" "}
          <strong className="font-semibold text-white">
            00:00 del jueves 19 de noviembre de 2026 en la hora local de cada
            país
          </strong>
          . Por eso hay hasta{" "}
          <strong className="font-semibold text-white">
            {UNLOCK_EXTREMES.spreadHours} horas de diferencia
          </strong>{" "}
          entre quien juega primero y quien juega último. Esta tabla ordena los
          husos de la primera a la última apertura.
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-zinc-900/40 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-300">
              <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
              Abre primero
            </dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {UNLOCK_EXTREMES.first}
            </dd>
            <dd className="text-xs text-zinc-500">
              11:00 UTC del 18 de noviembre
            </dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-zinc-900/40 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Abre último
            </dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {UNLOCK_EXTREMES.last}
            </dd>
            <dd className="text-xs text-zinc-500">
              06:00 UTC del 19 de noviembre
            </dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-zinc-900/40 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-pink-400">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              Referencia de la tabla
            </dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {REFERENCE_LABEL}
            </dd>
            <dd className="text-xs text-zinc-500">
              {rows.length} husos · {verificado} con desfase verificado
            </dd>
          </div>
        </dl>
      </header>

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-300">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          De dónde sale cada número de esta tabla
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-zinc-300">
          <li>
            <strong className="text-white">La regla es de Rockstar.</strong> La
            compañía la confirmó a través de la ficha de PlayStation Store: el
            juego se abre a medianoche local del 19 de noviembre, no a una hora
            mundial.
          </li>
          <li>
            <strong className="text-white">
              Las horas UTC y peninsulares son cálculo nuestro.
            </strong>{" "}
            No son una tabla publicada por Rockstar: salen de aplicar esa regla
            al desfase horario oficial de cada territorio. Cada fila dice si ese
            desfase está verificado o pendiente de confirmar.
          </li>
          <li>
            <strong className="text-white">
              La hora local siempre es 00:00.
            </strong>{" "}
            Lo que cambia entre países no es la hora del reloj, es el momento en
            que ese reloj marca la medianoche. Por eso la columna útil para
            comparar es la de referencia UTC.
          </li>
          <li>
            Si solo quieres saber si vas a comer spoilers antes de jugar, mira
            la columna «respecto a España»: un valor en cian significa que ese
            país abre <strong className="text-white">antes</strong> que España.
          </li>
        </ul>
      </div>

      <section className="mt-8" aria-labelledby="tabla">
        <h2
          id="tabla"
          className="mb-4 flex items-center gap-2 text-2xl font-black text-white"
        >
          <span aria-hidden="true" className="h-6 w-1.5 rounded bg-pink-500" />
          Tabla de desbloqueo
        </h2>
        <UnlockTable rows={rows} />
        <p className="mt-4 text-xs leading-relaxed text-zinc-500">
          En pantallas estrechas la tabla se desplaza en horizontal. La fecha de
          referencia es el jueves 19 de noviembre de 2026; las filas marcadas
          con «18 de noviembre» en UTC corresponden a husos que van por delante
          y que a esa hora aún no han llegado al día 19 en su calendario local.
        </p>
      </section>

      <section className="mt-10 rounded-xl border border-white/5 bg-zinc-900/40 p-5 sm:p-6">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-black text-white">
          <Clock className="h-5 w-5 text-pink-500" aria-hidden="true" />
          La noche del lanzamiento, en orden
        </h2>
        <ol className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-300">
          <li>
            <span className="font-semibold text-white">
              Miércoles 18, 11:00 UTC:
            </span>{" "}
            Nueva Zelanda abre. En España son las 12:00 del mediodía del día 18.
          </li>
          <li>
            <span className="font-semibold text-white">
              Miércoles 18, 23:00 UTC:
            </span>{" "}
            España peninsular abre, ya jueves 19 en el calendario local.
          </li>
          <li>
            <span className="font-semibold text-white">
              Jueves 19, 05:00 UTC:
            </span>{" "}
            Nueva York abre. En España son las 06:00 de la mañana.
          </li>
          <li>
            <span className="font-semibold text-white">
              Jueves 19, 09:00 UTC:
            </span>{" "}
            Los Ángeles abre, el último huso de la tabla: en España son las
            10:00 y en Nueva Zelanda ya es viernes 20.
          </li>
        </ol>
        <p className="mt-4 text-xs leading-relaxed text-zinc-500">
          Horas calculadas con los desfases de la tabla. La franja de mayor
          riesgo de spoilers es la que va de la apertura de Nueva Zelanda a la
          de España: casi 12 horas de juego circulando antes de que aquí se
          abra.
        </p>
      </section>

      <section className="mt-10 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-black text-white">
          <AlertTriangle
            className="h-5 w-5 text-amber-400"
            aria-hidden="true"
          />
          Lo que no está confirmado
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-300">
          Todo lo que sigue es un hueco real, no una omisión. Si ves una cifra
          concreta en otro sitio, exige la fuente: aquí no hay ninguna que la
          sostenga.
        </p>
        <ul className="space-y-3">
          {UNLOCK_PENDIENTE.map((item) => (
            <li
              key={item.tema}
              className="rounded-lg border border-white/5 bg-zinc-950/40 px-4 py-3"
            >
              <p className="text-sm font-semibold text-white">{item.tema}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                {item.detalle}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="precarga">
        <h2
          id="precarga"
          className="mb-3 flex items-center gap-2 text-2xl font-black text-white"
        >
          <Download className="h-5 w-5 text-cyan-400" aria-hidden="true" />
          Lo que sí está confirmado del 12 de noviembre
        </h2>
        <ul className="space-y-2 rounded-xl border border-white/5 bg-zinc-900/40 p-5 text-sm leading-relaxed text-zinc-300">
          <li className="flex items-start gap-2">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400"
              aria-hidden="true"
            />
            <span>
              La precarga digital empieza el{" "}
              <strong className="text-white">12 de noviembre de 2026</strong>,
              una semana antes del lanzamiento, según el comunicado de reservas
              del 24 de junio.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400"
              aria-hidden="true"
            />
            <span>
              Ese mismo día llega a las tiendas la edición física, que contiene
              un <strong className="text-white">código de descarga</strong> y no
              un disco, precisamente para poder descargar con tiempo.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400"
              aria-hidden="true"
            />
            <span>
              Descargar no adelanta el acceso: el juego se abre a medianoche
              local del 19, también para quien tenga la caja en casa desde el
              día 12.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400"
              aria-hidden="true"
            />
            <span>
              No hay tamaño de descarga oficial. Las cifras que circulan son
              estimaciones y no sirven para calcular si te cabe en el disco.
            </span>
          </li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="faq">
        <h2
          id="faq"
          className="mb-4 flex items-center gap-2 text-2xl font-black text-white"
        >
          <HelpCircle className="h-5 w-5 text-pink-500" aria-hidden="true" />
          Preguntas frecuentes
        </h2>
        <div className="space-y-3">
          {UNLOCK_FAQ.map((entry) => (
            <details
              key={entry.question}
              className="group rounded-xl border border-white/5 bg-zinc-900/40 p-4"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-white marker:hidden">
                <span className="mr-2 text-pink-400 group-open:hidden">+</span>
                <span className="mr-2 hidden text-pink-400 group-open:inline">
                  −
                </span>
                {entry.question}
              </summary>
              <p className="mt-2 border-t border-white/5 pt-2 text-sm leading-relaxed text-zinc-300">
                {entry.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-white/5 bg-zinc-900/40 p-5 sm:p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-pink-400">
          Fuentes
        </h2>
        <ul className="space-y-2">
          {FUENTES_HORA.map((source) => (
            <li key={source.url} className="text-sm">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="break-all text-cyan-400 underline-offset-2 hover:underline"
              >
                {source.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-white/5 pt-3 text-xs leading-relaxed text-zinc-500">
          La regla de «medianoche local» procede de la confirmación de Rockstar
          recogida por NME y Vandal. Los desfases horarios son los oficiales de
          cada territorio para el 19 de noviembre de 2026. ¿Ves un error en una
          fila? Escríbenos por la{" "}
          <Link
            href="/contacto"
            className="text-pink-400 underline-offset-2 hover:underline"
          >
            página de contacto
          </Link>{" "}
          y se corrige con la fuente delante.
        </p>
      </section>

      {articulos.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
            <span
              aria-hidden="true"
              className="h-6 w-1.5 rounded bg-pink-500"
            />
            Para preparar el día 19
          </h2>
          <ArticleGrid articles={articulos} columns={2} />
        </section>
      )}
    </div>
  );
}
