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

// src/accessibility-spec.ts
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
function resolveSpecRoot() {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, "../../react/spec"),
    join(here, "../../react/dist/spec"),
    join(process.cwd(), "packages/react/spec"),
    join(process.cwd(), "packages/react/dist/spec")
  ];
  for (const path3 of candidates) {
    if (existsSync(join(path3, "manifest.json"))) return path3;
  }
  return null;
}
function readJson2(path3) {
  return JSON.parse(readFileSync(path3, "utf8"));
}
var cachedSlots = null;
function loadAccessibilitySlots() {
  if (cachedSlots) return cachedSlots;
  const root = resolveSpecRoot();
  if (!root) {
    cachedSlots = [];
    return cachedSlots;
  }
  const manifest = readJson2(join(root, "manifest.json"));
  const entries = [];
  for (const item of manifest.components) {
    const specPath = join(root, item.spec.replace(/^\.\//, ""));
    if (!existsSync(specPath)) continue;
    const spec = readJson2(specPath);
    if (!spec.accessibility) continue;
    for (const [slotId, contract] of Object.entries(spec.accessibility)) {
      entries.push({ componentId: spec.component, slotId, contract });
    }
  }
  cachedSlots = entries;
  return cachedSlots;
}
function toJsxAttrNames(attr) {
  if (!attr.includes("-")) return [attr];
  const camel = attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return [attr, camel];
}
function extractAttributeExpression(content, attr) {
  for (const name of toJsxAttrNames(attr)) {
    const expr = new RegExp(`${name}=\\{([^}]+)\\}`, "s");
    const match = content.match(expr);
    if (match) return match[1].trim();
  }
  return null;
}
function extractAttributeStringLiteral(content, attr) {
  for (const name of toJsxAttrNames(attr)) {
    const dquoted = new RegExp(`${name}="([^"]*)"`);
    const squoted = new RegExp(`${name}='([^']*)'`);
    const m1 = content.match(dquoted);
    if (m1) return m1[1];
    const m2 = content.match(squoted);
    if (m2) return m2[1];
  }
  return null;
}
function hasAttribute(content, attr) {
  return extractAttributeExpression(content, attr) !== null || extractAttributeStringLiteral(content, attr) !== null;
}
function fileContainsSlot(content, slotId) {
  return content.includes(`data-refineui="${slotId}"`) || content.includes(`data-refineui={'${slotId}'}`) || content.includes(`data-refineui={"${slotId}"}`);
}
function usesNativeElement(content, element) {
  const re = new RegExp(`<${element}[\\s>]`);
  return re.test(content);
}

// src/rules/accessibility-contract.ts
var REFS6 = [
  "https://ui.pelagornis.com/ai-tools/doctor/",
  "https://ui.pelagornis.com/llms.txt"
];
var SOURCE_FILE = /\.(tsx|jsx)$/;
function push(findings, input) {
  findings.push({ rule: "accessibility-contract", ...input });
}
function validateRequiredAttributes(content, rel, componentId, slotId, requiredAttributes, findings) {
  for (const [attr, contract] of Object.entries(requiredAttributes)) {
    if (!contract.required) continue;
    const contractPath = `accessibility.${slotId}.requiredAttributes.${attr}`;
    if (!hasAttribute(content, attr)) {
      push(findings, {
        severity: "error",
        message: `Missing required accessibility attribute "${attr}" on ${slotId}`,
        file: rel,
        references: REFS6,
        remediation: [
          `Component: ${componentId}`,
          `Slot: ${slotId}`,
          `Missing required attribute: ${attr}`,
          `Contract: ${contractPath}`,
          `Expected: required: true${contract.type ? `, type: ${contract.type}` : ""}`
        ].join("\n")
      });
      continue;
    }
    if (contract.type === "boolean") {
      const literal = extractAttributeStringLiteral(content, attr);
      if (literal !== null) {
        push(findings, {
          severity: "error",
          message: `Invalid type for "${attr}" \u2014 boolean expression required, string literal found`,
          file: rel,
          references: REFS6,
          remediation: [
            `Component: ${componentId}`,
            `Slot: ${slotId}`,
            `Attribute: ${attr}`,
            `Received: "${literal}" (string literal)`,
            `Contract: ${contractPath}`,
            `Expected: aria-expanded={boolean} \u2014 canonical RefineUI form`
          ].join("\n")
        });
      } else if (extractAttributeExpression(content, attr) === null) {
        push(findings, {
          severity: "error",
          message: `Invalid type for "${attr}" \u2014 expected boolean JSX expression`,
          file: rel,
          references: REFS6,
          remediation: [
            `Component: ${componentId}`,
            `Slot: ${slotId}`,
            `Attribute: ${attr}`,
            `Contract: ${contractPath}`,
            `Expected: {boolean expression} e.g. aria-expanded={open}`
          ].join("\n")
        });
      }
    }
    if (contract.type === "string") {
      const literal = extractAttributeStringLiteral(content, attr);
      const expr = extractAttributeExpression(content, attr);
      if (literal === null && expr === null) {
        push(findings, {
          severity: "error",
          message: `Invalid type for "${attr}" \u2014 expected string expression or id reference`,
          file: rel,
          references: REFS6,
          remediation: [
            `Component: ${componentId}`,
            `Slot: ${slotId}`,
            `Attribute: ${attr}`,
            `Contract: ${contractPath}`,
            `Expected: type string (expression referencing id/token)`
          ].join("\n")
        });
      }
    }
  }
}
function validateNativeElement(content, rel, componentId, slotId, contract, findings) {
  if (!contract.native || contract.element !== "button") return;
  if (!fileContainsSlot(content, slotId)) return;
  if (!usesNativeElement(content, "button")) {
    push(findings, {
      severity: "error",
      message: `Native button contract violated on ${slotId}`,
      file: rel,
      references: REFS6,
      remediation: [
        `Component: ${componentId}`,
        `Slot: ${slotId}`,
        `Contract: accessibility.${slotId}.native = true`,
        `Expected: <button data-refineui="${slotId}"> \u2014 not <div role="button">`
      ].join("\n")
    });
  }
}
function validateRelationships(slotFiles, componentId, slotId, relationships, findings) {
  const source = slotFiles.get(slotId);
  if (!source) return;
  for (const relContract of relationships) {
    if (!relContract.required) continue;
    const sourceExpr = extractAttributeExpression(source.content, relContract.attribute);
    if (!sourceExpr) continue;
    const target = slotFiles.get(relContract.target);
    if (!target) {
      push(findings, {
        severity: "error",
        message: `Accessibility relationship target file missing for ${relContract.target}`,
        file: source.rel,
        references: REFS6,
        remediation: [
          `Component: ${componentId}`,
          `${relContract.attribute} on ${slotId} requires target slot ${relContract.target}`,
          `Expected: implementation file with data-refineui="${relContract.target}"`
        ].join("\n")
      });
      continue;
    }
    const targetAttr = relContract.targetAttribute ?? "id";
    const targetExpr = extractAttributeExpression(target.content, targetAttr);
    if (!targetExpr) {
      push(findings, {
        severity: "error",
        message: `Target ${targetAttr} missing on ${relContract.target}`,
        file: target.rel,
        references: REFS6,
        remediation: [
          `Component: ${componentId}`,
          `Relationship: ${slotId}.${relContract.attribute} \u2192 ${relContract.target}.${targetAttr}`,
          `Contract: accessibility.${slotId}.relationships`
        ].join("\n")
      });
      continue;
    }
    if (sourceExpr !== targetExpr) {
      push(findings, {
        severity: "error",
        message: `Accessibility relationship mismatch: ${relContract.attribute} \u2194 ${targetAttr}`,
        file: source.rel,
        references: REFS6,
        remediation: [
          `Component: ${componentId}`,
          `${slotId}.${relContract.attribute}={${sourceExpr}}`,
          `${relContract.target}.${targetAttr}={${targetExpr}}`,
          `Expected: both expressions must reference the same id token`,
          `Contract: accessibility.${slotId}.relationships`
        ].join("\n")
      });
    }
  }
}
var accessibilityContractRule = {
  id: "accessibility-contract",
  category: "accessibility",
  run({ workspace }) {
    const slots = loadAccessibilitySlots();
    const findings = [];
    if (slots.length === 0) {
      return {
        check: {
          rule: "accessibility-contract",
          category: "accessibility",
          status: "not-verified",
          reason: "Component spec accessibility contracts not found",
          references: REFS6
        },
        findings: []
      };
    }
    const sourceFiles = workspace.sourceFiles.filter((f) => SOURCE_FILE.test(f));
    const slotIds = new Set(slots.map((s) => s.slotId));
    const slotFiles = /* @__PURE__ */ new Map();
    for (const file of sourceFiles) {
      const content = readFileLines(file).join("\n");
      const rel = relPath(workspace.root, file);
      for (const slotId of slotIds) {
        if (fileContainsSlot(content, slotId) && !slotFiles.has(slotId)) {
          slotFiles.set(slotId, { rel, content });
        }
      }
    }
    const slotsByComponent = /* @__PURE__ */ new Map();
    for (const entry of slots) {
      const list = slotsByComponent.get(entry.componentId) ?? [];
      list.push(entry);
      slotsByComponent.set(entry.componentId, list);
    }
    let validatedSlots = 0;
    for (const entry of slots) {
      const file = slotFiles.get(entry.slotId);
      if (!file) continue;
      validatedSlots += 1;
      validateNativeElement(
        file.content,
        file.rel,
        entry.componentId,
        entry.slotId,
        entry.contract,
        findings
      );
      if (entry.contract.requiredAttributes) {
        validateRequiredAttributes(
          file.content,
          file.rel,
          entry.componentId,
          entry.slotId,
          entry.contract.requiredAttributes,
          findings
        );
      }
    }
    for (const [componentId, componentSlots] of slotsByComponent) {
      const relSlots = componentSlots.filter((s) => slotFiles.has(s.slotId));
      if (relSlots.length === 0) continue;
      for (const entry of relSlots) {
        if (!entry.contract.relationships?.length) continue;
        validateRelationships(
          slotFiles,
          componentId,
          entry.slotId,
          entry.contract.relationships,
          findings
        );
      }
    }
    const capped = findings.slice(0, 25);
    if (validatedSlots === 0) {
      return {
        check: {
          rule: "accessibility-contract",
          category: "accessibility",
          status: "not-applicable",
          evidence: "No component implementation files with declared accessibility slots in this workspace",
          references: REFS6
        },
        findings: []
      };
    }
    if (capped.length === 0) {
      return {
        check: {
          rule: "accessibility-contract",
          category: "accessibility",
          status: "pass",
          evidence: `Validated declared accessibility contracts on ${validatedSlots} slot(s)`,
          references: REFS6
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "accessibility-contract",
        category: "accessibility",
        status: "fail",
        evidence: `${capped.length} accessibility contract violation(s)`,
        references: REFS6
      },
      findings: capped
    };
  }
};

// src/keyboard-spec.ts
import { existsSync as existsSync2, readFileSync as readFileSync2, readdirSync } from "fs";
import { dirname as dirname2, join as join2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
function resolveSpecRoot2() {
  const here = dirname2(fileURLToPath2(import.meta.url));
  const candidates = [
    join2(here, "../../react/spec"),
    join2(here, "../../react/dist/spec"),
    join2(process.cwd(), "packages/react/spec"),
    join2(process.cwd(), "packages/react/dist/spec")
  ];
  for (const path3 of candidates) {
    if (existsSync2(join2(path3, "manifest.json"))) return path3;
  }
  return null;
}
function readJson3(path3) {
  return JSON.parse(readFileSync2(path3, "utf8"));
}
function normalizeBinding(raw) {
  if (typeof raw === "string") return { action: raw };
  return raw;
}
var cached = null;
function loadKeyboardContracts() {
  if (cached) return cached;
  const root = resolveSpecRoot2();
  if (!root) {
    cached = [];
    return cached;
  }
  const manifest = readJson3(join2(root, "manifest.json"));
  const entries = [];
  for (const item of manifest.components) {
    const specPath = join2(root, item.spec.replace(/^\.\//, ""));
    if (!existsSync2(specPath)) continue;
    const spec = readJson3(specPath);
    if (!spec.keyboard || Object.keys(spec.keyboard).length === 0) continue;
    const bindings = {};
    for (const [key, raw] of Object.entries(spec.keyboard)) {
      bindings[key] = normalizeBinding(raw);
    }
    entries.push({
      componentId: spec.component,
      exportName: item.export,
      dataRefineui: item.dataRefineui,
      bindings
    });
  }
  cached = entries;
  return cached;
}
function collectComponentSources(workspaceRoot, exportName) {
  const dir = join2(workspaceRoot, "src/components", exportName);
  if (!existsSync2(dir)) return [];
  const files = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join2(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx|jsx|ts)$/.test(entry.name)) files.push(full);
    }
  };
  walk(dir);
  return files;
}
function readWorkspaceFile(path3) {
  if (!existsSync2(path3)) return "";
  return readFileSync2(path3, "utf8");
}
function hasKeyHandler(content, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`case\\s+["']${escaped}["']`).test(content) || new RegExp(`\\.key\\s*===\\s*["']${escaped}["']`).test(content) || new RegExp(`key\\s*===\\s*["']${escaped}["']`).test(content);
}
var ACTION_PATTERNS = {
  activate: [/<button[\s>]/, /role=["'](?:option|menuitem|tab|radio|switch)["']/],
  close: [
    /["']Escape["'][\s\S]{0,200}setOpen\s*\(\s*false/,
    /key\s*===\s*["']Escape["'][\s\S]{0,160}setOpen\s*\(\s*false/,
    /key\s*===\s*["']Escape["'][\s\S]{0,120}hide\s*\(/,
    /["']Escape["'][\s\S]{0,120}&&\s*setOpen\s*\(\s*false/,
    /["']Escape["'][\s\S]{0,120}&&\s*hide\s*\(/,
    /["']Escape["'][\s\S]{0,120}close\s*\(/,
    /["']Escape["'][\s\S]{0,160}setValueSafe\s*\(/,
    /["']Escape["'][\s\S]{0,120}setValue\s*\(\s*["']["']\s*\)/,
    /["']Escape["'][\s\S]{0,120}clear\s*\(/
  ],
  "first-trigger": [
    /focusFirst\s*\(/,
    /focusTrigger\s*\(\s*0\s*\)/,
    /case\s+["']Home["'][\s\S]{0,280}\??\.focus\s*\(/,
    /["']Home["'][\s\S]{0,280}\??\.focus\s*\(/,
    /setActiveIndex\s*\(\s*(?:enabledItems\.length\s*>\s*0\s*\?\s*)?0/,
    /scrollTo\s*\(\s*0\s*\)/,
    /["']Home["'][\s\S]{0,400}setSelectedValue/,
    /case\s+["']Home["'][\s\S]{0,280}minSize/
  ],
  "last-trigger": [
    /focusLast\s*\(/,
    /case\s+["']End["'][\s\S]{0,280}\??\.focus\s*\(/,
    /["']End["'][\s\S]{0,280}\??\.focus\s*\(/,
    /setActiveIndex\s*\(\s*enabledItems\.length\s*-\s*1/,
    /scrollTo\s*\(\s*(?:Math\.max\s*\(\s*0\s*,\s*)?count\s*-\s*1/,
    /["']End["'][\s\S]{0,400}setSelectedValue/,
    /case\s+["']End["'][\s\S]{0,600}maxSize/,
    /case\s+["']End["'][\s\S]{0,280}pairSum/
  ],
  "next-trigger": [
    /focusByDelta\([^,]+,\s*1\)/,
    /focusNext/i,
    /moveFocus\s*\(\s*1\s*\)/,
    /moveSelection\s*\(\s*1\s*\)/,
    /scrollNext\s*\(/,
    /setActiveIndex\s*\(\s*\(prev\)\s*=>\s*Math\.min/,
    /focusAt\s*\(\s*index\s*\+\s*1\s*\)/
  ],
  "previous-trigger": [
    /focusByDelta\([^,]+,\s*-1\)/,
    /focusPrevious/i,
    /moveFocus\s*\(\s*-1\s*\)/,
    /moveSelection\s*\(\s*-1\s*\)/,
    /scrollPrev\s*\(/,
    /setActiveIndex\s*\(\s*\(prev\)\s*=>\s*Math\.max/,
    /focusAt\s*\(\s*index\s*-\s*1\s*\)/
  ]
};
function hasActionPattern(content, action) {
  const patterns = ACTION_PATTERNS[action];
  return patterns.some((pattern) => pattern.test(content));
}
function isFullyNativeKeyboard(bindings) {
  const values = Object.values(bindings);
  return values.length > 0 && values.every((b) => b.native === true);
}

// src/rules/keyboard-contract.ts
var REFS7 = [
  "https://ui.pelagornis.com/ai-tools/doctor/",
  "https://ui.pelagornis.com/llms.txt"
];
function push2(findings, input) {
  findings.push({ rule: "keyboard-contract", ...input });
}
var keyboardContractRule = {
  id: "keyboard-contract",
  category: "accessibility",
  run({ workspace }) {
    const contracts = loadKeyboardContracts();
    const findings = [];
    if (contracts.length === 0) {
      return {
        check: {
          rule: "keyboard-contract",
          category: "accessibility",
          status: "not-verified",
          reason: "Component spec keyboard contracts not found",
          references: REFS7
        },
        findings: []
      };
    }
    let validatedComponents = 0;
    for (const entry of contracts) {
      const sourcePaths = collectComponentSources(workspace.root, entry.exportName);
      if (sourcePaths.length === 0) continue;
      validatedComponents += 1;
      const content = sourcePaths.map((file) => readWorkspaceFile(file)).join("\n");
      const primaryFile = relPath(workspace.root, sourcePaths[0]);
      if (isFullyNativeKeyboard(entry.bindings)) continue;
      for (const [key, binding] of Object.entries(entry.bindings)) {
        if (binding.native) continue;
        const contractPath = `keyboard.${key}`;
        if (!hasKeyHandler(content, key)) {
          push2(findings, {
            severity: "error",
            message: `Keyboard contract violation \u2014 missing handler for "${key}"`,
            file: primaryFile,
            references: REFS7,
            remediation: [
              `Component: ${entry.componentId}`,
              `Key: ${key}`,
              `Expected: ${binding.action}`,
              `Received: none`,
              `Contract: ${contractPath}`
            ].join("\n")
          });
          continue;
        }
        if (!hasActionPattern(content, binding.action)) {
          push2(findings, {
            severity: "error",
            message: `Keyboard contract violation \u2014 "${key}" does not implement "${binding.action}"`,
            file: primaryFile,
            references: REFS7,
            remediation: [
              `Component: ${entry.componentId}`,
              `Key: ${key}`,
              `Expected action: ${binding.action}`,
              `Contract: ${contractPath}`,
              `Ensure the key handler implements the declared action pattern.`
            ].join("\n")
          });
        }
      }
    }
    const capped = findings.slice(0, 25);
    if (validatedComponents === 0) {
      return {
        check: {
          rule: "keyboard-contract",
          category: "accessibility",
          status: "not-applicable",
          evidence: "No component implementation directories match declared keyboard contracts",
          references: REFS7
        },
        findings: []
      };
    }
    if (capped.length === 0) {
      return {
        check: {
          rule: "keyboard-contract",
          category: "accessibility",
          status: "pass",
          evidence: `Validated keyboard contracts on ${validatedComponents} component(s)`,
          references: REFS7
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "keyboard-contract",
        category: "accessibility",
        status: "fail",
        evidence: `${capped.length} keyboard contract violation(s)`,
        references: REFS7
      },
      findings: capped
    };
  }
};

// src/rules/focus-contract.ts
import { join as join4 } from "path";

// src/focus-spec.ts
import { existsSync as existsSync3, readFileSync as readFileSync3 } from "fs";
import { dirname as dirname3, join as join3 } from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
function resolveSpecRoot3() {
  const here = dirname3(fileURLToPath3(import.meta.url));
  const candidates = [
    join3(here, "../../react/spec"),
    join3(here, "../../react/dist/spec"),
    join3(process.cwd(), "packages/react/spec"),
    join3(process.cwd(), "packages/react/dist/spec")
  ];
  for (const path3 of candidates) {
    if (existsSync3(join3(path3, "manifest.json"))) return path3;
  }
  return null;
}
function readJson4(path3) {
  return JSON.parse(readFileSync3(path3, "utf8"));
}
function specDeclaresFocusVisible(spec) {
  if (spec.states?.pseudo?.includes("focus-visible")) return true;
  if (!spec.dom) return false;
  return Object.values(spec.dom).some((slot) => slot.states?.pseudo?.includes("focus-visible"));
}
var cached2 = null;
function loadFocusContracts() {
  if (cached2) return cached2;
  const root = resolveSpecRoot3();
  if (!root) {
    cached2 = [];
    return cached2;
  }
  const manifest = readJson4(join3(root, "manifest.json"));
  const entries = [];
  for (const item of manifest.components) {
    const specPath = join3(root, item.spec.replace(/^\.\//, ""));
    if (!existsSync3(specPath)) continue;
    const spec = readJson4(specPath);
    if (!spec.focus) continue;
    entries.push({
      componentId: spec.component,
      exportName: item.export,
      dataRefineui: item.dataRefineui,
      focus: spec.focus,
      declaresFocusVisiblePseudo: specDeclaresFocusVisible(spec)
    });
  }
  cached2 = entries;
  return cached2;
}
function hasFocusVisibleVisualContract(dataRefineui, cssContent, componentContent, declaresFocusVisiblePseudo) {
  for (const slot of dataRefineui) {
    if (cssContent.includes(`[data-refineui="${slot}"]:focus-visible`)) return true;
  }
  if (/focus-visible/.test(componentContent)) return true;
  if (declaresFocusVisiblePseudo && cssContent.includes(":focus-visible")) {
    for (const slot of dataRefineui) {
      if (cssContent.includes(`[data-refineui="${slot}"]`) && cssContent.includes(":focus-visible")) {
        return true;
      }
    }
  }
  if (/<Button\b/.test(componentContent) && cssContent.includes('[data-refineui="button"]:focus-visible')) {
    return true;
  }
  return false;
}
function hasFocusTrapPattern(componentContent) {
  return /useFocusTrap\s*\(/.test(componentContent);
}
function hasFocusReturnPattern(componentContent, hookContent) {
  return /previousFocus/.test(componentContent) || /useFocusTrap/.test(componentContent) && /previousFocus/.test(hookContent);
}
function hasFocusInitialPattern(componentContent, hookContent) {
  return /focusableIn/.test(componentContent) || /useFocusTrap/.test(componentContent) && (/nodes\[0\]/.test(hookContent) || /focusableIn/.test(hookContent));
}
function resolveFocusTrapHookPath(workspaceRoot) {
  const candidates = [
    join3(workspaceRoot, "src/hooks/useFocusTrap.ts"),
    join3(workspaceRoot, "src/hooks/useFocusTrap.tsx")
  ];
  for (const path3 of candidates) {
    if (existsSync3(path3)) return path3;
  }
  return null;
}
function readFileIfExists(path3) {
  if (!path3 || !existsSync3(path3)) return "";
  return readFileSync3(path3, "utf8");
}

// src/rules/focus-contract.ts
var REFS8 = [
  "https://ui.pelagornis.com/ai-tools/doctor/",
  "https://ui.pelagornis.com/llms.txt"
];
function push3(findings, input) {
  findings.push({ rule: "focus-contract", ...input });
}
var focusContractRule = {
  id: "focus-contract",
  category: "accessibility",
  run({ workspace }) {
    const contracts = loadFocusContracts();
    const findings = [];
    if (contracts.length === 0) {
      return {
        check: {
          rule: "focus-contract",
          category: "accessibility",
          status: "not-verified",
          reason: "Component spec focus contracts not found",
          references: REFS8
        },
        findings: []
      };
    }
    const cssContent = readWorkspaceFile(join4(workspace.root, "refineui.css"));
    const hookPath = resolveFocusTrapHookPath(workspace.root);
    const hookContent = readFileIfExists(hookPath);
    let validatedComponents = 0;
    for (const entry of contracts) {
      const sourcePaths = collectComponentSources(workspace.root, entry.exportName);
      if (sourcePaths.length === 0) continue;
      validatedComponents += 1;
      const componentContent = sourcePaths.map((file) => readWorkspaceFile(file)).join("\n");
      const primaryFile = relPath(workspace.root, sourcePaths[0]);
      const { visual, behavior } = entry.focus;
      if (visual?.required && visual.selector === ":focus-visible") {
        if (!hasFocusVisibleVisualContract(
          entry.dataRefineui,
          cssContent,
          componentContent,
          entry.declaresFocusVisiblePseudo
        )) {
          push3(findings, {
            severity: "error",
            message: `Focus visual contract violation \u2014 :focus-visible pattern not found`,
            file: primaryFile,
            references: REFS8,
            remediation: [
              `Component: ${entry.componentId}`,
              `Contract: focus.visual`,
              `Expected: ${visual.selector} styling for interactive slots`,
              `Add refineui.css :focus-visible rules or focus-visible utility classes.`
            ].join("\n")
          });
        }
      }
      if (behavior?.trap) {
        if (!hasFocusTrapPattern(componentContent)) {
          push3(findings, {
            severity: "error",
            message: `Focus behavior contract violation \u2014 focus trap pattern not found`,
            file: primaryFile,
            references: REFS8,
            remediation: [
              `Component: ${entry.componentId}`,
              `Contract: focus.behavior.trap = true`,
              `Expected: useFocusTrap(...) or equivalent trap implementation`
            ].join("\n")
          });
        }
      }
      if (behavior?.initial === "first-focusable") {
        if (!hasFocusInitialPattern(componentContent, hookContent)) {
          push3(findings, {
            severity: "error",
            message: `Focus behavior contract violation \u2014 initial focus pattern not found`,
            file: primaryFile,
            references: REFS8,
            remediation: [
              `Component: ${entry.componentId}`,
              `Contract: focus.behavior.initial = first-focusable`,
              `Expected: focus first focusable element on open (e.g. useFocusTrap hook)`
            ].join("\n")
          });
        }
      }
      if (behavior?.return === "trigger") {
        if (!hasFocusReturnPattern(componentContent, hookContent)) {
          push3(findings, {
            severity: "error",
            message: `Focus behavior contract violation \u2014 focus return pattern not found`,
            file: primaryFile,
            references: REFS8,
            remediation: [
              `Component: ${entry.componentId}`,
              `Contract: focus.behavior.return = trigger`,
              `Expected: restore focus to trigger on close (e.g. previousFocus in useFocusTrap)`
            ].join("\n")
          });
        }
      }
    }
    const capped = findings.slice(0, 25);
    if (validatedComponents === 0) {
      return {
        check: {
          rule: "focus-contract",
          category: "accessibility",
          status: "not-applicable",
          evidence: "No component implementation directories match declared focus contracts",
          references: REFS8
        },
        findings: []
      };
    }
    if (capped.length === 0) {
      return {
        check: {
          rule: "focus-contract",
          category: "accessibility",
          status: "pass",
          evidence: `Validated focus contracts on ${validatedComponents} component(s)`,
          references: REFS8
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "focus-contract",
        category: "accessibility",
        status: "fail",
        evidence: `${capped.length} focus contract violation(s)`,
        references: REFS8
      },
      findings: capped
    };
  }
};

// src/rules/environment-contract.ts
import { join as join6 } from "path";

// src/environment-spec.ts
import { existsSync as existsSync4, readFileSync as readFileSync4 } from "fs";
import { dirname as dirname4, join as join5 } from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
function resolveSpecRoot4() {
  const here = dirname4(fileURLToPath4(import.meta.url));
  const candidates = [
    join5(here, "../../react/spec"),
    join5(here, "../../react/dist/spec"),
    join5(process.cwd(), "packages/react/spec"),
    join5(process.cwd(), "packages/react/dist/spec")
  ];
  for (const path3 of candidates) {
    if (existsSync4(join5(path3, "manifest.json"))) return path3;
  }
  return null;
}
function readJson5(path3) {
  return JSON.parse(readFileSync4(path3, "utf8"));
}
function collectEnvironments(spec) {
  const values = /* @__PURE__ */ new Set();
  for (const env of spec.states?.environment ?? []) values.add(env);
  if (spec.dom) {
    for (const slot of Object.values(spec.dom)) {
      for (const env of slot.states?.environment ?? []) values.add(env);
    }
  }
  return Array.from(values);
}
var cached3 = null;
function loadEnvironmentContracts() {
  if (cached3) return cached3;
  const root = resolveSpecRoot4();
  if (!root) {
    cached3 = [];
    return cached3;
  }
  const manifest = readJson5(join5(root, "manifest.json"));
  const entries = [];
  for (const item of manifest.components) {
    const specPath = join5(root, item.spec.replace(/^\.\//, ""));
    if (!existsSync4(specPath)) continue;
    const spec = readJson5(specPath);
    const environments = collectEnvironments(spec);
    if (environments.length === 0) continue;
    entries.push({
      componentId: spec.component,
      exportName: item.export,
      dataRefineui: item.dataRefineui,
      environments
    });
  }
  cached3 = entries;
  return cached3;
}
function extractMediaBlock(css, marker) {
  const start = css.indexOf(marker);
  if (start < 0) return null;
  const braceStart = css.indexOf("{", start);
  if (braceStart < 0) return null;
  let depth = 0;
  for (let i = braceStart; i < css.length; i += 1) {
    const ch = css[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(braceStart + 1, i);
    }
  }
  return null;
}
function extractForcedColorsBlock(css) {
  return extractMediaBlock(css, "@media (forced-colors: active)");
}
function extractPrefersContrastBlock(css) {
  return extractMediaBlock(css, "@media (prefers-contrast: more)");
}
function blockReferencesSlot(block, slotId) {
  return block.includes(`data-refineui="${slotId}"`) || block.includes(`data-refineui='${slotId}'`);
}
function interactiveSlotsForForcedColors(dataRefineui) {
  const preferred = dataRefineui.filter(
    (id) => id === "button" || id === "alert" || id === "dialog" || id.endsWith("-trigger")
  );
  return preferred.length > 0 ? preferred : [...dataRefineui].slice(0, 1);
}

// src/rules/environment-contract.ts
var REFS9 = [
  "https://ui.pelagornis.com/ai-tools/doctor/",
  "https://ui.pelagornis.com/llms.txt"
];
function push4(findings, input) {
  findings.push({ rule: "environment-contract", ...input });
}
var environmentContractRule = {
  id: "environment-contract",
  category: "accessibility",
  run({ workspace }) {
    const contracts = loadEnvironmentContracts();
    const findings = [];
    if (contracts.length === 0) {
      return {
        check: {
          rule: "environment-contract",
          category: "accessibility",
          status: "not-verified",
          reason: "Component spec environment contracts not found",
          references: REFS9
        },
        findings: []
      };
    }
    const forcedColorEntries = contracts.filter(
      (entry) => entry.environments.includes("forced-colors")
    );
    const prefersContrastEntries = contracts.filter(
      (entry) => entry.environments.includes("prefers-contrast")
    );
    if (forcedColorEntries.length === 0 && prefersContrastEntries.length === 0) {
      return {
        check: {
          rule: "environment-contract",
          category: "accessibility",
          status: "not-applicable",
          evidence: "No forced-colors / prefers-contrast environment contracts declared",
          references: REFS9
        },
        findings: []
      };
    }
    const cssPath = join6(workspace.root, "refineui.css");
    const cssContent = readWorkspaceFile(cssPath);
    const cssRel = existsRelative(workspace.root, "refineui.css") ? relPath(workspace.root, cssPath) : "refineui.css";
    if (!cssContent) {
      push4(findings, {
        severity: "error",
        message: "environment contracts require refineui.css",
        file: cssRel,
        references: REFS9,
        remediation: [
          "Contract: states.environment includes forced-colors and/or prefers-contrast",
          "Expected: packages/react/refineui.css with matching @media blocks"
        ].join("\n")
      });
      return {
        check: {
          rule: "environment-contract",
          category: "accessibility",
          status: "fail",
          evidence: "1 environment contract violation(s)",
          references: REFS9
        },
        findings
      };
    }
    if (forcedColorEntries.length > 0) {
      const forcedBlock = extractForcedColorsBlock(cssContent);
      if (!forcedBlock) {
        push4(findings, {
          severity: "error",
          message: "Missing @media (forced-colors: active) block",
          file: cssRel,
          references: REFS9,
          remediation: [
            "Contract: states.environment = forced-colors",
            "Expected: @media (forced-colors: active) { ... } in refineui.css",
            "Use system colors (Highlight, CanvasText, ButtonBorder) \u2014 not theme aliases."
          ].join("\n")
        });
      } else {
        for (const entry of forcedColorEntries) {
          const slots = interactiveSlotsForForcedColors(entry.dataRefineui);
          for (const slot of slots) {
            if (!blockReferencesSlot(forcedBlock, slot)) {
              push4(findings, {
                severity: "error",
                message: `forced-colors CSS missing slot "${slot}"`,
                file: cssRel,
                references: REFS9,
                remediation: [
                  `Component: ${entry.componentId}`,
                  `Slot: ${slot}`,
                  `Contract: states.environment includes forced-colors`,
                  `Expected: [data-refineui="${slot}"] rules inside @media (forced-colors: active)`
                ].join("\n")
              });
            }
          }
        }
      }
    }
    if (prefersContrastEntries.length > 0) {
      const contrastBlock = extractPrefersContrastBlock(cssContent);
      if (!contrastBlock) {
        push4(findings, {
          severity: "error",
          message: "Missing @media (prefers-contrast: more) block",
          file: cssRel,
          references: REFS9,
          remediation: [
            "Contract: states.environment = prefers-contrast",
            "Expected: @media (prefers-contrast: more) { ... } in refineui.css"
          ].join("\n")
        });
      } else {
        for (const entry of prefersContrastEntries) {
          const slots = interactiveSlotsForForcedColors(entry.dataRefineui);
          for (const slot of slots) {
            if (!blockReferencesSlot(contrastBlock, slot)) {
              push4(findings, {
                severity: "error",
                message: `prefers-contrast CSS missing slot "${slot}"`,
                file: cssRel,
                references: REFS9,
                remediation: [
                  `Component: ${entry.componentId}`,
                  `Slot: ${slot}`,
                  `Contract: states.environment includes prefers-contrast`,
                  `Expected: [data-refineui="${slot}"] rules inside @media (prefers-contrast: more)`
                ].join("\n")
              });
            }
          }
        }
      }
    }
    const capped = findings.slice(0, 25);
    const validatedCount = forcedColorEntries.length + prefersContrastEntries.length;
    if (capped.length === 0) {
      return {
        check: {
          rule: "environment-contract",
          category: "accessibility",
          status: "pass",
          evidence: `Validated environment contracts on ${validatedCount} component declaration(s) (forced-colors: ${forcedColorEntries.length}, prefers-contrast: ${prefersContrastEntries.length})`,
          references: REFS9
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "environment-contract",
        category: "accessibility",
        status: "fail",
        evidence: `${capped.length} environment contract violation(s)`,
        references: REFS9
      },
      findings: capped
    };
  }
};
function existsRelative(root, file) {
  return readWorkspaceFile(join6(root, file)).length > 0;
}

// src/layout-spec.ts
import { existsSync as existsSync5, readFileSync as readFileSync5 } from "fs";
import { dirname as dirname5, join as join7 } from "path";
import { fileURLToPath as fileURLToPath5 } from "url";
function resolveSpecRoot5() {
  const here = dirname5(fileURLToPath5(import.meta.url));
  const candidates = [
    join7(here, "../../react/spec"),
    join7(here, "../../react/dist/spec"),
    join7(process.cwd(), "packages/react/spec"),
    join7(process.cwd(), "packages/react/dist/spec")
  ];
  for (const path3 of candidates) {
    if (existsSync5(join7(path3, "manifest.json"))) return path3;
  }
  return null;
}
function readJson6(path3) {
  return JSON.parse(readFileSync5(path3, "utf8"));
}
var cached4 = null;
function loadLayoutContracts() {
  if (cached4) return cached4;
  const root = resolveSpecRoot5();
  if (!root) {
    cached4 = [];
    return cached4;
  }
  const manifest = readJson6(join7(root, "manifest.json"));
  const entries = [];
  for (const item of manifest.components) {
    const specPath = join7(root, item.spec.replace(/^\.\//, ""));
    if (!existsSync5(specPath)) continue;
    const spec = readJson6(specPath);
    if (!spec.layout) continue;
    if (spec.layout.direction !== "logical" && spec.layout.rtl !== true) continue;
    entries.push({
      componentId: spec.component,
      exportName: item.export,
      layout: spec.layout
    });
  }
  cached4 = entries;
  return cached4;
}
var PHYSICAL_DIRECTION_PATTERNS = [
  { id: "text-left", pattern: /\btext-left\b/, expected: "text-start" },
  { id: "text-right", pattern: /\btext-right\b/, expected: "text-end" },
  { id: "pl-*", pattern: /\bpl-(?!\[)/, expected: "ps-*" },
  { id: "pr-*", pattern: /\bpr-(?!\[)/, expected: "pe-*" },
  { id: "ml-*", pattern: /\bml-(?!\[)/, expected: "ms-*" },
  { id: "mr-*", pattern: /\bmr-(?!\[)/, expected: "me-*" },
  { id: "left-*", pattern: /\bleft-(?!\[)/, expected: "start-* / inset-inline-start" },
  { id: "right-*", pattern: /\bright-(?!\[)/, expected: "end-* / inset-inline-end" },
  { id: "padding-left", pattern: /\bpadding-left\b/, expected: "padding-inline-start" },
  { id: "padding-right", pattern: /\bpadding-right\b/, expected: "padding-inline-end" },
  { id: "margin-left", pattern: /\bmargin-left\b/, expected: "margin-inline-start" },
  { id: "margin-right", pattern: /\bmargin-right\b/, expected: "margin-inline-end" },
  { id: "border-left", pattern: /\bborder-left\b/, expected: "border-inline-start" },
  { id: "border-right", pattern: /\bborder-right\b/, expected: "border-inline-end" },
  { id: "rounded-l", pattern: /\brounded-l(?:-\w+)?\b/, expected: "rounded-s*" },
  { id: "rounded-r", pattern: /\brounded-r(?:-\w+)?\b/, expected: "rounded-e*" }
];
function findPhysicalDirectionHits(content) {
  const hits = [];
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;
    for (const rule of PHYSICAL_DIRECTION_PATTERNS) {
      if (!rule.pattern.test(line)) continue;
      hits.push({
        id: rule.id,
        expected: rule.expected,
        line: index + 1,
        snippet: trimmed.slice(0, 120)
      });
    }
  });
  return hits;
}

// src/rules/layout-contract.ts
var REFS10 = [
  "https://ui.pelagornis.com/ai-tools/doctor/",
  "https://ui.pelagornis.com/llms.txt"
];
function push5(findings, input) {
  findings.push({ rule: "layout-contract", ...input });
}
var layoutContractRule = {
  id: "layout-contract",
  category: "accessibility",
  run({ workspace }) {
    const contracts = loadLayoutContracts();
    const findings = [];
    if (contracts.length === 0) {
      return {
        check: {
          rule: "layout-contract",
          category: "accessibility",
          status: "not-verified",
          reason: "Component spec layout contracts not found",
          references: REFS10
        },
        findings: []
      };
    }
    let validatedComponents = 0;
    for (const entry of contracts) {
      const sourcePaths = collectComponentSources(workspace.root, entry.exportName);
      if (sourcePaths.length === 0) continue;
      validatedComponents += 1;
      for (const file of sourcePaths) {
        const content = readWorkspaceFile(file);
        const rel = relPath(workspace.root, file);
        const hits = findPhysicalDirectionHits(content);
        for (const hit of hits) {
          push5(findings, {
            severity: "error",
            message: `Layout contract violation \u2014 physical direction utility "${hit.id}"`,
            file: rel,
            line: hit.line,
            references: REFS10,
            remediation: [
              `Component: ${entry.componentId}`,
              `Contract: layout.direction=logical` + (entry.layout.rtl ? ", layout.rtl=true" : ""),
              `Found: ${hit.id}`,
              `Expected: ${hit.expected}`,
              `Snippet: ${hit.snippet}`,
              `Use logical Tailwind (ps/pe/ms/me/text-start) or CSS logical properties.`
            ].join("\n")
          });
        }
      }
    }
    const capped = findings.slice(0, 25);
    if (validatedComponents === 0) {
      return {
        check: {
          rule: "layout-contract",
          category: "accessibility",
          status: "not-applicable",
          evidence: "No component implementation directories match declared layout contracts",
          references: REFS10
        },
        findings: []
      };
    }
    if (capped.length === 0) {
      return {
        check: {
          rule: "layout-contract",
          category: "accessibility",
          status: "pass",
          evidence: `Validated layout/RTL contracts on ${validatedComponents} component(s)`,
          references: REFS10
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "layout-contract",
        category: "accessibility",
        status: "fail",
        evidence: `${capped.length} layout contract violation(s)`,
        references: REFS10
      },
      findings: capped
    };
  }
};

// src/component-spec.ts
import { existsSync as existsSync6, readFileSync as readFileSync6 } from "fs";
import { dirname as dirname6, join as join8 } from "path";
import { fileURLToPath as fileURLToPath6 } from "url";
function resolveSpecRoot6() {
  const here = dirname6(fileURLToPath6(import.meta.url));
  const candidates = [
    join8(here, "../../react/spec"),
    join8(here, "../../react/dist/spec"),
    join8(process.cwd(), "node_modules/@refineui/react/spec"),
    join8(process.cwd(), "node_modules/@refineui/react/dist/spec"),
    join8(process.cwd(), "packages/react/spec"),
    join8(process.cwd(), "packages/react/dist/spec")
  ];
  for (const path3 of candidates) {
    if (existsSync6(join8(path3, "manifest.json"))) return path3;
  }
  return null;
}
function readJson7(path3) {
  return JSON.parse(readFileSync6(path3, "utf8"));
}
function buildDataStateSchema(root, manifest, specs) {
  const schema = {};
  for (const entry of manifest.components) {
    const spec = specs[entry.id] ?? readJson7(join8(root, entry.spec.replace(/^\.\//, "")));
    if (!spec.dom) continue;
    for (const [dataRefineui, domContract] of Object.entries(spec.dom)) {
      const values = domContract.states?.component?.["data-state"];
      if (values?.length) schema[dataRefineui] = values;
    }
  }
  return schema;
}
var cached5 = null;
function loadComponentSpecs() {
  if (cached5) return cached5;
  const root = resolveSpecRoot6();
  if (!root) return null;
  const manifest = readJson7(join8(root, "manifest.json"));
  const specs = {};
  for (const entry of manifest.components) {
    const path3 = join8(root, entry.spec.replace(/^\.\//, ""));
    if (existsSync6(path3)) specs[entry.id] = readJson7(path3);
  }
  cached5 = {
    manifest,
    specs,
    dataStateSchema: buildDataStateSchema(root, manifest, specs)
  };
  return cached5;
}

// src/rules/component-state-contract.ts
var REFS11 = [
  "https://ui.pelagornis.com/ai-tools/doctor/",
  "https://ui.pelagornis.com/llms.txt"
];
var SOURCE_FILE2 = /\.(tsx?|jsx?)$/;
var DATA_STATE_STRING = /data-state=["'{]([a-zA-Z0-9_-]+)["'}]/g;
var DATA_REFINEUI = /data-refineui=["'{]([a-zA-Z0-9_-]+)["'}]/;
var componentStateContractRule = {
  id: "component-state-contract",
  category: "components",
  run({ workspace }) {
    const loaded = loadComponentSpecs();
    const findings = [];
    if (!loaded) {
      return {
        check: {
          rule: "component-state-contract",
          category: "components",
          status: "not-verified",
          reason: "Component spec manifest not found \u2014 build @refineui/react or run from monorepo",
          references: REFS11
        },
        findings: []
      };
    }
    const { dataStateSchema } = loaded;
    const sourceFiles = workspace.sourceFiles.filter((f) => SOURCE_FILE2.test(f));
    for (const file of sourceFiles) {
      const lines = readFileLines(file);
      const rel = relPath(workspace.root, file);
      lines.forEach((line, index) => {
        const refineuiMatch = line.match(DATA_REFINEUI);
        if (!refineuiMatch) return;
        const dataRefineui = refineuiMatch[1];
        const allowed = dataStateSchema[dataRefineui];
        if (!allowed?.length) return;
        for (const stateMatch of line.matchAll(DATA_STATE_STRING)) {
          const received = stateMatch[1];
          if (allowed.includes(received)) continue;
          findings.push({
            rule: "component-state-contract",
            severity: "error",
            message: `Invalid component state "${received}" on data-refineui="${dataRefineui}"`,
            file: rel,
            line: index + 1,
            references: REFS11,
            remediation: [
              `Component: ${dataRefineui}`,
              `Attribute: data-state`,
              `Received: ${received}`,
              `Expected: ${allowed.map((v) => `- ${v}`).join("\n")}`,
              "",
              "See packages/react/spec/components/*.json \u2014 Spec defines contracts, not implementation docs."
            ].join("\n")
          });
        }
      });
    }
    const capped = findings.slice(0, 20);
    if (capped.length === 0) {
      return {
        check: {
          rule: "component-state-contract",
          category: "components",
          status: "pass",
          evidence: `Validated data-state literals against ${Object.keys(dataStateSchema).length} DOM contract(s)`,
          references: REFS11
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "component-state-contract",
        category: "components",
        status: "fail",
        evidence: `${capped.length} invalid data-state value(s) against Component Spec`,
        references: REFS11
      },
      findings: capped
    };
  }
};

// src/rules/motion-contract.ts
var REFS12 = [
  "https://ui.pelagornis.com/foundations/motion/",
  "https://ui.pelagornis.com/development/motion/"
];
var STYLE_FILE2 = /\.(tsx?|jsx?|css)$/;
var motionContractRule = {
  id: "motion-contract",
  category: "accessibility",
  run({ workspace }) {
    const findings = [];
    const codeFiles = workspace.sourceFiles.filter((f) => STYLE_FILE2.test(f));
    for (const file of codeFiles) {
      const lines = readFileLines(file);
      const rel = relPath(workspace.root, file);
      lines.forEach((line, index) => {
        if (line.includes("prefers-reduced-motion")) return;
        if (!/\btransition\b|\banimation\b|\btransform\b/.test(line)) return;
        if (line.includes("var(--refineui-motion") || line.includes("refineui.css")) return;
        if (line.trim().startsWith("//") || line.trim().startsWith("*")) return;
        const hasDurationMs = /\b\d+m?s\b/.test(line) && !line.includes("var(");
        if (!hasDurationMs) return;
        findings.push({
          rule: "motion-contract",
          severity: "info",
          message: "Hardcoded motion duration \u2014 prefer semantic motion CSS vars",
          file: rel,
          line: index + 1,
          references: REFS12,
          remediation: "Use var(--refineui-motion-duration-*) roles and honor prefers-reduced-motion. Import @refineui/react/refineui.css."
        });
      });
    }
    const stylesheets = workspace.sourceFiles.filter(
      (f) => f.endsWith(".css") && !f.includes("node_modules")
    );
    const hasReducedMotionCss = stylesheets.some(
      (file) => readFileLines(file).some((l) => l.includes("prefers-reduced-motion"))
    );
    const importsRefineCss = codeFiles.some(
      (file) => readFileLines(file).some(
        (l) => l.includes("@refineui/react/refineui.css") || l.includes('refineui.css"')
      )
    );
    if (workspace.projectKinds.includes("app") && !hasReducedMotionCss && !importsRefineCss) {
      findings.push({
        rule: "motion-contract",
        severity: "warn",
        message: "No reduced-motion contract detected \u2014 import @refineui/react/refineui.css",
        file: workspace.relativePath,
        references: REFS12,
        remediation: "Import @refineui/react/refineui.css once at the app root. Token CSS collapses motion roles under prefers-reduced-motion."
      });
    }
    const capped = findings.slice(0, 15);
    const significant = capped.filter((f) => f.severity !== "info");
    if (significant.length === 0) {
      return {
        check: {
          rule: "motion-contract",
          category: "accessibility",
          status: "pass",
          evidence: "Motion contract satisfied or informational hints only",
          references: REFS12
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "motion-contract",
        category: "accessibility",
        status: "fail",
        evidence: `${significant.length} motion contract issue(s)`,
        references: REFS12
      },
      findings: capped.filter((f) => f.severity !== "info")
    };
  }
};

// src/rules/state-contract.ts
var REFS13 = [
  "https://ui.pelagornis.com/foundations/design-tokens/",
  "https://ui.pelagornis.com/llms.txt"
];
var COMPONENT_TSX = /packages\/react\/src\/components\/[^/]+\/[A-Z][^/]+\.tsx$/;
var stateContractRule = {
  id: "state-contract",
  category: "components",
  run({ workspace }) {
    const findings = [];
    const componentFiles = workspace.sourceFiles.filter((f) => COMPONENT_TSX.test(f.replace(/\\/g, "/")));
    for (const file of componentFiles) {
      const lines = readFileLines(file);
      const rel = relPath(workspace.root, file);
      const content = lines.join("\n");
      const exportFn = content.match(/export function (\w+)/);
      if (!exportFn) continue;
      const componentName = exportFn[1];
      if (componentName.startsWith("use")) continue;
      const hasDataRefineui = content.includes('data-refineui="') || content.includes("data-refineui={'") || content.includes("data-refineui={");
      if (!hasDataRefineui && !content.includes("forwardRef")) {
        findings.push({
          rule: "state-contract",
          severity: "info",
          message: `Root component ${componentName} has no data-refineui attribute`,
          file: rel,
          references: REFS13,
          remediation: "Set data-refineui on the component root. Use data-variant, data-size, and data-state for visual/interaction contracts."
        });
      }
      lines.forEach((line, index) => {
        if (/:focus(?!-visible)/.test(line) && !line.includes(":focus-visible")) {
          findings.push({
            rule: "state-contract",
            severity: "warn",
            message: ":focus used without :focus-visible \u2014 prefer keyboard-only focus rings",
            file: rel,
            line: index + 1,
            references: REFS13,
            remediation: "Use :focus-visible with --refineui-focus-ring-* vars. Avoid :focus for mouse clicks."
          });
        }
      });
    }
    const capped = findings.slice(0, 15);
    const significant = capped.filter((f) => f.severity === "warn");
    if (significant.length === 0) {
      return {
        check: {
          rule: "state-contract",
          category: "components",
          status: "pass",
          evidence: `Scanned ${componentFiles.length} component roots \u2014 state contract OK`,
          references: REFS13
        },
        findings: []
      };
    }
    return {
      check: {
        rule: "state-contract",
        category: "components",
        status: "fail",
        evidence: `${significant.length} state/focus contract issue(s)`,
        references: REFS13
      },
      findings: significant
    };
  }
};

// src/run.ts
var ALL_RULES = [
  packageSetupRule,
  stylesheetSetupRule,
  foundationContractRule,
  compositionApiRule,
  componentImportsRule,
  componentStateContractRule,
  accessibilityContractRule,
  keyboardContractRule,
  focusContractRule,
  environmentContractRule,
  layoutContractRule,
  stateContractRule,
  motionContractRule
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
