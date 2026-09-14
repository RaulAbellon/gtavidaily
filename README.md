# GTA VI Hub — Noticias de Grand Theft Auto VI en español

Sitio web de noticias sobre **Grand Theft Auto VI** (GTA 6) de Rockstar Games,
optimizado para **SEO** (metadata, JSON-LD, sitemap, robots) y **Google AdSense**
(bloques publicitarios en posiciones estratégicas, política de privacidad
incluida).

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
| `NEXT_PUBLIC_SITE_URL`         | URL pública del sitio (sin barra final)              | `https://gtavihub.example`         |
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

### Pasos

1. **Sube el código a GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: GTA VI Hub"
   git branch -M main
   git remote add origin https://github.com/USUARIO/gta-vi-hub.git
   git push -u origin main
   ```

2. **Conecta GitHub a Runable**

   - Entra en [runable.com](https://runable.com) y crea un nuevo proyecto.
   - Selecciona "Import from GitHub" y elige tu repositorio `gta-vi-hub`.

3. **Configura el build command** (Runable lo leerá del `package.json`):

   ```
   npm run build
   ```

4. **Configura el start command**:

   ```
   npm start
   ```

   > Next.js standalone ya lee la variable `PORT` que Runable inyecta, así que
   > no hay que tocar nada más.

5. **Configura las variables de entorno** en el panel de Runable:

   - `NEXT_PUBLIC_SITE_URL` → URL pública que Runable te asigne
   - `NEXT_PUBLIC_ADSENSE_CLIENT` → tu `ca-pub-XXXX` cuando AdSense apruebe el sitio
   - `DATABASE_URL` → cadena de conexión que Runable te proporcione
   - `GOOGLE_SITE_VERIFICATION` → token de Search Console (opcional)

6. **Despliega**. Runable ejecutará `npm install` → `npm run build` → `npm start`
   automáticamente.

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
