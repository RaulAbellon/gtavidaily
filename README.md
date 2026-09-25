# GTA VI Daily

Sitio de noticias en español sobre **Grand Theft Auto VI**: tráileres, mapa de
Leonida, personajes y novedades de Rockstar Games y Take-Two.

Sitio fan **no oficial**, sin afiliación con Rockstar Games ni Take-Two
Interactive. Cada artículo lleva su propia imagen (JPEG 1200×675 en
`public/imagenes/`) y, si faltara, una portada SVG estática generada en el build
en `/portadas/<slug>.svg`.

El sitio es **completamente estático**: `next build` produce ficheros en `out/` y
el CDN los sirve tal cual. Ninguna petición se renderiza en el servidor ni en un
Worker. El porqué y el cómo están en `CONVERSION-ESTATICA.md`.

---

## Stack

- **Next.js 16** (App Router, Turbopack) con `output: "export"`: HTML, RSC,
  sitemaps, feed y `robots.txt` se generan en el build
- **React 19** + **TypeScript** en modo `strict`
- **Tailwind CSS 4** (configuración en CSS, sin `tailwind.config.ts`)
- **Vitest** para pruebas unitarias y un script de humo HTTP para extremo a extremo
- 4 dependencias de producción: `next`, `react`, `react-dom` y `lucide-react`
- Sin servidor en producción: **Cloudflare Workers sirviendo activos estáticos**
  (sin Worker que ejecute código) y Netlify publicando el mismo `out/`

## Requisitos

- Node.js **20.9 o superior** (lo exige Next 16; ver `.nvmrc`)
- npm 10+

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y ajusta los valores
npm run dev                  # http://localhost:3000
```

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build estático completo en `out/` (+ `scripts/postbuild.mjs`) |
| `npm start` | Sirve `out/` en local (respeta `PORT` y `HOSTNAME`), con `public/_headers` |
| `npm run content` | **Valida el contenido y regenera el índice de artículos** |
| `npm run content:check` | Solo valida (lo usa el CI) |
| `npm run content:fix` | Recalcula el tiempo de lectura a partir del texto real |
| `npm run content:images` | Informe de cobertura de imágenes propias por artículo |
| `npm run content:new -- <slug>` | Crea la plantilla de un artículo nuevo |
| `npm run lint` | ESLint con las reglas de corrección activadas |
| `npm run typecheck` | `tsc --noEmit` (tipos estrictos) |
| `npm run test` | Pruebas unitarias (Vitest) |
| `npm run test:e2e` | Prueba de humo HTTP contra un servidor en marcha |
| `npm run check` | Contenido + lint + tipos + tests + build, en ese orden |
| `npm run deploy` | Publica: regenera, comprueba, hace commit y empuja a `main` |
| `npm run indexnow` | Avisa a Bing y Yandex de las URLs nuevas (IndexNow). Se lanza **después** de publicar |
| `npm run cf:build` | Build del sitio estático (`out/`), que es lo que se sube a Cloudflare |
| `npm run cf:preview` | `cf:build` + `wrangler dev`: sirve `out/` como lo hará el CDN |
| `npm run cf:deploy` | `cf:build` + `wrangler deploy` (solo activos, sin Worker) |
| `node scripts/verify-cf.mjs <url>` | Comprueba un despliegue de Cloudflare (rutas, cabeceras, AdSense) |

## Publicar una noticia nueva (flujo diario)

Cada artículo es **un fichero JSON**. El ciclo completo son tres comandos:

```bash
# 1. Crear la plantilla
npm run content:new -- mi-noticia-del-dia

# 2. Editar src/content/articles/mi-noticia-del-dia.json
#    (titular, entradilla, párrafos, categoría, fuentes con enlace permanente)

# 3. Validar y regenerar el índice
npm run content

# 4. Comprobar que todo sigue en pie
npm run check

