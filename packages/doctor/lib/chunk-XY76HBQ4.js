// src/discover.ts
import fs from "fs";
import path from "path";
var REFINEUI_DEPS = ["@refineui/react", "@refineui/tokens", "@refineui/utilities", "@refineui/web-icons"];
var SKIP_DIRS = /* @__PURE__ */ new Set(["node_modules", ".git", "dist", "lib", "build", ".astro", "coverage", ".next", ".turbo"]);
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}
function collectSourceFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(full, acc);
      continue;
    }
    if (/\.(tsx?|jsx?|css|astro)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}
function inferProjectKinds(pkg, root) {
  const kinds = [];
  const scripts = pkg.scripts ?? {};
  const hasAppScript = Object.keys(scripts).some((key) => /^(dev|start|preview)$/.test(key));
  const hasExports = Boolean(pkg.exports ?? pkg.main ?? pkg.module);
  const srcDirs = ["src", "app", "pages"].map((d) => path.join(root, d));
  const hasAppEntry = srcDirs.some((d) => fs.existsSync(path.join(d, "main.tsx")) || fs.existsSync(path.join(d, "App.tsx")) || fs.existsSync(path.join(d, "index.tsx")));
  if (hasAppScript || hasAppEntry) kinds.push("app");
  if (hasExports && !pkg.private) kinds.push("library");
  if (kinds.length === 0 && fs.existsSync(path.join(root, "src"))) kinds.push("app");
  return kinds;
}
function extractRefineuiDeps(pkg) {
  const merged = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies
  };
  const declared = {};
  for (const name of REFINEUI_DEPS) {
    if (merged[name]) declared[name] = merged[name];
  }
  return declared;
}
function hasRefineuiUsage(root) {
  const pkgPath = path.join(root, "package.json");
  const pkg = readJson(pkgPath);
  if (!pkg) return false;
  return Object.keys(extractRefineuiDeps(pkg)).length > 0;
}
function discoverWorkspaces(targetRoot) {
  const absRoot = path.resolve(targetRoot);
  const workspaces = [];
  function considerPackage(dir) {
    const pkgPath = path.join(dir, "package.json");
    if (!fs.existsSync(pkgPath)) return;
    const pkg = readJson(pkgPath);
    if (!pkg) return;
    const declared = extractRefineuiDeps(pkg);
    if (Object.keys(declared).length === 0) return;
    const srcRoot = fs.existsSync(path.join(dir, "src")) ? path.join(dir, "src") : dir;
    workspaces.push({
      root: dir,
      packageJsonPath: pkgPath,
      relativePath: path.relative(absRoot, dir) || ".",
      name: pkg.name,
      projectKinds: inferProjectKinds(pkg, dir),
      declared,
      sourceFiles: collectSourceFiles(srcRoot)
    });
  }
  considerPackage(absRoot);
  const queue = [absRoot];
  while (queue.length > 0) {
    const dir = queue.pop();
    if (!dir) break;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.name === "packages" || entry.name === "apps" || entry.name === "examples") {
        for (const child of fs.readdirSync(full, { withFileTypes: true })) {
          if (!child.isDirectory() || SKIP_DIRS.has(child.name)) continue;
          considerPackage(path.join(full, child.name));
        }
      }
      if (fs.existsSync(path.join(full, "package.json")) && hasRefineuiUsage(full) && full !== absRoot) {
        considerPackage(full);
      }
      queue.push(full);
    }
  }
  const seen = /* @__PURE__ */ new Set();
  return workspaces.filter((ws) => {
    if (seen.has(ws.root)) return false;
    seen.add(ws.root);
    return true;
  });
}
function readFileLines(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  } catch {
    return [];
  }
}
function relPath(root, filePath) {
  return path.relative(root, filePath) || path.basename(filePath);
}

