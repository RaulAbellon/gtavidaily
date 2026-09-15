/**
 * Copia los artefactos que Next.js no incluye en el build standalone.
 *
 * El script de build original usaba `cp -r`, que solo funciona en Unix y
 * rompía `npm run build` en Windows. Esto hace lo mismo con Node.
 */
import { access, cp, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

// En Netlify y Vercel el build lo empaqueta su propio adaptador y no existe
// `.next/standalone` (ver `outputMode` en next.config.ts). Ahí no hay nada que
// copiar, así que el script termina sin error en lugar de romper el despliegue.
const managedBuild = Boolean(process.env.NETLIFY || process.env.VERCEL);

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (managedBuild) {
    console.log(
      "· Build gestionado por la plataforma: no se genera .next/standalone"
    );
    return;
  }

  if (!(await exists(standalone))) {
    console.error(
      "No se ha encontrado .next/standalone. Comprueba que next.config.ts mantiene output: \"standalone\"."
    );
    process.exit(1);
  }

  await mkdir(path.join(standalone, ".next"), { recursive: true });

  const staticDir = path.join(root, ".next", "static");
  if (await exists(staticDir)) {
    await cp(staticDir, path.join(standalone, ".next", "static"), {
      recursive: true,
    });
    console.log("· .next/static copiado");
  }

  const publicDir = path.join(root, "public");
  if (await exists(publicDir)) {
    await cp(publicDir, path.join(standalone, "public"), { recursive: true });
    console.log("· public/ copiado");
  }

  console.log("Build standalone listo en .next/standalone");
}

main().catch((error) => {
  console.error("Error al preparar el build standalone:", error);
  process.exit(1);
});
