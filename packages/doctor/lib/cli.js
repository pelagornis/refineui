#!/usr/bin/env node
import {
  discoverWorkspaces,
  reportToSummary,
  reportToYaml,
  runDoctor
} from "./chunk-BLUTUNSC.js";

// src/cli.ts
import fs from "fs";
import os from "os";
import path from "path";
function parseArgs(argv) {
  const options = { target: process.cwd(), json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
    if (arg === "--json") {
      options.json = true;
      continue;
    }
    if (arg === "--target" && argv[i + 1]) {
      options.target = path.resolve(argv[++i]);
      continue;
    }
    if (arg === "--workspace" && argv[i + 1]) {
      options.workspace = argv[++i];
      continue;
    }
    if (arg === "--output" && argv[i + 1]) {
      options.output = path.resolve(argv[++i]);
      continue;
    }
    if (arg === "--category" && argv[i + 1]) {
      options.categories = options.categories ?? [];
      options.categories.push(argv[++i]);
      continue;
    }
    if (!arg.startsWith("-")) {
      options.target = path.resolve(arg);
    }
  }
  return options;
}
function printHelp() {
  console.log(`refineui-doctor \u2014 read-only RefineUI workspace diagnostics

Usage:
  refineui-doctor [path] [options]

Options:
  --target <path>       Project root (default: cwd)
  --workspace <path>    Workspace relative path inside monorepo
  --output <file>       Write YAML report to file (default: temp dir)
  --category <name>     Run only rules in category (setup, foundations, components)
  --json                Print JSON to stdout instead of summary
  -h, --help            Show help

Docs: https://ui.pelagornis.com/ai-tools/doctor/
`);
}
function defaultOutputPath() {
  return path.join(os.tmpdir(), `refineui-doctor-${Date.now()}`, "doctor-report.yaml");
}
async function main() {
  const options = parseArgs(process.argv.slice(2));
  const targetRoot = options.target;
  if (!fs.existsSync(targetRoot)) {
    console.error(`Target not found: ${targetRoot}`);
    process.exit(1);
  }
  const workspaces = discoverWorkspaces(targetRoot);
  if (workspaces.length === 0) {
    console.error("No RefineUI workspaces found. Install @refineui/react or @refineui/tokens first.");
    process.exit(1);
  }
  let selected = workspaces[0];
  if (options.workspace) {
    const match = workspaces.find((ws) => ws.relativePath === options.workspace);
    if (!match) {
      console.error(`Workspace "${options.workspace}" not found. Available: ${workspaces.map((w) => w.relativePath).join(", ")}`);
      process.exit(1);
    }
    selected = match;
  }
  const report = runDoctor(targetRoot, selected, { categories: options.categories });
  const yaml = reportToYaml(report);
  const outPath = options.output ?? defaultOutputPath();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, yaml, "utf8");
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(reportToSummary(report));
    console.log("");
    console.log(`Report: ${outPath}`);
  }
  process.exit(report.summary.error > 0 ? 1 : 0);
}
main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
