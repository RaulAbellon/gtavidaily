import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://gtavihub.example";
const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-0000000000000000";
const SITE_NAME = "GTA VI Hub";
const SITE_DESCRIPTION =
  "Las últimas noticias, análisis, tráileres y rumores sobre Grand Theft Auto VI (GTA 6) de Rockstar Games. Cobertura en español de Vice City, Lucia y Juan, fecha de lanzamiento y mucho más.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GTA VI Hub · Noticias de Grand Theft Auto VI en español",
    template: "%s | GTA VI Hub",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "GTA VI",
    "GTA 6",
    "Grand Theft Auto VI",
    "GTA VI noticias",
    "GTA VI fecha de lanzamiento",
    "Vice City",
    "Lucia GTA VI",
    "Rockstar Games",
    "GTA VI PS5",
    "GTA VI Xbox",
    "GTA VI PC",
    "GTA VI tráiler",
    "GTA 6 español",
    "noticias GTA VI",
  ],
  authors: [{ name: "Equipo GTA VI Hub" }],
  creator: "GTA VI Hub",
  publisher: "GTA VI Hub",
  applicationName: SITE_NAME,
  category: "Videojuegos",
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/",
      "es-MX": "/",
      "es-AR": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["es_MX", "es_AR"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "GTA VI Hub · Noticias de Grand Theft Auto VI en español",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "GTA VI Hub - Noticias de Grand Theft Auto VI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@gtavihub",
    creator: "@gtavihub",
    title: "GTA VI Hub · Noticias de Grand Theft Auto VI en español",
    description: SITE_DESCRIPTION,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=630&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "google-site-verification-token",
  },
  other: {
    // AdSense verification: se carga desde NEXT_PUBLIC_ADSENSE_CLIENT.
    // Sustituye el valor en el panel de Runable cuando aprueben el sitio.
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD estructurado para la organización y el sitio web
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GTA VI Hub",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  description: SITE_DESCRIPTION,
  sameAs: [
    "https://twitter.com/gtavihub",
    "https://www.youtube.com/@gtavihub",
    "https://www.instagram.com/gtavihub",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GTA VI Hub",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: ["es-ES", "es-MX", "es-AR"],
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?s={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "GTA VI Hub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Google AdSense - script principal.
            El ID de cliente se controla con NEXT_PUBLIC_ADSENSE_CLIENT
            para no tener que tocar código al publicar. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
        {/* JSON-LD estructurado global */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body className="antialiased bg-zinc-950 text-zinc-100">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
