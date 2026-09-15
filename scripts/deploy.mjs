#!/usr/bin/env node
/**
 * Publica lo que hay en local con un solo comando.
 *
 * Hace, en este orden: regenera el índice de contenido, pasa la batería
 * completa de comprobaciones (`npm run check`), añade los cambios, crea el
 * commit y empuja a `main`. A partir de ahí es la plataforma la que despliega:
 * no hay ningún paso manual en su panel.
 *
 *   npm run deploy                        # mensaje automático con la fecha
 *   npm run deploy -- "contenido: ..."    # mensaje propio
 *   npm run deploy -- --skip-checks       # publica sin volver a comprobar
 *   npm run deploy -- --dry-run           # enseña lo que haría, sin tocar git
 *
 * `git` no está en el PATH de este equipo (se instaló con winget en su ruta
 * habitual), así que el binario se localiza aquí antes de usarlo.
 */
import { spawnSync } from "node:child_process";

const root = process.cwd();
const argv = process.argv.slice(2);
const skipChecks = argv.includes("--skip-checks");
const dryRun = argv.includes("--dry-run");
const message =
  argv
    .filter((arg) => !arg.startsWith("--"))
    .join(" ")
    .trim() ||
  `contenido: actualización diaria ${new Date().toISOString().slice(0, 10)}`;

/**
 * Rutas que nunca deben acabar en un commit: configuración local con
 * credenciales, tokens y claves privadas. `.env.example` sí se publica porque
 * es la plantilla sin valores.
 */
const FORBIDDEN =
  /(^|\/)(\.env$|\.env\.(?!example$)[^/]+$|\.gh-token$|.*\.pem$|.*\.key$)/;

const GIT_CANDIDATES = [
  process.env.GIT_BINARY,
  "git",
  "C:\\Program Files\\Git\\cmd\\git.exe",
  "C:\\Program Files (x86)\\Git\\cmd\\git.exe",
  "/usr/bin/git",
  "/usr/local/bin/git",
].filter(Boolean);

function findGit() {
  for (const candidate of GIT_CANDIDATES) {
    const probe = spawnSync(candidate, ["--version"], { encoding: "utf8" });
    if (probe.status === 0) return candidate;
  }
  return null;
}

const git = findGit();

function fail(step, detail) {
  console.error(`\n✖ ${step}`);
  if (detail) console.error(detail.trim());
  process.exit(1);
}

/**
 * Ejecuta git sin shell intermedia: así el mensaje del commit llega intacto
 * aunque contenga comillas, acentos o dos puntos.
 */
function gitExec(args, { inherit = false } = {}) {
  const result = spawnSync(git, args, {
    cwd: root,
    encoding: "utf8",
    stdio: inherit ? "inherit" : "pipe",
  });

  const out = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  return { ok: result.status === 0, out: inherit ? "" : out.trim() };
}

/** Ejecuta un comando npm y hereda la salida para poder ver el progreso. */
function npmRun(script) {
  return (
    spawnSync(`npm run ${script}`, {
      cwd: root,
      shell: true,
      stdio: "inherit",
    }).status === 0
  );
}

function gitPush() {
  const result = gitExec(["push", "origin", "main"], { inherit: true });
  if (result.ok) return;

  console.error("\n✖ El commit se ha creado, pero el push ha fallado.");
  console.error(
    [
      "",
      "GitHub no reconoce esta máquina. Autoriza la clave pública que ya está",
      "generada en C:\\Users\\Usuario\\.ssh\\gtavidaily.pub:",
      "",
      "  1. Abre https://github.com/settings/ssh/new",
      "  2. Title: gtavidaily-deploy   ·   Key type: Authentication key",
      "  3. Pega el contenido de ese fichero .pub y guarda",
      "",
      "Después vuelve a lanzar:  npm run deploy -- --skip-checks",
      "",
    ].join("\n")
  );
  process.exit(1);
}

function main() {
  if (!git) {
    fail(
      "No se ha encontrado git.",
      "Instálalo con: winget install --id Git.Git -e --scope user"
    );
  }

  const branch = gitExec(["rev-parse", "--abbrev-ref", "HEAD"]);
  if (!branch.ok) fail("Esto no es un repositorio git.", branch.out);
  if (branch.out !== "main") {
    fail(
      `La rama actual es "${branch.out}" y el despliegue publica "main".`,
      "Cámbiala con: git switch main"
    );
  }

  if (!skipChecks) {
    console.log("· Regenerando el índice de contenido…");
    if (!npmRun("content")) fail("Fallo al regenerar el índice de contenido.");

    console.log("· Pasando comprobaciones (contenido, lint, tipos, tests, build)…");
    if (!npmRun("check")) {
      fail("Las comprobaciones han fallado: no se publica nada.");
    }
  }

  const status = gitExec(["status", "--porcelain"]);
  if (!status.ok) fail("No se ha podido leer el estado del repositorio.", status.out);

  if (!status.out) {
    console.log("✓ Sin cambios que publicar: el repositorio ya está al día.");
    return;
  }

  if (dryRun) {
    console.log("\nCambios que se publicarían:\n");
    console.log(status.out);
    console.log(`\nMensaje de commit: ${message}`);
    return;
  }

  if (!gitExec(["add", "-A"]).ok) fail("Fallo al preparar los cambios.");

  const staged = gitExec(["diff", "--cached", "--name-only"]);
  if (!staged.ok) fail("Fallo al leer los cambios preparados.", staged.out);

  if (!staged.out) {
    console.log("✓ Nada que commitear después de preparar los cambios.");
    return;
  }

  const leaked = staged.out.split("\n").filter((file) => FORBIDDEN.test(file));
  if (leaked.length > 0) {
    gitExec(["reset"]);
    fail(
      "Hay ficheros con secretos preparados para el commit.",
      `${leaked.join("\n")}\nRevisa .gitignore antes de volver a intentarlo.`
    );
  }

  const changed = staged.out.split("\n");
  console.log(`· ${changed.length} ficheros preparados`);

  if (!gitExec(["commit", "-m", message]).ok) fail("Fallo al crear el commit.");

  gitPush();

  console.log(`\n✓ Publicado en main: ${message}`);
  console.log("  La plataforma desplegará este commit automáticamente.");
}

main();
