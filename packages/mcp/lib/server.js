import {
  DESIGN_RULES,
  getDesignMd,
  getDocPage,
  getIndexMeta,
  getLlmIndex,
  listPages,
  listSemanticTextRoles,
  listTokenCategories,
  normalizeSlug,
  searchDocs
} from "./chunk-BIQ6ODHB.js";

// src/server.ts
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { discoverWorkspaces, runDoctor, reportToSummary } from "@refineui/doctor";

// src/token-spec.ts
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
var __dirname = dirname(fileURLToPath(import.meta.url));
function resolveTokensSpecPath(...segments) {
  const candidates = [
    join(__dirname, "../../tokens/dist/spec", ...segments),
    join(process.cwd(), "node_modules/@refineui/tokens/dist/spec", ...segments),
    join(process.cwd(), "packages/tokens/dist/spec", ...segments)
  ];
  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  return null;
}
function resolveReactSpecPath(...segments) {
  const candidates = [
    join(__dirname, "../../react/dist/spec", ...segments),
    join(__dirname, "../../react/spec", ...segments),
    join(process.cwd(), "node_modules/@refineui/react/dist/spec", ...segments),
    join(process.cwd(), "node_modules/@refineui/react/spec", ...segments),
    join(process.cwd(), "packages/react/dist/spec", ...segments),
    join(process.cwd(), "packages/react/spec", ...segments)
  ];
  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  return null;
}
function readJson(path) {
  if (!path || !existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}
function normalizeTokenQuery(name) {
  return name.replace(/^component\./, "").trim();
}
function buildChainFromTraceV2(entry) {
  const chain = [];
  if (entry.type === "component") chain.push("component token");
  const resolved = entry.resolvesTo;
  if (!resolved) return chain;
  if ("semantic" in resolved && resolved.semantic) {
    chain.push(`semantic.${resolved.semantic}`);
  }
  if (resolved.light) {
    chain.push(`foundation.${resolved.light.foundation} (light: ${resolved.light.value})`);
  }
  if (resolved.dark) {
    chain.push(`foundation.${resolved.dark.foundation} (dark: ${resolved.dark.value})`);
  }
  return chain;
}
function inspectToken(name) {
  const componentTrace = readJson(resolveReactSpecPath("token-trace-v2.json"));
  const query = normalizeTokenQuery(name);
  const componentKey = Object.keys(componentTrace?.tokens ?? {}).find(
    (k) => k === query || k.endsWith(`.${query}`) || k.includes(query)
  );
  if (componentKey && componentTrace?.tokens?.[componentKey]) {
    const entry = componentTrace.tokens[componentKey];
    return {
      query: name,
      layer: "component",
      token: componentKey,
      chain: [
        componentKey,
        `semantic.${entry.resolvesTo.semantic}`,
        `light \u2192 foundation.${entry.resolvesTo.light.foundation} \u2192 ${entry.resolvesTo.light.value}`,
        `dark \u2192 foundation.${entry.resolvesTo.dark.foundation} \u2192 ${entry.resolvesTo.dark.value}`
      ],
      resolvesTo: entry.resolvesTo
    };
  }
  const semanticTrace = readJson(resolveTokensSpecPath("trace-v2.json"));
  const semanticKey = Object.keys(semanticTrace?.tokens ?? {}).find(
    (k) => k === name || k.toLowerCase() === name.toLowerCase()
  ) ?? null;
  if (semanticKey && semanticTrace?.tokens?.[semanticKey]) {
    const entry = semanticTrace.tokens[semanticKey];
    return {
      query: name,
      layer: "semantic",
      token: semanticKey,
      cssVar: entry.cssVar,
      chain: buildChainFromTraceV2({ type: "semantic", resolvesTo: { ...entry.resolvesTo, semantic: semanticKey } }),
      resolvesTo: entry.resolvesTo
    };
  }
  return {
    query: name,
    error: "Token not found in trace spec. Run build:tokens and build:react.",
    hint: "Try button.primary.background, backgroundBrand, or inspect token-graph.json"
  };
}
function getComponentSpec(name) {
  const manifest = readJson(resolveReactSpecPath("manifest.json"));
  if (!manifest?.components) {
    return { error: "Component manifest not found." };
  }
  const key = name.toLowerCase();
  const entry = manifest.components.find((c) => c.id === key || c.name.toLowerCase() === key);
  if (!entry) {
    return {
      error: `No component spec for "${name}".`,
      available: manifest.components.map((c) => c.id)
    };
  }
  const spec = readJson(resolveReactSpecPath(entry.spec.replace(/^\.\//, "")));
  return { ...entry, spec };
}
function getComponentRecipe(name) {
  const spec = getComponentSpec(name);
  if ("error" in spec && spec.error) return spec;
  const componentSpec = spec.spec;
  if (!componentSpec?.recipe) {
    return { error: "No recipe reference on component spec.", component: spec };
  }
  return {
    component: spec.id ?? name,
    recipe: componentSpec.recipe,
    note: "Recipe defines appearance; Component Spec defines contract."
  };
}
function getTokenSpecIndex() {
  return readJson(resolveReactSpecPath("contract-index.json")) ?? readJson(resolveTokensSpecPath("index.json"));
}
function listComponentSpecs() {
  const manifest = readJson(resolveReactSpecPath("manifest.json"));
  return manifest ?? { error: "manifest.json not found" };
}

// src/server.ts
function textResult(text) {
  return {
    content: [{ type: "text", text }]
  };
}
function jsonResult(value) {
  return textResult(JSON.stringify(value, null, 2));
}
function createServer() {
  const server = new McpServer({
    name: "refineui",
    version: "0.1.0"
  });
  server.registerResource(
    "llm-index",
    "refineui://llm.txt",
    {
      title: "RefineUI llm.txt",
      description: "Machine-readable RefineUI documentation index",
      mimeType: "text/plain"
    },
    async () => ({
      contents: [
        {
          uri: "refineui://llm.txt",
          mimeType: "text/plain",
          text: getLlmIndex()
        }
      ]
    })
  );
  server.registerResource(
    "design-md",
    "refineui://DESIGN.md",
    {
      title: "RefineUI DESIGN.md",
      description: "Stitch-compatible design system identity and agent rules",
      mimeType: "text/markdown"
    },
    async () => ({
      contents: [
        {
          uri: "refineui://DESIGN.md",
          mimeType: "text/markdown",
          text: getDesignMd()
        }
      ]
    })
  );
  server.registerResource(
    "design-rules",
    "refineui://design-rules",
    {
      title: "RefineUI design rules",
      description: "Alias of DESIGN.md for backward compatibility",
      mimeType: "text/markdown"
    },
    async () => ({
      contents: [
        {
          uri: "refineui://design-rules",
          mimeType: "text/markdown",
          text: DESIGN_RULES
        }
      ]
    })
  );
  server.registerTool(
    "search_docs",
    {
      title: "Search RefineUI docs",
      description: "Search RefineUI documentation pages by keyword.",
      inputSchema: z.object({
        query: z.string().describe("Search terms, e.g. 'button variant' or 'color alias'"),
        category: z.enum(["components", "foundations", "development", "guides", "ai-tools"]).optional().describe("Optional docs section filter"),
        limit: z.number().int().min(1).max(25).optional().describe("Max results (default 10)")
      })
    },
    async ({ query, category, limit }) => jsonResult({
      query,
      results: searchDocs(query, category, limit ?? 10)
    })
  );
  server.registerTool(
    "get_doc_page",
    {
      title: "Get RefineUI doc page",
      description: "Fetch a documentation page by slug, e.g. components/button or foundations/color.",
      inputSchema: z.object({
        slug: z.string().describe("Doc slug or path, e.g. components/button or /foundations/color/")
      })
    },
    async ({ slug }) => {
      const page = getDocPage(slug);
      if (!page) {
        return textResult(`No documentation page found for slug "${normalizeSlug(slug)}".`);
      }
      return jsonResult(page);
    }
  );
  server.registerTool(
    "list_components",
    {
      title: "List RefineUI components",
      description: "List all component documentation pages in A\u2013Z order.",
      inputSchema: z.object({})
    },
    async () => jsonResult(listPages("components"))
  );
  server.registerTool(
    "list_foundations",
    {
      title: "List RefineUI foundations",
      description: "List foundation documentation pages (tokens, layout, color, \u2026).",
      inputSchema: z.object({})
    },
    async () => jsonResult(listPages("foundations"))
  );
  server.registerTool(
    "get_llm_index",
    {
      title: "Get llm.txt index",
      description: "Return the full RefineUI llm.txt machine-readable documentation index.",
      inputSchema: z.object({})
    },
    async () => textResult(getLlmIndex())
  );
  server.registerTool(
    "get_design_rules",
    {
      title: "Get RefineUI DESIGN.md",
      description: "Return docs/public/DESIGN.md \u2014 Stitch-compatible visual identity and codegen rules for @refineui/*.",
      inputSchema: z.object({})
    },
    async () => textResult(getDesignMd())
  );
  server.registerTool(
    "list_tokens",
    {
      title: "List RefineUI token categories",
      description: "List global token categories and semantic text roles from @refineui/tokens.",
      inputSchema: z.object({})
    },
    async () => jsonResult({
      globalCategories: listTokenCategories(),
      semanticTextRoles: listSemanticTextRoles(),
      docs: "https://ui.pelagornis.com/foundations/design-tokens/"
    })
  );
  server.registerTool(
    "get_index_meta",
    {
      title: "Get docs index metadata",
      description: "Return when the embedded docs index was generated and how many pages it contains.",
      inputSchema: z.object({})
    },
    async () => jsonResult(getIndexMeta())
  );
  server.registerTool(
    "run_doctor",
    {
      title: "Run RefineUI Doctor",
      description: "Read-only RefineUI workspace diagnostics \u2014 setup, stylesheet imports, token contract, composition API, imports.",
      inputSchema: z.object({
        target: z.string().optional().describe("Project root path (default: process.cwd() of MCP server)"),
        workspace: z.string().optional().describe("Monorepo workspace relative path, e.g. apps/web or docs"),
        categories: z.array(
          z.enum([
            "setup",
            "compatibility",
            "foundations",
            "components",
            "library",
            "accessibility"
          ])
        ).optional().describe("Optional rule categories to run")
      })
    },
    async ({ target, workspace, categories }) => {
      const targetRoot = target ?? process.cwd();
      const workspaces = discoverWorkspaces(targetRoot);
      if (workspaces.length === 0) {
        return textResult("No RefineUI workspaces found. Install @refineui/react or @refineui/tokens first.");
      }
      let selected = workspaces[0];
      if (workspace) {
        const match = workspaces.find((ws) => ws.relativePath === workspace);
        if (!match) {
          return jsonResult({
            error: `Workspace "${workspace}" not found`,
            available: workspaces.map((ws) => ws.relativePath)
          });
        }
        selected = match;
      }
      const report = runDoctor(targetRoot, selected, { categories });
      return jsonResult({
        summary: reportToSummary(report),
        report,
        workspaces: workspaces.map((ws) => ({
          relativePath: ws.relativePath,
          name: ws.name,
          projectKinds: ws.projectKinds
        }))
      });
    }
  );
  server.registerTool(
    "inspect_token",
    {
      title: "Inspect RefineUI token",
      description: "Trace a semantic or component token through the dependency graph (foundation \u2192 semantic \u2192 component). Requires built token spec.",
      inputSchema: z.object({
        name: z.string().describe("Token name, e.g. backgroundBrand, button.primary.background, or button")
      })
    },
    async ({ name }) => jsonResult(inspectToken(name))
  );
  server.registerTool(
    "get_component_spec",
    {
      title: "Get RefineUI component spec",
      description: "Return the Component Spec contract (anatomy, states, accessibility, keyboard) \u2014 Contract Layer source of truth.",
      inputSchema: z.object({
        name: z.string().describe("Component id or name, e.g. button, accordion, dialog")
      })
    },
    async ({ name }) => jsonResult(getComponentSpec(name))
  );
  server.registerTool(
    "list_component_specs",
    {
      title: "List RefineUI component specs",
      description: "Return manifest.json \u2014 all components with spec paths and data-refineui identities.",
      inputSchema: z.object({})
    },
    async () => jsonResult(listComponentSpecs())
  );
  server.registerTool(
    "get_component_recipe",
    {
      title: "Get component recipe reference",
      description: "Return recipe id from Component Spec \u2014 visual mapping only, not the contract.",
      inputSchema: z.object({
        name: z.string().describe("Component id, e.g. button or accordion")
      })
    },
    async ({ name }) => jsonResult(getComponentRecipe(name))
  );
  server.registerTool(
    "get_token_spec",
    {
      title: "Get spec index",
      description: "Return Contract Layer index (component spec + token trace manifests).",
      inputSchema: z.object({})
    },
    async () => jsonResult(getTokenSpecIndex() ?? { error: "Spec not built. Run build:tokens and build:react." })
  );
  return server;
}
serveStdio(() => createServer());
