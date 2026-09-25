import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { GET as getFeed } from "@/app/feed.xml/route";
import { articles, getLatestArticles } from "@/lib/data";
import { FEED_LIMIT, buildFeed } from "@/lib/feed";
import {
  SECURITY_TXT_PATH,
  buildSecurityTxt,
  securityTxtExpires,
} from "@/lib/security-txt";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

describe("feed RSS", () => {
  const xml = buildFeed(FEED_LIMIT);

  it("es un RSS 2.0 con declaración XML", () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<channel>");
    expect(xml).toContain("</rss>");
  });

  it("se identifica y enlaza a sí mismo", () => {
    expect(xml).toContain(`<link>${SITE_URL}</link>`);
    expect(xml).toContain(
      `<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`
    );
  });

  it("no publica más elementos de los permitidos", () => {
    const items = xml.match(/<item>/g) ?? [];
    expect(items.length).toBe(Math.min(FEED_LIMIT, articles.length));
  });

  it("respeta el límite indicado", () => {
    const short = buildFeed(5);
    expect((short.match(/<item>/g) ?? []).length).toBe(5);
  });

  it("usa URLs absolutas y enlaces permanentes", () => {
    const links = [...xml.matchAll(/<link>(http[^<]+)<\/link>/g)].map((m) => m[1]);
    const articleLinks = links.filter((link) => link.includes("/articulo/"));
    expect(articleLinks.length).toBeGreaterThan(0);
    for (const link of articleLinks) {
      expect(link.startsWith(`${SITE_URL}/articulo/`)).toBe(true);
    }
    expect(xml).toContain('isPermaLink="true"');
  });

  it("publica las fechas en formato RFC 822", () => {
    const dates = [...xml.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map((m) => m[1]);
    expect(dates.length).toBeGreaterThan(0);
    for (const date of dates) {
      expect(Number.isNaN(Date.parse(date))).toBe(false);
      expect(date).toMatch(/GMT$/);
    }
  });

  it("ordena los elementos del más reciente al más antiguo", () => {
    const dates = [...xml.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map((m) =>
      Date.parse(m[1])
    );
    for (let i = 1; i < dates.length; i += 1) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
    // Coincide con el orden de las últimas noticias.
    const expectedFirst = getLatestArticles(1)[0];
    expect(xml).toContain(expectedFirst.title.slice(0, 30));
  });

  it("sirve con el tipo de contenido correcto", async () => {
    const response = await getFeed();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/rss+xml");
    expect(await response.text()).toContain("<rss");
  });
});

describe("security.txt (RFC 9116)", () => {
  // Desde la conversión a sitio estático el fichero es **real**
  // (`public/.well-known/security.txt`): antes lo generaba la ruta
  // `/security-txt` y se publicaba en su URL canónica con una reescritura de
  // `next.config.ts`, que con `output: "export"` no existe. Estas pruebas miran
  // el fichero que se despliega, no una función.
  const file = readFileSync(
    fileURLToPath(new URL("../public/.well-known/security.txt", import.meta.url)),
    "utf8"
  );

  it("vive en la ruta canónica del sitio", () => {
    expect(SECURITY_TXT_PATH).toBe(".well-known/security.txt");
  });

  it("incluye contacto y canonical", () => {
    const lines = file.split("\n");
    expect(lines).toContain(`Contact: mailto:${CONTACT_EMAIL}`);
    expect(lines).toContain(`Canonical: ${SITE_URL}/${SECURITY_TXT_PATH}`);
    expect(lines).toContain("Preferred-Languages: es, en");
    expect(lines).toContain(`Policy: ${SITE_URL}/aviso-legal`);
  });

  it("declara una caducidad en el futuro", () => {
    const expires = securityTxtExpires(file);
    expect(expires, "falta el campo Expires o no es una fecha").not.toBeNull();
    expect((expires as Date).getTime()).toBeGreaterThan(Date.now());
  });

  it("avisa con margen antes de caducar (al menos 90 días)", () => {
    // El fichero versionado no se regenera solo: si se acerca su caducidad, esta
    // prueba falla y recuerda actualizarlo. En cada build,
    // `scripts/postbuild.mjs` reescribe el Expires del fichero **publicado** a un
    // año vista, así que el sitio desplegado siempre va holgado.
    const expires = securityTxtExpires(file) as Date;
    expect(expires.getTime() - Date.now()).toBeGreaterThan(
      90 * 24 * 60 * 60 * 1000
    );
  });

  it("mantiene el mismo formato que el generador", () => {
    // `buildSecurityTxt` es la fuente de verdad del formato: regenerarlo con la
    // fecha del fichero tiene que devolver el fichero tal cual.
    const expires = securityTxtExpires(file) as Date;
    const regenerated = buildSecurityTxt(
      new Date(expires.getTime() - 365 * 24 * 60 * 60 * 1000)
    );
    expect(regenerated).toBe(file);
  });

  it("va en UTF-8 sin BOM", () => {
    const bytes = readFileSync(
      fileURLToPath(new URL("../public/.well-known/security.txt", import.meta.url))
    );
    expect([...bytes.slice(0, 3)]).not.toEqual([0xef, 0xbb, 0xbf]);
  });
});
