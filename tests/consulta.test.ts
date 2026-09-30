import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CRONOLOGIA,
  getCronologiaDesc,
  getCronologiaResumen,
} from "@/lib/cronologia";
import {
  REFERENCE_OFFSET,
  UNLOCK_FAQ,
  UNLOCK_PENDIENTE,
  UNLOCK_REGIONS,
  getUnlockTable,
} from "@/lib/desbloqueo";
import { getArticleBySlug } from "@/lib/data";
import { STATIC_ROUTES } from "@/lib/site";
import { matchesKnownRoute, readSource } from "./helpers/routes";

const read = (...segments: string[]) =>
  readSource(path.join(process.cwd(), ...segments));

describe("páginas de consulta", () => {
  it("existen las dos rutas y son estáticas", () => {
    for (const route of ["/cronologia", "/desbloqueo"]) {
      expect(matchesKnownRoute(route), route).toBe(true);
    }

    expect(
      existsSync(
        path.join(process.cwd(), "src", "app", "cronologia", "page.tsx"),
      ),
    ).toBe(true);
    expect(
      existsSync(
        path.join(process.cwd(), "src", "app", "desbloqueo", "page.tsx"),
      ),
    ).toBe(true);
  });

  it("no leen parámetros ni declaran rutas dinámicas (el sitio es estático)", () => {
    for (const file of [
      ["src", "app", "cronologia", "page.tsx"],
      ["src", "app", "desbloqueo", "page.tsx"],
      ["src", "app", "desbloqueo", "unlock-table.tsx"],
    ]) {
      const code = read(...file);
      // `searchParams` y `generateStaticParams` con params implican render por
      // petición: con `output: "export"` eso no existe.
      expect(code, file.join("/")).not.toMatch(/searchParams/);
      expect(code, file.join("/")).not.toMatch(/dynamicParams\s*=\s*true/);
    }
  });

  it("declaran metadatos completos con canonical y Open Graph", () => {
    const expectedCanonical: Record<string, string> = {
      "cronologia/page.tsx": 'canonical: "/cronologia"',
      "desbloqueo/page.tsx": 'canonical: "/desbloqueo"',
    };

    for (const [file, canonical] of Object.entries(expectedCanonical)) {
      const code = read("src", "app", file);
      expect(code, file).toContain("export const metadata");
      expect(code, file).toContain("title:");
      expect(code, file).toContain("description:");
      expect(code, file).toContain(canonical);
      expect(code, file).toContain("openGraph:");
      expect(code, file).toContain("twitter:");
    }
  });

  it("emiten datos estructurados con la página y su listado", () => {
    const cronologia = read("src", "app", "cronologia", "page.tsx");
    expect(cronologia).toContain('"@type": "WebPage"');
    expect(cronologia).toContain('"@type": "ItemList"');
    expect(cronologia).toContain("citation");
    expect(cronologia).toContain("isBasedOn");
    expect(cronologia).toContain('"@type": "FAQPage"');

    const desbloqueo = read("src", "app", "desbloqueo", "page.tsx");
    expect(desbloqueo).toContain('"@type": "WebPage"');
    expect(desbloqueo).toContain('"@type": "ItemList"');
    expect(desbloqueo).toContain("citation");
    expect(desbloqueo).toContain("isBasedOn");
    expect(desbloqueo).toContain('"@type": "FAQPage"');
    // Las respuestas del FAQPage y las visibles son el mismo texto.
    expect(desbloqueo).toContain("UNLOCK_FAQ");
  });

  it("están enlazadas desde la navegación del sitio", () => {
    // En la cabecera las dos rutas viven en el listado `CONSULTAS` que alimenta
    // la franja de escritorio y el menú móvil; en el pie, como enlaces sueltos.
    const header = read("src", "components", "site", "header.tsx");
    const footer = read("src", "components", "site", "footer.tsx");
    for (const route of ["/cronologia", "/desbloqueo"]) {
      expect(header, `cabecera → ${route}`).toContain(`href: "${route}"`);
      expect(footer, `pie → ${route}`).toContain(`href="${route}"`);
    }
  });

  it("se declaran en las rutas estáticas del sitio (y por tanto en el sitemap)", () => {
    const paths = STATIC_ROUTES.map((route) => route.path);
    expect(paths).toContain("/cronologia");
    expect(paths).toContain("/desbloqueo");
  });

  it("enlazan a artículos que existen de verdad", () => {
    const slugs = new Set<string>();
    // Los slugs relacionados viajan dentro de los datos, así que se validan
    // desde los datos y no desde el HTML.
    for (const event of CRONOLOGIA) {
      for (const slug of event.related ?? []) slugs.add(slug);
    }
    expect(slugs.size).toBeGreaterThan(10);
    for (const slug of slugs) {
      expect(
        getArticleBySlug(slug),
        `artículo relacionado inexistente: ${slug}`,
      ).toBeTruthy();
    }
  });
});

