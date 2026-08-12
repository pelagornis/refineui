#!/usr/bin/env node
/**
 * Run a workspace package script with the active package manager
 * (bun / pnpm / yarn / npm). Detects PM via npm_config_user_agent.
 *
 * Usage: node scripts/ws.mjs <package-name> [script=build]
 */
import { spawnSync } from "node:child_process";

const [pkg, script = "build"] = process.argv.slice(2);

if (!pkg) {
  console.error("Usage: node scripts/ws.mjs <package-name> [script]");
  process.exit(1);
}

const ua = process.env.npm_config_user_agent ?? "";
const execPath = process.env.npm_execpath ?? "";

/** @type {{ command: string; args: string[] }} */
let runner;

if (ua.includes("bun") || execPath.includes("bun")) {
  runner = { command: "bun", args: ["run", "--filter", pkg, script] };
} else if (ua.includes("pnpm") || execPath.includes("pnpm")) {
  runner = { command: "pnpm", args: ["--filter", pkg, "run", script] };
} else if (ua.includes("yarn") || execPath.includes("yarn")) {
  runner = { command: "yarn", args: ["workspace", pkg, "run", script] };
} else {
  runner = { command: "npm", args: ["run", script, `--workspace=${pkg}`] };
}

const result = spawnSync(runner.command, runner.args, {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
