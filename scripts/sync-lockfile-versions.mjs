#!/usr/bin/env node
/**
 * Sync the workspace `version` fields recorded in bun.lock with each
 * workspace's package.json.
 *
 * `bun pm pack` rewrites `workspace:*` from the version bun.lock records for
 * that workspace, not from its package.json — and bun (1.3.x) never refreshes
 * those fields once they exist, not even with `bun install --lockfile-only`.
 * After `changeset version`, a stale lockfile makes packed tarballs pin old
 * internal versions (e.g. @refineui/react depending on an old @refineui/tokens).
 *
 * Usage: node scripts/sync-lockfile-versions.mjs [--check]
 *   --check  exit 1 instead of writing when bun.lock is stale
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LOCKFILE = join(ROOT, "bun.lock");
const check = process.argv.includes("--check");

/** Matches `"<workspace path>": {\n "name": "<name>",\n "version": "<version>"` blocks. */
const WORKSPACE_ENTRY = /("([^"]+)": \{\s*"name": "[^"]+",\s*"version": ")([^"]+)(")/g;

if (!existsSync(LOCKFILE)) {
  console.error(`Cannot find ${LOCKFILE}`);
  process.exit(1);
}

const source = readFileSync(LOCKFILE, "utf8");
/** @type {string[]} */
const changes = [];

const next = source.replace(WORKSPACE_ENTRY, (match, head, workspacePath, lockedVersion, tail) => {
  const manifestPath = join(ROOT, workspacePath, "package.json");
  if (!existsSync(manifestPath)) return match;

  const { name, version } = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!version || version === lockedVersion) return match;

  changes.push(`${name}: ${lockedVersion} -> ${version}`);
  return `${head}${version}${tail}`;
});

if (changes.length === 0) {
  console.log("bun.lock workspace versions match package.json.");
  process.exit(0);
}

if (check) {
  console.error(`bun.lock records stale workspace versions:\n  ${changes.join("\n  ")}`);
  console.error("Run `node scripts/sync-lockfile-versions.mjs` and commit bun.lock.");
  process.exit(1);
}

writeFileSync(LOCKFILE, next);
console.log(`Updated bun.lock workspace versions:\n  ${changes.join("\n  ")}`);
