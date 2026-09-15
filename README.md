# GTA VI Daily

Sitio de noticias en español sobre **Grand Theft Auto VI**: tráileres, mapa de
Leonida, personajes y novedades de Rockstar Games y Take-Two.

Sitio fan **no oficial**, sin afiliación con Rockstar Games ni Take-Two
Interactive. Las imágenes son ilustraciones SVG generadas localmente.

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
| `npm run content:new -- <slug>` | Crea la plantilla de un artículo nuevo |
| `npm run lint` | ESLint con las reglas de corrección activadas |
| `npm run typecheck` | `tsc --noEmit` (tipos estrictos) |
| `npm run test` | Pruebas unitarias (Vitest) |
| `npm run test:e2e` | Prueba de humo HTTP contra un servidor en marcha |
| `npm run check` | Contenido + lint + tipos + tests + build, en ese orden |

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
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Para monetizar | ID `ca-pub-…`. Si no tiene formato válido, **no se renderiza ningún anuncio** |
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
   ├─ data.ts                    Contenido (44 artículos, 7 categorías)
   ├─ queries.ts                 Búsqueda, recuentos y filtros de fuentes
   ├─ site.ts                    Configuración del sitio (una sola fuente)
   └─ consent.ts                 Tipos y lógica pura del consentimiento
```

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

## Contenido: leer antes de monetizar

Los artículos se generaron en su día con plantillas (`scripts/generate_articles_*.py`
ya retirados) y **no han pasado una verificación editorial**. Antes de activar
publicidad conviene:

1. Revisar artículo por artículo los datos concretos (fechas, precios, cifras,
   casting) y corregir o retirar lo que no se pueda contrastar.
2. Sustituir cualquier fuente que sea una portada de dominio por un enlace
   permanente. La interfaz ya oculta las fuentes sin ruta, pero conviene
   limpiarlas también en los datos.
3. Mantener el aviso de sitio fan no oficial y las marcas registradas.

## Despliegue

El build genera un servidor autocontenido en `.next/standalone` (los estáticos y
`public/` se copian con `scripts/postbuild.mjs`):

```bash
npm run build
npm start          # respeta PORT y HOSTNAME
```

Cualquier plataforma con Node 20.9+ sirve. No hay dependencias nativas ni base
de datos. El endpoint `/api/contacto` necesita `CONTACT_WEBHOOK_URL` para enviar
mensajes.

Si la plataforma despliega desde GitHub (Runable, Vercel, Netlify, Cloudflare
Pages…), basta con que el cambio llegue a `main`: el despliegue lo hace ella. En
ese caso el ciclo diario es el de arriba y termina publicando en el repositorio.

### Cabeceras de seguridad

`next.config.ts` aplica `Content-Security-Policy` (permisiva con los dominios de
Google que necesita AdSense, restrictiva con todo lo demás), `Strict-Transport-Security`
en producción, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y
`Permissions-Policy`. Está documentado en el propio fichero para poder migrarla a
nonces cuando se integre un CMP con soporte completo.

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
