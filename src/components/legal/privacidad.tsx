/**
 * Página legal: privacidad.
 *
 * Componente de servidor extraído del antiguo StaticPage.tsx (1.153 líneas con
 * las seis páginas mezcladas). Los metadatos de la ruta viven en
 * `src/app/privacidad/page.tsx`.
 */
import { FileText, Shield } from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import { SectionTitle } from "@/components/legal/section-title";
import {
  CONTACT_EMAIL,
  LEGAL_OWNER,
  SITE_NAME,
  isLegalOwnerComplete,
} from "@/lib/site";

export function LegalPrivacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <LegalHeader badge="Legal" title="Política de Privacidad" updatedAt="15 de septiembre de 2026" />

      <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
        <section>
          <SectionTitle icon>
            <Shield className="h-5 w-5 text-pink-500" />
            1. Responsable del tratamiento
          </SectionTitle>
          <p>
            El responsable del tratamiento de los datos personales recabados a
            través del sitio web <strong>{SITE_NAME}</strong> es{" "}
            <strong>
              {isLegalOwnerComplete
                ? LEGAL_OWNER.name
                : "el titular del sitio"}
            </strong>
            {isLegalOwnerComplete ? (
              <>
                , con NIF/CIF <strong>{LEGAL_OWNER.taxId}</strong> y domicilio
                en <strong>{LEGAL_OWNER.address}</strong>
              </>
            ) : (
              <>
                . La denominación social, el NIF y el domicilio completos
                deben publicarse en esta misma página antes de activar la
                publicidad: son obligatorios por el artículo 10 de la LSSI-CE y
                el artículo 13 del RGPD
              </>
            )}
            . Para cualquier cuestión relacionada con el tratamiento de datos
            personales puedes escribir a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-cyan-400 underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <SectionTitle>
            2. Datos que recogemos
          </SectionTitle>
          <p>
            Como medio de noticias, nuestro sitio funciona principalmente sin
            necesidad de registro. Sin embargo, podemos recabar los siguientes
            datos:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Datos de navegación:</strong> dirección IP, tipo de
              navegador, sistema operativo, páginas visitadas, tiempo de
              permanencia, fuente de tráfico. Se utilizan exclusivamente con
              fines analíticos y estadísticos.
            </li>
            <li>
              <strong>Datos de formulario de contacto:</strong> nombre,
              correo electrónico y contenido del mensaje, si decides
              contactarnos. Se utilizan únicamente para responder a tu
              consulta.
            </li>
            <li>
              <strong>Datos de cookies:</strong> tal y como se detalla en
              nuestra Política de Cookies, podemos utilizar cookies propias y
              de terceros para mejorar la experiencia, analizar el tráfico y
              servir publicidad.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle>
            3. Finalidades del tratamiento
          </SectionTitle>
          <p>Los datos se tratan con las siguientes finalidades:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Permitir el funcionamiento básico del sitio web.</li>
            <li>
              Analizar el comportamiento de los usuarios para mejorar el
              contenido y la experiencia (solo con tu consentimiento).
            </li>
            <li>
              Servir publicidad personalizada a través de Google AdSense y
              otros partners (solo con tu consentimiento).
            </li>
            <li>
              Atender consultas y solicitudes recibidas a través del
              formulario de contacto.
            </li>
            <li>
              Cumplir con las obligaciones legales que pudieran ser exigibles.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle>
            4. Base legal del tratamiento
          </SectionTitle>
          <p>
            La base legal para el tratamiento de tus datos personales se
            fundamenta en:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Consentimiento</strong> (art. 6.1.a RGPD): para el uso
              de cookies analíticas y de marketing, así como para el
              tratamiento de datos del formulario de contacto.
            </li>
            <li>
              <strong>Interés legítimo</strong> (art. 6.1.f RGPD): para la
              prevención de fraudes, seguridad del sitio y cumplimiento de
              obligaciones contractuales.
            </li>
            <li>
              <strong>Cumplimiento legal</strong> (art. 6.1.c RGPD): cuando
              exista una obligación legal de conservar determinados datos.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle>
            5. Plazos de conservación
          </SectionTitle>
          <p>
            Los datos de navegación se conservan durante el tiempo
            estrictamente necesario para las finalidades para las que fueron
            recabados, y en cualquier caso durante el plazo legalmente
            establecido. Los datos del formulario de contacto se conservan
            durante el tiempo necesario para responder a la consulta, y como
            máximo 12 meses, salvo que exista una obligación legal de
            conservación por mayor tiempo. Los datos obtenidos a través de
            cookies se conservan según lo indicado en la Política de Cookies.
          </p>
        </section>

        <section>
          <SectionTitle icon>
            <FileText className="h-5 w-5 text-pink-500" />
            6. Google AdSense y publicidad personalizada
          </SectionTitle>
          <p>
            Este sitio utiliza Google AdSense, un servicio de publicidad
            proporcionado por Google LLC. Google y sus proveedores externos
            utilizan cookies para mostrar anuncios basados en visitas
            anteriores del usuario a nuestro sitio o a otros sitios.
          </p>
          <p>
            <strong>Quién recoge tu consentimiento.</strong> En el Espacio
            Económico Europeo, el Reino Unido y Suiza lo recoge la plataforma de
            gestión de consentimiento (CMP) certificada por Google, obligatoria
            en esas regiones, que emite la cadena de consentimiento del marco
            europeo (IAB TCF); puedes cambiar o retirar tu decisión desde
            «Configurar cookies» en el pie de página. En el resto del mundo lo
            recoge el banner propio del sitio. En ambos casos el sistema arranca
            con el Consent Mode v2 de Google en estado denegado, de modo que
            hasta que no decides no se escribe ninguna cookie publicitaria ni se
            personaliza la publicidad: la etiqueta de Google está presente en las
            páginas porque es la que sirve el mensaje de consentimiento donde es
            obligatorio.
          </p>
          <p>
            El uso de cookies de publicidad por parte de Google permite a
            Google y a sus partners mostrar anuncios a tus usuarios en base a
            su visita a nuestros sitios o a otros sitios en Internet. Los
            usuarios pueden desactivar la publicidad personalizada visitando la{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-cyan-400 underline"
            >
              Configuración de anuncios de Google
            </a>
            .
          </p>
          <p>
            Puedes encontrar más información sobre cómo Google utiliza los
            datos en{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-cyan-400 underline"
            >
              Cómo Google utiliza la información de los sitios o apps que
              utilizan nuestros servicios
            </a>
            .
          </p>
        </section>

        <section>
          <SectionTitle>
            7. Destinatarios de los datos
          </SectionTitle>
          <p>
            Tus datos podrán ser comunicados a las siguientes entidades, en
            calidad de encargados del tratamiento:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Google LLC:</strong> para la prestación del servicio de
              publicidad (Google AdSense) y analítica (Google Analytics, si
              aplicase).
            </li>
            <li>
              <strong>Proveedores de hosting:</strong> para el alojamiento del
              sitio web.
            </li>
            <li>
              <strong>Proveedores de servicios de email:</strong> para la
              gestión de consultas recibidas a través del formulario de
              contacto.
            </li>
          </ul>
          <p>
            No cederemos tus datos a terceros sin tu consentimiento expreso,
            salvo cuando sea necesario para cumplir con obligaciones legales.
          </p>
        </section>

        <section>
          <SectionTitle>
            8. Transferencias internacionales
          </SectionTitle>
          <p>
            Algunos de los proveedores mencionados (especialmente Google LLC)
            están establecidos en Estados Unidos u otros países fuera del
            Espacio Económico Europeo. Estas transferencias internacionales se
            realizan bajo garantías adecuadas, tales como cláusulas
            contractuales tipo aprobadas por la Comisión Europea, o bajo
            decisiones de adecuación. Puedes solicitar más información sobre
            estas transferencias contactando con nosotros.
          </p>
        </section>

        <section>
          <SectionTitle>
            9. Derechos del usuario (RGPD)
          </SectionTitle>
          <p>
            Conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica
            3/2018 de Protección de Datos Personales y garantía de los
            derechos digitales (LOPDGDD), tienes los siguientes derechos:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Acceso:</strong> obtener información sobre si estamos
              tratando tus datos y, en su caso, acceder a ellos.
            </li>
            <li>
              <strong>Rectificación:</strong> solicitar la corrección de datos
              inexactos o incompletos.
            </li>
            <li>
              <strong>Supresión:</strong> solicitar la eliminación de tus
              datos cuando ya no sean necesarios.
            </li>
            <li>
              <strong>Limitación del tratamiento:</strong> solicitar que
              suspendamos el tratamiento en determinadas circunstancias.
            </li>
            <li>
              <strong>Portabilidad:</strong> recibir tus datos en formato
              estructurado y transmitirlos a otro responsable.
            </li>
            <li>
              <strong>Oposición:</strong> oponerte al tratamiento de tus datos
              por motivos relacionados con tu situación particular.
            </li>
            <li>
              <strong>Retirada del consentimiento:</strong> en cualquier
              momento, sin que ello afecte a la licitud del tratamiento
              anterior.
            </li>
          </ul>
          <p>
            Para ejercer estos derechos, contacta a través de{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-cyan-400 underline"
            >
              contacto@gtavidaily.com
            </a>
            . Si consideras que no hemos respetado tus derechos, tienes
            derecho a presentar una reclamación ante la Agencia Española de
            Protección de Datos (www.aepd.es).
          </p>
        </section>

        <section>
          <SectionTitle>
            10. Derechos CCPA (California, EE.UU.)
          </SectionTitle>
          <p>
            Si eres residente de California, la California Consumer Privacy
            Act (CCPA) te otorga derechos adicionales:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Saber:</strong> qué datos personales recogemos sobre ti
              y a quién se los compartimos.
            </li>
            <li>
              <strong>Eliminar:</strong> solicitar la eliminación de tus datos
              personales.
            </li>
            <li>
              <strong>No discriminación:</strong> no ser discriminado por
              ejercer tus derechos.
            </li>
            <li>
              <strong>Opt-out:</strong> solicitar no vender tus datos
              personales. No vendemos datos personales a terceros.
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle>
            11. Menores de edad
          </SectionTitle>
          <p>
            Nuestro sitio no está dirigido a menores de 13 años, y no
            recogemos deliberadamente datos personales de menores. Si eres
            padre o tutor y crees que tu hijo nos ha proporcionado datos
            personales, contáctanos para que procedamos a su eliminación.
          </p>
        </section>

        <section>
          <SectionTitle>
            12. Seguridad
          </SectionTitle>
          <p>
            Hemos implementado medidas técnicas y organizativas apropiadas
            para garantizar la seguridad de tus datos personales y prevenir su
            alteración, pérdida, tratamiento o acceso no autorizado. Sin
            embargo, ningún método de transmisión por Internet o de
            almacenamiento electrónico es 100% seguro, por lo que no podemos
            garantizar una seguridad absoluta.
          </p>
        </section>

        <section>
          <SectionTitle>
            13. Cambios en esta política
          </SectionTitle>
          <p>
            Nos reservamos el derecho de modificar esta Política de
            Privacidad para adaptarla a novedades legislativas o
            jurisprudenciales. Te recomendamos consultarla periódicamente.
            Los cambios sustanciales serán comunicados a través del sitio o
            por email si tienes cuenta registrada.
          </p>
        </section>

        <section>
          <SectionTitle>
            14. Contacto
          </SectionTitle>
          <p>
            Para cualquier duda sobre esta Política de Privacidad o sobre el
            tratamiento de tus datos personales, puedes contactarnos en{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-cyan-400 underline"
            >
              contacto@gtavidaily.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
