import path from "node:path";
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  internalLinks,
  listFiles,
  matchesKnownRoute,
  readCode,
  readSource,
  sourceFiles,
} from "./helpers/routes";

describe("frontera servidor/cliente", () => {
  it("ningún componente cliente importa el fichero de contenido", () => {
    const offenders = sourceFiles()
      .filter((file) => {
        const content = readCode(file);
        return (
          /^\s*["']use client["']/m.test(content) &&
          /from\s+["']@\/lib\/data["']/.test(content)
        );
      })
      .map((file) => path.relative(process.cwd(), file));

    // Importar `data.ts` (200 KB) desde un componente cliente lo mete entero en
    // el bundle del navegador: fue uno de los hallazgos de la auditoría.
    expect(offenders).toEqual([]);
  });

  it("el contenido se consulta con módulos de servidor", () => {
    const queries = readSource(path.join(process.cwd(), "src", "lib", "queries.ts"));
    expect(queries).toContain("@/lib/data");
  });
});

describe("enlaces internos", () => {
  it("todos apuntan a rutas existentes", () => {
    const broken = internalLinks()
      .filter((link) => !matchesKnownRoute(link.href))
      .map((link) => `${link.file} -> ${link.href}`);
    expect(broken).toEqual([]);
  });

  it("hay enlaces internos que revisar (el test no está vacío)", () => {
    expect(internalLinks().length).toBeGreaterThan(10);
  });
});

describe("restos de la versión anterior", () => {
  it("no queda ninguna identidad de marca alternativa", () => {
    const offenders = sourceFiles().filter((file) => {
      const content = readCode(file);
      return /gtavihub|GTA VI HUB/i.test(content);
    });
    expect(offenders.map((file) => path.relative(process.cwd(), file))).toEqual([]);
  });

  it("no se sirven avatares ni imágenes de terceros", () => {
    const offenders = sourceFiles().filter((file) =>
      /pravatar|gravatar/i.test(readCode(file))
    );
    expect(offenders.map((file) => path.relative(process.cwd(), file))).toEqual([]);
  });

  it("no hay identificadores de AdSense de ejemplo en el código", () => {
    const offenders = sourceFiles().filter((file) =>
      /ca-pub-0{16}/.test(readCode(file))
    );
    expect(offenders.map((file) => path.relative(process.cwd(), file))).toEqual([]);
  });

  it("no se manipula document.title a mano", () => {
    const offenders = sourceFiles().filter((file) =>
      /document\.title\s*=/.test(readCode(file))
    );
    expect(offenders.map((file) => path.relative(process.cwd(), file))).toEqual([]);
  });

  it("el consentimiento emitido tiene quien lo escuche", () => {
    const emitters = sourceFiles().filter((file) =>
      readSource(file).includes("CONSENT_EVENT")
    );
    // Quien emite (banner) y quien aplica las señales (carga de AdSense).
    expect(emitters.length).toBeGreaterThanOrEqual(3);
  });
});

describe("páginas legales", () => {
  const legalRoutes = [
    { slug: "sobre", component: "LegalAbout" },
    { slug: "privacidad", component: "LegalPrivacy" },
    { slug: "cookies", component: "LegalCookies" },
    { slug: "aviso-legal", component: "LegalNotice" },
    { slug: "dmca", component: "LegalDmca" },
    { slug: "contacto", component: "LegalContact" },
  ];

  it("cada página tiene su propio componente de servidor", () => {
    for (const route of legalRoutes) {
      const componentPath = path.join(
        process.cwd(),
        "src",
        "components",
        "legal",
        `${route.slug}.tsx`
      );
      const component = readSource(componentPath);
      expect(component, route.slug).toContain(`export function ${route.component}()`);

      const page = readSource(
        path.join(process.cwd(), "src", "app", route.slug, "page.tsx")
      );
      expect(page, route.slug).toContain(`<${route.component} />`);
      expect(page, route.slug).toContain("alternates: { canonical:");
    }
  });

  it("el monolito con las seis páginas ya no existe", () => {
    expect(
      existsSync(
        path.join(process.cwd(), "src", "components", "site", "StaticPage.tsx")
      )
    ).toBe(false);
  });

  it("las cabeceras y títulos de sección están extraídos, no copiados", () => {
    // `legal-header.tsx` es la definición compartida; el resto no debe repetirla.
    const duplicated: string[] = [];
    for (const file of listFiles(path.join(process.cwd(), "src", "components", "legal"))) {
      const name = path.basename(file);
      if (name === "legal-header.tsx") continue;
      const content = readSource(file);
      if (content.includes('<h2 className="mb-3')) duplicated.push(name);
      if (content.includes('<header className="mb-8">')) duplicated.push(name);
    }
    expect(duplicated).toEqual([]);
  });
});

describe("configuración del proyecto", () => {
  const pkg = JSON.parse(
    readFileSync(path.join(process.cwd(), "package.json"), "utf8")
  ) as {
    scripts: Record<string, string>;
    engines: { node: string };
  };

  it("los scripts funcionan en Windows y en Linux", () => {
    for (const [name, command] of Object.entries(pkg.scripts)) {
      expect(command, `script ${name}`).not.toMatch(/\bcp -r\b/);
      expect(command, `script ${name}`).not.toMatch(/^\s*[A-Z_]+=\S+ /);
    }
  });

  it("exige la versión de Node que necesita Next", () => {
    expect(pkg.engines.node).toBe(">=20.9.0");
  });

  it("mantiene un solo lockfile", () => {
    const root = listFiles(process.cwd()).filter((file) =>
      /(package-lock\.json|bun\.lock|yarn\.lock|pnpm-lock\.yaml)$/.test(file)
    );
    expect(root.length).toBe(1);
  });

  it("no quedan restos de Prisma ni de la base de datos", () => {
    const leftovers = listFiles(process.cwd()).filter((file) =>
      /(^|[\\/])(prisma|db)([\\/]|$)|custom\.db/.test(file)
    );
    expect(leftovers).toEqual([]);
  });
});
