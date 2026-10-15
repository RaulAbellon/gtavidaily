/**
 * Página de confianza: equipo.
 *
 * El sitio firma como «Redacción» a propósito y no publica nombres ni fichas de
 * redactores. Esta página convierte esa decisión en lo que de verdad aporta al
 * lector: el reparto de tareas, cómo se verifica y quién responde de qué. No se
 * inventa ninguna persona, ningún cargo ni ningún dato biográfico.
 *
 * Los metadatos de la ruta viven en `src/app/equipo/page.tsx`.
 */
import Link from "next/link";
import {
  ClipboardCheck,
  FileSearch,
  PenLine,
  ShieldAlert,
  Users,
} from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import { SectionTitle } from "@/components/legal/section-title";
import { EDITORIAL_NAME, SITE_NAME } from "@/lib/site";

export function LegalTeam() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <LegalHeader
        badge="Transparencia"
        title="Quién hace el sitio"
        updatedAt="14 de octubre de 2026"
        intro="Publicamos bajo una firma colectiva. Esto es lo que hay detrás de esa firma: cómo se reparte el trabajo, cómo se verifica y quién responde."
      />

      <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
        <section>
          <SectionTitle icon>
            <Users className="h-5 w-5 text-pink-500" />
            1. Por qué firmamos como «Redacción»
          </SectionTitle>
          <p>
            Todos los artículos de {SITE_NAME} van firmados por{" "}
            <strong className="font-semibold text-white">{EDITORIAL_NAME}</strong>
            . No es una marca vacía: es una decisión deliberada. Preferimos una
            firma colectiva honesta a una plantilla de nombres y cargos que no
            existe, y por eso no publicamos fichas de redactores ni biografías
            inventadas.
          </p>
          <p>
            Lo que sí se puede saber es cómo trabaja esa redacción y quién
            responde de lo que se publica. Es lo que cuentan los apartados
            siguientes, y es más útil para juzgar un medio que un retrato.
          </p>
        </section>

        <section>
          <SectionTitle icon>
            <FileSearch className="h-5 w-5 text-pink-500" />
            2. Cómo se reparte el trabajo
          </SectionTitle>
          <p>
            Cada pieza pasa por tres fases y ninguna se salta. No son
            departamentos distintos: son tareas distintas, y quien las hace
            responde de ellas.
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Documentación.</strong> Seguimiento diario de las fuentes
              que importan: Newswire y páginas oficiales de Rockstar, comunicados
              de resultados de Take-Two, fichas de tienda de primera parte,
              expedientes y agendas municipales, prensa especializada
              internacional y las declaraciones de los protagonistas en su propio
              canal. De aquí sale el material con el que se puede escribir algo
              que no esté ya en otros diez sitios.
            </li>
            <li>
              <strong>Redacción.</strong> El texto se escribe en español de
              España, con una voz propia y sin relleno. Un artículo que no aporta
              nada sobre lo publicado no sale, aunque haya hueco en la portada.
            </li>
            <li>
              <strong>Verificación.</strong> Antes de publicar, otra lectura
              abre una a una las fuentes citadas y comprueba que dicen lo que el
              texto afirma, que las cifras están donde se dice y que lo no
              confirmado va marcado como tal. Es la fase que más veces cambia un
              titular.
            </li>
          </ul>
          <p>
            Después hay dos trabajos permanentes: mantener la{" "}
            <Link
              href="/cronologia"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              cronología de confirmaciones
            </Link>{" "}
            y la{" "}
            <Link
              href="/desbloqueo"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              tabla de desbloqueo por países
            </Link>{" "}
            al día, y atender las{" "}
            <Link
              href="/correcciones"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              correcciones
            </Link>
            .
          </p>
        </section>

        <section>
          <SectionTitle icon>
            <PenLine className="h-5 w-5 text-pink-500" />
            3. Cómo se decide qué se publica
          </SectionTitle>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Menos piezas y mejor documentadas.</strong> No hay una
              cuota diaria que cumplir. Si un día no hay nada que aporte algo
              nuevo, no se publica nada.
            </li>
            <li>
              <strong>Un hecho, una pieza.</strong> Cuando varias noticias
              cuentan lo mismo, se unifican en la que mejor lo explica en lugar
              de repartirlo en tres URLs que compiten entre sí.
            </li>
            <li>
              <strong>Cada pieza indica sus fuentes</strong> al final, con
              enlace, y distingue en el propio texto lo confirmado de lo
              reportado. Las normas completas están en la{" "}
              <Link
                href="/politica-editorial"
                className="font-semibold text-pink-400 underline-offset-2 hover:underline"
              >
                política editorial
              </Link>
              .
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle icon>
            <ClipboardCheck className="h-5 w-5 text-pink-500" />
            4. Quién responde
          </SectionTitle>
          <p>
            De cada texto responde la redacción que lo firma; del sitio, su
            titular. La identificación completa del responsable —nombre, NIF y
            domicilio— está publicada en el{" "}
            <Link
              href="/aviso-legal"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              aviso legal
            </Link>
            , porque es una obligación legal y porque un medio tiene que poder
            ser localizado. Para cualquier asunto editorial, una corrección o una
            reclamación hay una dirección que funciona: la{" "}
            <Link
              href="/contacto"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              página de contacto
            </Link>
            .
          </p>
        </section>

        <section>
          <SectionTitle icon>
            <ShieldAlert className="h-5 w-5 text-pink-500" />
            5. Sitio no oficial
          </SectionTitle>
          <p>
            {SITE_NAME} es un medio <strong>no oficial</strong>. No está
            afiliado, patrocinado ni respaldado por Rockstar Games ni por
            Take-Two Interactive, y no mantiene con ellos ninguna relación
            comercial. Grand Theft Auto, GTA, Vice City y Rockstar Games son
            marcas registradas de sus propietarios; se citan con propósito
            informativo y crítico.
          </p>
          <p>
            Tampoco somos un canal de la compañía ni hablamos en su nombre. Si
            buscas información oficial sobre el juego, la fuente es la{" "}
            <a
              href="https://www.rockstargames.com/VI"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-cyan-400 underline"
            >
              página oficial de Grand Theft Auto VI
            </a>
            . Lo que hacemos aquí es ordenar, verificar y contextualizar lo que
            publican quienes sí tienen esa información.
          </p>
        </section>
      </div>
    </div>
  );
}