// src/rules/package-setup.ts
var REFS = [
  "https://ui.pelagornis.com/development/installation/",
  "https://ui.pelagornis.com/llms.txt"
];
var packageSetupRule = {
  id: "package-setup",
  category: "setup",
  run({ workspace }) {
    const hasReact = Boolean(workspace.declared["@refineui/react"]);
    const hasTokens = Boolean(workspace.declared["@refineui/tokens"]);
    const isApp = workspace.projectKinds.includes("app");
    if (!isApp) {
      return {
        check: {
          rule: "package-setup",
          category: "setup",
          status: "not-applicable",
          reason: "Library package \u2014 app dependency check skipped",
          references: REFS
        },
        findings: []
      };
    }
    const missing = [];
    if (!hasReact) missing.push("@refineui/react");
    if (!hasTokens) missing.push("@refineui/tokens");
    if (missing.length === 0) {
      return {
        check: {
          rule: "package-setup",
          category: "setup",
          status: "pass",
          evidence: `package.json declares ${Object.keys(workspace.declared).join(", ")}`,
          references: REFS
        },
        findings: []
      };
    }
    const finding = {
      rule: "package-setup",
      severity: "error",
      message: `Missing required RefineUI packages: ${missing.join(", ")}`,
      file: relPath(workspace.root, workspace.packageJsonPath),
      references: REFS,
      remediation: [
        "Install required RefineUI packages for app projects:",
        "  bun add @refineui/react @refineui/tokens",
        "Optional but recommended:",
        "  bun add @refineui/web-icons @refineui/utilities"
      ].join("\n")
    };
    return {
      check: {
        rule: "package-setup",
        category: "setup",
        status: "fail",
        evidence: `Missing: ${missing.join(", ")}`,
        references: REFS
      },
      findings: [finding]
    };
  }
};

// src/rules/stylesheet-setup.ts
import fs2 from "fs";
import path2 from "path";
var REFS2 = [
  "https://ui.pelagornis.com/development/theming/",
  "https://ui.pelagornis.com/llms.txt"
];
var REQUIRED_IMPORTS = [
  "@refineui/tokens/tailwind.css",
  "@refineui/react/refineui.css"
];
var RECOMMENDED_IMPORTS = ["@refineui/web-icons/dist/fonts/refineui-system-icons.css"];
function scanStylesheets(workspace) {
  const cssFiles = workspace.sourceFiles.filter((f) => f.endsWith(".css"));
  const entryCandidates = [
    path2.join(workspace.root, "src", "index.css"),
    path2.join(workspace.root, "src", "styles", "global.css"),
    path2.join(workspace.root, "src", "app.css"),
    path2.join(workspace.root, "src", "main.css")
  ];
  return [.../* @__PURE__ */ new Set([...cssFiles, ...entryCandidates.filter((f) => fs2.existsSync(f))])];
}
function fileContainsImport(content, imp) {
  return content.includes(imp);
}
var stylesheetSetupRule = {
  id: "stylesheet-setup",
  category: "setup",
  run({ workspace }) {
    const isApp = workspace.projectKinds.includes("app");
    if (!isApp) {
      return {
        check: {
          rule: "stylesheet-setup",
          category: "setup",
          status: "not-applicable",
          reason: "Library package \u2014 global stylesheet import check skipped",
          references: REFS2
        },
        findings: []
      };
    }
    const stylesheets = scanStylesheets(workspace);
    const allContent = stylesheets.map((f) => {
      try {
        return fs2.readFileSync(f, "utf8");
      } catch {
        return "";
      }
    }).join("\n");
    const missingRequired = REQUIRED_IMPORTS.filter((imp) => !fileContainsImport(allContent, imp));
    const missingRecommended = RECOMMENDED_IMPORTS.filter((imp) => !fileContainsImport(allContent, imp));
    if (missingRequired.length === 0) {
      const evidence = missingRecommended.length > 0 ? `Required imports present; optional missing: ${missingRecommended.join(", ")}` : "All required stylesheet imports found";
      return {
        check: {
          rule: "stylesheet-setup",
          category: "setup",
          status: "pass",
          evidence,
          references: REFS2
        },
        findings: []
      };
    }
    const finding = {
      rule: "stylesheet-setup",
      severity: "error",
      message: `Missing RefineUI stylesheet imports: ${missingRequired.join(", ")}`,
      file: stylesheets[0] ? relPath(workspace.root, stylesheets[0]) : "src/index.css",
      references: REFS2,
      remediation: [
        "Add the following imports to your global CSS entry (e.g. src/index.css):",
        "",
        '@import "@refineui/tokens/tailwind.css";',
        '@import "@refineui/web-icons/dist/fonts/refineui-system-icons.css";',
        '@import "@refineui/react/refineui.css";'
      ].join("\n")
    };
    return {
      check: {
        rule: "stylesheet-setup",
        category: "setup",
        status: "fail",
        evidence: `Missing: ${missingRequired.join(", ")}`,
        references: REFS2
      },
      findings: [finding]
    };
  }
};

