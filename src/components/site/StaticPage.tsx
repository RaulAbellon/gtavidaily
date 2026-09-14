"use client";

import { useEffect } from "react";
import {
  Mail,
  Twitter,
  Send,
  Users,
  Shield,
  FileText,
  Cookie,
  Scale,
  AlertTriangle,
} from "lucide-react";
import { authors } from "@/lib/data";
import { useNav } from "@/lib/nav";
import { AdSense } from "@/components/ads/AdSense";

type StaticPageProps = {
  type: "about" | "privacy" | "cookies" | "legal" | "dmca" | "contact";
};

export function StaticPage({ type }: StaticPageProps) {
  const nav = useNav();

  useEffect(() => {
    const titles = {
      about: "Sobre GTA VI Daily | GTA VI Daily",
      privacy: "Política de Privacidad | GTA VI Daily",
      cookies: "Política de Cookies | GTA VI Daily",
      legal: "Aviso Legal | GTA VI Daily",
      dmca: "DMCA / Copyright | GTA VI Daily",
      contact: "Contacto | GTA VI Daily",
    };
    document.title = titles[type];
  }, [type]);

  if (type === "about") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="mb-8">
          <span className="inline-block rounded bg-pink-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Sobre nosotros
          </span>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Sobre GTA VI Daily
          </h1>
        </header>

        <div className="prose-article space-y-5 text-[17px] leading-relaxed text-zinc-200">
          <p>
            GTA VI Daily es un medio digital independiente dedicado a cubrir todo
            lo relacionado con Grand Theft Auto VI, el próximo gran lanzamiento
            de Rockstar Games. Nuestro equipo de periodistas y analistas sigue
            de cerca cada anuncio, filtración y rumor para ofrecer a la
            comunidad hispanohablante la información más completa y rigurosa.
          </p>
          <p>
            Nacimos en agosto de 2026 con la ilusión de crear un espacio de
            referencia para los fans de la saga en español. Tras años consumiendo
            contenidos en inglés y frustrados por la falta de medios de calidad
            en nuestro idioma, decidimos dar el paso y construir el sitio que
            nos habría gustado leer. Hoy somos un equipo de cuatro personas
            apasionadas por los videojuegos, los mundos abiertos y la saga GTA
            en particular.
          </p>
          <p>
            Nuestra línea editorial se basa en tres pilares: rigor informativo,
            análisis profundo y respeto por la comunidad. Solo publicamos
            noticias verificadas, distinguimos claramente entre hechos y rumores,
            y citamos siempre las fuentes originales. En el análisis,
            privilegiamos la profundidad sobre la inmediatez, y siempre damos
            contexto suficiente para que el lector entienda el porqué de cada
            noticia.
          </p>
          <p>
            No estamos afiliados con Rockstar Games ni con Take-Two Interactive.
            Grand Theft Auto y todos los nombres relacionados son marcas
            registradas de sus propietarios. Nuestro contenido se publica bajo
            fair use y con propósito informativo y crítico, en línea con la
            tradición del periodismo de videojuegos.
          </p>
        </div>

        <AdSense
          slot="9999999999"
          format="horizontal"
          className="my-8"
          style={{ minHeight: "120px" }}
        />

        <section className="mt-10">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
            <Users className="h-6 w-6 text-pink-500" />
            Nuestro equipo
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {authors.map((author) => (
              <div
                key={author.slug}
                className="rounded-xl border border-white/5 bg-zinc-900/40 p-5"
              >
                <div className="flex items-start gap-4">
                  { }
                  <img
                    src={author.avatar}
                    alt={`Foto de ${author.name}`}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-pink-400">
                      {author.role}
                    </p>
                    <h3 className="mt-1 font-bold text-white">{author.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                      {author.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (type === "privacy") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="mb-8">
          <span className="inline-block rounded bg-pink-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Legal
          </span>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Política de Privacidad
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Última actualización: 15 de septiembre de 2026
          </p>
        </header>

        <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <Shield className="h-5 w-5 text-pink-500" />
              1. Responsable del tratamiento
            </h2>
            <p>
              El responsable del tratamiento de los datos personales recabados a
              través del sitio web{" "}
              <strong>gtavidaily.com</strong> es el titular de este medio
              digital. Para cualquier cuestión relacionada con el tratamiento de
              datos personales, puedes contactar a través del formulario de
              contacto disponible en el pie de página, o escribiendo a{" "}
              <a
                href="mailto:contacto@gtavidaily.com"
                className="text-cyan-400 underline"
              >
                contacto@gtavidaily.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              2. Datos que recogemos
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              3. Finalidades del tratamiento
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              4. Base legal del tratamiento
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              5. Plazos de conservación
            </h2>
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
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <FileText className="h-5 w-5 text-pink-500" />
              6. Google AdSense y publicidad personalizada
            </h2>
            <p>
              Este sitio utiliza Google AdSense, un servicio de publicidad
              proporcionado por Google LLC. Google y sus proveedores externos
              utilizan cookies para mostrar anuncios basados en visitas
              anteriores del usuario a nuestro sitio o a otros sitios.
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
            <h2 className="mb-3 text-xl font-bold text-white">
              7. Destinatarios de los datos
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              8. Transferencias internacionales
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              9. Derechos del usuario (RGPD)
            </h2>
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
                href="mailto:contacto@gtavidaily.com"
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
            <h2 className="mb-3 text-xl font-bold text-white">
              10. Derechos CCPA (California, EE.UU.)
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              11. Menores de edad
            </h2>
            <p>
              Nuestro sitio no está dirigido a menores de 13 años, y no
              recogemos deliberadamente datos personales de menores. Si eres
              padre o tutor y crees que tu hijo nos ha proporcionado datos
              personales, contáctanos para que procedamos a su eliminación.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              12. Seguridad
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              13. Cambios en esta política
            </h2>
            <p>
              Nos reservamos el derecho de modificar esta Política de
              Privacidad para adaptarla a novedades legislativas o
              jurisprudenciales. Te recomendamos consultarla periódicamente.
              Los cambios sustanciales serán comunicados a través del sitio o
              por email si tienes cuenta registrada.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              14. Contacto
            </h2>
            <p>
              Para cualquier duda sobre esta Política de Privacidad o sobre el
              tratamiento de tus datos personales, puedes contactarnos en{" "}
              <a
                href="mailto:contacto@gtavidaily.com"
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

  if (type === "cookies") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="mb-8">
          <span className="inline-block rounded bg-pink-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Legal
          </span>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Política de Cookies
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Última actualización: 15 de septiembre de 2026
          </p>
        </header>

        <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <Cookie className="h-5 w-5 text-pink-500" />
              1. ¿Qué son las cookies?
            </h2>
            <p>
              Las cookies son pequeños archivos de texto que un sitio web envía
              al navegador del usuario y se almacenan en su dispositivo. Las
              cookies permiten al sitio recordar información sobre tu visita,
              lo que facilita tu experiencia en futuras visitas y permite
              ofrecer servicios personalizados.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              2. Tipos de cookies que utilizamos
            </h2>
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
                <strong>gtavidaily-cookie-consent:</strong> almacena tus
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
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              3. Cookies de terceros
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              4. Gestión de cookies
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              5. Consecuencias de desactivar cookies
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              6. Actualizaciones
            </h2>
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

  if (type === "legal") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="mb-8">
          <span className="inline-block rounded bg-pink-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Legal
          </span>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Aviso Legal
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Última actualización: 15 de septiembre de 2026
          </p>
        </header>

        <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <Scale className="h-5 w-5 text-pink-500" />
              1. Identificación del titular
            </h2>
            <p>
              El sitio web <strong>gtavidaily.com</strong> es un medio digital
              independiente dedicado a la cobertura informativa de Grand Theft
              Auto VI. De acuerdo con la Ley 34/2002 de servicios de la sociedad
              de la información y de comercio electrónico (LSSI-CE), se informan
              los siguientes datos del titular:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>Denominación:</strong> GTA VI Daily (medio digital
                independiente)
              </li>
              <li>
                <strong>Sitio web:</strong>{" "}
                <a
                  href="https://gtavidaily.com"
                  className="text-cyan-400 underline"
                >
                  https://gtavidaily.com
                </a>
              </li>
              <li>
                <strong>Email de contacto:</strong>{" "}
                <a
                  href="mailto:contacto@gtavidaily.com"
                  className="text-cyan-400 underline"
                >
                  contacto@gtavidaily.com
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
            <h2 className="mb-3 text-xl font-bold text-white">
              2. Objeto del sitio
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              3. Condiciones de uso
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              4. Propiedad intelectual
            </h2>
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
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <AlertTriangle className="h-5 w-5 text-pink-500" />
              5. Carácter no oficial (fan site)
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              6. Responsabilidad
            </h2>
            <p>
              El titular no se hace responsable de los posibles daños o
              perjuicios que pudieran derivarse del uso del sitio, incluyendo
             但不限于:
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
            <h2 className="mb-3 text-xl font-bold text-white">
              7. Enlaces a sitios de terceros
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              8. Publicidad y enlaces de afiliados
            </h2>
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
            <h2 className="mb-3 text-xl font-bold text-white">
              9. Modificación del Aviso Legal
            </h2>
            <p>
              El titular se reserva el derecho de modificar el presente Aviso
              Legal para adaptarlo a novedades legislativas o
              jurisprudenciales, así como a prácticas de la industria. La
              vigencia temporal del Aviso Legal coincide con el tiempo de su
              exposición, hasta que sea modificado total o parcialmente.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              10. Legislación aplicable y jurisdicción
            </h2>
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

  if (type === "dmca") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="mb-8">
          <span className="inline-block rounded bg-pink-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Legal
          </span>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            DMCA / Copyright Notice
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Última actualización: 15 de septiembre de 2026
          </p>
        </header>

        <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <FileText className="h-5 w-5 text-pink-500" />
              1. Aviso de copyright
            </h2>
            <p>
              GTA VI Daily respeta los derechos de propiedad intelectual de
              terceros y espera que los usuarios de nuestro sitio hagan lo
              mismo. Todos los contenidos editoriales publicados en este sitio
              (textos, análisis, artículos) son propiedad intelectual de GTA VI
              Daily y están protegidos por las leyes de copyright aplicables.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              2. Carácter no oficial y fair use
            </h2>
            <p>
              Este sitio es un medio de comunicación no oficial dedicado a la
              cobertura periodística de Grand Theft Auto VI. No estamos
              afiliados, patrocinados ni endosados por Rockstar Games o
              Take-Two Interactive. Las marcas, nombres comerciales, logos y
              otros signos distintivos pertenecen a sus respectivos titulares.
            </p>
            <p>
              Todo el contenido editorial se publica bajo la doctrina de fair
              use (uso legítimo) con propósito informativo, periodístico y
              crítico. Las imágenes utilizadas son ilustraciones conceptuales
              generadas localmente y no representan arte oficial del juego,
              salvo cuando se indique lo contrario y se cite la fuente. Si
              consideras que algún contenido de nuestro sitio infringe tus
              derechos de propiedad intelectual, por favor contáctanos de
              acuerdo con el procedimiento DMCA descrito a continuación.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              3. Procedimiento DMCA para notificación de infracción
            </h2>
            <p>
              Si consideras que algún contenido de gtavidaily.com infringe tus
              derechos de autor, puedes enviar una notificación DMCA
              (Digital Millennium Copyright Act) con la siguiente información:
            </p>
            <ol className="ml-6 list-decimal space-y-2">
              <li>
                <strong>Identificación de la obra:</strong> descripción de la
                obra protegida por derechos de autor que consideras infringida.
              </li>
              <li>
                <strong>Identificación del material infractor:</strong> URL
                exacta del contenido en nuestro sitio que consideras
                infractor.
              </li>
              <li>
                <strong>Información de contacto:</strong> nombre completo,
                dirección física, número de teléfono y dirección de correo
                electrónico.
              </li>
              <li>
                <strong>Declaración de buena fe:</strong> una declaración de
                que crees de buena fe que el uso del material no está autorizado
                por el titular de los derechos, su agente o la ley.
              </li>
              <li>
                <strong>Declaración de exactitud:</strong> una declaración,
                bajo pena de perjurio, de que la información en la notificación
                es exacta y que estás autorizado a actuar en nombre del titular
                de los derechos.
              </li>
              <li>
                <strong>Firma:</strong> firma física o electrónica del titular
                de los derechos o de la persona autorizada para actuar en su
                nombre.
              </li>
            </ol>
            <p>
              Las notificaciones DMCA deben enviarse a{" "}
              <a
                href="mailto:contacto@gtavidaily.com"
                className="text-cyan-400 underline"
              >
                contacto@gtavidaily.com
              </a>{" "}
              con el asunto &quot;DMCA Notice&quot;.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              4. Contranotificaciones
            </h2>
            <p>
              Si eres un usuario cuyo contenido ha sido retirado en respuesta a
              una notificación DMCA y consideras que la retirada fue un error o
              que tienes derecho a usar el material, puedes enviar una
              contranotificación con la siguiente información:
            </p>
            <ol className="ml-6 list-decimal space-y-2">
              <li>
                Tu nombre, dirección, número de teléfono y dirección de correo
                electrónico.
              </li>
              <li>
                Identificación del material retirado y la ubicación en la que
                aparecía antes de su retirada.
              </li>
              <li>
                Una declaración, bajo pena de perjurio, de que crees de buena fe
                que el material fue retirado por error o identificación
                errónea.
              </li>
              <li>
                Tu consentimiento para someterte a la jurisdicción del tribunal
                federal de tu distrito.
              </li>
              <li>Tu firma física o electrónica.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              5. Política de retirada de contenido
            </h2>
            <p>
              Tras recibir una notificación DMCA válida, retiraremos o
              desactivaremos el acceso al material presuntamente infractor en
              un plazo razonable (generalmente 48-72 horas). Si recibimos una
              contranotificación válida, podemos restablecer el material entre
              10 y 14 días después, salvo que recibamos notificación del titular
              original de que ha iniciado acciones legales.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              6. Reincidencia
            </h2>
            <p>
              En casos apropiados, podemos terminar las cuentas de usuarios que
              sean reincidientes en infracciones de derechos de autor, según
              determine nuestra política interna.
            </p>
          </section>
        </div>
      </div>
    );
  }

  // Contact
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <header className="mb-8">
        <span className="inline-block rounded bg-pink-500 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Contacto
        </span>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Contacta con nosotros
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          ¿Tienes una noticia, una filtración, una consulta legal o simplemente
          quieres saludar? Escríbenos y te responderemos lo antes posible.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("¡Gracias por tu mensaje! Te responderemos pronto.");
        }}
        className="space-y-4 rounded-xl border border-white/5 bg-zinc-900/40 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              placeholder="tu@email.com"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="subject"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            Asunto
          </label>
          <input
            id="subject"
            type="text"
            required
            className="w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            placeholder="Sobre qué nos escribes"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            Mensaje
          </label>
          <textarea
            id="message"
            required
            rows={5}
            className="w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            placeholder="Cuéntanos en qué podemos ayudarte..."
          />
        </div>
        <p className="text-xs text-zinc-500">
          Al enviar este formulario, aceptas que tus datos sean tratados según
          nuestra{" "}
          <button
            type="button"
            onClick={() => nav.goPrivacy()}
            className="underline hover:text-zinc-300"
          >
            Política de Privacidad
          </button>
          .
        </p>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-pink-400 sm:w-auto"
        >
          <Send className="h-4 w-4" />
          Enviar mensaje
        </button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href="mailto:contacto@gtavidaily.com"
          className="flex items-center gap-3 rounded-lg border border-white/5 bg-zinc-900/40 p-4 transition-colors hover:border-pink-500/40"
        >
          <Mail className="h-5 w-5 text-pink-500" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Email
            </p>
            <p className="text-sm text-white">contacto@gtavidaily.com</p>
          </div>
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 rounded-lg border border-white/5 bg-zinc-900/40 p-4 transition-colors hover:border-pink-500/40"
        >
          <Twitter className="h-5 w-5 text-pink-500" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Twitter / X
            </p>
            <p className="text-sm text-white">@gtavidaily</p>
          </div>
        </a>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => nav.goHome()}
          className="text-sm text-zinc-400 hover:text-pink-400"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}
