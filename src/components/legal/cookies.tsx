/**
 * Página legal: cookies.
 *
 * Componente de servidor extraído del antiguo StaticPage.tsx (1.153 líneas con
 * las seis páginas mezcladas). Los metadatos de la ruta viven en
 * `src/app/cookies/page.tsx`.
 */
import { Cookie } from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import { SectionTitle } from "@/components/legal/section-title";

export function LegalCookies() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <LegalHeader badge="Legal" title="Política de Cookies" updatedAt="15 de septiembre de 2026" />

      <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
        <section>
          <SectionTitle icon>
            <Cookie className="h-5 w-5 text-pink-500" />
            1. ¿Qué son las cookies?
          </SectionTitle>
          <p>
            Las cookies son pequeños archivos de texto que un sitio web envía
            al navegador del usuario y se almacenan en su dispositivo. Las
            cookies permiten al sitio recordar información sobre tu visita,
            lo que facilita tu experiencia en futuras visitas y permite
            ofrecer servicios personalizados.
          </p>
        </section>

        <section>
          <SectionTitle>
            2. Tipos de cookies que utilizamos
          </SectionTitle>
          <p>
            A continuación, te detallamos los tipos de cookies que utiliza
            gtavidaily.com:
          </p>

          <h3 className="mt-4 text-lg font-semibold text-pink-400">
            2.1. Cookies necesarias (técnicas)
          </h3>
          <p>
            Son esenciales para el funcionamiento básico del sitio. Permiten
            la navegación, recordar tus preferencias de consentimiento de
            cookies y garantizar la seguridad. Sin estas cookies, el sitio no
            puede funcionar correctamente. No requieren consentimiento.
          </p>
          <ul className="ml-6 list-disc space-y-1 text-sm">
            <li>
              <strong>gtavidaily-consent:</strong> almacena tus
              preferencias de consentimiento de cookies. Duración: 12 meses.
            </li>
          </ul>

          <h3 className="mt-4 text-lg font-semibold text-pink-400">
            2.2. Cookies analíticas
          </h3>
          <p>
            Nos ayudan a entender cómo interactúan los usuarios con el sitio,
            recopilando información anónima sobre el uso. Solo se instalan si
            has dado tu consentimiento.
          </p>
          <ul className="ml-6 list-disc space-y-1 text-sm">
            <li>
              <strong>_ga, _gid (Google Analytics):</strong> distinguen a
              usuarios únicos y generan estadísticas de uso. Duración: 24
              meses / 24 horas respectivamente.
            </li>
          </ul>

          <h3 className="mt-4 text-lg font-semibold text-pink-400">
            2.3. Cookies de marketing / publicidad
          </h3>
          <p>
            Utilizadas por Google AdSense y otros partners para mostrar anuncios
            personalizados basados en tus intereses y en tu comportamiento de
            navegación. Solo se instalan si has dado tu consentimiento.
          </p>
          <ul className="ml-6 list-disc space-y-1 text-sm">
            <li>
              <strong>__gads, __gpi (Google AdSense):</strong> permiten a
              Google servir anuncios personalizados. Duración: 13 meses.
            </li>
            <li>
              <strong>IDE (Doubleclick):</strong> almacena preferencias
              publicitarias. Duración: 12 meses.
            </li>
            <li>
              <strong>NID (Google):</strong> recuerda tus preferencias y
              configuración. Duración: 6 meses.
            </li>
          </ul>

          <h3 className="mt-4 text-lg font-semibold text-pink-400">
            2.4. Quién recoge tu consentimiento
          </h3>
          <p>
            Depende de dónde nos visites, porque la normativa aplicable no es la
            misma:
          </p>
          <ul className="ml-6 list-disc space-y-1 text-sm">
            <li>
              <strong>Espacio Económico Europeo, Reino Unido y Suiza:</strong> el
              consentimiento lo recoge la plataforma de gestión de consentimiento
              (CMP) certificada por Google, que es obligatoria en esas regiones y
              emite la cadena de consentimiento del marco europeo (IAB TCF). Para
              cambiar o retirar tu decisión, usa el enlace «Configurar cookies»
              del pie de página.
            </li>
            <li>
              <strong>Resto del mundo:</strong> lo recoge el banner propio de este
              sitio.
            </li>
          </ul>
          <p>
            En ambos casos el sitio arranca con el <strong>Consent Mode v2</strong>{" "}
            de Google en estado <strong>denegado</strong>: hasta que no decides,
            no se escribe ninguna cookie publicitaria ni se personaliza la
            publicidad. La etiqueta de Google está presente en todas las páginas
            porque es la que sirve el mensaje de consentimiento allí donde es
            obligatorio; la cookie que guarda esa decisión es técnica, no de
            seguimiento.
          </p>
        </section>

        <section>
          <SectionTitle>
            3. Cookies de terceros
          </SectionTitle>
          <p>
            Algunas cookies son instaladas por terceros (Google, etc.) para
            prestar sus servicios. Estos terceros pueden acceder a la
            información recogida por sus cookies, pero solo la utilizan para
            los fines descritos anteriormente (estadísticas anónimas,
            publicidad personalizada). Puedes consultar las políticas de
            privacidad de estos terceros en:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-cyan-400 underline"
              >
                Política de Privacidad de Google
              </a>
            </li>
            <li>
              <a
                href="https://policies.google.com/technologies/cookies"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-cyan-400 underline"
              >
                Cómo Google utiliza las cookies
              </a>
            </li>
            <li>
              <a
                href="https://support.google.com/adsense/answer/1348695"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-cyan-400 underline"
              >
                Cookies publicitarias de Google AdSense
              </a>
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle>
            4. Gestión de cookies
          </SectionTitle>
          <p>
            Puedes gestionar tus preferencias de cookies en cualquier momento:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Desde nuestro banner:</strong> al visitar el sitio por
              primera vez, te mostramos un banner donde puedes aceptar,
              rechazar o personalizar las cookies. Puedes volver a mostrar el
              banner borrando las cookies del sitio en tu navegador.
            </li>
            <li>
              <strong>Desde tu navegador:</strong> puedes configurar tu
              navegador para aceptar, bloquear o eliminar las cookies. Cada
              navegador tiene un procedimiento diferente:
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-cyan-400 underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/es/kb/Borrar%20cookies"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-cyan-400 underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-cyan-400 underline"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-cyan-400 underline"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <strong>Desde la configuración de Google:</strong> puedes
              gestionar la personalización de anuncios en{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-cyan-400 underline"
              >
                Google Ads Settings
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle>
            5. Consecuencias de desactivar cookies
          </SectionTitle>
          <p>
            Si decides desactivar todas las cookies, el sitio seguirá
            funcionando en su versión básica, pero algunas funcionalidades
            pueden no estar disponibles o no funcionar correctamente. Por
            ejemplo, no recordaremos tus preferencias de consentimiento, los
            anuncios que veas serán genéricos en lugar de relevantes, y no
            podremos generar estadísticas agregadas sobre el uso del sitio.
          </p>
        </section>

        <section>
          <SectionTitle>
            6. Actualizaciones
          </SectionTitle>
          <p>
            Esta Política de Cookies puede modificarse para adaptarse a
            cambios en la legislación, en las cookies utilizadas o en
            nuestras prácticas. Te recomendamos revisarla periódicamente.
          </p>
        </section>
      </div>
    </div>
  );
}
