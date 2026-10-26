import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CircleCheck,
  CircleQuestionMark,
  Compass,
  Fish,
  Info,
  Layers,
  ListChecks,
  Map as MapIcon,
  MapPin,
  Mountain,
  Sparkles,
  Trees,
  TriangleAlert,
  Wind,
} from "lucide-react";
import { MapaLeonida } from "@/app/mapa/mapa-leonida";
import { ArticleGrid } from "@/components/site/article-grid";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { getArticleBySlug, type Article } from "@/lib/data";
import {
  MAPA_ACTIVIDADES,
  MAPA_ACTIVIDADES_NOTA,
  MAPA_ARTICULOS,
  MAPA_CIFRAS,
  MAPA_CLIMA,
  MAPA_ESTADO_LABEL,
  MAPA_FAUNA,
  MAPA_FAQ,
  MAPA_FUENTES,
  MAPA_MARCAS,
  MAPA_PENDIENTE,
  MAPA_REGIONES,
  MAPA_TOPONIMOS,
  MAPA_UPDATED_AT,
  mapaCorteLabel,
  type MapaDato,
  type MapaEstado,
  type MapaRegion,
} from "@/lib/mapa";
import { EDITORIAL_NAME, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

const TITULO = "Mapa interactivo de Leonida: las seis regiones de GTA VI";

export const metadata: Metadata = {
  title: TITULO,
  description:
    "Mapa interactivo del estado de Leonida: las seis regiones que describe Game Informer 382, qué se ha visto de cada una, los topónimos que sí están acreditados y lo que sigue sin confirmar. Sin imágenes de terceros y sin mapa oficial inventado.",
  alternates: { canonical: "/mapa" },
  keywords: [
    "mapa GTA VI",
    "mapa de Leonida",
    "regiones de Leonida",
    "mapa interactivo GTA 6",
    "Vice City mapa",
    "Mount Kalaga",
    "Port Gellhorn",
    "Ambrosia",
  ],
  openGraph: {
    type: "article",
    url: "/mapa",
    title: TITULO,
    description:
      "Las seis regiones de Leonida, qué se ha visto en material oficial de cada una y qué no está confirmado. Esquema propio, sin escala y sin cartografía inventada.",
    publishedTime: `${MAPA_UPDATED_AT}T08:00:00.000Z`,
    modifiedTime: `${MAPA_UPDATED_AT}T08:00:00.000Z`,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description:
      "Mapa esquemático de Leonida con sus seis regiones, cada dato con su estado y su fuente, y la lista de lo que todavía no se puede afirmar.",
  },
};

const ESTADO_STYLE: Record<MapaEstado, string> = {
  confirmado: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  reportado: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  "sin-fuente": "border-white/15 bg-white/5 text-zinc-300",
};

const ESTADO_ICON: Record<MapaEstado, typeof CircleCheck> = {
  confirmado: CircleCheck,
  reportado: TriangleAlert,
  "sin-fuente": CircleQuestionMark,
};

/** Chip del estado de un dato. El texto va siempre, no solo el color. */
function EstadoChip({ estado }: { estado: MapaEstado }) {
  const Icon = ESTADO_ICON[estado];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${ESTADO_STYLE[estado]}`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {MAPA_ESTADO_LABEL[estado]}
    </span>
  );
}

/** Lista de datos con su estado, la unidad de esta página. */
function ListaDatos({ datos }: { datos: MapaDato[] }) {
  return (
    <ul className="space-y-2">
      {datos.map((dato) => (
        <li
          key={dato.texto}
          className="rounded-lg border border-white/5 bg-zinc-950/40 px-3 py-2.5"
        >
          <EstadoChip estado={dato.estado} />
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
            {dato.texto}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Fuentes de una región, con el mismo formato que en la cronología. */
function FuentesRegion({ region }: { region: MapaRegion }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {region.fuentes.map((fuente) => (
        <li key={fuente.url}>
          <a
            href={fuente.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-start gap-1.5 text-sm text-cyan-400 underline-offset-2 hover:underline"
          >
            <ArrowUpRight
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span>{fuente.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Datos estructurados.
 *
 * `WebPage` con `citation` (las fuentes de la página) e `isBasedOn` (las piezas
 * propias que la sostienen), un `ItemList` con las seis regiones —que es lo que
 * puede leer un asistente—, un `Place` para Leonida con sus regiones dentro y un
 * `FAQPage` con exactamente las mismas respuestas que se ven en pantalla.
 *
 * El `Place` no lleva coordenadas a propósito: las del esquema son de dibujo y
 * publicarlas como geografía sería inventar un dato.
 */
function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/mapa"),
        url: absoluteUrl("/mapa"),
        name: TITULO,
        description:
          "Mapa esquemático e interactivo del estado ficticio de Leonida (GTA VI) con sus seis regiones, el estado de cada dato y las fuentes.",
        inLanguage: "es",
        datePublished: `${MAPA_UPDATED_AT}T08:00:00.000Z`,
        dateModified: `${MAPA_UPDATED_AT}T08:00:00.000Z`,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: EDITORIAL_NAME },
        about: { "@id": `${absoluteUrl("/mapa")}#leonida` },
        citation: MAPA_FUENTES.map((fuente) => fuente.url),
        isBasedOn: MAPA_ARTICULOS.map((slug) =>
          absoluteUrl(`/articulo/${slug}`),
        ),
        mainEntity: {
          "@type": "ItemList",
          name: "Regiones de Leonida en GTA VI",
          numberOfItems: MAPA_REGIONES.length,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: MAPA_REGIONES.map((region, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: region.nombre,
            url: `${absoluteUrl("/mapa")}#region-${region.id}`,
            description: `${region.tipo}: ${region.resumen}`,
          })),
        },
      },
      {
        "@type": "Place",
        "@id": `${absoluteUrl("/mapa")}#leonida`,
        name: "Leonida",
        description:
          "Estado ficticio en el que transcurre Grand Theft Auto VI, con seis regiones descritas por Aaron Garbut (Rockstar North) en el reportaje de portada de Game Informer 382, del 29 de septiembre de 2026. No incluye coordenadas: la posición de las regiones no está publicada por Rockstar.",
        containsPlace: MAPA_REGIONES.map((region) => ({
          "@type": "Place",
          name: region.nombre,
          description: region.resumen,
          url: `${absoluteUrl("/mapa")}#region-${region.id}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: MAPA_FAQ.map((entrada) => ({
          "@type": "Question",
          name: entrada.question,
          acceptedAnswer: { "@type": "Answer", text: entrada.answer },
        })),
      },
    ],
  };
}

export default function MapaPage() {
  const articulos = MAPA_ARTICULOS.map((slug) => getArticleBySlug(slug)).filter(
    (article): article is Article => Boolean(article),
  );
  const confirmados = MAPA_REGIONES.reduce(
    (total, region) =>
      total +
      region.visto.filter((dato) => dato.estado === "confirmado").length,
    0,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      <Breadcrumbs
        items={[{ label: "Inicio", href: "/" }, { label: "Mapa de Leonida" }]}
      />

      <header className="mb-8">
        <span className="inline-block rounded bg-pink-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Mapa
        </span>
        <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
          {TITULO}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-300">
          Leonida tiene{" "}
          <strong className="font-semibold text-white">seis regiones</strong> y
          ninguna de ellas está cartografiada. Esta página dibuja un esquema
          propio para poder hablar de ellas, y pone al lado de cada dato su
          estado: lo que dijo{" "}
          <strong className="font-semibold text-white">Rockstar</strong>, lo que
          solo está{" "}
          <strong className="font-semibold text-white">reportado</strong> por
          medios y lo que{" "}
          <strong className="font-semibold text-white">
            no tiene ninguna fuente
          </strong>
          . El mapa es la excusa para ordenar el estado del conocimiento, no un
          plano del juego.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Regiones", value: String(MAPA_REGIONES.length) },
            { label: "Datos confirmados", value: String(confirmados) },
            { label: "Fuentes", value: String(MAPA_FUENTES.length) },
            { label: "Sin confirmar", value: String(MAPA_PENDIENTE.length) },
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
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            Esquema propio, sin escala y sin valor cartográfico
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            Corte de datos: {mapaCorteLabel()}
          </span>
        </p>
      </header>

      <section
        className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5"
        aria-labelledby="como-leer"
      >
        <h2
          id="como-leer"
          className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-300"
        >
          <ListChecks className="h-4 w-4" aria-hidden="true" />
          Cómo leer este mapa
        </h2>
        <ul className="space-y-2.5 text-sm leading-relaxed text-zinc-300">
          <li>
            <EstadoChip estado="confirmado" />
            <span className="ml-2">
              Comunicado de Rockstar, web oficial o material distribuido por la
              compañía. Aquí entra también lo que un responsable con nombre y
              cargo describe en el reportaje de portada de{" "}
              <em>Game Informer</em> 382 —las seis regiones, la fauna, el clima,
              las actividades—: es una entrevista publicada, no un comunicado, y
              así se dice en cada ficha.
            </span>
          </li>
          <li>
            <EstadoChip estado="reportado" />
            <span className="ml-2">
              Declaraciones recogidas en previews que la compañía no ha publicado
              en un canal propio, documentos de una institución y lecturas de
              material de producto, como el póster de la caja coleccionista.
              También van aquí, y no en lo confirmado,{" "}
              <strong className="text-zinc-200">
                las cifras y mediciones
              </strong>{" "}
              —el doble de GTA V, el triple de RDR2, el arranque en los Keys—:
              las diga quien las diga, no hay una ficha oficial detrás, y una
              cifra sin ficha se queda en reportada.
            </span>
          </li>
          <li>
            <EstadoChip estado="sin-fuente" />
            <span className="ml-2">
              No consta en ninguna fuente que se pueda abrir. Aquí no se rellena
              el hueco con un número que suene razonable: se escribe que falta.
            </span>
          </li>
          <li>
            <strong className="text-white">Las formas son nuestras.</strong> El
            estado tiene la forma que tiene porque este esquema la dibuja así.
            Rockstar no ha publicado el mapa, y lo único que las fuentes fijan
            es que la historia empieza en los Leonida Keys, en el sur, y que
            Mount Kalaga es el parque nacional del norte. Todo lo demás es
            composición, y no sirve para medir distancias.
          </li>
          <li>
            <strong className="text-white">Ninguna imagen de terceros.</strong>{" "}
            El dibujo son trazos propios en un SVG servido desde este dominio:
            no hay teselas de mapas ajenos, ni capturas del juego, ni recursos
            externos. Las capturas oficiales se describen con palabras y se
            enlazan en la fuente, no se incrustan.
          </li>
          <li>
            La separación entre estados es la misma que la de la{" "}
            <Link
              href="/politica-editorial"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              política editorial
            </Link>{" "}
            y la de la{" "}
            <Link
              href="/cronologia"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              cronología
            </Link>
            .
          </li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="el-mapa">
        <h2
          id="el-mapa"
          className="mb-4 flex items-center gap-2 text-2xl font-black text-white"
        >
          <span aria-hidden="true" className="h-6 w-1.5 rounded bg-pink-500" />
          El mapa
        </h2>

        <MapaLeonida />

        <div className="mt-4 rounded-xl border border-white/5 bg-zinc-900/40 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400">
            Topónimos dibujados que no son una de las seis regiones
          </h3>
          <dl className="mt-2 space-y-2 text-sm">
            {MAPA_MARCAS.map((marca) => (
              <div key={marca.etiqueta}>
                <dt className="font-semibold text-white">{marca.etiqueta}</dt>
                <dd className="text-zinc-400">{marca.nota}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-zinc-500">
            Los nombres son de material de Rockstar o de lecturas acreditadas del
            póster; las posiciones son del dibujo. No hay coordenadas oficiales
            de ninguno de ellos.
          </p>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="regiones">
        <h2
          id="regiones"
          className="mb-2 flex items-center gap-2 text-2xl font-black text-white"
        >
          <MapIcon className="h-6 w-6 text-pink-500" aria-hidden="true" />
          Las seis regiones, una por una
        </h2>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Las seis fichas están completas aquí, en el HTML, aunque el navegador
          no ejecute JavaScript: es la versión de lectura de la página. Cada una
          lleva qué se sabe, qué se ha visto en material distribuido por
          Rockstar, qué actividades se le pueden atribuir con la fuente delante y
          qué no está confirmado.
        </p>

        <div className="space-y-8">
          {MAPA_REGIONES.map((region, index) => (
            <article
              key={region.id}
              id={`region-${region.id}`}
              className="scroll-mt-24 rounded-xl border border-white/5 bg-zinc-900/40 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
                    Región {index + 1} de {MAPA_REGIONES.length} ·{" "}
                    {region.tipo}
                  </p>
                  <h3 className="mt-1 flex items-center gap-2 text-xl font-black leading-tight text-white">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: region.color }}
                    />
                    {region.nombre}
                  </h3>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
                  {region.visto.length} vistos · {region.dudas.length} sin
                  confirmar
                </span>
              </div>

              <p className="mt-3 text-[15px] leading-relaxed text-zinc-200">
                {region.resumen}
              </p>

              <div className="mt-4 space-y-2">
                {region.sabemos.map((parrafo) => (
                  <p
                    key={parrafo}
                    className="text-sm leading-relaxed text-zinc-300"
                  >
                    {parrafo}
                  </p>
                ))}
              </div>

              <div className="mt-4 grid gap-4 border-t border-white/5 pt-4 lg:grid-cols-2">
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    <BadgeCheck
                      className="h-3.5 w-3.5 text-cyan-400"
                      aria-hidden="true"
                    />
                    Qué se ha visto en material oficial
                  </h4>
                  <ListaDatos datos={region.visto} />
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    <Sparkles
                      className="h-3.5 w-3.5 text-pink-400"
                      aria-hidden="true"
                    />
                    Actividades atribuibles a esta región
                  </h4>
                  <ListaDatos datos={region.actividades} />
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  Lo que no está confirmado
                </h4>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed text-zinc-300">
                  {region.dudas.map((duda) => (
                    <li key={duda}>{duda}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 border-t border-white/5 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Fuentes
                </p>
                <FuentesRegion region={region} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="datos-mapa">
        <h2
          id="datos-mapa"
          className="mb-2 flex items-center gap-2 text-2xl font-black text-white"
        >
          <Layers className="h-6 w-6 text-pink-500" aria-hidden="true" />
          Los datos del mapa que sostienen las piezas publicadas
        </h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Las cifras que se repiten en los artículos del sitio, con la atribución
          exacta. Ninguna es una ficha oficial de producto: dos son declaraciones
          en previews y una es una lista que da un responsable en una entrevista.
        </p>

        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MAPA_CIFRAS.map((cifra) => (
            <div
              key={cifra.etiqueta}
              className="rounded-xl border border-white/5 bg-zinc-900/40 p-4"
            >
              <dt className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
                {cifra.etiqueta}
              </dt>
              <dd className="mt-1 text-2xl font-black text-white">
                {cifra.valor}
              </dd>
              <dd className="mt-2">
                <EstadoChip estado={cifra.estado} />
                <span className="mt-1.5 block text-xs leading-relaxed text-zinc-400">
                  {cifra.detalle}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-base font-black text-white">
              <Fish className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              Fauna
            </h3>
            <p className="text-sm leading-relaxed text-zinc-300">
              {MAPA_FAUNA.resumen}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              <strong className="text-zinc-200">Nativas confirmadas:</strong>{" "}
              {MAPA_FAUNA.nativas.join(", ")}.{" "}
              <strong className="text-zinc-200">Invasoras:</strong>{" "}
              {MAPA_FAUNA.invasoras.join(", ")}.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              <strong className="text-zinc-200">Rastreables:</strong>{" "}
              {MAPA_FAUNA.grupos.join(", ")}. {MAPA_FAUNA.nota}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-base font-black text-white">
              <Wind className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              Clima
            </h3>
            <ul className="space-y-1.5">
              {MAPA_CLIMA.confirmado.map((linea) => (
                <li
                  key={linea}
                  className="flex items-start gap-2 text-sm leading-relaxed text-zinc-300"
                >
                  <CircleCheck
                    className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{linea}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-white/5 pt-2 text-xs leading-relaxed text-amber-300">
              Sin confirmar: {MAPA_CLIMA.pendiente.join(" ")}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              {MAPA_CLIMA.nota}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/5 bg-zinc-900/40 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-base font-black text-white">
            <Mountain className="h-4 w-4 text-pink-400" aria-hidden="true" />
            Actividades confirmadas en Leonida
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {MAPA_ACTIVIDADES.length}
            </span>
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {MAPA_ACTIVIDADES.map((actividad) => (
              <li
                key={actividad.nombre}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300"
                title={actividad.nota}
              >
                {actividad.nombre}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-zinc-500">
            {MAPA_ACTIVIDADES_NOTA}
          </p>
        </div>
      </section>

      <section
        className="mt-12 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6"
        aria-labelledby="lo-que-no"
      >
        <h2
          id="lo-que-no"
          className="mb-2 flex items-center gap-2 text-xl font-black text-white"
        >
          <TriangleAlert
            className="h-5 w-5 text-amber-400"
            aria-hidden="true"
          />
          Lo que NO está en este mapa
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-300">
          Esta lista es tan deliberada como el mapa. Son las cosas que se pueden
          encontrar en otras páginas sobre Leonida y que aquí no aparecen porque
          no hay una fuente que las sostenga, no porque se hayan pasado por alto.
        </p>
        <ul className="space-y-3">
          {MAPA_PENDIENTE.map((item) => (
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

      <section className="mt-10" aria-labelledby="toponimos">
        <h2
          id="toponimos"
          className="mb-2 flex items-center gap-2 text-xl font-black text-white"
        >
          <MapPin className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          Topónimos acreditados
        </h2>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-zinc-300">
          Los nombres que sí están respaldados, con el documento donde aparecen.
          Es la lista contra la que se puede comprobar cualquier mapa de Leonida:
          si un topónimo no está aquí y no aparece en el reportaje de{" "}
          <em>Game Informer</em> 382, no está confirmado.
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-zinc-900/40">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Topónimos de Leonida acreditados, con su ubicación, el documento en
              el que aparecen y su estado de confirmación.
            </caption>
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-pink-400">
                <th scope="col" className="px-4 py-2.5 font-bold">
                  Topónimo
                </th>
                <th scope="col" className="px-4 py-2.5 font-bold">
                  Dónde
                </th>
                <th scope="col" className="px-4 py-2.5 font-bold">
                  Documento
                </th>
                <th scope="col" className="px-4 py-2.5 font-bold">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {MAPA_TOPONIMOS.map((toponimo) => (
                <tr
                  key={toponimo.nombre}
                  className="border-b border-white/5 align-top last:border-0"
                >
                  <th
                    scope="row"
                    className="px-4 py-2.5 text-left text-sm font-semibold text-white"
                  >
                    {toponimo.nombre}
                  </th>
                  <td className="px-4 py-2.5 text-zinc-400">
                    {toponimo.donde}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-400">
                    {toponimo.origen}
                  </td>
                  <td className="px-4 py-2.5">
                    <EstadoChip estado={toponimo.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          Los dos topónimos marcados como reportados —Sandbars y Crude
          Islands— proceden del póster de la caja coleccionista, que es material
          de producto y no un documento cartográfico. El resto aparece en el
          comunicado de la Ultimate Edition del 24 de junio de 2026, en la web
          oficial o en el reportaje de portada de <em>Game Informer</em> 382 del
          29 de septiembre de 2026.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="faq">
        <h2
          id="faq"
          className="mb-4 flex items-center gap-2 text-2xl font-black text-white"
        >
          <CircleQuestionMark className="h-5 w-5 text-pink-500" aria-hidden="true" />
          Preguntas frecuentes
        </h2>
        <div className="space-y-3">
          {MAPA_FAQ.map((entrada) => (
            <details
              key={entrada.question}
              className="group rounded-xl border border-white/5 bg-zinc-900/40 p-4"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-white marker:hidden">
                <span className="mr-2 text-pink-400 group-open:hidden">+</span>
                <span className="mr-2 hidden text-pink-400 group-open:inline">
                  −
                </span>
                {entrada.question}
              </summary>
              <p className="mt-2 border-t border-white/5 pt-2 text-sm leading-relaxed text-zinc-300">
                {entrada.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-white/5 bg-zinc-900/40 p-5 sm:p-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-pink-400">
          <Trees className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          Fuentes de esta página
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {MAPA_FUENTES.map((fuente) => (
            <li key={fuente.url} className="text-sm">
              <a
                href={fuente.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-start gap-1.5 break-words text-cyan-400 underline-offset-2 hover:underline"
              >
                <ArrowUpRight
                  className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>{fuente.name}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-white/5 pt-3 text-xs leading-relaxed text-zinc-500">
          ¿Ves un dato que debería estar y no está, o un topónimo que sí consta
          en una fuente? Escríbenos por la{" "}
          <Link
            href="/contacto"
            className="text-pink-400 underline-offset-2 hover:underline"
          >
            página de contacto
          </Link>{" "}
          y se corrige con la fuente delante, como en el{" "}
          <Link
            href="/correcciones"
            className="text-pink-400 underline-offset-2 hover:underline"
          >
            registro de correcciones
          </Link>
          .
        </p>
      </section>

      {articulos.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
            <span
              aria-hidden="true"
              className="h-6 w-1.5 rounded bg-pink-500"
            />
            Las piezas que sostienen este mapa
          </h2>
          <ArticleGrid articles={articulos} columns={2} />
        </section>
      )}

      <section className="mt-12 rounded-xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 via-zinc-900/40 to-cyan-500/10 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-xl font-black text-white">
          <Compass className="h-5 w-5 text-pink-500" aria-hidden="true" />
          Qué es este mapa y qué no
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
          Es un esquema de trabajo: seis regiones, cada dato con su estado y su
          fuente, y una lista explícita de lo que falta. No es un plano del
          juego, no está a escala y no pretende ser el mapa que Rockstar
          publicará cuando lo publique. Si citas esta página, enlázala como{" "}
          <span className="break-all text-zinc-100">
            {absoluteUrl("/mapa").replace(/^https?:\/\//, "")}
          </span>{" "}
          y cita la fuente original de cada dato, no el dibujo.
        </p>
        <p className="mt-3 text-xs text-zinc-500">
          Mapa mantenido por {EDITORIAL_NAME}. Última revisión completa de las
          fuentes: {mapaCorteLabel()} ({MAPA_REGIONES.length} regiones,{" "}
          {MAPA_FUENTES.length} fuentes).
        </p>
      </section>
    </div>
  );
}
