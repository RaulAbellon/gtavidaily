#!/usr/bin/env node
/**
 * Comprobación del despliegue en Cloudflare (Workers, solo activos estáticos).
 *
 * Está pensada para lanzarse contra el servidor local (`npm run cf:preview`) o,
 * después del cambio de DNS, contra el dominio real, y responde a la pregunta
 * «¿el sitio funciona aquí igual que en Netlify?», con especial atención a dos
 * cosas: que **ninguna página se renderice en la petición** (el sitio es
 * estático) y que la publicidad de AdSense siga viva.
 *
 * Uso:
 *   npm run cf:preview                                   # en otra terminal
 *   node scripts/verify-cf.mjs http://127.0.0.1:8787
 *   node scripts/verify-cf.mjs https://gtavidaily.com
 *
 * Salida: código 0 si todo pasa, 1 si algo falla. Nada de «debería funcionar».
 *
 * No sustituye a `npm run test:e2e` (que además revisa el sitemap entero); lo
 * complementa con las particularidades de Cloudflare.
 */

const BASE = (process.argv[2] ?? process.env.BASE_URL ?? "").replace(/\/+$/, "");

if (!BASE) {
  console.error(
    "Falta la URL. Ejemplo:\n  node scripts/verify-cf.mjs https://gtavidaily.mi-subdominio.workers.dev"
  );
  process.exit(2);
}

const checks = [];
const failures = [];

function ok(label, extra = "") {
  checks.push(`  ✓ ${label}${extra ? ` (${extra})` : ""}`);
}
function fail(label, detail) {
  failures.push(`  ✗ ${label}: ${detail}`);
}

async function get(pathname, init = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    redirect: "manual",
    headers: { "user-agent": "gtavidaily-verify-cf" },
    ...init,
  });
  const body = await response.text();
  return { status: response.status, body, headers: response.headers };
}

async function checkStatus(pathname, expected) {
  const { status } = await get(pathname);
  if (status === expected) ok(`${pathname} → ${expected}`);
  else fail(pathname, `esperaba ${expected} y llegó ${status}`);
}

