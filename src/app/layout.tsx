import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConsentScripts } from "@/components/consent/consent-scripts";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import {
  ADSENSE_CLIENT,
  ADSENSE_ENABLED,
  GOOGLE_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Videojuegos",
  alternates: {
    languages: {
      [SITE_LOCALE.replace("_", "-")]: "/",
      "x-default": "/",
    },
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} · ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    // El SVG es el preferido por los navegadores actuales; el .ico queda como
    // respaldo y el PNG para iOS, que no acepta SVG.
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  // El token de verificación se lee de entorno y, si no existe, no se emite una
  // etiqueta falsa (antes se enviaba un literal de plantilla).
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  ...(ADSENSE_ENABLED
    ? { other: { "google-adsense-account": ADSENSE_CLIENT } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon-512.png`,
    width: 512,
    height: 512,
  },
  description: SITE_DESCRIPTION,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: SITE_LANGUAGE,
  publisher: { "@type": "Organization", name: SITE_NAME },
  potentialAction: {
    "@type": "SearchAction",
    // Antes apuntaba a `/?s=...`, un parámetro que no existía. Ahora apunta al
    // buscador real.
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={SITE_LANGUAGE}>
      <body className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 antialiased">
        {/* El enlace al feed se emite como elemento (y React lo eleva al <head>)
            porque cada página define su propio `alternates.canonical` y eso
            reemplaza el `types` del layout. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} · RSS`}
          href="/feed.xml"
        />
        {/* Consent Mode v2 arranca en "denied" y AdSense solo se carga tras el
            consentimiento explícito. */}
        <ConsentScripts />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
