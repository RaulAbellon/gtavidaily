#!/usr/bin/env node
/**
 * Comprobación del despliegue en Cloudflare (Workers) antes de tocar el DNS.
 *
 * Está pensada para lanzarse contra la URL de previsualización del Worker —o,
 * después del cambio de DNS, contra el dominio real— y responde a la pregunta
 * «¿el sitio funciona aquí igual que en Netlify?», con especial atención a lo
 * que afecta a la publicidad de AdSense.
 *
 * Uso:
 *   node scripts/verify-cf.mjs https://gtavidaily.<subdominio>.workers.dev
 *   node scripts/verify-cf.mjs https://gtavidaily.com
 *
 * Salida: código 0 si todo pasa, 1 si algo falla. Nada de «debería funcionar».
 *
 * No sustituye a `npm run test:e2e` (que además revisa el sitemap entero y las
 * portadas); lo complementa con las particularidades de Cloudflare.
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
  // Las mismas que sirve Netlify hoy. Si alguna falla aquí, fallaría igual con
  // el DNS ya cambiado: mejor enterarse antes.
  const PAGES = ["/", "/noticias", "/buscar?q=lucia", "/sobre", "/contacto"];
  const FEEDS = ["/robots.txt", "/sitemap.xml", "/news-sitemap.xml", "/feed.xml"];
  const ASSETS = ["/manifest.json", "/favicon.ico", "/icon-192.png", "/og-image.png"];

  for (const route of [...PAGES, ...FEEDS, ...ASSETS]) {
    await checkStatus(route, 200);
  }

  // La reescritura de next.config.ts: la URL canónica de security.txt la sirve
  // la ruta /security-txt. Es lo que más fácilmente se rompe al cambiar de CDN.
  const security = await get("/.well-known/security.txt");
  if (security.status === 200 && security.body.includes("Contact:")) {
    ok("/.well-known/security.txt (reescritura) → 200 con Contact:");
  } else {
    fail(
      "/.well-known/security.txt",
      `estado ${security.status}; la reescritura no llegó a /security-txt`
    );
  }

  const notFound = await get("/no-existe-esta-ruta");
  if (notFound.status === 404) ok("/no-existe-esta-ruta → 404");
  else fail("404", `esperaba 404 y llegó ${notFound.status}`);

  // /cover es una ruta dinámica que lee la query: es la que compartía caché en
  // Netlify y dejaba 66 portadas idénticas, así que aquí se comprueba que dos
  // consultas distintas devuelven SVG **distintos**.
  const coverA = await get("/cover?c=Noticias&t=Portada%20de%20prueba%20A");
  const coverB = await get("/cover?c=Trailers&t=Portada%20de%20prueba%20B");
  const coverType = coverA.headers.get("content-type") ?? "";
  if (coverA.status === 200 && coverType.includes("image/svg+xml")) {
    ok("/cover devuelve SVG", coverType);
    if (coverA.body !== coverB.body) {
      ok("dos /cover con parámetros distintos devuelven SVG distintos");
    } else {
      fail(
        "/cover",
        "dos consultas distintas devuelven el mismo SVG: la caché está ignorando los parámetros"
      );
    }
  } else {
    fail("/cover", `estado ${coverA.status} y content-type ${coverType}`);
  }

  // -------------------------------------------------- cabeceras de seguridad --
  // En Cloudflare, `public/_headers` solo se aplica a los activos estáticos; el
  // HTML lo genera el Worker. Por eso se comprueban las dos cosas.
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

  // `public/_headers` actúa sobre los activos estáticos: se comprueba en una
  // imagen propia, que es la que sirve Cloudflare sin pasar por el Worker.
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