// src/rules/foundation-contract.ts
var REFS3 = [
  "https://ui.pelagornis.com/foundations/",
  "https://ui.pelagornis.com/llms.txt"
];
var HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/;
var RGBA_PATTERN = /rgba?\(\s*\d+/;
var ARBITRARY_PX_PATTERN = /(?:^|[\s"'`])(\d+(?:\.\d+)?px)(?:[\s"'`]|$)/;
var STYLE_FILE = /\.(tsx?|jsx?|css)$/;
function isLikelyTokenLine(line) {
  return line.includes("var(--refineui") || line.includes("@refineui/tokens") || line.includes("refineui-color") || line.trim().startsWith("//") || line.trim().startsWith("*") || line.trim().startsWith("/*");
}
var foundationContractRule = {
  id: "foundation-contract",
  category: "foundations",
  run({ workspace }) {
    const codeFiles = workspace.sourceFiles.filter((f) => STYLE_FILE.test(f));
    const findings = [];
    for (const file of codeFiles) {
      const lines = readFileLines(file);
      lines.forEach((line, index) => {
        if (isLikelyTokenLine(line)) return;
        const rel = relPath(workspace.root, file);
        const lineNo = index + 1;
        if (HEX_PATTERN.test(line)) {
          findings.push({
            rule: "foundation-contract",
            severity: "warn",
            message: "Hardcoded hex color detected \u2014 use RefineUI design tokens instead",
            file: rel,
            line: lineNo,
            references: REFS3,
            remediation: "Replace hardcoded hex/rgba colors with semantic tokens (e.g. var(--refineui-color-alias-*) or Tailwind theme tokens from @refineui/tokens)."
          });
        } else if (RGBA_PATTERN.test(line)) {
          findings.push({
            rule: "foundation-contract",
            severity: "warn",
            message: "Hardcoded rgb/rgba color detected \u2014 use RefineUI design tokens instead",
            file: rel,
            line: lineNo,
            references: REFS3,
            remediation: "Replace hardcoded rgb/rgba with semantic color tokens from @refineui/tokens."
          });
        } else if (ARBITRARY_PX_PATTERN.test(line) && !line.includes("strokeWidth")) {
          findings.push({
            rule: "foundation-contract",
            severity: "info",
            message: "Arbitrary px value detected \u2014 prefer RefineUI spacing/size tokens",
            file: rel,
            line: lineNo,
            references: REFS3,
            remediation: "Use spacing, foundation size, or component size tokens instead of raw px values in component styles."
          });
        }
      });
    }
    const capped = findings.slice(0, 20);
    if (capped.length === 0) {
      return {
        check: {
          rule: "foundation-contract",
          category: "foundations",
          status: "pass",
          evidence: `Scanned ${codeFiles.length} source files \u2014 no token violations`,
          references: REFS3
        },
        findings: []
      };
    }
    const significant = capped.filter((f) => f.severity !== "info");
    if (significant.length === 0) {
      return {
        check: {
          rule: "foundation-contract",
          category: "foundations",
          status: "pass",
          evidence: `${capped.length} informational px hint(s) \u2014 no contract violations`,
          references: REFS3
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "foundation-contract",
        category: "foundations",
        status: "fail",
        evidence: `${significant.length} token contract issue(s) in ${new Set(significant.map((f) => f.file)).size} file(s)`,
        references: REFS3
      },
      findings: capped
    };
  }
};

// src/rules/composition-api.ts
var REFS4 = [
  "https://ui.pelagornis.com/components/",
  "https://ui.pelagornis.com/llm.txt"
];
var CONVENIENCE_PROPS = ["title", "description", "items", "actions", "onClose"];
function extractRefineuiImports(content) {
  const names = /* @__PURE__ */ new Set();
  const importPattern = /import\s+(?:type\s+)?(?:\{([^}]+)\}|(\w+))\s+from\s+["']@refineui\/react["']/g;
  let match;
  while ((match = importPattern.exec(content)) !== null) {
    const block = match[1];
    if (block) {
      for (const part of block.split(",")) {
        const name = part.trim().split(/\s+as\s+/)[0]?.trim();
        if (name && /^[A-Z]/.test(name)) names.add(name);
      }
    } else if (match[2]) {
      names.add(match[2]);
    }
  }
  return names;
}
var compositionApiRule = {
  id: "composition-api",
  category: "components",
  run({ workspace }) {
    const tsxFiles = workspace.sourceFiles.filter((f) => /\.tsx$/.test(f));
    const findings = [];
    for (const file of tsxFiles) {
      const content = readFileLines(file).join("\n");
      const refineuiComponents = extractRefineuiImports(content);
      if (refineuiComponents.size === 0) continue;
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        for (const component of refineuiComponents) {
          const openTag = new RegExp(`<${component}\\b`);
          if (!openTag.test(line)) continue;
          for (const prop of CONVENIENCE_PROPS) {
            const pattern = new RegExp(`\\b${prop}\\s*=`);
            if (pattern.test(line)) {
              findings.push({
                rule: "composition-api",
                severity: "warn",
                message: `Convenience prop "${prop}" on <${component}> \u2014 use composable subcomponents instead`,
                file: relPath(workspace.root, file),
                line: index + 1,
                references: REFS4,
                remediation: [
                  "RefineUI components use composable subcomponent APIs only.",
                  `Do not pass convenience props (${CONVENIENCE_PROPS.join(", ")}) to RefineUI components.`,
                  "Compose with documented subcomponents (e.g. Dialog.Title, Dialog.Content)."
                ].join("\n")
              });
            }
          }
        }
      });
    }
    const capped = findings.slice(0, 15);
    if (capped.length === 0) {
      return {
        check: {
          rule: "composition-api",
          category: "components",
          status: "pass",
          evidence: `Scanned ${tsxFiles.length} TSX files \u2014 no convenience prop usage on @refineui/react imports`,
          references: REFS4
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "composition-api",
        category: "components",
        status: "fail",
        evidence: `${capped.length} convenience prop usage(s) on RefineUI components`,
        references: REFS4
      },
      findings: capped
    };
  }
};

// src/rules/component-imports.ts
var REFS5 = [
  "https://ui.pelagornis.com/development/installation/",
  "https://ui.pelagornis.com/llms.txt"
];
var SHALLOW_IMPORT_PATTERN = /from\s+["']@refineui\/react\/(?:src\/|components\/)/;
var LEGACY_IMPORT_PATTERN = /from\s+["']refineui["']/;
var componentImportsRule = {
  id: "component-imports",
  category: "components",
  run({ workspace }) {
    const sourceFiles = workspace.sourceFiles.filter((f) => /\.(tsx?|jsx?)$/.test(f));
    const findings = [];
    for (const file of sourceFiles) {
      const lines = readFileLines(file);
      lines.forEach((line, index) => {
        if (SHALLOW_IMPORT_PATTERN.test(line)) {
          findings.push({
            rule: "component-imports",
            severity: "error",
            message: "Deep import from @refineui/react \u2014 import from the package root instead",
            file: relPath(workspace.root, file),
            line: index + 1,
            references: REFS5,
            remediation: 'Use `import { Button, ... } from "@refineui/react"` \u2014 never deep-import internal paths.'
          });
        }
        if (LEGACY_IMPORT_PATTERN.test(line)) {
          findings.push({
            rule: "component-imports",
            severity: "error",
            message: 'Legacy "refineui" import \u2014 use scoped "@refineui/react" package',
            file: relPath(workspace.root, file),
            line: index + 1,
            references: REFS5,
            remediation: 'Replace `from "refineui"` with `from "@refineui/react"`.'
          });
        }
      });
    }
    if (findings.length === 0) {
      return {
        check: {
          rule: "component-imports",
          category: "components",
          status: "pass",
          evidence: `Scanned ${sourceFiles.length} files \u2014 imports follow @refineui/react conventions`,
          references: REFS5
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "component-imports",
        category: "components",
        status: "fail",
        evidence: `${findings.length} import convention violation(s)`,
        references: REFS5
      },
      findings: findings.slice(0, 15)
    };
  }
};

// src/run.ts
var ALL_RULES = [
  packageSetupRule,
  stylesheetSetupRule,
  foundationContractRule,
  compositionApiRule,
  componentImportsRule
];
var DOCS = {
  index: "https://ui.pelagornis.com/llms.txt",
  installation: "https://ui.pelagornis.com/development/installation/",
  theming: "https://ui.pelagornis.com/development/theming/",
  doctor: "https://ui.pelagornis.com/ai-tools/doctor/"
};
function summarize(findings) {
  return findings.reduce(
    (acc, f) => {
      acc[f.severity] += 1;
      return acc;
    },
    { error: 0, warn: 0, info: 0 }
  );
}
function validateReport(report) {
  const failRules = new Set(report.checks.filter((c) => c.status === "fail").map((c) => c.rule));
  for (const finding of report.findings) {
    if (!failRules.has(finding.rule)) {
      throw new Error(`Finding rule ${finding.rule} has no matching fail check`);
    }
  }
  for (const check of report.checks.filter((c) => c.status === "fail")) {
    if (!report.findings.some((f) => f.rule === check.rule)) {
      throw new Error(`Fail check ${check.rule} has no finding`);
    }
  }
  const summary = summarize(report.findings);
  if (summary.error !== report.summary.error || summary.warn !== report.summary.warn || summary.info !== report.summary.info) {
    throw new Error("Summary does not match findings severity counts");
  }
}
function runDoctor(targetRoot, workspace, options) {
  const ctx = { docsBase: "https://ui.pelagornis.com", workspace };
  const rules = options?.categories?.length ? ALL_RULES.filter((r) => options.categories?.includes(r.category)) : ALL_RULES;
  const results = rules.map((rule) => rule.run(ctx));
  const checks = results.map((r) => r.check);
  const findings = results.flatMap((r) => r.findings);
  const report = {
    schemaVersion: 2,
    meta: {
      target: targetRoot,
      workspace: workspace.relativePath === "." ? void 0 : workspace.relativePath,
      projectKinds: workspace.projectKinds,
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      refineui: { declared: workspace.declared }
    },
    summary: summarize(findings),
    checks,
    findings,
    verdicts: [],
    coverage: [],
    rejected: []
  };
  validateReport(report);
  return report;
}
function formatRemediation(target, finding) {
  return [
    "Fix the following RefineUI Doctor finding.",
    "",
    `Target project: ${target}`,
    `File: ${finding.file}${finding.line ? `:${finding.line}` : ""}`,
    `Problem: ${finding.message}`,
    "",
    "Requirements:",
    finding.remediation.trim(),
    "",
    "References:",
    ...finding.references.map((ref) => `- ${ref}`),
    "",
    "Do not change unrelated files. Re-run `refineui-doctor` after fixing."
  ].join("\n");
}

// src/report.ts
function yamlQuote(value) {
  if (/[:#\[\]{}&*!|>'"%@`]/.test(value) || value.includes("\n")) {
    return JSON.stringify(value);
  }
  return value;
}
function indentBlock(text, spaces) {
  const pad = " ".repeat(spaces);
  return text.split("\n").map((line) => line ? pad + line : line).join("\n");
}
function reportToYaml(report) {
  const lines = [];
  lines.push("schemaVersion: 2");
  lines.push("meta:");
  lines.push(`  target: ${yamlQuote(report.meta.target)}`);
  if (report.meta.workspace) lines.push(`  workspace: ${yamlQuote(report.meta.workspace)}`);
  lines.push(`  projectKinds: [${report.meta.projectKinds.join(", ")}]`);
  lines.push(`  date: ${report.meta.date}`);
  lines.push("  refineui:");
  lines.push("    declared:");
  for (const [pkg, version] of Object.entries(report.meta.refineui.declared)) {
    lines.push(`      ${pkg}: ${yamlQuote(version)}`);
  }
  lines.push("summary:");
  lines.push(`  error: ${report.summary.error}`);
  lines.push(`  warn: ${report.summary.warn}`);
  lines.push(`  info: ${report.summary.info}`);
  lines.push("checks:");
  for (const check of report.checks) {
    lines.push(`  - rule: ${check.rule}`);
    lines.push(`    category: ${check.category}`);
    lines.push(`    status: ${check.status}`);
    if (check.evidence) lines.push(`    evidence: ${yamlQuote(check.evidence)}`);
    if (check.reason) lines.push(`    reason: ${yamlQuote(check.reason)}`);
    lines.push(`    references:`);
    for (const ref of check.references) lines.push(`      - ${yamlQuote(ref)}`);
  }
  lines.push("findings:");
  if (report.findings.length === 0) {
    lines.push("  []");
  } else {
    for (const finding of report.findings) {
      lines.push(`  - rule: ${finding.rule}`);
      lines.push(`    severity: ${finding.severity}`);
      lines.push(`    message: ${yamlQuote(finding.message)}`);
      lines.push(`    file: ${yamlQuote(finding.file)}`);
      if (finding.line) lines.push(`    line: ${finding.line}`);
      lines.push(`    references:`);
      for (const ref of finding.references) lines.push(`      - ${yamlQuote(ref)}`);
      lines.push(`    remediation: |`);
      lines.push(indentBlock(finding.remediation, 6));
    }
  }
  lines.push("verdicts: []");
  lines.push("coverage: []");
  lines.push("rejected: []");
  return `${lines.join("\n")}
`;
}
function reportToSummary(report) {
  const { error, warn, info } = report.summary;
  const ws = report.meta.workspace ?? ".";
  const lines = [
    `RefineUI Doctor \u2014 ${report.meta.date}`,
    `Target: ${report.meta.target} (${ws})`,
    `Packages: ${Object.keys(report.meta.refineui.declared).join(", ") || "none"}`,
    "",
    `Summary: ${error} error(s), ${warn} warn(s), ${info} info`,
    ""
  ];
  for (const check of report.checks) {
    const icon = check.status === "pass" ? "\u2713" : check.status === "fail" ? "\u2717" : check.status === "not-applicable" ? "\u2013" : "?";
    lines.push(`${icon} ${check.rule} (${check.status})${check.evidence ? `: ${check.evidence}` : ""}`);
  }
  if (report.findings.length > 0) {
    lines.push("");
    lines.push("Findings:");
    for (const f of report.findings.slice(0, 10)) {
      lines.push(`  [${f.severity}] ${f.file}${f.line ? `:${f.line}` : ""} \u2014 ${f.message}`);
    }
    if (report.findings.length > 10) {
      lines.push(`  \u2026 and ${report.findings.length - 10} more (see YAML report)`);
    }
  }
  return lines.join("\n");
}

export {
  discoverWorkspaces,
  readFileLines,
  relPath,
  ALL_RULES,
  DOCS,
  runDoctor,
  formatRemediation,
  reportToYaml,
  reportToSummary
};
