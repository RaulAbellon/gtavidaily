/**
 * Página legal: dmca.
 *
 * Componente de servidor extraído del antiguo StaticPage.tsx (1.153 líneas con
 * las seis páginas mezcladas). Los metadatos de la ruta viven en
 * `src/app/dmca/page.tsx`.
 */
import { FileText } from "lucide-react";
import { LegalHeader } from "@/components/legal/legal-header";
import { SectionTitle } from "@/components/legal/section-title";
import {
  CONTACT_EMAIL,
} from "@/lib/site";

export function LegalDmca() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <LegalHeader badge="Legal" title="DMCA / Copyright Notice" updatedAt="15 de septiembre de 2026" />

      <div className="prose-article space-y-6 text-[17px] leading-relaxed text-zinc-200">
        <section>
          <SectionTitle icon>
            <FileText className="h-5 w-5 text-pink-500" />
            1. Aviso de copyright
          </SectionTitle>
          <p>
            GTA VI Daily respeta los derechos de propiedad intelectual de
            terceros y espera que los usuarios de nuestro sitio hagan lo
            mismo. Todos los contenidos editoriales publicados en este sitio
            (textos, análisis, artículos) son propiedad intelectual de GTA VI
            Daily y están protegidos por las leyes de copyright aplicables.
          </p>
        </section>

        <section>
          <SectionTitle>
            2. Carácter no oficial y fair use
          </SectionTitle>
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
          <SectionTitle>
            3. Procedimiento DMCA para notificación de infracción
          </SectionTitle>
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
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-cyan-400 underline"
            >
              contacto@gtavidaily.com
            </a>{" "}
            con el asunto &quot;DMCA Notice&quot;.
          </p>
        </section>

        <section>
          <SectionTitle>
            4. Contranotificaciones
          </SectionTitle>
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
          <SectionTitle>
            5. Política de retirada de contenido
          </SectionTitle>
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
          <SectionTitle>
            6. Reincidencia
          </SectionTitle>
          <p>
            En casos apropiados, podemos terminar las cuentas de usuarios que
            sean reincidentes en infracciones de derechos de autor, según
            determine nuestra política interna.
          </p>
        </section>
      </div>
    </div>
  );
}