# 5. Publicar (el despliegue lo lanza la plataforma sola)
npm run deploy -- "contenido: mi noticia del día"
```

**Portada de la noticia.** Cada artículo lleva una ilustración propia en JPEG de
1200×675, que es lo que usan Google Discover y las previsualizaciones al compartir
en WhatsApp, Telegram o X. Se genera con la herramienta local
`work/assets/generate-covers.mjs` (necesita `npm run dev` en marcha), que dibuja la
misma escena que el motor de portadas y anota `image`, `imageAlt` y `imageCredit`
en el JSON. Si no se genera, el artículo usa la portada SVG estática
`/portadas/<slug>.svg` que produce el build: **ninguna página se queda sin
imagen**, y el validador avisa si se declara una imagen que no existe.

Cada noticia que se publica entra sola en el **sitemap de noticias**
(`/news-sitemap.xml`), que solo contiene piezas de las últimas 48 horas: es la vía
por la que Google detecta contenido fresco. Con el build estático esa ventana se
calcula **en cada compilación**, así que se refresca con cada publicación; el
detalle está en `CONVERSION-ESTATICA.md`.

El validador rechaza lo que no debe publicarse: campos que faltan o sobran,
categorías inexistentes, fechas incoherentes (`updatedAt` anterior a
`publishedAt`), texto con la codificación rota, títulos o rótulos demasiado
largos y **fuentes que sean una portada de medio en lugar de un enlace
permanente**. Los avisos (artículo corto, `readingTime` desajustado, menos de
dos fuentes) no bloquean, pero aparecen en pantalla.

El buscador, el sitemap, el feed RSS, las categorías y los artículos
relacionados se recalculan solos a partir de los ficheros: no hay que tocar
ningún listado a mano. El buscador filtra en el navegador (ver
`src/app/buscar`); su índice se publica como fichero estático en
`/buscar/indice.json`.

La prueba de humo se lanza contra un servidor ya arrancado. Vale cualquier
servidor que sirva `out/`:

```bash
npm start &                                          # estático, puerto 3000
BASE_URL=http://127.0.0.1:3000 npm run test:e2e

npm run cf:preview &                                 # runtime de Cloudflare, puerto 8787
node scripts/verify-cf.mjs http://127.0.0.1:8787
BASE_URL=http://127.0.0.1:8787 npm run test:e2e
```

## Variables de entorno

Todas están documentadas en `.env.example`. Las importantes:

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Sí en producción | **Única fuente de verdad** de la URL: canonical, sitemap, robots y datos estructurados salen de aquí |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Para monetizar | ID `ca-pub-…`. Si no tiene formato válido, **no se renderiza ningún anuncio**; de él se genera también `/ads.txt` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Recomendada | Email mostrado en las páginas legales y el pie |
| `NEXT_PUBLIC_EDITORIAL_NAME` | No | Firma editorial de los artículos |
| `NEXT_PUBLIC_LEGAL_NAME` / `_TAX_ID` / `_ADDRESS` | **Sí antes de monetizar** | Identificación del responsable (art. 10 LSSI-CE y art. 13 RGPD). Mientras falten, la página legal avisa de que están pendientes |
| `GOOGLE_SITE_VERIFICATION` | No | Emite la etiqueta de verificación de Search Console |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Para recibir mensajes | Clave pública de Web3Forms: el formulario de contacto y el aviso de lanzamiento se envían **desde el navegador**, sin servidor de por medio |
| `CONTACT_WEBHOOK_URL` / `CONTACT_WEBHOOK_KEY` | Ya no se usan | Restos del endpoint `/api/contacto`, que se retiró. Ningún código las lee |

**Todas las variables `NEXT_PUBLIC_*` se incrustan en el momento de compilar.**
Como el sitio es estático, no basta con definirlas en el panel del hosting como
variables de *runtime*: tienen que estar presentes en el **build** (en Cloudflare,
en las variables de build del proyecto; en Netlify, en `[build.environment]` o en
el panel). Para probar en local, cópialas a `.env.local`, que Next lee solo:

```bash
cp .dev.vars .env.local    # .dev.vars es para wrangler; .env.local, para el build
```

Si faltan, el sitio se compila igual, pero sin AdSense, sin datos legales y sin
la etiqueta de verificación; `node scripts/verify-cf.mjs` falla a propósito.

## Arquitectura

```
src/
├─ app/
│  ├─ layout.tsx                 Cabecera, pie, consentimiento y datos estructurados
│  ├─ page.tsx                   Portada
│  ├─ noticias/                  Listado completo; pagina en el navegador (noticias-list.tsx)
│  ├─ articulo/[slug]/           Artículos: generateStaticParams + generateMetadata
│  ├─ categoria/[slug]/          Categorías
│  ├─ buscar/                    Buscador estático: filtra en el cliente con indice.json
│  ├─ portadas/[slug]/           Portadas SVG de reserva, un fichero por artículo
│  ├─ feed.xml/                  RSS 2.0 generado en el build
│  ├─ news-sitemap.xml/          Sitemap de Google News (ventana de 48 h del build)
│  ├─ sobre | contacto | privacidad | cookies | aviso-legal | dmca
│  ├─ sitemap.ts | robots.ts     Generados desde la misma fuente de verdad
│  └─ error.tsx | global-error.tsx | loading.tsx | not-found.tsx
├─ components/
│  ├─ ads/                       Bloque publicitario condicionado al consentimiento
│  ├─ consent/                   Banner, ajustes, señales de Consent Mode y hook
│  └─ site/                      Cabecera, pie, tarjetas, migas, buscador, compartir
└─ lib/
   ├─ data.ts                    Ensambla el contenido (96 artículos, 8 categorías)
   ├─ queries.ts                 Recuentos, filtros de fuentes y buscador del servidor
   ├─ search.ts                  Motor de búsqueda puro, compartido servidor/navegador
   ├─ article-view.ts            Aplana un artículo para las tarjetas del cliente
   ├─ images.ts                  Imagen propia del artículo, portada de reserva y og:image
   ├─ cover.ts                   Motor de las portadas SVG (las sirve /portadas/<slug>.svg)
   ├─ site.ts                    Configuración del sitio (una sola fuente)
   └─ consent.ts                 Tipos y lógica pura del consentimiento
