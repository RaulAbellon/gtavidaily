/**
 * Página de confianza: correcciones.
 *
 * Dos mitades: cómo se pide una corrección y qué compromiso hay detrás, y el
 * registro público de las que ya se han hecho. El registro sale de
 * `src/lib/correcciones.ts`, que solo contiene correcciones reales y
 * documentadas; no se inventa ninguna entrada.
 *
 * Los metadatos de la ruta viven en `src/app/correcciones/page.tsx`.
 */
import Link from "next/link";
import { CheckCircle2, Clock, History, MailWarning } from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import { SectionTitle } from "@/components/legal/section-title";
import {
  CORRECCION_CIERRE,
  CORRECCION_PLAZO,
  getCorreccionesDesc,
  getCorreccionesResumen,
} from "@/lib/correcciones";
import { getArticleBySlug, type Article } from "@/lib/data";
import { CONTACT_EMAIL } from "@/lib/site";

export function LegalCorrections() {
  const correcciones = getCorreccionesDesc();
  const resumen = getCorreccionesResumen();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <LegalHeader
        badge="Transparencia"
        title="Correcciones"
        updatedAt="14 de octubre de 2026"
        intro="Cómo pedirnos una corrección, qué plazo asumimos y el registro de los errores que ya hemos corregido."
      />

      <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
        <section>
          <SectionTitle icon>
            <MailWarning className="h-5 w-5 text-pink-500" />
            1. Cómo pedir una corrección
          </SectionTitle>
          <p>
            Si has encontrado un error —un dato mal atribuido, una cifra
            equivocada, una fecha que no se sostiene, una fuente que dice lo
            contrario de lo que escribimos—, escríbenos y dinos tres cosas:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>La URL exacta de la pieza o de la línea que está mal.</li>
            <li>Qué dice el texto y qué debería decir.</li>
            <li>
              La fuente que lo demuestra, con enlace. Cuanto más cerca esté del
              origen —documento oficial, ficha de tienda, mensaje del propio
              protagonista—, antes se resuelve.
            </li>
          </ul>
          <p>
            Puedes hacerlo desde el{" "}
            <Link
              href="/contacto"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              formulario de contacto
            </Link>{" "}
            con el asunto «Corrección» o directamente a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="break-all text-cyan-400 underline"
            >
              {CONTACT_EMAIL}
            </a>
            . Las peticiones de retirada por derechos de autor tienen su propio
            procedimiento en la{" "}
            <Link
              href="/dmca"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              página DMCA
            </Link>
            .
          </p>
        </section>

        <section>
          <SectionTitle icon>
            <Clock className="h-5 w-5 text-pink-500" />
            2. Lo que nos comprometemos a hacer
          </SectionTitle>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Acusar recibo en {CORRECCION_PLAZO}.</strong> Aunque
              todavía no hayamos podido comprobar nada, contestamos para que
              sepas que el aviso está en la cola.
            </li>
            <li>
              <strong>Resolver en {CORRECCION_CIERRE}.</strong> Si el error se
              puede comprobar, se corrige en ese plazo. Si la corrección
              depende de una fuente que aún no existe, se dice que sigue
              abierta en lugar de dejarla sin respuesta.
            </li>
            <li>
              <strong>Corregir con nota visible al pie del artículo.</strong> El
              texto se arregla y se añade al pie del artículo afectado una nota
              con la fecha, qué decía y qué dice ahora. No se reescribe en
              silencio y no se cambia la fecha de publicación para disimular el
              arreglo.
            </li>
            <li>
              <strong>Anotarlo en el registro de abajo.</strong> Toda corrección
              que cambie un hecho —no una coma ni un estilo— entra en el
              registro público con su fecha y su motivo.
            </li>
            <li>
              <strong>Si no corregimos, explicamos por qué.</strong> Cuando la
              discrepancia no es un error sino una interpretación distinta, se
              responde igualmente y se argumenta con las fuentes delante.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle icon>
            <History className="h-5 w-5 text-pink-500" />
            3. Registro público de correcciones
          </SectionTitle>
          <p>
            {resumen.total} correcciones registradas hasta hoy, que han afectado
            a {resumen.articulos} artículos. La más reciente es del{" "}
            {resumen.ultima?.toLowerCase()}. Cada entrada enlaza el artículo
            corregido y la fuente con la que se puede comprobar el dato bueno.
          </p>

          <ol className="mt-4 space-y-4">
            {correcciones.map((correction) => {
              const articulos = correction.articles
                .map((slug) => getArticleBySlug(slug))
                .filter((article): article is Article => Boolean(article));

              return (
                <li
                  key={correction.id}
                  className="rounded-xl border border-white/5 bg-zinc-900/40 p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-pink-400">
                    {correction.dateLabel}
                  </p>
                  <h3 className="mt-1 text-lg font-bold leading-snug text-white">
                    {correction.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    <span className="font-bold uppercase tracking-wider text-amber-300">
                      Qué decía ·{" "}
                    </span>
                    {correction.what}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    <span className="font-bold uppercase tracking-wider text-emerald-300">
                      Qué se cambió ·{" "}
                    </span>
                    {correction.fix}
                  </p>

                  {articulos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        Artículos corregidos ({articulos.length})
                      </p>
                      <ul className="mt-1.5 flex flex-wrap gap-2">
                        {articulos.map((article) => (
                          <li key={article.slug}>
                            <Link
                              href={`/articulo/${article.slug}`}
                              className="inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:border-pink-500/40 hover:text-white"
                            >
                              {article.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {correction.sources.length > 0 && (
                    <div className="mt-4 border-t border-white/5 pt-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        Cómo comprobarlo
                      </p>
                      <ul className="mt-1.5 space-y-1.5">
                        {correction.sources.map((source) => (
                          <li key={source.url}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="text-sm text-cyan-400 underline-offset-2 hover:underline"
                            >
                              {source.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <section>
          <SectionTitle icon>
            <CheckCircle2 className="h-5 w-5 text-pink-500" />
            4. Lo que este registro no es
          </SectionTitle>
          <p>
            No es una lista de mejoras ni de cambios de estilo: aquí solo entran
            correcciones de hechos. Tampoco es un archivo histórico completo
            —empieza el 1 de octubre de 2026— ni un sustituto de la{" "}
            <Link
              href="/cronologia"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              cronología
            </Link>
            , que es donde se ve cómo cambia lo que se sabe de un juego sin
            lanzar. El método con el que se evitan estos errores está en la{" "}
            <Link
              href="/politica-editorial"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              política editorial
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
