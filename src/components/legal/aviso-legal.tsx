/**
 * Página legal: aviso-legal.
 *
 * Componente de servidor extraído del antiguo StaticPage.tsx (1.153 líneas con
 * las seis páginas mezcladas). Los metadatos de la ruta viven en
 * `src/app/aviso-legal/page.tsx`.
 */
import { AlertTriangle, Scale } from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import { SectionTitle } from "@/components/legal/section-title";
import {
  CONTACT_EMAIL,
  LEGAL_OWNER,
  SITE_NAME,
  SITE_URL,
  isLegalOwnerComplete,
} from "@/lib/site";

export function LegalNotice() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <LegalHeader badge="Legal" title="Aviso Legal" updatedAt="15 de septiembre de 2026" />

      <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
        <section>
          <SectionTitle icon>
            <Scale className="h-5 w-5 text-pink-500" />
            1. Identificación del titular
          </SectionTitle>
          <p>
            El sitio web <strong>gtavidaily.com</strong> es un medio digital
            independiente dedicado a la cobertura informativa de Grand Theft
            Auto VI. De acuerdo con la Ley 34/2002 de servicios de la sociedad
            de la información y de comercio electrónico (LSSI-CE), se informan
            los siguientes datos del titular:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              <strong>Denominación:</strong>{" "}
              {LEGAL_OWNER.name ||
                `${SITE_NAME} (medio digital independiente)`}
            </li>
            {isLegalOwnerComplete && (
              <>
                <li>
                  <strong>NIF/CIF:</strong> {LEGAL_OWNER.taxId}
                </li>
                <li>
                  <strong>Domicilio:</strong> {LEGAL_OWNER.address}
                </li>
              </>
            )}
            <li>
              <strong>Sitio web:</strong>{" "}
              <a href={SITE_URL} className="text-cyan-400 underline">
                {SITE_URL}
              </a>
            </li>
            <li>
              <strong>Email de contacto:</strong>{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-cyan-400 underline"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <strong>Naturaleza:</strong> medio de comunicación digital no
              impreso, de titularidad privada
            </li>
          </ul>
          <p className="mt-3">
            Para cualquier comunicación oficial, los datos de contacto
            indicados anteriormente serán los únicos reconocidos a efectos
            legales.
          </p>
        </section>

        <section>
          <SectionTitle>
            2. Objeto del sitio
          </SectionTitle>
          <p>
            El objeto de gtavidaily.com es la publicación de noticias,
            análisis, rumores y contenidos informativos relacionados con el
            videojuego Grand Theft Auto VI (GTA VI) de Rockstar Games, así
            como cualquier otro contenido relacionado con la saga Grand Theft
            Auto, la industria del videojuego y la cultura gamer en general.
            El sitio se publica en español y está dirigido principalmente a
            la comunidad hispanohablante.
          </p>
        </section>

        <section>
          <SectionTitle>
            3. Condiciones de uso
          </SectionTitle>
          <p>
            El acceso y uso del sitio atribuye a quien lo realiza la
            condición de usuario, lo que implica la aceptación, sin
            reservas, de todas las disposiciones incluidas en este Aviso
            Legal, así como en la Política de Privacidad y la Política de
            Cookies.
          </p>
          <p>El usuario se compromete a:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              Hacer un uso adecuado y lícito del sitio, conforme a la
              legislación vigente y a este Aviso Legal.
            </li>
            <li>
              No realizar actividades que puedan dañar, sobrecargar,
              deteriorar o impedir la normal utilización del sitio.
            </li>
            <li>
              No introducir virus, código malicioso o cualquier otro elemento
              que pueda alterar el funcionamiento del sitio.
            </li>
            <li>
              No reproducir, copiar, distribuir o explotar comercialmente los
              contenidos del sitio sin autorización expresa por escrito.
            </li>
            <li>
              Respetar los derechos de propiedad intelectual e industrial
              del titular y de terceros.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle>
            4. Propiedad intelectual
          </SectionTitle>
          <p>
            Todos los contenidos del sitio (textos, imágenes, gráficos,
            iconos, diseño, código fuente, etc.) son propiedad de GTA VI
            Daily o de terceros que han autorizado su uso, y están protegidos
            por la legislación vigente sobre propiedad intelectual. La
            reproducción, distribución, comunicación pública o
            transformación, total o parcial, sin autorización expresa por
            escrito, está prohibida.
          </p>
          <p>
            Los nombres comerciales, marcas o signos distintivos son
            propiedad de sus respectivos titulares. El uso en el sitio de
            nombres comerciales, marcas o signos distintivos de terceros
            (especialmente &quot;Grand Theft Auto&quot;, &quot;GTA&quot;,
            &quot;Rockstar Games&quot;, &quot;Take-Two Interactive&quot; y
            otros) se realiza únicamente con fines informativos y
            descriptivos, sin implicar afiliación, patrocinio o
            endorsement por parte de los titulares de dichas marcas.
          </p>
        </section>

        <section>
          <SectionTitle icon>
            <AlertTriangle className="h-5 w-5 text-pink-500" />
            5. Carácter no oficial (fan site)
          </SectionTitle>
          <p>
            <strong>
              GTA VI Daily es un sitio fan no oficial y no está afiliado, ni
              patrocinado, ni endosado por Rockstar Games ni Take-Two
              Interactive.
            </strong>{" "}
            &quot;Grand Theft Auto&quot;, &quot;GTA&quot;, &quot;Vice
            City&quot;, &quot;Rockstar Games&quot;, &quot;Rockstar&quot; y
            todos los nombres, logos y marcas relacionados son propiedad de
            Take-Two Interactive Software, Inc. y/o sus filiales.
          </p>
          <p>
            Todos los contenidos publicados en este sitio tienen propósito
            informativo, periodístico y crítico, y se publican bajo la
            doctrina de fair use (uso legítimo) reconocida por la legislación
            sobre propiedad intelectual. Las imágenes utilizadas son
            ilustraciones conceptuales generadas localmente y no
            representan arte oficial del juego, salvo cuando se indique
            lo contrario y se cite la fuente.
          </p>
        </section>

        <section>
          <SectionTitle>
            6. Responsabilidad
          </SectionTitle>
          <p>
            El titular no se hace responsable de los posibles daños o
            perjuicios que pudieran derivarse del uso del sitio, incluyendo
           entre otros:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              Posibles errores técnicos o interrupciones en el acceso al
              sitio.
            </li>
            <li>
              Presencia de virus o código malicioso en el sitio o en sitios
              de terceros enlazados.
            </li>
            <li>
              Veracidad, exactitud o actualización de los contenidos
              publicados, especialmente rumores y filtraciones que se
              identifiquen claramente como tales.
            </li>
            <li>
              Contenidos de sitios de terceros a los que se acceda desde
              enlaces incluidos en nuestro sitio.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle>
            7. Enlaces a sitios de terceros
          </SectionTitle>
          <p>
            El sitio puede contener enlaces a sitios web de terceros
            (fuentes de noticias, tiendas online, redes sociales, etc.) cuyo
            contenido no controlamos. El titular no se hace responsable del
            contenido de dichos sitios ni de sus políticas de privacidad. Te
            recomendamos leer las políticas de privacidad y términos de uso de
            cualquier sitio de terceros que visites.
          </p>
        </section>

        <section>
          <SectionTitle>
            8. Publicidad y enlaces de afiliados
          </SectionTitle>
          <p>
            Este sitio muestra publicidad a través de Google AdSense y,
            eventualmente, otros networks publicitarios. Algunos enlaces
            externos pueden ser enlaces de afiliados, lo que significa que
            podríamos recibir una pequeña comisión si realizas una compra a
            través de ellos, sin coste adicional para ti. Esta comisión nos
            ayuda a mantener el sitio y no influye en nuestra línea editorial.
            Cuando un enlace sea de afiliados, lo indicaremos claramente.
          </p>
        </section>

        <section>
          <SectionTitle>
            9. Modificación del Aviso Legal
          </SectionTitle>
          <p>
            El titular se reserva el derecho de modificar el presente Aviso
            Legal para adaptarlo a novedades legislativas o
            jurisprudenciales, así como a prácticas de la industria. La
            vigencia temporal del Aviso Legal coincide con el tiempo de su
            exposición, hasta que sea modificado total o parcialmente.
          </p>
        </section>

        <section>
          <SectionTitle>
            10. Legislación aplicable y jurisdicción
          </SectionTitle>
          <p>
            El presente Aviso Legal se rige por la legislación española. Para
            cualquier controversia, las partes se someten a los Juzgados y
            Tribunales del domicilio del titular, salvo que la legislación
            aplicable imponga otra jurisdicción.
          </p>
        </section>
      </div>
    </div>
  );
}