```

Además, fuera del repositorio y solo para trabajo de assets, `work/assets/`
contiene el generador de la identidad visual y la herramienta de preparación de
imágenes (usan `sharp`; el proyecto no la necesita para compilar).

**Frontera servidor/cliente.** El contenido (`lib/data.ts`) se consulta solo
desde componentes de servidor: así el HTML se genera en el build y el fichero de
contenido no viaja al navegador. Hay una prueba que falla si algún componente con
`"use client"` lo importa. Cuando una página necesita filtrar en el navegador
(`/buscar`, `/noticias`), el servidor le pasa **vistas aplanadas**
(`ArticleView`), no artículos enteros.

**Nada se renderiza en la petición.** No hay ninguna ruta dinámica (`ƒ`): todas
son estáticas (`○`) o prerenderizadas con `generateStaticParams` (`●`). Hay
pruebas que fallan si alguien vuelve a leer `searchParams` en el servidor, si un
route handler declara `revalidate` o si reaparece la ruta `/cover`.

## Privacidad y consentimiento

- **Consent Mode v2** arranca en `denied` (publicidad, datos de usuario y
  medición).
- El script de AdSense **no se carga** hasta que hay consentimiento de
  publicidad; antes de eso, el bloque publicitario ni siquiera se renderiza.
- El banner empieza con las casillas **desactivadas**, "Rechazar todo" tiene el
  mismo peso visual que "Aceptar todo", cerrar sin decidir no equivale a
  aceptar, y el consentimiento se puede revisar o retirar en cualquier momento
  desde el pie ("Configurar cookies").
- La decisión se guarda en `localStorage` bajo la clave `gtavidaily-consent`,
  versionada, y se propaga por un evento que sí tiene consumidores.

## Contenido: estado y criterio editorial

Los artículos de la primera etapa salieron de plantillas
(`scripts/generate_articles_*.py`, ya retirados). Ese contenido **se revisó
después afirmación por afirmación y se reescribió**: cada dato se clasificó como
confirmado, reportado, probable, rumor o falso, y lo que no se pudo sostener se
corrigió o se retiró del sitio.

Al añadir contenido nuevo, el criterio es:

1. Separar siempre **lo que Rockstar ha confirmado** de lo que solo es un rumor,
   y decirlo en el cuerpo del texto, no solo en el titular.
2. Enlazar una **fuente permanente** para cada afirmación relevante: el validador
   rechaza las portadas de medio.
3. Mantener el aviso de sitio fan no oficial y las marcas registradas.
4. No inventar datos para redondear un artículo: si falta información
   verificable, se publica menos y se dice lo que falta.

## Identidad visual

El logotipo, los iconos y la imagen social se generan con un script que vive
**fuera del repositorio** (`work/assets/build-brand.mjs`, con `sharp`), para que
el proyecto no arrastre una dependencia nativa por una tarea que se hace de vez
en cuando. Lo que produce va a `public/`:

| Fichero | Para qué |
| --- | --- |
| `logo.svg` | Lockup completo (marca + nombre + lema): pie y prensa |
| `logo-compact.svg` | Marca + nombre: lo que usa la cabecera |
| `logo-mark.svg` / `icon.svg` | Marca cuadrada (avatar, manifiesto PWA) |
| `icon-192.png` / `icon-512.png` / `icon-maskable-512.png` | Iconos PWA |
| `apple-touch-icon.png` | Icono de iOS (180 px, a sangre) |
| `favicon.ico` | ICO multi-tamaño 16/32/48 |
| `og-image.png` | Imagen social 1200×630 |

El logotipo es **original**: se compone con una tipografía geométrica propia
definida como trazados en el propio script, así que no depende de fuentes del
sistema ni imita la identidad de Rockstar/Take-Two. Antes, `public/logo.svg` era
un resto del andamiaje original con el logotipo de la herramienta que generó el
sitio.

Para regenerarlo todo:

```bash
cd work/assets && node build-brand.mjs
```

## Imágenes de los artículos

Cada artículo puede llevar su propia imagen, además de la portada generada. Las
reglas completas están en `public/imagenes/README.md`; el resumen:

- **Siempre copia local** en `public/imagenes/`, nunca un enlace a un tercero: el
  validador rechaza una URL remota en `image`.
- Campos del JSON: `image`, `imageAlt`, `imageCredit` y `imageSource`.
- Sin imagen propia, el artículo sirve la portada SVG estática
  `/portadas/<slug>.svg`, que el build genera con el motor de `src/lib/cover.ts`.
  Es una situación válida, no un problema pendiente.
- La imagen propia se usa también como `og:image` del artículo, se declara en el
  sitemap (Google Imágenes) y su autoría aparece en el pie de foto.

Herramienta para prepararlas (recorte 16:9 por atención, 1200×675 y JPEG
optimizado):

```bash
node work/assets/prepare-image.mjs <origen> <slug> "Autoría" "https://fuente"
npm run content && npm run content:images
```

Antes de añadir imágenes con derechos conviene leer la política de Rockstar sobre
material con copyright, enlazada en `public/imagenes/README.md`.

## Despliegue

El sitio es **completamente estático**, así que en cualquier plataforma se reduce
a publicar el directorio `out/` del build. El destino actual es **Cloudflare
Workers**, sirviendo solo activos estáticos (sin Worker que ejecute código); ver
la sección de Cloudflare más abajo. El despliegue en **Netlify** sigue preparado
en paralelo.

La configuración de Netlify vive en `netlify.toml`: comando de build, directorio
publicado (`out`), versión de Node y las cabeceras de seguridad del CDN.

### Puesta en marcha (una sola vez)

1. Entra en Netlify con la cuenta de GitHub y elige **Add new site → Import an
   existing project → GitHub → `RaulAbellon/gtavidaily`**.
2. No toques el formulario: `netlify.toml` ya declara el comando de build y la
   versión de Node. Pulsa **Deploy**.
3. En **Domain management** añade `gtavidaily.com` como dominio principal y
   `www.gtavidaily.com` como alias. Netlify redirige el segundo al primero y
   emite el certificado TLS automáticamente.
4. Apunta el DNS en GoDaddy: lo más simple es cambiar los *nameservers* por los
   cuatro que indique Netlify (gestiona todos los registros). La alternativa es
   crear un registro `A` para el dominio raíz y un `CNAME` para `www` con los
   valores que muestre el panel.
5. En **Site configuration → Environment variables** define las variables de
   `.env.example` (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_CLIENT` y los
   datos legales son las importantes) y vuelve a desplegar.

