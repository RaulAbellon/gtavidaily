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
  return { status: response.status, body };
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
    ok("el artículo se renderiza en el servidor", articlePath);
  } else {
    fail("artículo", `${articlePath} → ${article.status}`);
  }

  // Las portadas se sirven como SVG cacheable, no incrustadas en el HTML.
  const coverUrls = [...new Set([...home.body.matchAll(/\/cover\?[^"'\s)]+/g)].map((m) => m[0]))];
  if (coverUrls.length === 0) {
    fail("portadas", "la home no referencia ninguna portada en /cover");
  } else {
    const coverResponse = await fetch(`${BASE}${coverUrls[0].replace(/&amp;/g, "&")}`);
    const contentType = coverResponse.headers.get("content-type") ?? "";
    if (coverResponse.status === 200 && contentType.includes("image/svg+xml")) {
      ok(`${coverUrls.length} portadas servidas desde /cover`, contentType);
    } else {
      fail("portada", `${coverUrls[0]} → ${coverResponse.status} ${contentType}`);
    }
  }

  if (/data:image\/svg\+xml/.test(home.body)) {
    fail("portadas incrustadas", "el HTML todavía lleva SVG en data URI");
  } else {
    ok("ninguna portada incrustada como data URI");
  }

  // Privacidad: el cargador de AdSense no debe estar en el HTML inicial.
  for (const [label, page] of [
    ["home", home],
    ["artículo", article],
  ]) {
    if (/adsbygoogle\.js/.test(page.body)) {
      fail(`AdSense en ${label}`, "el script se sirve antes del consentimiento");
    } else {
      ok(`sin script de AdSense antes del consentimiento (${label})`);
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
