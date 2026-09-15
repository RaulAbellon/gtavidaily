/**
 * Publica los cambios en GitHub sin necesidad de tener `git` instalado.
 *
 * Estrategia: lee el árbol remoto, compara los ficheros locales con él por su
 * hash de blob, sube solo lo que cambió y crea un commit sobre la rama. No
 * toca nada más del repositorio.
 *
 * Uso:
 *   node scripts/publish.mjs --dry-run          (solo muestra qué cambiaría)
 *   GITHUB_TOKEN=xxx node scripts/publish.mjs   (publica)
 *
 * El token puede venir de la variable GITHUB_TOKEN o del fichero `.gh-token`
 * (que está en .gitignore y nunca se sube). Necesita permiso
 * "Contents: Read and write" y nada más.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";

const OWNER = "RaulAbellon";
const REPO = "gtavidaily";
const API = "https://api.github.com";

const IGNORED = new Set([
  "node_modules",
  ".next",
  ".git",
  "out",
  "build",
  "dist",
  "coverage",
  ".vercel",
]);
const IGNORED_FILES = new Set([".gh-token", ".DS_Store"]);
const IGNORED_PATTERNS = [/\.log$/, /\.tsbuildinfo$/, /^next-env\.d\.ts$/];
/** `.env`, `.env.local`… se ignoran, pero `.env.example` sí se publica. */
const ENV_TEMPLATE = /^\.env\.example$/;

const dryRun = process.argv.includes("--dry-run");
const root = process.cwd();

function shouldIgnore(relativePath) {
  const segments = relativePath.split("/");
  if (segments.some((segment) => IGNORED.has(segment))) return true;
  const base = segments[segments.length - 1];
  if (IGNORED_FILES.has(base)) return true;
  if (base.startsWith(".env") && !ENV_TEMPLATE.test(base)) return true;
  return IGNORED_PATTERNS.some((pattern) => pattern.test(base));
}

function localFiles() {
  const entries = readdirSync(root, { recursive: true, withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const parent = entry.parentPath ?? root;
    const absolute = path.join(parent, entry.name);
    const relative = path.relative(root, absolute).split(path.sep).join("/");
    if (shouldIgnore(relative)) continue;
    files.push({ relative, absolute });
  }
  return files;
}

function gitBlobSha(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`, "utf8");
  return createHash("sha1").update(Buffer.concat([header, buffer])).digest("hex");
}

async function readToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
  try {
    await access(path.join(root, ".gh-token"));
    return readFileSync(path.join(root, ".gh-token"), "utf8").trim();
  } catch {
    return "";
  }
}

async function api(endpoint, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API}${endpoint}`, {
    method,
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "gtavidaily-publish",
      ...(body ? { "content-type": "application/json" } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${method} ${endpoint} → ${response.status}: ${detail.slice(0, 300)}`);
  }
  return response.status === 204 ? null : response.json();
}

async function main() {
  const token = await readToken();
  if (!token && !dryRun) {
    console.error(
      "Falta el token. Define GITHUB_TOKEN o crea el fichero .gh-token con un PAT fine-grained (Contents: Read and write) del repositorio."
    );
    process.exit(1);
  }

  const repo = await api(`/repos/${OWNER}/${REPO}`, { token });
  const branch = repo.default_branch;
  const ref = await api(`/repos/${OWNER}/${REPO}/git/ref/heads/${branch}`, { token });
  const headSha = ref.object.sha;
  const headCommit = await api(`/repos/${OWNER}/${REPO}/git/commits/${headSha}`, { token });
  const baseTree = headCommit.tree.sha;
  const remoteTree = await api(
    `/repos/${OWNER}/${REPO}/git/trees/${baseTree}?recursive=1`,
    { token }
  );

  const remoteBlobs = new Map(
    remoteTree.tree
      .filter((entry) => entry.type === "blob")
      .map((entry) => [entry.path, entry])
  );

  const changed = [];
  const localPaths = new Set();

  for (const file of localFiles()) {
    const buffer = readFileSync(file.absolute);
    const sha = gitBlobSha(buffer);
    localPaths.add(file.relative);
    const remote = remoteBlobs.get(file.relative);
    if (!remote) changed.push({ ...file, status: "añadido", sha });
    else if (remote.sha !== sha) changed.push({ ...file, status: "modificado", sha });
  }

  const deleted = [...remoteBlobs.keys()].filter((p) => !localPaths.has(p));

  console.log(`Repositorio: ${OWNER}/${REPO} (rama ${branch}, HEAD ${headSha.slice(0, 7)})`);
  console.log(`Ficheros locales: ${localPaths.size} | remotos: ${remoteBlobs.size}`);
  console.log(`\nCambios a publicar: ${changed.length} ficheros`);
  for (const file of changed.slice(0, 200)) {
    console.log(`  ${file.status.padEnd(11)} ${file.relative}`);
  }
  if (changed.length > 200) console.log(`  … y ${changed.length - 200} más`);

  console.log(`\nBorrados a aplicar: ${deleted.length}`);
  for (const relative of deleted.slice(0, 200)) console.log(`  borrado     ${relative}`);
  if (deleted.length > 200) console.log(`  … y ${deleted.length - 200} más`);

  if (dryRun) {
    console.log("\nSimulación: no se ha modificado nada en GitHub.");
    return;
  }

  if (changed.length === 0 && deleted.length === 0) {
    console.log("\nNo hay nada que publicar: el remoto ya coincide.");
    return;
  }

  console.log("\nSubiendo blobs…");
  const tree = [];
  for (const file of changed) {
    const blob = await api(`/repos/${OWNER}/${REPO}/git/blobs`, {
      method: "POST",
      token,
      body: {
        content: readFileSync(file.absolute).toString("base64"),
        encoding: "base64",
      },
    });
    tree.push({
      path: file.relative,
      mode: 0o100644,
      type: "blob",
      sha: blob.sha,
    });
  }

  for (const relative of deleted) {
    tree.push({ path: relative, mode: 0o100644, type: "blob", sha: null });
  }

  const newTree = await api(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    token,
    body: { base_tree: baseTree, tree },
  });

  const message = process.env.COMMIT_MESSAGE ?? "fix: auditoría completa (SEO, privacidad, tests y limpieza)";
  const commit = await api(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    token,
    body: { message, tree: newTree.sha, parents: [headSha] },
  });

  await api(`/repos/${OWNER}/${REPO}/git/refs/heads/${branch}`, {
    method: "PATCH",
    token,
    body: { sha: commit.sha },
  });

  console.log(`\nPublicado: https://github.com/${OWNER}/${REPO}/commit/${commit.sha}`);
}

main().catch((error) => {
  console.error(`\nError al publicar: ${error.message}`);
  process.exit(1);
});