Mientras el DNS no apunte al hosting, `gtavidaily.com` seguirá mostrando la
página de GoDaddy aunque el sitio ya esté publicado en su URL `*.netlify.app`.

### Estado actual

| Dato | Valor |
| --- | --- |
| Proyecto en Netlify | `gtavidaily-news` (`gtavidaily.netlify.app` estaba ocupado) |
| Dominio | `gtavidaily.com` en Netlify DNS, con `www` redirigiendo 301 al raíz |
| Registros | `ALIAS` del raíz → `apex-loadbalancer.netlify.com` y `CNAME` de `www` → `gtavidaily-news.netlify.app` |
| Certificado | Let's Encrypt, emitido y con renovación automática |
| Visibilidad | Pública. **Ojo:** desde julio de 2026 Netlify crea los proyectos privados por defecto (responden 401); si algún día se crea otro, hay que ponerlo en público en *Project configuration → Visitor access* |

### Publicar cambios

```bash
npm run deploy -- "contenido: noticia del día"
```

Regenera el índice, pasa `npm run check`, hace el commit y empuja a `main`. El
despliegue lo lanza Netlify por su cuenta: no hay ningún botón que pulsar. Sin
`git` instalado, `scripts/publish.mjs` hace lo mismo contra la API de GitHub.

