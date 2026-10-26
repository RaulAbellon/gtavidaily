import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MapaPage, { metadata as mapaMetadata } from "@/app/mapa/page";
import sitemap from "@/app/sitemap";
import { articles, getArticleBySlug } from "@/lib/data";
import {
  MAPA_ACTIVIDADES,
  MAPA_ARTICULOS,
  MAPA_CIFRAS,
  MAPA_CLIMA,
  MAPA_ESTADO_LABEL,
  MAPA_FAQ,
  MAPA_FAUNA,
  MAPA_FUENTES,
  MAPA_PENDIENTE,
  MAPA_REGIONES,
  MAPA_TOPONIMOS,
  MAPA_TRAZOS,
  getMapaTrazo,
} from "@/lib/mapa";
import { SITE_URL, STATIC_ROUTES } from "@/lib/site";
import { extractLinks } from "@/lib/text";
import { matchesKnownRoute, readSource } from "./helpers/routes";

const read = (...segments: string[]) =>
  readSource(path.join(process.cwd(), ...segments));

/** El HTML que se publica: el del build estático, si ya se ha ejecutado. */
const HTML_PUBLICADO = path.join(process.cwd(), "out", "mapa.html");
const htmlPublicado = existsSync(HTML_PUBLICADO)
  ? readFileSync(HTML_PUBLICADO, "utf8")
  : null;

/** El HTML que se publica en `out/mapa.html`: el del render de servidor. */
function renderMapa(): string {
  return renderToStaticMarkup(createElement(MapaPage));
}

/** Quita el JSON-LD para no confundir sus URLs con recursos cargados. */
function sinDatosEstructurados(html: string): string {
  return html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, "");
}

describe("ruta /mapa", () => {
  it("existe como página estática del App Router", () => {
    expect(matchesKnownRoute("/mapa")).toBe(true);
    expect(
      existsSync(path.join(process.cwd(), "src", "app", "mapa", "page.tsx")),
    ).toBe(true);
    expect(
      existsSync(
        path.join(process.cwd(), "src", "app", "mapa", "mapa-leonida.tsx"),
      ),
    ).toBe(true);
  });

  it("no lee parámetros ni datos de servidor (el sitio es estático)", () => {
    for (const file of [
      ["src", "app", "mapa", "page.tsx"],
      ["src", "app", "mapa", "mapa-leonida.tsx"],
    ]) {
      const code = read(...file);
      expect(code, file.join("/")).not.toMatch(/searchParams/);
      expect(code, file.join("/")).not.toMatch(/dynamicParams\s*=\s*true/);
      expect(code, file.join("/")).not.toMatch(/generateStaticParams/);
      expect(code, file.join("/")).not.toMatch(/export const dynamic\s*=/);
    }
  });

  it("declara metadatos completos con canonical y Open Graph", () => {
    const code = read("src", "app", "mapa", "page.tsx");
    expect(code).toContain('alternates: { canonical: "/mapa" }');
    expect(code).toContain("openGraph:");
    expect(code).toContain("twitter:");
    expect(mapaMetadata.alternates?.canonical).toBe("/mapa");
    expect(String(mapaMetadata.title)).toContain("Leonida");
    expect(String(mapaMetadata.description).length).toBeGreaterThan(120);
  });

  it("emite datos estructurados con la página, las regiones y el FAQ", () => {
    const code = read("src", "app", "mapa", "page.tsx");
    expect(code).toContain('"@type": "WebPage"');
    expect(code).toContain('"@type": "ItemList"');
    expect(code).toContain('"@type": "Place"');
    expect(code).toContain('"@type": "FAQPage"');
    expect(code).toContain("citation");
    expect(code).toContain("isBasedOn");
    // El FAQPage y el bloque visible salen de la misma constante.
    expect(code).toContain("MAPA_FAQ");

    const html = renderMapa();
    const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(
      html,
    )?.[1];
    expect(ld).toBeTruthy();
    const datos = JSON.parse(ld as string) as {
      "@graph": { "@type": string; name?: string }[];
    };
    const nodos = datos["@graph"] as {
      "@type": string;
      mainEntity?: { name: string }[];
    }[];
    const tipos = nodos.map((nodo) => nodo["@type"]);
    expect(tipos).toContain("WebPage");
    expect(tipos).toContain("FAQPage");
    expect(tipos).toContain("Place");
    const faq = nodos.find((nodo) => nodo["@type"] === "FAQPage");
    expect(faq?.mainEntity?.map((entrada) => entrada.name)).toEqual(
      MAPA_FAQ.map((entrada) => entrada.question),
    );
  });

  it("está en STATIC_ROUTES y en el sitemap", () => {
    expect(STATIC_ROUTES.map((route) => route.path)).toContain("/mapa");
    expect(sitemap().map((entry) => entry.url)).toContain(`${SITE_URL}/mapa`);
  });

  it("se enlaza desde la portada, la cabecera y el pie", () => {
    expect(read("src", "app", "page.tsx")).toContain('href="/mapa"');
    expect(read("src", "components", "site", "header.tsx")).toContain(
      'href: "/mapa"',
    );
    expect(read("src", "components", "site", "footer.tsx")).toContain(
      'href="/mapa"',
    );
  });

  it("recibe enlaces de los artículos que hablan del mapa", () => {
    const conEnlace = articles.filter((article) =>
      article.content.some((paragraph) =>
        extractLinks(paragraph).includes("/mapa"),
      ),
    );
    expect(conEnlace.length).toBeGreaterThanOrEqual(4);
    // Y el destino del enlace existe de verdad.
    expect(matchesKnownRoute("/mapa")).toBe(true);
  });

  it("enlaza a artículos propios que existen", () => {
    expect(MAPA_ARTICULOS.length).toBeGreaterThanOrEqual(4);
    for (const slug of MAPA_ARTICULOS) {
      expect(getArticleBySlug(slug), slug).toBeTruthy();
    }
  });
});

