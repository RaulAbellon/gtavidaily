import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Configuración de ESLint con las reglas de corrección activadas.
 *
 * La versión anterior desactivaba ~30 reglas (incluidas `no-unused-vars`,
 * `no-undef`, `no-unreachable` y `react-hooks/exhaustive-deps`), así que el
 * linting no detectaba nada.
 *
 * `eslint-plugin-react-hooks` está además declarado en `devDependencies`
 * (aunque ya venga con `eslint-config-next`) porque ESLint 9 lo resuelve por
 * nombre desde la raíz: instalado solo como dependencia transitiva, `npm run
 * lint` falla con «could not find plugin react-hooks» según cómo quede el árbol
 * de dependencias. Lo detectó la migración a Cloudflare al añadir wrangler.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Corrección: estas sí rompen el lint.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "prefer-const": "error",
      "no-unreachable": "error",
      "no-redeclare": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Estilo que sí toleramos, documentado a propósito.
      "@typescript-eslint/no-non-null-assertion": "warn",
      // Las portadas son SVG como data URI: `next/image` no aporta nada aquí.
      "@next/next/no-img-element": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // Los scripts de línea de comandos y las pruebas hablan por consola.
    files: ["scripts/**/*.mjs", "tests/**/*.{ts,mjs}"],
    rules: {
      "no-console": "off",
    },
  },
  {
    // `.wrangler` es el estado local de wrangler y `out/` el build estático.
    // Sin excluirlos, `npm run lint` después de compilar analiza el artefacto
    // entero y falla con decenas de miles de avisos que no son del proyecto.
    // (`.open-next` se mantiene en la lista por si queda algún resto de la etapa
    // del adaptador de OpenNext: ya no se genera.)
    ignores: [
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