describe("cronología", () => {
  it("tiene entradas suficientes y ordenadas", () => {
    expect(CRONOLOGIA.length).toBeGreaterThanOrEqual(35);
    const desc = getCronologiaDesc();
    for (let index = 1; index < desc.length; index += 1) {
      expect(desc[index - 1].date >= desc[index].date).toBe(true);
    }
  });

  it("cada entrada trae fecha ISO, título, detalle y al menos una fuente con URL", () => {
    for (const event of CRONOLOGIA) {
      expect(event.date, event.title).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(event.date)), event.title).toBe(false);
      expect(event.dateLabel.length, event.title).toBeGreaterThan(6);
      expect(event.title.length, event.date).toBeGreaterThan(20);
      expect(event.detail.length, event.title).toBeGreaterThan(60);
      expect(event.sources.length, event.title).toBeGreaterThan(0);
      for (const source of event.sources) {
        expect(source.name.length, event.title).toBeGreaterThan(10);
        expect(source.url, event.title).toMatch(/^https:\/\/[^\s]+$/);
      }
    }
  });

  it("lo confirmado siempre tiene fuente primaria o declara que es un hecho público", () => {
    // Dos casos legítimos para una entrada «confirmado»: que detrás esté la
    // compañía (o un documento oficial, con su enlace), o que sea un hecho
    // público verificable sostenido por medios de referencia. Lo que no vale es
    // una entrada confirmada sin ninguna de las dos cosas.
    for (const event of CRONOLOGIA.filter((e) => e.status === "confirmado")) {
      const primary = event.sources.filter((source) => source.primary);
      if (primary.length > 0) {
        expect(event.evidence ?? "compania", event.title).toBe("compania");
      } else {
        expect(
          event.evidence,
          `confirmado sin fuente primaria ni evidencia: ${event.title}`,
        ).toBe("informado");
      }
    }
  });

  it("lo reportado no se atribuye a Rockstar ni a Take-Two", () => {
    for (const event of CRONOLOGIA.filter((e) => e.status === "reportado")) {
      const primary = event.sources.filter((source) => source.primary);
      expect(
        primary.length,
        `reportado con fuente primaria: ${event.title}`,
      ).toBe(0);
    }
  });

  it("no repite fechas imposibles ni entradas duplicadas", () => {
    const claves = CRONOLOGIA.map((event) => `${event.date}|${event.title}`);
    expect(new Set(claves).size).toBe(claves.length);
    for (const event of CRONOLOGIA) {
      // El corte de datos está declarado como 30-sep-2026: nada posterior.
      expect(event.date <= "2026-09-30", event.title).toBe(true);
    }
  });

  it("resume sus propias cifras y no se queda vacío", () => {
    const resumen = getCronologiaResumen();
    expect(resumen.total).toBe(CRONOLOGIA.length);
    expect(resumen.confirmado + resumen.reportado).toBe(resumen.total);
    expect(resumen.fuentes).toBeGreaterThan(20);
  });
});

