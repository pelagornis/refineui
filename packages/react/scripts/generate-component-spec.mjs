/**
 * Contract Layer build — copies source specs, resolves component token trace v2 + graph.
 *
 * Source of truth: packages/react/spec/
 * Output: packages/react/dist/spec/
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const reactRoot = join(__dirname, "..");
const specSource = join(reactRoot, "spec");
const specDist = join(reactRoot, "dist/spec");
const reactDist = join(reactRoot, "dist/index.js");
const tokensDist = join(reactRoot, "../tokens/dist/index.mjs");

/** @param {unknown} value */
function isSemanticRef(value) {
    return (
        typeof value === "object" &&
        value !== null &&
        /** @type {{ type?: string }} */ (value).type === "semantic" &&
        typeof /** @type {{ name?: string }} */ (value).name === "string"
    );
}

/** @param {unknown} obj @param {string[]} pathParts */
function collectComponentTokenRefs(obj, pathParts = []) {
    /** @type {Array<{ path: string, semantic: string }>} */
    const out = [];
    if (obj == null || typeof obj !== "object") return out;
    if (isSemanticRef(obj)) {
        out.push({
            path: pathParts.join("."),
            semantic: /** @type {{ name: string }} */ (obj).name,
        });
        return out;
    }
    if (typeof obj === "string") return out;
    for (const [key, value] of Object.entries(obj)) {
        out.push(...collectComponentTokenRefs(value, [...pathParts, key]));
    }
    return out;
}

/**
 * @param {string} semanticName
 * @param {Record<string, { light: string, dark: string }>} palettePairs
 * @param {Record<string, string>} colors
 */
function traceSemanticToFoundation(semanticName, palettePairs, colors) {
    const pair = palettePairs[semanticName];
    if (!pair) {
        return {
            semantic: semanticName,
            light: null,
            dark: null,
        };
    }
    return {
        semantic: semanticName,
        light: {
            foundation: pair.light,
            value: colors[pair.light] ?? null,
        },
        dark: {
            foundation: pair.dark,
            value: colors[pair.dark] ?? null,
        },
    };
}

/**
 * @param {Array<{ path: string, semantic: string }>} refs
 * @param {Record<string, { light: string, dark: string }>} palettePairs
 * @param {Record<string, string>} colors
 */
function buildTokenTraceV2(refs, palettePairs, colors) {
    /** @type {Record<string, unknown>} */
    const trace = {};
    for (const { path, semantic } of refs) {
        trace[path] = {
            type: "component",
            source: "packages/react/src/tokens/componentColorTokens.ts",
            resolvesTo: traceSemanticToFoundation(semantic, palettePairs, colors),
        };
    }
    return trace;
}

/**
 * @param {Array<{ path: string, semantic: string }>} refs
 * @param {Record<string, { light: string, dark: string }>} palettePairs
 */
function buildTokenGraph(refs, palettePairs) {
    /** @type {Record<string, { id: string, layer: string }>} */
    const nodes = {};
    /** @type {Array<{ from: string, to: string, context?: string }>} */
    const edges = [];

    const addNode = (id, layer) => {
        if (!nodes[id]) nodes[id] = { id, layer };
    };

    for (const { path, semantic } of refs) {
        const componentId = `component.${path}`;
        const semanticId = `semantic.${semantic}`;
        addNode(componentId, "component");
        addNode(semanticId, "semantic");
        edges.push({ from: componentId, to: semanticId });

        const pair = palettePairs[semantic];
        if (!pair) continue;
        const lightFoundation = `foundation.${pair.light}`;
        const darkFoundation = `foundation.${pair.dark}`;
        addNode(lightFoundation, "foundation");
        addNode(darkFoundation, "foundation");
        edges.push({ from: semanticId, to: lightFoundation, context: "light" });
        edges.push({ from: semanticId, to: darkFoundation, context: "dark" });
    }

    return { schemaVersion: 2, nodes: Object.values(nodes), edges };
}

function copySpecSource() {
    mkdirSync(specDist, { recursive: true });
    cpSync(specSource, specDist, { recursive: true });
    console.log("Copied contract specs:", specSource, "→", specDist);
}

async function buildTraces() {
    if (!existsSync(reactDist)) {
        console.warn("[generate-component-spec] react dist missing — skip token trace v2");
        return;
    }
    if (!existsSync(tokensDist)) {
        console.warn("[generate-component-spec] tokens dist missing — skip token trace v2");
        return;
    }

    const { componentColorTokens } = await import(reactDist);
    const { colors, SEMANTIC_PALETTE_PAIRS } = await import(tokensDist);

    const refs = collectComponentTokenRefs(componentColorTokens);
    const tokenTraceV2 = {
        schemaVersion: 2,
        generatedAt: new Date().toISOString(),
        contractLayer: "component-token-trace",
        tokens: buildTokenTraceV2(refs, SEMANTIC_PALETTE_PAIRS, colors),
    };
    const tokenGraph = buildTokenGraph(refs, SEMANTIC_PALETTE_PAIRS);

    writeFileSync(join(specDist, "token-trace-v2.json"), `${JSON.stringify(tokenTraceV2, null, 2)}\n`);
    writeFileSync(join(specDist, "token-graph.json"), `${JSON.stringify(tokenGraph, null, 2)}\n`);
    console.log("Wrote token-trace-v2.json (", refs.length, "component token paths )");
    console.log("Wrote token-graph.json (", tokenGraph.nodes.length, "nodes,", tokenGraph.edges.length, "edges )");
}

function writeContractIndex() {
    const manifest = JSON.parse(readFileSync(join(specDist, "manifest.json"), "utf8"));
    const index = {
        schemaVersion: 2,
        contractLayer: "component-spec",
        contractLayerVersion: manifest.contractLayerVersion ?? "1.0",
        status: manifest.status ?? "v1-closed",
        generatedAt: new Date().toISOString(),
        role: "Behavior and DOM contracts — source of truth for Doctor, MCP, and Docs",
        files: {
            manifest: "./manifest.json",
            schema: "./schema/component-spec.schema.json",
            components: "./components/",
            tokenTraceV2: "./token-trace-v2.json",
            tokenGraph: "./token-graph.json",
            readme: "./README.md",
        },
        architecture: {
            layers: [
                "foundation",
                "semantic",
                "componentTokens",
                "componentSpec",
                "recipe",
                "component",
                "stateInteraction",
            ],
            principle: "Spec defines contracts; Recipe defines appearance; React implements behavior",
            consumers: ["doctor", "mcp", "docs"],
        },
        pilots: manifest.pilots ?? null,
        next: manifest.next ?? [],
        manifest,
    };
    writeFileSync(join(specDist, "contract-index.json"), `${JSON.stringify(index, null, 2)}\n`);
    console.log("Wrote contract-index.json");
}

copySpecSource();
await buildTraces();
writeContractIndex();
console.log("Contract Layer build complete.");
