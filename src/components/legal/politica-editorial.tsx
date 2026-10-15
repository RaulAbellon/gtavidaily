/**
 * Página de confianza: política editorial.
 *
 * Explica el método antes que la línea editorial: de dónde sale un dato, en qué
 * orden se cree, qué no se publica y cómo se etiqueta lo que no está
 * confirmado. Los metadatos de la ruta viven en
 * `src/app/politica-editorial/page.tsx`.
 *
 * El texto es deliberadamente verificable: cada regla se puede comprobar en el
 * propio sitio (etiquetas de la cronología, sección de fuentes de cada
 * artículo, registro de correcciones). No promete nada que el sitio no haga.
 */
import Link from "next/link";
import { AlertTriangle, BadgeCheck, FileText, Scale, Sparkles } from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import { SectionTitle } from "@/components/legal/section-title";
import { SITE_NAME } from "@/lib/site";

export function LegalEditorialPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <LegalHeader
        badge="Transparencia"
        title="Política editorial"
        updatedAt="14 de octubre de 2026"
        intro="Cómo se verifica lo que publicamos, qué no publicamos nunca y cómo se marca lo que todavía no está confirmado."
      />

      <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
        <section>
          <SectionTitle icon>
            <FileText className="h-5 w-5 text-pink-500" />
            1. Qué publicamos y qué no
          </SectionTitle>
          <p>
            Publicamos información sobre Grand Theft Auto VI con una condición:
            que se pueda comprobar. Eso se traduce en cinco reglas que se aplican
            a todas las piezas, sin excepciones por prisa ni por tráfico.
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Nada sin fuente.</strong> Cada afirmación relevante va
              acompañada de la fuente que la sostiene, enlazada al final del
              artículo. Si un dato no tiene una fuente que se pueda abrir y
              leer, no se publica aunque lo repita todo el mundo.
            </li>
            <li>
              <strong>Ninguna cifra inventada.</strong> Si no existe una cifra
              oficial, escribimos que no existe. No completamos un hueco con un
              número que suene razonable, ni aunque el hueco lo rellene otro
              medio.
            </li>
            <li>
              <strong>La fuente no sustituye a la atribución.</strong> Nunca se
              atribuye a Rockstar Games ni a Take-Two algo que no hayan dicho.
              Una declaración recogida en una entrevista se cita como lo que es,
              y se dice quién la hizo y dónde.
            </li>
            <li>
              <strong>El material oficial no se usa para sostener rumores.</strong>{" "}
              Las imágenes y documentos que Rockstar publica para descarga
              ilustran piezas informativas, nunca especulación, filtraciones,
              conflictos laborales ni sucesos negativos: daría a entender que la
              compañía respalda lo que escribimos. En esos temas se usa una
              ilustración propia o ninguna.
            </li>
            <li>
              <strong>No reproducimos material filtrado.</strong> Cuando hay una
              filtración, contamos qué ha circulado, de quién procede la
              afirmación y qué parte no está verificada, pero no enlazamos ni
              redistribuimos el material.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle icon>
            <BadgeCheck className="h-5 w-5 text-pink-500" />
            2. Cómo se verifica un dato
          </SectionTitle>
          <p>
            Antes de publicar, cada dato relevante se busca en el origen. El
            orden de confianza es siempre el mismo, y cuando dos fuentes se
            contradicen gana la de arriba:
          </p>
          <ol className="ml-6 list-decimal space-y-2">
            <li>
              <strong>Documento de la compañía o de una institución:</strong>{" "}
              Newswire de Rockstar, comunicado de resultados de Take-Two,
              expediente o resolución municipal, ficha de tienda de primera
              parte.
            </li>
            <li>
              <strong>Declaración de una persona identificable</strong> en una
              entrevista o en su propio canal, con enlace al mensaje original.
            </li>
            <li>
              <strong>Medio con fuentes propias:</strong> cobertura firmada que
              dice de dónde sale el dato.
            </li>
            <li>
              <strong>Recopilaciones y agregadores:</strong> solo como pista
              para llegar a la fuente real, nunca como fuente citada.
            </li>
          </ol>
          <p>
            Los foros, los vídeos de creadores y las publicaciones en redes no
            son fuente de un hecho. Solo se enlazan cuando es el propio
            protagonista quien habla, y entonces se dice que es su versión.
          </p>
          <p>
            Cuando el dato depende de un cálculo nuestro —una hora de
            desbloqueo, una proporción, un calendario—, la página lo declara y
            explica con qué se ha hecho. La{" "}
            <Link
              href="/desbloqueo"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              tabla de desbloqueo por países
            </Link>{" "}
            es el ejemplo más claro: la regla de medianoche local es de Rockstar
            y el resto es aritmética nuestra, y así está escrito.
          </p>
        </section>

        <section>
          <SectionTitle icon>
            <AlertTriangle className="h-5 w-5 text-pink-500" />
            3. Qué es un rumor y cómo se etiqueta
          </SectionTitle>
          <p>
            Un rumor es una afirmación sobre el juego que no está sostenida por
            Rockstar, por Take-Two ni por un documento oficial. Puede ser
            perfectamente publicable si se presenta como lo que es. En este
            sitio hay tres estados y se marcan siempre de forma visible:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Confirmado:</strong> lo dijo la compañía o consta en un
              documento oficial. En la{" "}
              <Link
                href="/cronologia"
                className="font-semibold text-pink-400 underline-offset-2 hover:underline"
              >
                cronología
              </Link>{" "}
              lleva la etiqueta verde.
            </li>
            <li>
              <strong>Confirmado, pero sin documento de la compañía:</strong> es
              un hecho público y verificable —una sentencia, un suceso, una
              declaración recogida por la prensa— sostenido por medios de
              referencia. Va marcado como «Hecho público» y no se presenta igual
              que lo anterior.
            </li>
            <li>
              <strong>Reportado:</strong> lo publicó un medio o un periodista
              con fuentes propias y la compañía no lo ha confirmado. Lleva la
              etiqueta ámbar y el texto dice expresamente que no está
              confirmado.
            </li>
          </ul>
          <p>
            El estado es el del <strong>hecho</strong>, no el de la fuente: una
            fecha puede estar confirmada y su cifra de audiencia solo reportada,
            y se dice en cada caso. La lista explícita de lo que sigue sin
            fuente está publicada al final de la cronología.
          </p>
        </section>

        <section>
          <SectionTitle icon>
            <Sparkles className="h-5 w-5 text-pink-500" />
            4. Cómo se hace una pieza
          </SectionTitle>
          <p>
            Todas las piezas las escribe y revisa una persona: el reparto de
            tareas está explicado en la{" "}
            <Link
              href="/equipo"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              página de equipo
            </Link>
            . Ningún artículo se publica sin que alguien haya abierto las fuentes
            que cita y haya comprobado que dicen lo que el texto afirma.
          </p>
          <p>
            Las ilustraciones propias se generan con el motor de portadas del
            sitio a partir de la escena descrita para cada artículo: no son
            capturas del juego, no son arte oficial y no se presentan como
            filtraciones. Cuando una pieza usa material distribuido por Rockstar
            para descarga y compartición, el pie de la imagen lo indica con su
            crédito y su enlace.
          </p>
        </section>

        <section>
          <SectionTitle icon>
            <Scale className="h-5 w-5 text-pink-500" />
            5. Correcciones y publicidad
          </SectionTitle>
          <p>
            Nos equivocamos como cualquier medio. Cuando pasa, se corrige y se
            dice: hay un{" "}
            <Link
              href="/correcciones"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              registro público de correcciones
            </Link>{" "}
            con lo que se cambió y por qué, y cada corrección deja una nota
            visible al pie del artículo afectado. Las normas de financiación y la
            separación entre publicidad y contenido están en{" "}
            <Link
              href="/financiacion"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              cómo nos financiamos
            </Link>
            .
          </p>
          <p>
            Para señalar un error, aportar una fuente mejor o pedir una
            aclaración, la vía es la{" "}
            <Link
              href="/contacto"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              página de contacto
            </Link>
            . {SITE_NAME} es un medio no oficial y no está afiliado a Rockstar
            Games ni a Take-Two Interactive.
          </p>
        </section>
      </div>
    </div>
  );
}