describe("tabla de desbloqueo", () => {
  const rows = getUnlockTable();

  it("cubre un rango amplio de husos y no repite filas", () => {
    expect(UNLOCK_REGIONS.length).toBeGreaterThanOrEqual(25);
    const nombres = rows.map((row) => row.region);
    expect(new Set(nombres).size).toBe(nombres.length);
  });

  it("está ordenada de la primera apertura a la última", () => {
    for (let index = 1; index < rows.length; index += 1) {
      expect(rows[index - 1].offset).toBeGreaterThanOrEqual(rows[index].offset);
      // La ventaja va de más a menos: quien abre primero encabeza la tabla.
      expect(rows[index - 1].advantage).toBeGreaterThanOrEqual(
        rows[index].advantage,
      );
    }
  });

  it("la hora local es siempre medianoche y la referencia UTC es coherente", () => {
    for (const row of rows) {
      // Medianoche local del 19 menos el desfase = instante UTC.
      const utc =
        Date.parse("2026-11-19T00:00:00.000Z") - row.offset * 3_600_000;
      const expected = new Date(utc);
      const hours = String(expected.getUTCHours()).padStart(2, "0");
      const minutes = String(expected.getUTCMinutes()).padStart(2, "0");
      expect(row.utc, row.region).toContain(`${hours}:${minutes} UTC`);
      // Positivo = abre antes que España; negativo = abre después.
      expect(row.advantage, row.region).toBe(row.offset - REFERENCE_OFFSET);
      expect(row.advantageLabel, row.region).toMatch(
        /^(\d+(?:\.\d)? h (antes|después)|Igual que España)$/,
      );
      if (row.advantage > 0)
        expect(row.advantageLabel, row.region).toContain("antes");
      if (row.advantage < 0)
        expect(row.advantageLabel, row.region).toContain("después");
    }
  });

  it("las horas peninsulares se leen como un reloj, no como una ventaja", () => {
    // Nueva Zelanda abre a las 11:00 UTC: en España es mediodía del día 18.
    const nuevaZelanda = rows.find((row) => row.offset === 13);
    expect(nuevaZelanda?.advantageLabel).toBe("12 h antes");
    expect(nuevaZelanda?.spain).toBe("18 de noviembre, 12:00");
    // México (centro) abre a las 06:00 UTC: en España son las 07:00 del día 19.
    const mexico = rows.find((row) => row.region.includes("Ciudad de México"));
    expect(mexico?.advantageLabel).toBe("7 h después");
    expect(mexico?.spain).toBe("19 de noviembre, 07:00");
    // España coincide consigo misma.
    const espana = rows.find((row) => row.region.includes("España peninsular"));
    expect(espana?.advantageLabel).toBe("Igual que España");
    expect(espana?.spain).toBe("19 de noviembre, 00:00");
  });

  it("los extremos documentados son Nueva Zelanda y México con 19 horas", () => {
    const primera = rows[0];
    const ultima = rows[rows.length - 1];
    expect(primera.region).toContain("Nueva Zelanda");
    expect(primera.offset).toBe(13);
    expect(ultima.region).toContain("Pacífico");
    expect(ultima.offset).toBe(-8);
    // Nueva Zelanda abre a las 11:00 UTC del 18 y México (centro, UTC-6) a las
    // 06:00 UTC del 19: 19 horas, la diferencia que la página declara.
    const nuevaZelanda = rows.find((row) => row.offset === 13);
    const mexico = rows.find((row) => row.region.includes("Ciudad de México"));
    expect(nuevaZelanda?.utc).toBe("18 de noviembre, 11:00 UTC");
    expect(mexico?.utc).toBe("19 de noviembre, 06:00 UTC");
  });

  it("cada fila declara si su desfase está verificado", () => {
    for (const row of rows) {
      expect(["verificado", "por-confirmar"], row.region).toContain(
        row.offsetStatus,
      );
      expect(row.offsetLabel.length, row.region).toBeGreaterThanOrEqual(5);
      expect(row.spain, row.region).toMatch(
        /^\d{1,2} de noviembre, \d{2}:\d{2}$/,
      );
    }
  });

  it("publica lo que no está confirmado y las preguntas frecuentes", () => {
    expect(UNLOCK_PENDIENTE.length).toBeGreaterThanOrEqual(4);
    expect(UNLOCK_PENDIENTE.some((item) => /precarga/i.test(item.tema))).toBe(
      true,
    );
    expect(UNLOCK_FAQ.length).toBeGreaterThanOrEqual(5);
    for (const entry of UNLOCK_FAQ) {
      expect(entry.question.endsWith("?")).toBe(true);
      expect(entry.answer.length).toBeGreaterThan(80);
    }
  });
});

describe("texto de la página sobre nosotros", () => {
  it("no inventa un equipo de cuatro personas", () => {
    const sobre = read("src", "components", "legal", "sobre.tsx");
    expect(sobre).not.toMatch(/cuatro personas/i);
    expect(sobre).not.toMatch(/equipo de \d+/i);
    // Y dice explícitamente bajo qué firma se publica.
    expect(sobre).toContain("Redacción");
  });

  it("no queda el texto antiguo en ningún fichero del sitio", () => {
    const offenders: string[] = [];
    for (const file of [
      ["src", "components", "legal", "sobre.tsx"],
      ["src", "app", "sobre", "page.tsx"],
    ]) {
      const content = readFileSync(path.join(process.cwd(), ...file), "utf8");
      if (/cuatro personas/i.test(content)) offenders.push(file.join("/"));
    }
    expect(offenders).toEqual([]);
  });
});
