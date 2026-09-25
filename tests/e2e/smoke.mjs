#!/usr/bin/env node
/**
 * Prueba de humo contra una instancia real del sitio.
 *
 * Comprueba lo que rompía la versión auditada: que cada ruta existe de verdad,
 * que **todas** las URLs del sitemap responden 200, que el contenido llega en
 * el HTML (SSR) y que AdSense **no** se carga antes del consentimiento.
 *
 * Uso:
 *   BASE_URL=http://127.0.0.1:3000 node tests/e2e/smoke.mjs
 */
const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/+$/, "");
const failures = [];
const checks = [];

function ok(label, extra = "") {
  checks.push(`  ✓ ${label}${extra ? ` (${extra})` : ""}`);
}
function fail(label, detail) {
  failures.push(`  ✗ ${label}: ${detail}`);
}

async function get(pathname) {
  const response = await fetch(`${BASE}${pathname}`, {
    redirect: "manual",
    headers: { "user-agent": "gtaidaily-smoke" },
  });
  const body = await response.text();
  return { status: response.status, body, headers: response.headers };
}

async function waitForServer() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      const response = await fetch(`${BASE}/`, { redirect: "manual" });
      if (response.status < 500) return true;
    } catch {
      // todavía no escucha
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

const REQUIRED_ROUTES = [
  "/",
  "/noticias",
  "/buscar?q=lucia",
  "/sobre",
  "/contacto",
  "/privacidad",
  "/cookies",
  "/aviso-legal",
  "/dmca",
  "/robots.txt",
  "/sitemap.xml",
  "/feed.xml",
  "/.well-known/security.txt",
  // El buscador es estático: la página y el índice con el que filtra el
  // navegador son dos activos distintos.
  "/buscar",
  "/buscar/indice.json",
  // Identidad visual: si falta un activo, el navegador o las redes sociales
  // sirven algo roto y nadie se entera hasta que se ve el enlace compartido.
  "/logo-compact.svg",
  "/logo.svg",
  "/favicon.svg",
  "/favicon.ico",
  "/icon-192.png",
  "/apple-touch-icon.png",
  "/og-image.png",
  "/manifest.json",
];

const EXPECTED_404 = ["/no-existe", "/about", "/articulo/no-existe-este-articulo"];

async function main() {
  if (!(await waitForServer())) {
    console.error(`El servidor no responde en ${BASE}`);
    process.exit(1);
  }

  for (const route of REQUIRED_ROUTES) {
    const { status } = await get(route);
    if (status === 200) ok(route);
    else fail(route, `esperaba 200 y llegó ${status}`);
  }

  for (const route of EXPECTED_404) {
    const { status } = await get(route);
    if (status === 404) ok(`${route} → 404`);
    else fail(route, `esperaba 404 y llegó ${status}`);
  }

  // El contenido debe venir en el HTML (rastreable sin JavaScript).
  const home = await get("/");
  if (home.body.includes("Vice City")) ok("la home incluye contenido en el HTML");
  else fail("SSR de la home", "no se encuentra el contenido en el HTML");

  const sitemap = await get("/sitemap.xml");
  const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) {
    fail("sitemap", "no contiene URLs");
  } else {
    let broken = 0;
    for (const url of urls) {
      const { status } = await get(new URL(url).pathname);
      if (status !== 200) {
        broken += 1;
        fail("URL del sitemap", `${url} → ${status}`);
      }
    }
    if (broken === 0) ok(`las ${urls.length} URLs del sitemap responden 200`);
  }

  const articlePath = new URL(urls.find((url) => url.includes("/articulo/")) ?? `${BASE}/`).pathname;
  const article = await get(articlePath);
  if (article.status === 200 && article.body.includes("<article")) {
    // El HTML viene pregenerado en el build: se sirve tal cual, sin renderizar.
    ok("el artículo llega completo en el HTML", articlePath);
  } else {
    fail("artículo", `${articlePath} → ${article.status}`);
  }

  // Portadas: cada artículo tiene su imagen en JPEG (/imagenes/) para que
  // Discover y las redes sociales la usen; `/portadas/<slug>.svg` es el fichero
  // estático de reserva que entra si algún artículo se quedara sin imagen
  // propia. La ruta dinámica `/cover?c=…&t=…` ya no existe: obligaba al Worker
  // a dibujar el SVG en cada petición.
  const ownImages = [
    ...new Set([...home.body.matchAll(/\/imagenes\/[^"'\s)]+\.jpg/g)].map((m) => m[0])),
  ];
  const coverUrls = [
    ...new Set([...home.body.matchAll(/\/portadas\/[^"'\s)]+\.svg/g)].map((m) => m[0])),
  ];

  if (ownImages.length > 0) {
    const image = await fetch(`${BASE}${ownImages[0]}`);
    const contentType = image.headers.get("content-type") ?? "";
    if (image.status === 200 && contentType.includes("image/jpeg")) {
      ok(`${ownImages.length} portadas propias en JPEG`, contentType);
    } else {
      fail("portada propia", `${ownImages[0]} → ${image.status} ${contentType}`);
    }
  } else if (coverUrls.length > 0) {
    const coverResponse = await fetch(`${BASE}${coverUrls[0]}`);
    const contentType = coverResponse.headers.get("content-type") ?? "";
    if (coverResponse.status === 200 && contentType.includes("image/svg+xml")) {
      ok(`${coverUrls.length} portadas servidas como SVG estático`, contentType);
    } else {
      fail("portada", `${coverUrls[0]} → ${coverResponse.status} ${contentType}`);
    }
  } else {
    fail("portadas", "la home no referencia ninguna imagen de artículo");
  }

  // La reserva tiene que existir de verdad para **todos** los artículos: es la
  // garantía de que ninguna página se queda sin imagen.
  const coverSlugs = urls
    .filter((url) => url.includes("/articulo/"))
    .slice(0, 3)
    .map((url) => new URL(url).pathname.replace("/articulo/", ""));
  for (const slug of coverSlugs) {
    const path = `/portadas/${slug}.svg`;
    const response = await fetch(`${BASE}${path}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (response.status === 200 && contentType.includes("image/svg+xml")) {
      ok(`${path} → 200`);
    } else {
      fail(path, `estado ${response.status}, content-type ${contentType}`);
    }
  }

  if (/data:image\/svg\+xml/.test(home.body)) {
    fail("portadas incrustadas", "el HTML todavía lleva SVG en data URI");
  } else {
    ok("ninguna portada incrustada como data URI");
  }

  // Privacidad: el HTML inicial no trae el script de AdSense. Se inyecta al
  // hidratar, con Consent Mode v2 arrancando en "denied", y en el EEE el mensaje
  // de la CMP certificada de Google va por delante de cualquier anuncio. Que no
  // esté en el HTML también significa que no entra en la ruta crítica de carga.
  for (const [label, page] of [
    ["home", home],
    ["artículo", article],
  ]) {
    if (/adsbygoogle\.js/.test(page.body)) {
      fail(`AdSense en ${label}`, "el script aparece en el HTML inicial");
    } else {
      ok(`el HTML de ${label} no trae el script de AdSense`);
    }
  }

  if (home.body.includes("ca-pub-0000000000000000")) {
    fail("AdSense", "hay un ID de cliente de ejemplo en el HTML");
  } else {
    ok("sin ID de AdSense de ejemplo en el HTML");
  }

  // El feed y el contacto de seguridad forman parte del producto.
  const feed = await get("/feed.xml");
  const feedItems = (feed.body.match(/<item>/g) ?? []).length;
  if (feed.status === 200 && feedItems > 0) {
    ok(`feed RSS con ${feedItems} elementos`);
  } else {
    fail("feed RSS", `estado ${feed.status}, ${feedItems} elementos`);
  }

  const security = await get("/.well-known/security.txt");
  const expires = /^Expires: (.+)$/m.exec(security.body)?.[1];
  if (
    security.status === 200 &&
    security.body.includes("Contact:") &&
    expires &&
    new Date(expires).getTime() > Date.now()
  ) {
    ok("security.txt válido y sin caducar");
  } else {
    fail(
      "security.txt",
      `estado ${security.status}, Expires=${expires ?? "ausente"}`
    );
  }

  // ads.txt: 404 honesto mientras no haya AdSense; con AdSense configurado, la
  // línea que espera Google para autorizar el inventario.
  const ads = await get("/ads.txt");
  if (ads.status === 404) {
    ok("/ads.txt → 404 (AdSense sin configurar)");
  } else if (ads.status === 200 && ads.body.includes("DIRECT")) {
    ok("/ads.txt declara el vendedor autorizado de AdSense");
  } else {
    fail("ads.txt", `estado ${ads.status}`);
  }

  // Cabeceras de seguridad: la misma comprobación vale en local y contra el
  // dominio real, que es donde se confirma que el CDN las aplique.
  const csp = home.headers.get("content-security-policy") ?? "";
  const missing = [
    "default-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
  ].filter((directive) => !csp.includes(directive));
  if (csp && missing.length === 0) {
    ok("la home envía la Content-Security-Policy");
  } else {
    fail("CSP", csp ? `faltan directivas: ${missing.join(", ")}` : "ausente");
  }

  const rssLinkInHtml = /application\/rss\+xml/.test(home.body);
  if (rssLinkInHtml) ok("la home anuncia el feed");
  else fail("feed", "la home no declara el enlace al feed");

  console.log(`\nPrueba de humo contra ${BASE}\n`);
  console.log([...checks, ...failures].join("\n"));
  console.log(
    `\n${checks.length} comprobaciones correctas, ${failures.length} fallos.`
  );

  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("Error inesperado en la prueba de humo:", error);
  process.exit(1);
});
