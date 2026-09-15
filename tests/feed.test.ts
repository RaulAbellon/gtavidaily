import { describe, expect, it } from "vitest";
import { GET as getFeed } from "@/app/feed.xml/route";
import { GET as getSecurityTxt } from "@/app/security-txt/route";
import { articles, getLatestArticles } from "@/lib/data";
import { FEED_LIMIT, buildFeed } from "@/lib/feed";
import { SECURITY_TXT_PATH, buildSecurityTxt } from "@/lib/security-txt";
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
  it("incluye contacto y canonical", async () => {
    const text = await (await getSecurityTxt()).text();
    const lines = text.split("\n");
    expect(lines).toContain(`Contact: mailto:${CONTACT_EMAIL}`);
    expect(lines).toContain(`Canonical: ${SITE_URL}/${SECURITY_TXT_PATH}`);
    expect(lines).toContain("Preferred-Languages: es, en");
  });

  it("declara una caducidad en el futuro y dentro de un año", () => {
    const text = buildSecurityTxt();
    const expires = /^Expires: (.+)$/m.exec(text)?.[1];
    expect(expires, "falta el campo Expires").toBeTruthy();

    const when = new Date(expires!).getTime();
    expect(Number.isNaN(when)).toBe(false);
    expect(when).toBeGreaterThan(Date.now());
    expect(when).toBeLessThan(Date.now() + 366 * 24 * 60 * 60 * 1000);
  });

  it("renueva la caducidad con cada generación", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const expires = /^Expires: (.+)$/m.exec(buildSecurityTxt(now))?.[1];
    expect(new Date(expires!).getUTCFullYear()).toBe(2027);
  });

  it("se sirve como texto plano", async () => {
    const response = await getSecurityTxt();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/plain");
  });
});
