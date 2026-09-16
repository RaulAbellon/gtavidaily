# GTA VI Daily

Sitio de noticias en español sobre **Grand Theft Auto VI**: tráileres, mapa de
Leonida, personajes y novedades de Rockstar Games y Take-Two.

Sitio fan **no oficial**, sin afiliación con Rockstar Games ni Take-Two
Interactive. Las portadas son ilustraciones SVG generadas localmente; cuando un
artículo lleva una imagen propia, su autoría aparece en el pie de foto.

---

## Stack

- **Next.js 16** (App Router, Turbopack) con rutas estáticas prerenderizadas
- **React 19** + **TypeScript** en modo `strict`
- **Tailwind CSS 4** (configuración en CSS, sin `tailwind.config.ts`)
- **Vitest** para pruebas unitarias y un script de humo HTTP para extremo a extremo
- 4 dependencias de producción: `next`, `react`, `react-dom` y `lucide-react`

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
| `npm run build` | Build de producción + artefactos standalone |
| `npm start` | Arranca el servidor standalone (multiplataforma) |
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

El validador rechaza lo que no debe publicarse: campos que faltan o sobran,
categorías inexistentes, fechas incoherentes (`updatedAt` anterior a
`publishedAt`), texto con la codificación rota, títulos o rótulos demasiado
largos y **fuentes que sean una portada de medio en lugar de un enlace
permanente**. Los avisos (artículo corto, `readingTime` desajustado, menos de
dos fuentes) no bloquean, pero aparecen en pantalla.

El buscador, el sitemap, el feed RSS, las categorías y los artículos
relacionados se recalculan solos a partir de los ficheros: no hay que tocar
ningún listado a mano.

La prueba de humo se lanza contra un servidor ya arrancado:

```bash
npm start &
BASE_URL=http://127.0.0.1:3000 npm run test:e2e
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
| `CONTACT_WEBHOOK_URL` | No | Destino del formulario de contacto. Sin él, el endpoint responde con un error explícito indicando el email directo (nunca finge un envío correcto) |

## Arquitectura

```
src/
├─ app/
│  ├─ layout.tsx                 Cabecera, pie, consentimiento y datos estructurados
│  ├─ page.tsx                   Portada
│  ├─ noticias/                  Listado completo con paginación
│  ├─ articulo/[slug]/           Artículos: generateStaticParams + generateMetadata
│  ├─ categoria/[slug]/          Categorías
│  ├─ buscar/                    Buscador real (?q=…), noindex
│  ├─ sobre | contacto | privacidad | cookies | aviso-legal | dmca
│  ├─ sitemap.ts | robots.ts     Generados desde la misma fuente de verdad
│  ├─ error.tsx | global-error.tsx | loading.tsx | not-found.tsx
│  └─ api/contacto/route.ts      Validación y envío honesto del formulario
├─ components/
│  ├─ ads/                       Bloque publicitario condicionado al consentimiento
│  ├─ consent/                   Banner, ajustes, señales de Consent Mode y hook
│  └─ site/                      Cabecera, pie, tarjetas, migas, buscador, compartir
└─ lib/
   ├─ data.ts                    Ensambla el contenido (57 artículos, 8 categorías)
   ├─ queries.ts                 Búsqueda, recuentos y filtros de fuentes
   ├─ images.ts                  Imagen propia del artículo, créditos y og:image
   ├─ cover.ts                   Portadas SVG generadas que sirve /cover
   ├─ site.ts                    Configuración del sitio (una sola fuente)
   └─ consent.ts                 Tipos y lógica pura del consentimiento
```

Además, fuera del repositorio y solo para trabajo de assets, `work/assets/`
contiene el generador de la identidad visual y la herramienta de preparación de
imágenes (usan `sharp`; el proyecto no la necesita para compilar).

**Frontera servidor/cliente.** El contenido (`lib/data.ts`) se consulta solo
desde componentes de servidor: así el HTML llega renderizado y el fichero de
contenido no viaja al navegador. Hay una prueba que falla si algún componente
con `"use client"` lo importa.

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
- Sin imagen propia, el artículo sigue sirviendo la portada SVG de `/cover`. Es
  una situación válida, no un problema pendiente.
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

El sitio se despliega en **Netlify**, plan gratuito. Para este proyecto es la
opción más rentable: el plan Starter **sí permite publicidad**, mientras que el
plan Hobby de Vercel la prohíbe; y el soporte de Next.js 16 lo lleva el adaptador
oficial de Netlify, que se actualiza solo en cada build.

La configuración vive en `netlify.toml`: comando de build, versión de Node y las
cabeceras de seguridad aplicadas en el CDN.

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

El build genera además un servidor autocontenido en `.next/standalone` (los
estáticos y `public/` se copian con `scripts/postbuild.mjs`), que es lo que usa
un VPS o un contenedor:

```bash
npm run build
npm start          # respeta PORT y HOSTNAME
```

En Netlify y Vercel ese bundle no se genera (`outputMode` en `next.config.ts` lo
desactiva), porque es su adaptador el que empaqueta el resultado. Cualquier
plataforma con Node 20.9+ sirve: no hay dependencias nativas ni base de datos.
El endpoint `/api/contacto` necesita `CONTACT_WEBHOOK_URL` para enviar mensajes.

### Cabeceras de seguridad

`next.config.ts` aplica la `Content-Security-Policy` (permisiva con los dominios
de Google que necesita AdSense, restrictiva con todo lo demás),
`Strict-Transport-Security` en producción, `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`. Las mismas
cabeceras se declaran en `netlify.toml` para que el CDN las aplique a todas las
respuestas, incluidas las de la función de Next; hay una prueba que falla si la
CSP de ambos ficheros diverge.

### Monetización

`/ads.txt` se genera desde `NEXT_PUBLIC_ADSENSE_CLIENT`: en cuanto el ID tenga
formato válido, la ruta publica la línea que espera Google para autorizar el
inventario. Sin AdSense configurado responde 404, que es lo honesto: no hay
inventario que declarar.

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
