# GTA VI Daily — Noticias de Grand Theft Auto VI en español

Sitio web de noticias sobre **Grand Theft Auto VI** (GTA 6) de Rockstar Games,
optimizado para **SEO** y **Google AdSense** (bloques publicitarios en
posiciones estratégicas, política de privacidad incluida).

**Dominio oficial**: [gtavidaily.com](https://gtavidaily.com)

Construido con **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**
y **shadcn/ui**.

---

## Requisitos

- **Node.js 20+** (recomendado vía `.nvmrc`)
- **npm 10+** (no se usa Bun en producción)
- Base de datos **SQLite** (desarrollo local) o **PostgreSQL** (producción, opcional)

---

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

| Variable                       | Descripción                                          | Ejemplo                            |
| ------------------------------ | ---------------------------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SITE_URL`         | URL pública del sitio (sin barra final)              | `https://gtavidaily.com`           |
| `NEXT_PUBLIC_ADSENSE_CLIENT`   | ID de cliente de Google AdSense                      | `ca-pub-1234567890123456`          |
| `DATABASE_URL`                 | Cadena de conexión a la base de datos (Prisma)       | `file:./dev.db` (SQLite)           |
| `GOOGLE_SITE_VERIFICATION`     | Token de verificación de Google Search Console       | `google-site-verification-token`   |

> **Importante:** las variables con prefijo `NEXT_PUBLIC_` se exponen al
> navegador. Las demás solo viven en el servidor.

---

## Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Generar el cliente de Prisma y crear la base de datos local
npm run db:push

# 3. Arrancar el servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:3000`.

---

## Build de producción

```bash
# Compilar el proyecto (genera .next/standalone autocontenido)
npm run build

# Arrancar el servidor de producción
npm start
```

El build genera un servidor Node standalone en `.next/standalone/` que escucha
en el puerto definido por la variable de entorno `PORT` (por defecto `3000`).

---

## Despliegue en Runable

Runable impone **Node.js** como runtime (no se puede elegir Bun, Deno ni
Docker). Por eso este proyecto está configurado para funcionar 100% con Node
estándar.

### Arquitectura del deploy

```
GoDaddy (DNS)  →  Runable (hosting Node.js)  →  gtavidaily.com
   ↓                    ↓
   Apunta @ al          Sirve Next.js standalone
   dominio de Runable   en el puerto PORT
```

### Paso 1: Sube el código a GitHub

```bash
git init
git add .
git commit -m "Initial commit: GTA VI Daily"
git branch -M main
git remote add origin https://github.com/USUARIO/gta-vi-daily.git
git push -u origin main
```

### Paso 2: Conecta GitHub a Runable

1. Entra en [runable.com](https://runable.com) y crea un nuevo proyecto.
2. Selecciona "Import from GitHub" y elige tu repositorio `gta-vi-daily`.
3. Runable detectará automáticamente:
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
   - **Node version:** 20+ (del `engines` y `.nvmrc`)

4. Configura las **variables de entorno** en el panel de Runable:

   | Variable | Valor |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://gtavidaily.com` |
   | `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-0000000000000000` (placeholder hasta que AdSense apruebe) |
   | `DATABASE_URL` | cadena que Runable te proporcione |

5. Deploy. Runable te dará una URL tipo `gta-vi-daily.runable.app` — apunta
   tu dominio GoDaddy a esa URL (ver siguiente paso).

### Paso 3: Configura el dominio en GoDaddy

1. Entra en [godaddy.com](https://dcc.godaddy.com/manage/) → ve a **Mis productos** → **DNS** junto a `gtavidaily.com`.

2. **Si Runable te da una IP (registro A):**
   - Edita el registro **A** existente con nombre `@`
   - Cambia el valor por la IP que Runable te dé
   - Guarda

3. **Si Runable te da un CNAME (más habitual en PaaS):**
   - Elimina el registro A existente con nombre `@` (si lo hay)
   - Crea un nuevo registro **CNAME** con:
     - **Name/Host:** `@`
     - **Value/Points to:** la URL de Runable (ej: `gta-vi-daily.runable.app`)
     - **TTL:** 600 (o Default)
   - Crea otro CNAME para `www` que apunte a lo mismo

4. **Espera la propagación DNS** (puede tardar de 5 minutos a 1 hora). Verifica con:
   ```bash
   dig gtavidaily.com
   # o en https://dnschecker.org
   ```

5. **Habilita HTTPS/SSL** — Runable normalmente emite certificado Let's
   Encrypt automáticamente. En el panel de Runable verifica que el dominio
   custom está añadido y el SSL está activo.

### Paso 4: Verifica que todo funciona

- Visita `https://gtavidaily.com` — debe cargar tu sitio
- Visita `https://gtavidaily.com/sitemap.xml` — debe mostrar el XML
- Visita `https://gtavidaily.com/robots.txt` — debe mostrar las reglas
- Comprueba que el certificado SSL es válido (candado verde en navegador)

### Paso 5: Google Search Console

1. Ve a [search.google.com/search-console](https://search.google.com/search-console)
2. Añade propiedad → **Prefijo de URL** → `https://gtavidaily.com`
3. Verifica con etiqueta HTML (te dará un token — ponlo en `GOOGLE_SITE_VERIFICATION` en Runable)
4. Envía el sitemap: `https://gtavidaily.com/sitemap.xml`

### Paso 6: Google AdSense (cuando aprueben)

1. Regístrate en [adsense.google.com](https://adsense.google.com)
2. Añade `gtavidaily.com` como sitio
3. Cuando aprueben (suele tardar días/semanas), copia tu `ca-pub-XXXXXXXXXXXXXXXX`
4. Actualiza la variable `NEXT_PUBLIC_ADSENSE_CLIENT` en el panel de Runable
5. Re-deploy

### Notas importantes para Runable

- **Runtime:** Node.js 20+ (declarado en `engines` del `package.json`).
- **Sin `sharp` nativo:** las imágenes se sirven sin optimización
  (`images.unoptimized: true` en `next.config.ts`) para evitar dependencias
  nativas frágiles en el entorno sin Docker.
- **Lockfile:** el repositorio incluye `package-lock.json` para garantizar
  instalaciones reproducibles. Si usas `bun install` en desarrollo, asegúrate
  de regenerar el lockfile con `npm install` antes de pushear.
- **SQLite:** si Runable no ofrece almacenamiento persistente para SQLite,
  cambia el `provider` de `prisma/schema.prisma` a `postgresql` y configura
  `DATABASE_URL` con la cadena de tu Postgres.

---

## Estructura del proyecto

```
.
├── prisma/
│   └── schema.prisma            # Esquema de base de datos
├── public/
│   ├── manifest.json            # PWA manifest
│   └── robots.txt               # Reglas para crawlers
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Metadata SEO + AdSense script + JSON-LD global
│   │   ├── page.tsx             # Router SPA por estado
│   │   ├── globals.css          # Estilos + tema GTA VI (neón Miami)
│   │   ├── sitemap.ts           # Sitemap dinámico
│   │   └── robots.ts            # Robots dinámico
│   ├── components/
│   │   ├── ads/
│   │   │   └── AdSense.tsx      # Componente de bloque publicitario
│   │   └── site/
│   │       ├── Header.tsx       # Header con nav, búsqueda, móvil
│   │       ├── Footer.tsx       # Footer completo
│   │       ├── ArticleCard.tsx  # 4 variantes de tarjeta de artículo
│   │       ├── ArticleView.tsx  # Vista de artículo individual
│   │       ├── HomeView.tsx     # Página de inicio
│   │       ├── CategoryView.tsx # Listado por categoría
│   │       └── StaticPage.tsx   # About / Privacy / Contact
│   └── lib/
│       ├── data.ts              # 13 artículos + 7 categorías + 4 autores
│       ├── nav.ts               # Store Zustand para navegación SPA
│       └── db.ts                # Cliente Prisma
├── .env.example                 # Plantilla de variables de entorno
├── .nvmrc                       # Versión de Node recomendada
├── next.config.ts               # Config standalone + headers
├── package.json                 # Scripts: dev / build / start (Node puro)
└── tsconfig.json
```

---

## SEO incluido

- ✅ Metadata completa (OpenGraph, Twitter Cards, canonical, multilenguaje)
- ✅ JSON-LD estructurado (Organization, WebSite, NewsArticle)
- ✅ Sitemap dinámico en `/sitemap.xml`
- ✅ Robots.txt en `/robots.txt`
- ✅ HTML semántico (`<article>`, `<nav>`, `<main>`, `<aside>`, `<time>`)
- ✅ Breadcrumbs con ARIA labels
- ✅ Manifest PWA
- ✅ Imágenes con `alt` descriptivo

## AdSense incluido

- ✅ Script de AdSense en `<head>` (controlado por `NEXT_PUBLIC_ADSENSE_CLIENT`)
- ✅ Componente `<AdSense>` reutilizable
- ✅ 9 posiciones publicitarias estratégicas
- ✅ Política de privacidad con cláusula AdSense
- ✅ Meta `google-adsense-account`
- ✅ Label "Publicidad" en cada bloque (cumple políticas)

---

## Disclaimer legal

Este sitio es un proyecto fan **no oficial**. Grand Theft Auto y Rockstar Games
son marcas registradas de Take-Two Interactive. No estamos afiliados con
Rockstar Games ni Take-Two. Todo el contenido es informativo y se publica bajo
fair use.

---

## Licencia

Código bajo licencia MIT. Contenido editorial propio del sitio.