describe("las seis regiones", () => {
  it("son exactamente las del reportaje de Game Informer 382", () => {
    expect(MAPA_REGIONES.map((region) => region.nombre)).toEqual([
      "Vice City",
      "Leonida Keys",
      "Grassrivers",
      "Port Gellhorn",
      "Ambrosia",
      "Mount Kalaga National Park",
    ]);
  });

  it("tienen id único y trazo propio", () => {
    const ids = MAPA_REGIONES.map((region) => region.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const region of MAPA_REGIONES) {
      const trazo = getMapaTrazo(region.id);
      expect(trazo, region.id).toBeTruthy();
      if (trazo?.tipo === "region") {
        expect(trazo.d.startsWith("M "), region.id).toBe(true);
        expect(trazo.d.trimEnd().endsWith("Z"), region.id).toBe(true);
        expect(trazo.d, region.id).not.toMatch(/NaN|undefined/);
      } else {
        expect(trazo?.tipo).toBe("islas");
        expect(trazo?.piezas.length, region.id).toBeGreaterThan(0);
      }
    }
    // Ningún trazo suelto que no corresponda a una región.
    expect(MAPA_TRAZOS.map((trazo) => trazo.id).sort()).toEqual(
      [...ids].sort(),
    );
  });

  it("cada ficha trae qué se sabe, qué se ha visto, qué falta y fuentes", () => {
    for (const region of MAPA_REGIONES) {
      expect(region.sabemos.length, region.id).toBeGreaterThanOrEqual(2);
      for (const parrafo of region.sabemos) {
        expect(parrafo.length, region.id).toBeGreaterThan(80);
      }
      expect(region.visto.length, region.id).toBeGreaterThanOrEqual(1);
      expect(region.actividades.length, region.id).toBeGreaterThanOrEqual(1);
      expect(region.dudas.length, region.id).toBeGreaterThanOrEqual(3);
      expect(region.fuentes.length, region.id).toBeGreaterThanOrEqual(2);
      for (const fuente of region.fuentes) {
        expect(fuente.url, region.id).toMatch(/^https:\/\/[^\s]+$/);
        expect(fuente.name.length, region.id).toBeGreaterThan(15);
      }
      // Un tipo y un resumen que se puedan leer en el panel y en las tarjetas.
      expect(region.tipo.length, region.id).toBeGreaterThan(4);
      expect(region.resumen.length, region.id).toBeGreaterThan(40);
    }
  });

  it("cada dato declara un estado válido y el estado se puede leer", () => {
    for (const region of MAPA_REGIONES) {
      for (const dato of [...region.visto, ...region.actividades]) {
        expect(Object.keys(MAPA_ESTADO_LABEL), region.id).toContain(dato.estado);
        expect(dato.texto.length, region.id).toBeGreaterThan(30);
      }
    }
    for (const cifra of MAPA_CIFRAS) {
      expect(Object.keys(MAPA_ESTADO_LABEL)).toContain(cifra.estado);
    }
  });

  it("separa lo confirmado de lo reportado y de lo que no tiene fuente", () => {
    const estados = new Set(
      MAPA_REGIONES.flatMap((region) => [
        ...region.visto.map((dato) => dato.estado),
        ...region.actividades.map((dato) => dato.estado),
      ]),
    );
    expect(estados.has("confirmado")).toBe(true);
    expect(estados.has("reportado")).toBe(true);
    // La página publica huecos: si no hubiera ninguno, no sería honesta.
    expect(estados.has("sin-fuente")).toBe(true);
  });
});

