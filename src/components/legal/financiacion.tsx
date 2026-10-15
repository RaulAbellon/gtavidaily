/**
 * Página de confianza: financiación.
 *
 * Explica con qué se sostiene el sitio hoy (nada todavía), qué cambia cuando
 * Google AdSense esté aprobado y qué no se va a hacer nunca con dinero de
 * terceros. La parte importante es la separación entre publicidad y redacción.
 *
 * Los metadatos de la ruta viven en `src/app/financiacion/page.tsx`.
 */
import Link from "next/link";
import { BadgeEuro, Ban, Handshake, Megaphone } from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import { SectionTitle } from "@/components/legal/section-title";
import { SITE_NAME } from "@/lib/site";

export function LegalFunding() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <LegalHeader
        badge="Transparencia"
        title="Cómo nos financiamos"
        updatedAt="14 de octubre de 2026"
        intro="De dónde sale el dinero del sitio, qué cambia cuando la publicidad esté activa y qué no aceptamos."
      />

      <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
        <section>
          <SectionTitle icon>
            <BadgeEuro className="h-5 w-5 text-pink-500" />
            1. Hoy: sin ingresos y sin anuncios
          </SectionTitle>
          <p>
            {SITE_NAME} es un medio independiente y no oficial. A día de hoy{" "}
            <strong>no muestra ni un solo anuncio</strong> y no tiene ninguna
            fuente de ingresos activa: ni suscripciones, ni muro de pago, ni
            contenido patrocinado, ni enlaces de afiliación.
          </p>
          <p>
            El sitio está pendiente de la aprobación de Google AdSense. Hasta
            que esa aprobación llegue —y solo si llega— no se renderiza ningún
            hueco publicitario: el sistema solo pinta un bloque cuando existe una
            unidad de anuncio configurada de verdad, precisamente para no dejar
            cajas vacías ni simular una publicidad que no existe.
          </p>
        </section>

        <section>
          <SectionTitle icon>
            <Megaphone className="h-5 w-5 text-pink-500" />
            2. Cuando AdSense esté activo
          </SectionTitle>
          <p>
            Si la cuenta se aprueba, el modelo será el más simple y el más
            fácil de auditar: <strong>publicidad display servida por Google</strong>{" "}
            en huecos fijos de la página. Nada más.
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              Los anuncios se cargan solo con tu consentimiento, gestionado por
              la plataforma certificada en el Espacio Económico Europeo, el Reino
              Unido y Suiza, y con el Consent Mode v2 de Google en estado
              denegado hasta que decidas. Está explicado en la{" "}
              <Link
                href="/cookies"
                className="font-semibold text-pink-400 underline-offset-2 hover:underline"
              >
                política de cookies
              </Link>{" "}
              y en la{" "}
              <Link
                href="/privacidad"
                className="font-semibold text-pink-400 underline-offset-2 hover:underline"
              >
                política de privacidad
              </Link>
              .
            </li>
            <li>
              Sin formatos que tapen el contenido: nada de ventanas que se abran
              solas, capas a pantalla completa ni anuncios que se muevan mientras
              se lee.
            </li>
            <li>
              Los bloques publicitarios van separados del texto y rotulados como
              publicidad cuando el formato lo permite.
            </li>
            <li>
              Ni un anunciante decide qué se publica, en qué orden o con qué
              titulares. No hay acceso previo a las piezas para ningún
              anunciante.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle icon>
            <Ban className="h-5 w-5 text-pink-500" />
            3. Lo que no vamos a hacer
          </SectionTitle>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>No hay contenido patrocinado sin señalar.</strong> Si algún
              día se publica una pieza pagada por un anunciante, llevará un
              aviso visible al principio que diga quién la paga. Mientras no lo
              lleve, no está pagada.
            </li>
            <li>
              <strong>No hay enlaces pagados ni de afiliación.</strong> Ninguna
              tienda, editor o plataforma paga por aparecer enlazada, y no
              cobramos comisión por las compras que se hagan desde aquí.
            </li>
            <li>
              <strong>No aceptamos dinero de Rockstar Games ni de Take-Two</strong>{" "}
              ni de sus agencias: ni publicidad, ni patrocinio, ni invitaciones
              con gastos pagados que condicionen la cobertura. Si alguna vez
              aceptáramos un viaje o un acceso cedido, se diría en la pieza.
            </li>
            <li>
              <strong>No vendemos datos personales</strong> ni cedemos listas de
              suscriptores a terceros.
            </li>
            <li>
              <strong>No compramos tráfico.</strong> Ni redes de visitas, ni
              intercambios, ni bots: además de ser fraudulento, destruiría lo
              único que este sitio puede ofrecer, que es que sus datos se puedan
              comprobar.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle icon>
            <Handshake className="h-5 w-5 text-pink-500" />
            4. La separación entre publicidad y redacción
          </SectionTitle>
          <p>
            Es la regla que sostiene todo lo anterior y la que se puede
            comprobar en cualquier página del sitio:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              Quien escribe y verifica las piezas no habla con anunciantes ni
              conoce sus encargos.
            </li>
            <li>
              Ninguna decisión editorial —qué se publica, con qué titular, en
              qué orden— se toma mirando el rendimiento publicitario.
            </li>
            <li>
              La publicidad no se inserta dentro del texto ni entre párrafos de
              un artículo, para que no se pueda confundir con el contenido.
            </li>
            <li>
              Si en el futuro hubiera una vía de ingresos distinta, se publicará
              en esta misma página antes de activarla, con su nombre y sus
              condiciones.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle>
            5. Dónde reclamar
          </SectionTitle>
          <p>
            Si consideras que algo de lo anterior no se cumple, escríbenos por la{" "}
            <Link
              href="/contacto"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              página de contacto
            </Link>
            . El método de trabajo y las normas de publicación están en la{" "}
            <Link
              href="/politica-editorial"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              política editorial
            </Link>
            ; quién hace el sitio, en la{" "}
            <Link
              href="/equipo"
              className="font-semibold text-pink-400 underline-offset-2 hover:underline"
            >
              página de equipo
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
