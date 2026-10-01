import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Info,
  ListChecks,
  MapPin,
  MessageSquareQuote,
} from "lucide-react";
import { ArticleGrid } from "@/components/site/article-grid";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import {
  CRONOLOGIA,
  CRONOLOGIA_EXCLUIDO,
  CRONOLOGIA_STATUS_LABEL,
  CRONOLOGIA_UPDATED_AT,
  LUGARES_OFICIALES,
  getCronologiaDesc,
  getCronologiaResumen,
  type CronologiaEvent,
  type CronologiaStatus,
} from "@/lib/cronologia";
import { getArticleBySlug, type Article } from "@/lib/data";
import { EDITORIAL_NAME, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cronología de GTA VI: todo lo confirmado, con su fuente",
  description:
    "Todas las confirmaciones oficiales sobre GTA VI en orden, desde la filtración de 2022 y el primer tráiler hasta el desbloqueo del 19 de noviembre de 2026, con la fuente primaria de cada línea y lo reportado marcado aparte.",
  alternates: { canonical: "/cronologia" },
  keywords: [
    "cronología GTA VI",
    "todo lo confirmado de GTA 6",
    "fechas clave GTA VI",
    "retrasos GTA VI",
    "GTA VI 19 de noviembre de 2026",
  ],
  openGraph: {
    type: "article",
    url: "/cronologia",
    title: "Cronología de GTA VI: todo lo confirmado, con su fuente",
    description:
      "Línea de tiempo de GTA VI desde 2022 hasta el lanzamiento, con la fuente primaria de cada confirmación y una lista explícita de lo que sigue sin confirmar.",
    publishedTime: "2026-09-30T08:00:00.000Z",
    modifiedTime: `${CRONOLOGIA_UPDATED_AT}T08:00:00.000Z`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Cronología de GTA VI: todo lo confirmado, con su fuente",
    description:
      "Cada confirmación sobre GTA VI en orden, con su fuente primaria y separando lo confirmado de lo reportado.",
  },
};

/** Artículos propios que se enlazan desde la cabecera de la cronología. */
const ARTICULOS_PILAR = [
  "gta-vi-lanzamiento-19-noviembre-2026-oficial",
  "gta-vi-cuenta-atras-fechas-clave-19-noviembre",
  "gta-vi-cuenta-atras-dos-meses-analisis",
  "gta-vi-que-puede-publicar-un-fansite",
];

const STATUS_STYLE: Record<CronologiaStatus, string> = {
  confirmado: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  reportado: "border-amber-500/40 bg-amber-500/10 text-amber-300",
};

function relatedArticles(event: CronologiaEvent): Article[] {
  return (event.related ?? [])
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is Article => Boolean(article));
}

/**
 * Datos estructurados.
 *
 * `WebPage` con `citation` (de dónde sale cada línea) e `isBasedOn` (los
 * artículos propios), más un `ItemList` con una `PublicationIssue` por entrada:
 * es la forma de que un motor de búsqueda vea la cronología como una lista de
 * hechos fechados y no como un texto cualquiera.
 */
function buildJsonLd() {
  const orden = getCronologiaDesc();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/cronologia"),
        url: absoluteUrl("/cronologia"),
        name: "Cronología de GTA VI: todo lo confirmado, con su fuente",
        description:
          "Línea de tiempo de las confirmaciones oficiales sobre Grand Theft Auto VI, con la fuente primaria de cada línea.",
        inLanguage: "es",
        datePublished: "2026-09-30T08:00:00.000Z",
        dateModified: `${CRONOLOGIA_UPDATED_AT}T08:00:00.000Z`,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: EDITORIAL_NAME },
        // Las fuentes primarias que sostienen la página en conjunto.
        citation: [
          "https://www.rockstargames.com/VI",
          "https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026",
          "https://www.take2games.com/ir/news/rockstar-games-announces-pre-orders-grand-theft-auto-vi",
        ],
        isBasedOn: ARTICULOS_PILAR.map((slug) =>
          absoluteUrl(`/articulo/${slug}`),
        ),
        mainEntity: {
          "@type": "ItemList",
          name: "Cronología de GTA VI",
          numberOfItems: orden.length,
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          itemListElement: orden.map((event, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: event.title,
            url: `${absoluteUrl("/cronologia")}#${event.date}-${index + 1}`,
            description: event.detail,
            citation: event.sources[0]?.url,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "¿Cuántas veces se ha retrasado GTA VI?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Dos veces con anuncio formal. El primer retraso se comunicó el 2 de mayo de 2025 y movió la fecha al 26 de mayo de 2026; el segundo, el 6 de noviembre de 2025, la dejó en el 19 de noviembre de 2026. Hubo además una fecha intermedia —el 26 de mayo de 2026— que se incumplió, y hay agregadores que cuentan un «tercer retraso» refiriéndose al desplazamiento 2025→2026, pero eso es una reinterpretación y no un anuncio nuevo.",
            },
          },
          {
            "@type": "Question",
            name: "¿Quién ha confirmado la fecha del 19 de noviembre de 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Rockstar Games, en un artículo propio del Newswire: «Grand Theft Auto VI will now release on Thursday, November 19, 2026». La fecha también figura en la página oficial del juego y en el comunicado de resultados de Take-Two del mismo día.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cuándo empieza la precarga de GTA VI?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "El 12 de noviembre de 2026, una semana antes del lanzamiento. Rockstar lo confirmó en el comunicado de reservas del 24 de junio de 2026, y ese mismo día llega a las tiendas la edición física, que contiene un código de descarga y no un disco. La hora exacta de apertura de la descarga en cada tienda no se ha anunciado.",
            },
          },
          {
            "@type": "Question",
            name: "¿Es fiable esta cronología?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Cada línea indica si el dato está confirmado por Rockstar Games, Take-Two o un documento oficial, o si solo está reportado por medios de referencia, y enlaza la fuente concreta que lo sostiene. Lo que no tiene fuente no aparece: esta página publica también una lista explícita de lo que sigue sin confirmarse.",
            },
          },
        ],
      },
    ],
  };
}

