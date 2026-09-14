"use client";

import { useEffect } from "react";
import { Mail, Twitter, Send, Users, Shield, FileText } from "lucide-react";
import { authors } from "@/lib/data";
import { useNav } from "@/lib/nav";
import { AdSense } from "@/components/ads/AdSense";

type StaticPageProps = {
  type: "about" | "privacy" | "contact";
};

export function StaticPage({ type }: StaticPageProps) {
  const nav = useNav();

  useEffect(() => {
    const titles = {
      about: "Sobre GTA VI Daily | GTA VI Daily",
      privacy: "Política de Privacidad | GTA VI Daily",
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
            Nacimos en 2024 con la ilusión de crear un espacio de referencia
            para los fans de la saga en español. Tras años consumiendo
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
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>
        </header>

        <div className="prose-article space-y-5 text-[17px] leading-relaxed text-zinc-200">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <Shield className="h-5 w-5 text-pink-500" />
              1. Introducción
            </h2>
            <p>
              En GTA VI Daily respetamos tu privacidad y nos comprometemos a
              proteger tus datos personales. Esta política explica qué
              información recogemos, cómo la usamos y qué derechos tienes como
              usuario. Al utilizar nuestro sitio web, aceptas las prácticas
              descritas en este documento.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              2. Datos que recogemos
            </h2>
            <p>
              Como medio de noticias, nuestro sitio funciona principalmente sin
              necesidad de registro. Sin embargo, podemos recoger datos
              anónimos de navegación como dirección IP, tipo de navegador,
              páginas visitadas y tiempo de permanencia. Estos datos se utilizan
              exclusivamente con fines analíticos y de mejora del servicio.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              3. Cookies y tecnologías similares
            </h2>
            <p>
              Utilizamos cookies propias y de terceros para mejorar la
              experiencia de usuario, analizar el tráfico y servir publicidad
              relevante. Las cookies de publicidad, gestionadas por Google
              AdSense, permiten mostrar anuncios basados en tus intereses y en
              visitas anteriores a nuestro sitio o a otros sitios web.
            </p>
            <p>
              Puedes configurar tu navegador para rechazar todas las cookies o
              para alertarte cuando se envían. Ten en cuenta que algunas
              funcionalidades del sitio pueden no funcionar correctamente si
              desactivas las cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <FileText className="h-5 w-5 text-pink-500" />
              4. Google AdSense y publicidad personalizada
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
              su visita a tus sitios o a otros sitios en Internet. Los usuarios
              pueden desactivar la publicidad personalizada visitando la
              Configuración de anuncios de Google.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              5. Derechos del usuario
            </h2>
            <p>
              Conforme al Reglamento General de Protección de Datos (RGPD) y
              otras normativas aplicables, tienes derecho a acceder, rectificar,
              suprimir y oponerte al tratamiento de tus datos personales. Para
              ejercer estos derechos, contacta con nosotros a través del
              formulario de contacto.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-white">
              6. Contacto
            </h2>
            <p>
              Si tienes cualquier duda sobre esta política de privacidad o
              sobre el tratamiento de tus datos, puedes contactarnos mediante
              el formulario de contacto disponible en el pie de página de
              nuestro sitio.
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
          ¿Tienes una noticia, una filtración o simplemente quieres saludar?
          Escríbenos y te responderemos lo antes posible. También puedes
          seguirnos en nuestras redes sociales para estar al día.
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
