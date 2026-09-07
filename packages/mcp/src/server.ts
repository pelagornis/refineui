import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { discoverWorkspaces, runDoctor, reportToSummary } from "@refineui/doctor";
import { DESIGN_RULES } from "./design-rules.js";
import { getComponentRecipe, getComponentSpec, getTokenSpecIndex, inspectToken, listComponentSpecs } from "./token-spec.js";
import {
    getDesignMd,
    getDocPage,
    getIndexMeta,
    getLlmIndex,
    listPages,
    listSemanticTextRoles,
    listTokenCategories,
    normalizeSlug,
    searchDocs,
    type DocCategory,
} from "./docs-store.js";

function textResult(text: string) {
    return {
        content: [{ type: "text" as const, text }],
    };
}

function jsonResult(value: unknown) {
    return textResult(JSON.stringify(value, null, 2));
}

function createServer() {
    const server = new McpServer({
        name: "refineui",
        version: "0.1.0",
    });

    server.registerResource(
        "llm-index",
        "refineui://llm.txt",
        {
            title: "RefineUI llm.txt",
            description: "Machine-readable RefineUI documentation index",
            mimeType: "text/plain",
        },
        async () => ({
            contents: [
                {
                    uri: "refineui://llm.txt",
                    mimeType: "text/plain",
                    text: getLlmIndex(),
                },
            ],
        }),
    );

    server.registerResource(
        "design-md",
        "refineui://DESIGN.md",
        {
            title: "RefineUI DESIGN.md",
            description: "Stitch-compatible design system identity and agent rules",
            mimeType: "text/markdown",
        },
        async () => ({
            contents: [
                {
                    uri: "refineui://DESIGN.md",
                    mimeType: "text/markdown",
                    text: getDesignMd(),
                },
            ],
        }),
    );

    server.registerResource(
        "design-rules",
        "refineui://design-rules",
        {
            title: "RefineUI design rules",
            description: "Alias of DESIGN.md for backward compatibility",
            mimeType: "text/markdown",
        },
        async () => ({
            contents: [
                {
                    uri: "refineui://design-rules",
                    mimeType: "text/markdown",
                    text: DESIGN_RULES,
                },
            ],
        }),
    );

    server.registerTool(
        "search_docs",
        {
            title: "Search RefineUI docs",
            description: "Search RefineUI documentation pages by keyword.",
            inputSchema: z.object({
                query: z.string().describe("Search terms, e.g. 'button variant' or 'color alias'"),
                category: z
                    .enum(["components", "foundations", "development", "guides", "ai-tools"])
                    .optional()
                    .describe("Optional docs section filter"),
                limit: z.number().int().min(1).max(25).optional().describe("Max results (default 10)"),
            }),
        },
        async ({ query, category, limit }) =>
            jsonResult({
                query,
                results: searchDocs(query, category as DocCategory | undefined, limit ?? 10),
            }),
    );

    server.registerTool(
        "get_doc_page",
        {
            title: "Get RefineUI doc page",
            description: "Fetch a documentation page by slug, e.g. components/button or foundations/color.",
            inputSchema: z.object({
                slug: z.string().describe("Doc slug or path, e.g. components/button or /foundations/color/"),
            }),
        },
        async ({ slug }) => {
            const page = getDocPage(slug);
            if (!page) {
                return textResult(`No documentation page found for slug "${normalizeSlug(slug)}".`);
            }
            return jsonResult(page);
        },
    );

    server.registerTool(
        "list_components",
        {
            title: "List RefineUI components",
            description: "List all component documentation pages in A–Z order.",
            inputSchema: z.object({}),
        },
        async () => jsonResult(listPages("components")),
    );

    server.registerTool(
        "list_foundations",
        {
            title: "List RefineUI foundations",
            description: "List foundation documentation pages (tokens, layout, color, …).",
            inputSchema: z.object({}),
        },
        async () => jsonResult(listPages("foundations")),
    );

    server.registerTool(
        "get_llm_index",
        {
            title: "Get llm.txt index",
            description: "Return the full RefineUI llm.txt machine-readable documentation index.",
            inputSchema: z.object({}),
        },
        async () => textResult(getLlmIndex()),
    );

    server.registerTool(
        "get_design_rules",
        {
            title: "Get RefineUI DESIGN.md",
            description:
                "Return docs/public/DESIGN.md — Stitch-compatible visual identity and codegen rules for @refineui/*.",
            inputSchema: z.object({}),
        },
        async () => textResult(getDesignMd()),
    );

    server.registerTool(
        "list_tokens",
        {
            title: "List RefineUI token categories",
            description: "List global token categories and semantic text roles from @refineui/tokens.",
            inputSchema: z.object({}),
        },
        async () =>
            jsonResult({
                globalCategories: listTokenCategories(),
                semanticTextRoles: listSemanticTextRoles(),
                docs: "https://ui.pelagornis.com/foundations/design-tokens/",
            }),
    );

    server.registerTool(
        "get_index_meta",
        {
            title: "Get docs index metadata",
            description: "Return when the embedded docs index was generated and how many pages it contains.",
            inputSchema: z.object({}),
        },
        async () => jsonResult(getIndexMeta()),
    );

    server.registerTool(
        "run_doctor",
        {
            title: "Run RefineUI Doctor",
            description:
                "Read-only RefineUI workspace diagnostics — setup, stylesheet imports, token contract, composition API, imports.",
            inputSchema: z.object({
                target: z
                    .string()
                    .optional()
                    .describe("Project root path (default: process.cwd() of MCP server)"),
                workspace: z
                    .string()
                    .optional()
                    .describe("Monorepo workspace relative path, e.g. apps/web or docs"),
                categories: z
                    .array(
                        z.enum([
                            "setup",
                            "compatibility",
                            "foundations",
                            "components",
                            "library",
                            "accessibility",
                        ]),
                    )
                    .optional()
                    .describe("Optional rule categories to run"),
            }),
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
                        available: workspaces.map((ws) => ws.relativePath),
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
                    projectKinds: ws.projectKinds,
                })),
            });
        },
    );

    server.registerTool(
        "inspect_token",
        {
            title: "Inspect RefineUI token",
            description:
                "Trace a semantic or component token through the dependency graph (foundation → semantic → component). Requires built token spec.",
            inputSchema: z.object({
                name: z
                    .string()
                    .describe("Token name, e.g. backgroundBrand, button.primary.background, or button"),
            }),
        },
        async ({ name }) => jsonResult(inspectToken(name)),
    );

    server.registerTool(
        "get_component_spec",
        {
            title: "Get RefineUI component spec",
            description:
                "Return the Component Spec contract (anatomy, states, accessibility, keyboard) — Contract Layer source of truth.",
            inputSchema: z.object({
                name: z.string().describe("Component id or name, e.g. button, accordion, dialog"),
            }),
        },
        async ({ name }) => jsonResult(getComponentSpec(name)),
    );

    server.registerTool(
        "list_component_specs",
        {
            title: "List RefineUI component specs",
            description: "Return manifest.json — all components with spec paths and data-refineui identities.",
            inputSchema: z.object({}),
        },
        async () => jsonResult(listComponentSpecs()),
    );

    server.registerTool(
        "get_component_recipe",
        {
            title: "Get component recipe reference",
            description: "Return recipe id from Component Spec — visual mapping only, not the contract.",
            inputSchema: z.object({
                name: z.string().describe("Component id, e.g. button or accordion"),
            }),
        },
        async ({ name }) => jsonResult(getComponentRecipe(name)),
    );

    server.registerTool(
        "get_token_spec",
        {
            title: "Get spec index",
            description: "Return Contract Layer index (component spec + token trace manifests).",
            inputSchema: z.object({}),
        },
        async () => jsonResult(getTokenSpecIndex() ?? { error: "Spec not built. Run build:tokens and build:react." }),
    );

    return server;
}

serveStdio(() => createServer());
