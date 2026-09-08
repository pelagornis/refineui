#!/usr/bin/env node
/**
 * Publish every public workspace package to npm.
 *
 * Each package is packed with bun and then uploaded with npm, because neither
 * tool can do both halves:
 *
 * - Internal deps use the `workspace:*` protocol. `bun pm pack` rewrites it to
 *   the resolved version inside the tarball; npm ships the literal
 *   `workspace:*`, which installs as a broken dependency.
 * - Auth is OIDC trusted publishing. `npm publish` performs the token exchange;
 *   `bun publish` cannot (oven-sh/bun#22423) and fails with "missing
 *   authentication" even when the workflow grants `id-token: write`.
 *
 * Already-published versions are skipped so a re-run is a no-op, and each new
 * release prints `New tag: <name>@<version>` plus a local git tag, which is the
 * contract changesets/action reads to push tags and create GitHub releases.
 *
 * Usage: node scripts/publish.mjs [--dry-run]
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REGISTRY = "https://registry.npmjs.org";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGES_DIR = join(ROOT, "packages");

const dryRun = process.argv.includes("--dry-run");

/** @typedef {{ name: string; version: string; dir: string; internalDeps: string[] }} WorkspacePackage */

/** @returns {WorkspacePackage[]} */
function readPublishablePackages() {
  /** @type {Map<string, WorkspacePackage>} */
  const byName = new Map();

  for (const entry of readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const dir = join(PACKAGES_DIR, entry.name);
    const manifestPath = join(dir, "package.json");
    if (!existsSync(manifestPath)) continue;

    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (manifest.private) continue;
    if (!manifest.name || !manifest.version) continue;

    byName.set(manifest.name, {
      name: manifest.name,
      version: manifest.version,
      dir,
      internalDeps: Object.keys({
        ...manifest.dependencies,
        ...manifest.peerDependencies,
      }),
    });
  }

  for (const pkg of byName.values()) {
    pkg.internalDeps = pkg.internalDeps.filter((dep) => byName.has(dep));
  }

  return topologicalOrder(byName);
}

/**
 * Publish dependencies first so a consumer never lands on npm pointing at a
 * version that does not exist yet.
 *
 * @param {Map<string, WorkspacePackage>} byName
 * @returns {WorkspacePackage[]}
 */
function topologicalOrder(byName) {
  /** @type {WorkspacePackage[]} */
  const ordered = [];
  /** @type {Set<string>} */
  const done = new Set();
  /** @type {Set<string>} */
  const visiting = new Set();

  /** @param {string} name */
  function visit(name) {
    if (done.has(name)) return;
    if (visiting.has(name)) {
      throw new Error(`Dependency cycle in packages/: ${[...visiting, name].join(" -> ")}`);
    }

    visiting.add(name);
    const pkg = byName.get(name);
    if (pkg) {
      for (const dep of pkg.internalDeps) visit(dep);
      ordered.push(pkg);
    }
    visiting.delete(name);
    done.add(name);
  }

  for (const name of [...byName.keys()].sort()) visit(name);

  return ordered;
}

/**
 * @param {string} name
 * @param {string} version
 * @returns {Promise<boolean>}
 */
async function isAlreadyPublished(name, version) {
  const url = `${REGISTRY}/${name.replace("/", "%2f")}/${version}`;

  /** @type {Response} */
  let response;
  try {
    response = await fetch(url, { headers: { accept: "application/json" } });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot reach ${url} to check whether ${name}@${version} exists: ${reason}`);
  }

  if (response.ok) return true;
  if (response.status === 404) return false;

  throw new Error(`Cannot read ${name}@${version} from npm: ${response.status} ${response.statusText}`);
}

/**
 * @param {WorkspacePackage} pkg
 * @param {string} destination
 * @returns {string} absolute path of the packed tarball
 */
function pack(pkg, destination) {
  const result = spawnSync("bun", ["pm", "pack", "--quiet", "--destination", destination], {
    cwd: pkg.dir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });

  if (result.error) {
    throw new Error(`Cannot run \`bun pm pack\` for ${pkg.name}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`\`bun pm pack\` failed for ${pkg.name}@${pkg.version} (exit ${result.status})`);
  }

  const tarball = result.stdout.trim().split("\n").pop()?.trim();
  if (!tarball || !existsSync(tarball)) {
    throw new Error(`\`bun pm pack\` did not report a tarball path for ${pkg.name}@${pkg.version}`);
  }

  return tarball;
}

/**
 * @param {WorkspacePackage} pkg
 * @param {string} tarball
 */
function publish(pkg, tarball) {
  const args = ["publish", tarball, "--access", "public"];
  if (dryRun) args.push("--dry-run");

  const result = spawnSync("npm", args, { cwd: ROOT, stdio: "inherit" });

  if (result.error) {
    throw new Error(`Cannot run \`npm publish\` for ${pkg.name}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`\`npm publish\` failed for ${pkg.name}@${pkg.version} (exit ${result.status})`);
  }
}

/** @param {string} tag */
function createGitTag(tag) {
  const existing = spawnSync("git", ["tag", "--list", tag], { cwd: ROOT, encoding: "utf8" });
  if (existing.stdout?.trim() === tag) return;

  const result = spawnSync("git", ["tag", tag], { cwd: ROOT, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`Cannot create git tag ${tag} (exit ${result.status})`);
  }
}

async function main() {
  const packages = readPublishablePackages();
  const stagingDir = mkdtempSync(join(tmpdir(), "refineui-publish-"));
  let published = 0;

  try {
    for (const pkg of packages) {
      const tag = `${pkg.name}@${pkg.version}`;

      if (await isAlreadyPublished(pkg.name, pkg.version)) {
        console.log(`Skipped: ${tag} is already on npm`);
        continue;
      }

      publish(pkg, pack(pkg, stagingDir));
      published += 1;

      if (dryRun) {
        console.log(`Would publish: ${tag}`);
        continue;
      }

      createGitTag(tag);
      console.log(`New tag: ${tag}`);
    }
  } finally {
    rmSync(stagingDir, { recursive: true, force: true });
  }

  if (published === 0) {
    console.log("Nothing to publish — every workspace version is already on npm.");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