### Autoalojamiento (alternativa)

El build deja el sitio entero en `out/` y `npm start` lo sirve en local aplicando
`public/_headers`, que es justo lo que hace un CDN:

```bash
npm run build
npm start          # respeta PORT y HOSTNAME
```

Cualquier servidor de ficheros estáticos vale (nginx, Caddy, S3+CloudFront,
GitHub Pages): no hay dependencias nativas, ni base de datos, ni proceso Node en
producción. Lo único que hay que replicar fuera de Cloudflare y Netlify son las
cabeceras de `public/_headers`. Los formularios se envían desde el navegador a
Web3Forms, así que funcionan en cualquier hosting.

### Cabeceras de seguridad

La `Content-Security-Policy` (permisiva con los dominios de Google que necesita
AdSense, restrictiva con todo lo demás), `Strict-Transport-Security`,
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y
`Permissions-Policy` viven en **`public/_headers`** (y, copiadas, en
`netlify.toml`). La constante `CSP` de `next.config.ts` es la fuente de verdad
documental del proyecto, pero con `output: "export"` Next no ejecuta `headers()`;
hay una prueba que falla si las tres copias divergen.

Ventaja del sitio estático: como el HTML también es un activo, **`_headers` se
aplica a las páginas**, no solo a las imágenes y a los ficheros de `_next`.
Antes el HTML lo generaba el Worker y su CSP dependía de `next.config.ts`.

### Cloudflare (destino actual)

El despliegue vive en `wrangler.jsonc` y es **solo activos estáticos**: publica
`out/` en Workers Static Assets y **no declara ningún Worker** (`main`), así que
ninguna petición ejecuta código. Eso resuelve el límite de 10 ms de CPU por
petición del plan gratuito, que cortaba la conexión al renderizar páginas con la
caché fría. Los pasos que dependen de una persona (cuenta, conexión del
repositorio y DNS) están en `MIGRACION-CLOUDFLARE.md`.

Para probarlo en local (necesita el build hecho con las variables, ver arriba):

```bash
npm run cf:preview                              # compila y sirve en http://127.0.0.1:8787
node scripts/verify-cf.mjs http://127.0.0.1:8787
BASE_URL=http://127.0.0.1:8787 npm run test:e2e
```

`cf:preview` levanta `wrangler dev`, que sirve `out/` con las mismas reglas que el
CDN: `_headers`, `html_handling` (una URL `/ruta` resuelve al fichero
`ruta.html`) y `not_found_handling` (el `404.html` del build, con estado 404).
Para comprobar que no hay Worker: `wrangler deploy --dry-run` no sube script
alguno (0,31 KiB de andamiaje vacío) y el arranque de `wrangler dev` no declara
script.

`@opennextjs/cloudflare` sigue en `devDependencies`, pero **ya no se usa**: el
adaptador obliga a compilar en modo `standalone` y a ejecutar un Worker en cada
petición, que es exactamente lo que se ha retirado. Se deja instalado para no
regenerar el lockfile; se puede quitar con
`npm uninstall @opennextjs/cloudflare esbuild` cuando se quiera.

### Monetización

`/ads.txt` es un fichero estático en `public/`, que es la forma canónica que
describe Google: lo sirve el CDN, sin función de por medio y con el tipo de
contenido correcto. Declara el vendedor autorizado de AdSense
(`pub-6098877112141110`); `tests/deploy.test.ts` falla si deja de coincidir con
el cliente configurado.

## Publicar cambios sin `git`

Si no hay `git` instalado, `scripts/publish.mjs` publica por la API de GitHub:
compara los ficheros locales con el árbol remoto por hash de blob, sube solo lo
que cambió y crea un commit en la rama por defecto.

```bash
node scripts/publish.mjs --dry-run       # muestra qué cambiaría
GITHUB_TOKEN=xxx node scripts/publish.mjs
```

El token es un PAT *fine-grained* con permiso **Contents: Read and write** sobre
este repositorio; también se puede dejar en un fichero `.gh-token` (ignorado por
Git).

## Licencia

Código bajo licencia MIT (ver `LICENSE`). El contenido editorial y las marcas de
terceros tienen su propio régimen.

---

Sitio fan no oficial. *Grand Theft Auto*, *GTA*, *Vice City* y *Rockstar Games*
son marcas registradas de Take-Two Interactive Software, Inc.