describe("HTML de /mapa (sin ejecutar JavaScript)", () => {
  const html = renderMapa();
  const sinScripts = sinDatosEstructurados(html);

  it("trae las seis regiones como texto en el HTML", () => {
    for (const region of MAPA_REGIONES) {
      expect(html, region.nombre).toContain(region.nombre);
      expect(html, region.id).toContain(`id="region-${region.id}"`);
      expect(html, region.id).toContain(`href="#region-${region.id}"`);
    }
  });

  it("trae el contenido completo de cada ficha, no solo el nombre", () => {
    for (const region of MAPA_REGIONES) {
      for (const parrafo of region.sabemos) {
        // El HTML escapa comillas y algunos signos: se compara el principio del
        // párrafo, que no lleva caracteres escapables.
        const fragmento = parrafo.slice(0, 60);
        expect(html, `${region.id}: ${fragmento}`).toContain(fragmento);
      }
      for (const duda of region.dudas) {
        expect(html, region.id).toContain(duda.slice(0, 50));
      }
    }
  });

  it("no carga ningún recurso externo", () => {
    // Las fuentes son enlaces `<a href>`, no recursos; las portadas de los
    // artículos relacionados son ficheros propios en `/imagenes/`. Lo que se
    // comprueba aquí es que el navegador no descargue nada de otro dominio al
    // pintar la página: ni imágenes, ni hojas, ni tipografías, ni iframes.
    expect(sinScripts).not.toMatch(/<iframe\b/i);
    expect(sinScripts).not.toMatch(/<link\b/i);
    expect(sinScripts).not.toMatch(/src="https?:/i);
    expect(sinScripts).not.toMatch(/srcset=/i);
    expect(sinScripts).not.toMatch(/url\(\s*['"]?https?:/i);
    expect(sinScripts).not.toMatch(/@import/i);
    expect(sinScripts).not.toMatch(/<use[^>]+href="https?:/i);

    // Toda imagen que aparezca se sirve desde este dominio.
    const externas = [...sinScripts.matchAll(/<img[^>]+src="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((src) => !src.startsWith("/"));
    expect(externas).toEqual([]);
  });

  it("el mapa es un SVG propio, escrito en la página", () => {
    const svg = /<svg[^>]*viewBox="0 0 640 800"[\s\S]*?<\/svg>/.exec(html)?.[0];
    expect(svg).toBeTruthy();
    expect(html).toContain("<svg");
    // Trazos del dibujo, no de una librería de mapas.
    expect(svg).toContain("<path");
    expect(html).not.toMatch(/leaflet|mapbox|google\.maps|openstreetmap/i);
  });

  it("cada región del SVG es un enlace con su nombre textual", () => {
    const svg =
      /<svg[^>]*viewBox="0 0 640 800"[\s\S]*?<\/svg>/.exec(html)?.[0] ?? "";
    expect(svg.length).toBeGreaterThan(3000);
    for (const region of MAPA_REGIONES) {
      expect(svg, region.id).toContain(
        `aria-label="${region.nombre}: ${region.tipo}. Ver la ficha completa"`,
      );
      expect(svg, region.id).toContain(`>${region.etiquetaLineas[0]}<`);
    }
    // El SVG se anuncia como grupo, con título y descripción, para que el lector
    // de pantalla pueda recorrer las regiones que hay dentro.
    expect(svg).toContain('role="group"');
    expect(svg).toContain("aria-labelledby");
    expect(svg).toContain("aria-describedby");
    expect(svg).toMatch(/<title[^>]*>[^<]*Leonida/i);
    expect(svg).toMatch(/<desc[^>]*>/);
  });

  it("el panel de detalle se anuncia solo y no depende del ratón", () => {
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-atomic="true"');
    expect(html).toContain('aria-label="Resumen de la región seleccionada"');
    // Aviso explícito de que sin JavaScript no se pierde nada.
    expect(html).toMatch(/Sin JavaScript no se pierde nada/i);
  });

  it("respeta prefers-reduced-motion y el foco visible", () => {
    const componente = read("src", "app", "mapa", "mapa-leonida.tsx");
    // Transiciones anuladas por clase cuando el sistema pide menos movimiento…
    expect(componente).toContain("motion-reduce:transition-none");
    // …y el bloque global que ya existía sigue cubriendo el resto.
    expect(read("src", "app", "globals.css")).toContain(
      "prefers-reduced-motion: reduce",
    );
    // Foco propio en las regiones del SVG.
    expect(read("src", "app", "globals.css")).toContain(".mapa-region:focus-visible");
  });
});

/**
 * Comprobaciones sobre el fichero que sirve el CDN. Solo se ejecutan si se ha
 * construido el sitio (`npm run build`) antes de las pruebas; el resto de la
 * suite no depende de `out/`.
 */
describe("HTML publicado de /mapa", () => {
  it.runIf(Boolean(htmlPublicado))(
    "sirve las seis regiones en el flujo normal, sin esconderlas tras JavaScript",
    () => {
      const html = htmlPublicado as string;
      // Nada de contenido dentro de `<div hidden>` a la espera de que un script
      // lo revele: el texto va donde el navegador lo pinta sin ejecutar nada.
      expect(html).not.toContain("<!--$?-->");
      expect(html).not.toMatch(/<div hidden[^>]*id="S:/);
      expect(html).not.toMatch(/aria-busy="true"/);
      for (const region of MAPA_REGIONES) {
        expect(html, region.id).toContain(`id="region-${region.id}"`);
        expect(html, region.nombre).toContain(region.nombre);
      }
      expect(html).toContain("viewBox=\"0 0 640 800\"");
    },
  );

  it.runIf(Boolean(htmlPublicado))("no carga recursos de otros dominios", () => {
    const html = sinDatosEstructurados(htmlPublicado as string);
    expect(html).not.toMatch(/src="https?:/i);
    expect(html).not.toMatch(/srcset=/i);
    expect(html).not.toMatch(/<iframe\b/i);
    expect(html).not.toMatch(/url\(\s*['"]?https?:/i);
  });

  it("no hay `loading.tsx` en la raíz del App Router", () => {
    // Con `output: "export"`, un `loading.tsx` de segmento envuelve la página en
    // un Suspense: el build pone el esqueleto en el HTML y el contenido real en
    // un `<div hidden>`, que solo aparece si el navegador ejecuta el script
    // `$RC`. Eso dejaba a todas las páginas del sitio sin contenido visible al
    // desactivar JavaScript. El esqueleto se puede volver a poner por segmento
    // (`src/app/noticias/loading.tsx`), nunca en la raíz.
    expect(existsSync(path.join(process.cwd(), "src", "app", "loading.tsx"))).toBe(
      false,
    );
  });
});

describe("datos del mapa", () => {
  it("las dos comparaciones de escala están atribuidas y no se mezclan", () => {
    const escala = MAPA_CIFRAS.filter((cifra) => cifra.valor === "2×" || cifra.valor === "3×");
    expect(escala.map((cifra) => cifra.valor)).toEqual(["2×", "3×"]);
    for (const cifra of escala) {
      // No es un dato de ficha: es una declaración en preview.
      expect(cifra.estado).toBe("reportado");
      expect(cifra.detalle).toMatch(/GTA V|Red Dead/);
    }
    // Y la superficie en km² figura como inexistente, no como estimación.
    const superficie = MAPA_CIFRAS.find((cifra) => /km²/.test(cifra.etiqueta));
    expect(superficie?.estado).toBe("sin-fuente");
  });

  it("la fauna no se reparte por regiones", () => {
    expect(MAPA_FAUNA.grupos).toEqual(["raros", "descubribles", "legendarios"]);
    expect(MAPA_FAUNA.nota).toMatch(/no ha desvelado|especulación/i);
  });

  it("el clima separa lo confirmado de lo pendiente", () => {
    expect(MAPA_CLIMA.confirmado.length).toBeGreaterThanOrEqual(4);
    expect(MAPA_CLIMA.pendiente.length).toBeGreaterThanOrEqual(3);
    expect(MAPA_CLIMA.nota).toMatch(/no asigna un clima|local/i);
  });

  it("las actividades se publican enteras y sin repartirlas por zona", () => {
    expect(MAPA_ACTIVIDADES.length).toBeGreaterThanOrEqual(12);
    const nombres = MAPA_ACTIVIDADES.map((actividad) => actividad.nombre);
    expect(new Set(nombres).size).toBe(nombres.length);
    expect(nombres).toContain("Caza");
    expect(nombres).toContain("Pesca");
  });

  it("publica lo que falta, incluidos los topónimos que no tienen fuente", () => {
    const texto = MAPA_PENDIENTE.map((item) => `${item.tema} ${item.detalle}`).join(" ");
    expect(texto).toContain("Kelly County");
    expect(texto).toContain("Vice Beach");
    expect(texto).toContain("Rockridge");
    expect(texto).toContain("Ocean Drive");
    expect(texto.toLocaleLowerCase()).toContain("km²");
  });

  it("los topónimos acreditados distinguen grado de respaldo", () => {
    const confirmados = MAPA_TOPONIMOS.filter((item) => item.estado === "confirmado");
    const reportados = MAPA_TOPONIMOS.filter((item) => item.estado === "reportado");
    expect(confirmados.length).toBeGreaterThan(10);
    expect(reportados.map((item) => item.nombre)).toEqual(
      expect.arrayContaining(["Sandbars", "Crude Islands"]),
    );
    const nombres = MAPA_TOPONIMOS.map((item) => item.nombre);
    expect(new Set(nombres).size).toBe(nombres.length);
  });

  it("las preguntas frecuentes están respondidas de verdad", () => {
    expect(MAPA_FAQ.length).toBeGreaterThanOrEqual(4);
    for (const entrada of MAPA_FAQ) {
      expect(entrada.question.endsWith("?")).toBe(true);
      expect(entrada.answer.length).toBeGreaterThan(120);
    }
  });

  it("las fuentes son únicas y abribles", () => {
    const urls = MAPA_FUENTES.map((fuente) => fuente.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      expect(url).toMatch(/^https:\/\/[^\s]+$/);
      expect(url).not.toContain("example.com");
    }
  });
});