async function main() {
  console.log(`\nComprobando ${BASE}\n`);

  // ---------------------------------------------------------------- rutas ---
  // Las mismas que servía Netlify. Si alguna falla aquí, fallaría igual con el
  // DNS ya cambiado: mejor enterarse antes.
  const PAGES = ["/", "/noticias", "/buscar?q=lucia", "/sobre", "/contacto"];
  const FEEDS = ["/robots.txt", "/sitemap.xml", "/news-sitemap.xml", "/feed.xml"];
  const ASSETS = [
    "/manifest.json",
    "/favicon.ico",
    "/icon-192.png",
    "/og-image.png",
    "/ads.txt",
    // El índice de búsqueda es un activo estático más: si falta, el buscador
    // del navegador no devuelve nada aunque la página responda 200.
    "/buscar/indice.json",
  ];

  for (const route of [...PAGES, ...FEEDS, ...ASSETS]) {
    await checkStatus(route, 200);
  }

  // ------------------------------------------- todo el contenido es estático --
  // Aquí se comprueba lo que motivó el cambio: que **ninguna ruta se renderice
  // en la petición**. Tres evidencias independientes:
  //
  // 1. La URL con parámetros devuelve exactamente los mismos bytes que la URL
  //    limpia. Si hubiera un Worker renderizando, el HTML de `?q=lucia` sería
  //    distinto (con los resultados dentro).
  // 2. Los artículos y las categorías responden 200 con su HTML completo.
  // 3. La portada SVG de reserva se sirve como fichero (<slug>.svg), no como una
  //    ruta con parámetros de consulta.
  const sameBytes = async (a, b) => {
    const left = await get(a);
    const right = await get(b);
    if (left.status !== 200 || right.status !== 200) {
      fail(`${a} vs ${b}`, `estados ${left.status} y ${right.status}`);
      return;
    }
    if (left.body === right.body && left.body.length > 1000) {
      ok(`${a} y ${b} sirven el mismo fichero (nada se renderiza por consulta)`);
    } else {
      fail(
        `${a} vs ${b}`,
        "el HTML cambia según los parámetros: hay algo renderizando en la petición"
      );
    }
  };

  await sameBytes("/buscar", "/buscar?q=lucia&otro=1");
  await sameBytes("/noticias", "/noticias?pagina=3");

  const sitemap = await get("/sitemap.xml");
  const articleUrls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .filter((pathname) => pathname.startsWith("/articulo/"));
  const categoryUrls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .filter((pathname) => pathname.startsWith("/categoria/"));

  if (articleUrls.length === 0) {
    fail("sitemap", "no declara ningún artículo");
  } else {
    // El primero y el último: uno recién publicado y otro antiguo, que es
    // justo la comparación que importa (los nuevos eran los que no cargaban).
    for (const pathname of [articleUrls[0], articleUrls[articleUrls.length - 1]]) {
      const page = await get(pathname);
      const hasArticle = /<article/.test(page.body);
      if (page.status === 200 && hasArticle) ok(`${pathname} → 200 con contenido`);
      else fail(pathname, `estado ${page.status}, ¿tiene <article>? ${hasArticle}`);
    }
  }

  if (categoryUrls.length === 0) {
    fail("sitemap", "no declara ninguna categoría");
  } else {
    await checkStatus(categoryUrls[0], 200);
  }

  // La reescritura de next.config.ts ya no existe: `security.txt` es un fichero
  // real en `public/.well-known/`, que es la ruta que exige la RFC 9116.
  const security = await get("/.well-known/security.txt");
  const expires = /^Expires: (.+)$/m.exec(security.body)?.[1];
  if (
    security.status === 200 &&
    security.body.includes("Contact:") &&
    expires &&
    new Date(expires).getTime() > Date.now()
  ) {
    ok("/.well-known/security.txt es un fichero real y no está caducado");
  } else {
    fail(
      "/.well-known/security.txt",
      `estado ${security.status}, Expires=${expires ?? "ausente"}`
    );
  }

  const notFound = await get("/no-existe-esta-ruta");
  if (notFound.status === 404) ok("/no-existe-esta-ruta → 404");
  else fail("404", `esperaba 404 y llegó ${notFound.status}`);

  // Las portadas de reserva son ficheros (`/portadas/<slug>.svg`), no la ruta
  // dinámica `/cover?c=…&t=…` que compartía caché en Netlify y obligaba al
  // Worker a dibujar el SVG en cada petición.
  if (articleUrls.length > 0) {
    const slugs = articleUrls.map((pathname) => pathname.replace("/articulo/", ""));
    const coverA = await get(`/portadas/${slugs[0]}.svg`);
    const coverB = await get(`/portadas/${slugs[slugs.length - 1]}.svg`);
    const coverType = coverA.headers.get("content-type") ?? "";
    if (coverA.status === 200 && coverType.includes("image/svg+xml")) {
      ok("/portadas/<slug>.svg devuelve SVG", coverType);
      if (coverA.body !== coverB.body) {
        ok("dos portadas distintas devuelven SVG distintos");
      } else {
        fail("/portadas", "dos artículos devuelven la misma portada");
      }
    } else {
      fail("/portadas", `estado ${coverA.status} y content-type ${coverType}`);
    }
  }

  // -------------------------------------------------- cabeceras de seguridad --
  // Con el sitio estático el HTML **también** lo sirve el CDN, así que
  // `public/_headers` cubre ya las páginas y los activos: la misma regla tiene
  // que aplicar a las dos cosas.
  const home = await get("/");
  const csp = home.headers.get("content-security-policy") ?? "";
  const missingCsp = [
    "default-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "https://pagead2.googlesyndication.com",
    "https://fundingchoicesmessages.google.com",
  ].filter((directive) => !csp.includes(directive));
  if (csp && missingCsp.length === 0) ok("el HTML envía la CSP completa");
  else
    fail(
      "CSP en el HTML",
      csp ? `faltan: ${missingCsp.join(", ")}` : "la cabecera no llega"
    );

  for (const header of [
    "x-content-type-options",
    "x-frame-options",
    "referrer-policy",
    "permissions-policy",
    "strict-transport-security",
  ]) {
    if (home.headers.get(header)) ok(`cabecera ${header}`);
    else fail(`cabecera ${header}`, "ausente en el HTML");
  }

  // `public/_headers` actúa sobre los activos servidos por el CDN: se comprueba
  // en una imagen, que es un activo de libro.
  const image = await fetch(`${BASE}/icon-192.png`, { headers: { "user-agent": "gtavidaily-verify-cf" } });
  if (image.headers.get("x-content-type-options") === "nosniff") {
    ok("public/_headers se aplica a los activos estáticos");
  } else {
    fail(
      "public/_headers",
      "los activos estáticos no llevan X-Content-Type-Options: revisa public/_headers"
    );
  }

  // ---------------------------------------------------------- AdSense ------
  // 1) ads.txt: tiene que servirse con la línea del vendedor autorizado.
  const adsTxt = await get("/ads.txt");
  if (adsTxt.status === 200 && /^google\.com, pub-\d{16}, DIRECT, f08c47fec0942fa0$/m.test(adsTxt.body)) {
    ok("/ads.txt se sirve con la línea del vendedor autorizado");
  } else {
    fail(
      "/ads.txt",
      `estado ${adsTxt.status}; ¿se ha copiado public/ads.txt al build? Contenido: ${JSON.stringify(
        adsTxt.body.slice(0, 80)
      )}`
    );
  }

  // 2) La etiqueta que usa AdSense para verificar la propiedad del sitio.
  const adsenseMeta = /<meta[^>]+name="google-adsense-account"[^>]*>/i.exec(home.body)?.[0] ?? "";
  if (adsenseMeta.includes("ca-pub-6098877112141110")) {
    ok("el <head> incluye google-adsense-account con el cliente correcto");
  } else if (adsenseMeta) {
    fail("google-adsense-account", `la etiqueta existe pero con otro valor: ${adsenseMeta}`);
  } else {
    fail(
      "google-adsense-account",
      "la etiqueta no está en el HTML: falta NEXT_PUBLIC_ADSENSE_CLIENT en el build"
    );
  }

  // 3) El script de AdSense NO debe ir en el HTML inicial: el sitio carga
  //    AdSense solo después del consentimiento (Consent Mode v2).
  if (/adsbygoogle\.js/.test(home.body)) {
    fail(
      "AdSense antes del consentimiento",
      "el HTML inicial ya trae adsbygoogle.js: se estaría incumpliendo el consentimiento"
    );
  } else {
    ok("el HTML inicial no trae adsbygoogle.js (se carga tras el consentimiento)");
  }

  // 4) El HTML debe traer el cliente correcto para que el script lo use al
  //    hidratar. Se busca en todo el documento porque va en el bundle de React.
  if (home.body.includes("ca-pub-6098877112141110")) {
    ok("el cliente de AdSense correcto viaja en la página");
  } else {
    fail(
      "cliente de AdSense",
      "ca-pub-6098877112141110 no aparece en el HTML: falta en el build"
    );
  }

  // ------------------------------------------------- otros datos de build ---
  // Estas variables se insertan al compilar. Si faltan, la página legal queda a
  // medias y Search Console pierde la verificación: mejor verlo ahora.
  const legal = await get("/aviso-legal");
  if (legal.body.includes("71183429F")) {
    ok("los datos del responsable legal están en el HTML");
  } else {
    fail(
      "datos legales",
      "no aparece el NIF del titular: faltan NEXT_PUBLIC_LEGAL_* en el build"
    );
  }

  if (home.body.includes("L5mhV_ec7wXJGWr6yV5DdFAVXbxkhj1A6HPX5oUhCVI")) {
    ok("la verificación de Search Console está en el HTML");
  } else {
    fail(
      "Search Console",
      "no aparece google-site-verification: falta GOOGLE_SITE_VERIFICATION en el build"
    );
  }

  // ------------------------------------------------------------- informe ----
  console.log([...checks, ...failures].join("\n"));
  console.log(
    `\n${checks.length} comprobaciones correctas, ${failures.length} fallos.\n`
  );
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(`\nError inesperado comprobando ${BASE}:`, error);
  process.exit(1);
});