export default function CronologiaPage() {
  const eventos = getCronologiaDesc();
  const resumen = getCronologiaResumen();
  const articulos = ARTICULOS_PILAR.map((slug) =>
    getArticleBySlug(slug),
  ).filter((article): article is Article => Boolean(article));

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Cronología de GTA VI" },
        ]}
      />

      <header className="mb-8">
        <span className="inline-block rounded bg-pink-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Referencia
        </span>
        <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
          Cronología de GTA VI: todo lo confirmado, con su fuente
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-300">
          Todo lo que Rockstar Games y Take-Two han confirmado sobre Grand Theft
          Auto VI, en orden, desde la filtración de 2022 hasta hoy. Cada línea
          lleva quién lo dijo y el enlace a la fuente; lo{" "}
          <strong className="font-semibold text-white">confirmado</strong> va
          separado de lo{" "}
          <strong className="font-semibold text-white">reportado</strong> por
          medios.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Entradas", value: String(resumen.total) },
            { label: "Confirmadas", value: String(resumen.confirmado) },
            { label: "Reportadas", value: String(resumen.reportado) },
            { label: "Fuentes distintas", value: String(resumen.fuentes) },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/5 bg-zinc-900/40 px-4 py-3"
            >
              <dt className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
                {item.label}
              </dt>
              <dd className="mt-1 text-2xl font-black text-white">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Corte de datos: 30 de septiembre de 2026
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            Se amplía cada vez que Rockstar publica algo nuevo
          </span>
        </p>
      </header>

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-300">
          <ListChecks className="h-4 w-4" aria-hidden="true" />
          Cómo leer esta página
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-zinc-300">
          <li>
            <span className="mr-2 inline-flex items-center gap-1 rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              Confirmado
            </span>
            Lo dijo Rockstar Games, Take-Two o consta en un documento oficial
            (tienda, expediente municipal, comunicado de resultados).
          </li>
          <li>
            Dentro de lo confirmado hay un matiz que se marca cuando aparece: si
            el hecho lo sostiene la compañía o un documento, la fuente lleva la
            etiqueta <strong className="text-pink-300">Primaria</strong>; si es
            un hecho público verificable del que solo hay cobertura de medios
            —un suceso, una sentencia, una declaración recogida en una
            entrevista—, la entrada lo dice con la etiqueta{" "}
            <strong className="text-zinc-100">Hecho público</strong>. No es lo
            mismo una cosa que la otra y no se presentan igual.
          </li>
          <li>
            <span className="mr-2 inline-flex items-center gap-1 rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              Reportado
            </span>
            Lo publicó un medio o un periodista con fuentes propias. Puede ser
            cierto, pero la compañía no lo ha confirmado y aquí no se presenta
            como si lo hubiera hecho.
          </li>
          <li>
            El estado es el del <strong className="text-white">hecho</strong>,
            no el de la fuente: una fecha puede estar confirmada y su cifra de
            audiencia solo reportada, y se dice en cada caso.
          </li>
          <li>
            ¿Buscas solo la hora del día 19? Está en la{" "}
            <Link
              href="/desbloqueo"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              tabla de desbloqueo por países
            </Link>
            .
          </li>
        </ul>
      </div>

      <ol className="mt-10 space-y-6 border-l border-white/10 pl-5 sm:space-y-8 sm:pl-8">
        {eventos.map((event, index) => {
          const relacionadas = relatedArticles(event);
          return (
            <li
              key={`${event.date}-${index}`}
              id={`${event.date}-${index + 1}`}
              className="relative scroll-mt-24"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[26px] top-2 h-3 w-3 rounded-full border-2 border-pink-500 bg-zinc-950 sm:-left-[38px]"
              />
              <article className="rounded-xl border border-white/5 bg-zinc-900/40 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <time
                    dateTime={event.date}
                    className="text-xs font-bold uppercase tracking-wider text-pink-400"
                  >
                    {event.dateLabel}
                  </time>
                  <span
                    className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLE[event.status]}`}
                  >
                    {event.status === "confirmado" ? (
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    )}
                    {CRONOLOGIA_STATUS_LABEL[event.status]}
                  </span>
                  {event.evidence === "informado" && (
                    <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                      Hecho público
                    </span>
                  )}
                </div>

                <h2 className="mt-2 text-lg font-bold leading-snug text-white">
                  {event.title}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-300">
                  {event.detail}
                </p>

                <div className="mt-3 border-t border-white/5 pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Fuente
                  </p>
                  <ul className="mt-1.5 space-y-1.5">
                    {event.sources.map((source) => (
                      <li key={source.url}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-start gap-1.5 text-sm text-cyan-400 underline-offset-2 hover:underline"
                        >
                          <ArrowUpRight
                            className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            {source.name}
                            {source.primary ? (
                              <span className="ml-1.5 rounded bg-pink-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-300">
                                Primaria
                              </span>
                            ) : null}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {relacionadas.length > 0 && (
                  <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                    <span className="font-bold uppercase tracking-wider text-zinc-500">
                      En el sitio
                    </span>
                    {relacionadas.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/articulo/${article.slug}`}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-zinc-300 transition-colors hover:border-pink-500/40 hover:text-white"
                      >
                        {article.title}
                      </Link>
                    ))}
                  </p>
                )}
              </article>
            </li>
          );
        })}
      </ol>

      <section className="mt-12 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-black text-white">
          <AlertTriangle
            className="h-5 w-5 text-amber-400"
            aria-hidden="true"
          />
          Lo que NO está en esta cronología
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-300">
          Esta lista es tan deliberada como la de arriba. Son las afirmaciones
          que circulan sin una fuente que las sostenga: no aparecen porque no se
          pueden citar, no porque se hayan pasado por alto.
        </p>
        <ul className="space-y-3">
          {CRONOLOGIA_EXCLUIDO.map((item) => (
            <li
              key={item.tema}
              className="rounded-lg border border-white/5 bg-zinc-950/40 px-4 py-3"
            >
              <p className="text-sm font-semibold text-white">{item.tema}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                {item.motivo}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border border-white/5 bg-zinc-900/40 p-5 sm:p-6">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-black text-white">
          <MapPin className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          Topónimos que sí están respaldados
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-300">
          Para que la separación sea útil también aquí: estos nombres aparecen
          en textos o imágenes distribuidas por Rockstar o en declaraciones de
          sus responsables recogidas por la prensa. Cualquier otro topónimo que
          circule —«Kelly County» incluido— es una lectura de la comunidad o de
          una ilustración de producto, no una confirmación.
        </p>
        <ul className="flex flex-wrap gap-2">
          {LUGARES_OFICIALES.map((lugar) => (
            <li
              key={lugar}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
            >
              {lugar}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-zinc-500">
          Los lugares enumerados arriba están en el comunicado del 24 de junio
          de 2026, en el texto del Extended Look o en la propia web de Rockstar.
          Las excepciones van marcadas: «Leonida Keys» consta en una entrevista
          de preview y no en un comunicado de la compañía, y «Port Gellhorn» y
          «Ambrosia» proceden del reportaje de portada de Game Informer 382
          (29 de septiembre de 2026), donde Aaron Garbut, responsable de arte de
          Rockstar North, describe las seis regiones del estado. «Kelly County»
          y cualquier otro topónimo que no aparezca en ese reportaje siguen sin
          acreditarse.
        </p>
      </section>

      {articulos.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
            <span
              aria-hidden="true"
              className="h-6 w-1.5 rounded bg-pink-500"
            />
            Para seguir el hilo
          </h2>
          <ArticleGrid articles={articulos} columns={2} />
        </section>
      )}

      <section className="mt-12 rounded-xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 via-zinc-900/40 to-cyan-500/10 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-xl font-black text-white">
          <MessageSquareQuote
            className="h-5 w-5 text-pink-500"
            aria-hidden="true"
          />
          Cita esta página
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
          Si estás preparando una pieza y esto te ahorra trabajo, adelante: cita
          la fuente original que acompaña a cada línea, no esta página. Si citas
          la cronología, enlázala como{" "}
          <span className="break-all text-zinc-100">
            {absoluteUrl("/cronologia").replace(/^https?:\/\//, "")}
          </span>
          . Para correcciones o para aportar una fuente mejor, escríbenos desde
          la{" "}
          <Link
            href="/contacto"
            className="font-semibold text-pink-400 underline-offset-2 hover:underline"
          >
            página de contacto
          </Link>
          : si una línea está mal, se corrige y se dice.
        </p>
        <p className="mt-3 text-xs text-zinc-500">
          Mantenida por {EDITORIAL_NAME}. Última revisión completa de las
          fuentes primarias: 30 de septiembre de 2026 ({CRONOLOGIA.length}{" "}
          entradas).
        </p>
      </section>
    </div>
  );
}
