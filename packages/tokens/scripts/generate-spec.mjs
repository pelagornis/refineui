/**
 * Emit machine-readable token spec into `dist/spec/` for Docs, MCP, and Doctor.
 *
 * Source: built `@refineui/tokens` dist — same artifacts as generate-css.mjs.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensDist = join(__dirname, "../dist/index.mjs");
const specDir = join(__dirname, "../dist/spec");

const {
    SEMANTIC_PALETTE_PAIRS,
    SEMANTIC_TEXT,
    colors,
    componentSizeFoundationKeys,
    semanticColors,
    semanticFocus,
    semanticInteraction,
    spacings,
    foundationSizes,
    motion,
} = await import(tokensDist);

function toKebab(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .replace(/([a-zA-Z])(\d)/g, "$1-$2")
        .toLowerCase();
}

/** @param {string} semanticName */
function traceSemanticColor(semanticName) {
    const pair = SEMANTIC_PALETTE_PAIRS[semanticName];
    if (!pair) {
        if (semanticName === "surfaceOverlay") {
            return {
                name: semanticName,
                layer: "semantic",
                references: [],
                resolved: semanticColors.surfaceOverlay,
            };
        }
        return null;
    }
    return {
        name: semanticName,
        layer: "semantic",
        references: [`foundation.${pair.light}`, `foundation.${pair.dark}`],
        themes: {
            light: pair.light,
            dark: pair.dark,
        },
        resolved: semanticColors[semanticName],
    };
}

mkdirSync(specDir, { recursive: true });

const foundation = {
    schemaVersion: 1,
    categories: ["colors", "spacings", "foundationSizes", "motion"],
    spacings,
    foundationSizes,
    motion,
};

const semanticColorsSpec = {
    schemaVersion: 1,
    themeContexts: ["light", "dark"],
    reservedThemeContexts: ["highContrast", "forcedColors", "brand"],
    tokens: Object.keys(SEMANTIC_PALETTE_PAIRS).map((name) => ({
        name,
        cssVar: `--refineui-color-alias-${toKebab(name)}`,
        ...traceSemanticColor(name),
        status: "stable",
    })),
};

const semanticTextSpec = {
    schemaVersion: 1,
    textStyles: Object.entries(SEMANTIC_TEXT).map(([role, foundation]) => ({
        name: role,
        cssUtility: `refineui-typo-${toKebab(foundation)}`,
        references: [`foundation.typographys.${foundation}`],
        status: "stable",
    })),
};

const motionSpec = {
    schemaVersion: 1,
    foundation: motion,
    semantic: semanticInteraction,
    accessibility: {
        reducedMotion: {
            mediaQuery: "(prefers-reduced-motion: reduce)",
            contract: "Motion duration roles collapse to instant; scale roles resolve to 1.",
        },
    },
};

const componentSizesSpec = {
    schemaVersion: 1,
    tokens: Object.entries(componentSizeFoundationKeys).map(([name, foundationKey]) => ({
        name,
        cssVar: `--refineui-size-${toKebab(name)}`,
        references: [`foundation.${foundationKey}`],
        status: "stable",
    })),
};

const focusSpec = {
    schemaVersion: 1,
    ring: {
        ...semanticFocus.ring,
        cssVars: {
            color: "--refineui-focus-ring-color",
            width: "--refineui-focus-ring-width",
            offset: "--refineui-focus-ring-offset",
            style: "--refineui-focus-ring-style",
        },
        contract: "Use :focus-visible, not :focus, for keyboard focus rings.",
        status: "stable",
    },
};

const index = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    files: {
        foundation: "./foundation.json",
        semanticColors: "./semantic-colors.json",
        semanticText: "./semantic-text.json",
        motion: "./motion.json",
        componentSizes: "./component-sizes.json",
        focus: "./focus.json",
        traceV2: "./trace-v2.json",
        tokenGraph: "./token-graph.json",
    },
    architecture: {
        layers: [
            "foundation",
            "semantic",
            "componentTokens",
            "recipe",
            "component",
            "stateInteraction",
        ],
        dependencyDirection: "foundation → semantic → componentTokens → recipe → component",
    },
};

function writeSpec(name, data) {
    const dest = join(specDir, name);
    writeFileSync(dest, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    console.log("Wrote", dest);
}

writeSpec("foundation.json", foundation);
writeSpec("semantic-colors.json", semanticColorsSpec);
writeSpec("semantic-text.json", semanticTextSpec);
writeSpec("motion.json", motionSpec);
writeSpec("component-sizes.json", componentSizesSpec);
writeSpec("focus.json", focusSpec);
writeSpec("index.json", index);

writeSpec(
    "trace-index.json",
    Object.fromEntries(
        semanticColorsSpec.tokens.map((t) => [
            t.name,
            {
                layer: "semantic",
                cssVar: t.cssVar,
                references: t.references,
                themes: t.themes,
            },
        ]),
    ),
);

/** v2 — semantic → foundation → resolved hex */
const semanticTraceV2 = Object.fromEntries(
    Object.entries(SEMANTIC_PALETTE_PAIRS).map(([name, pair]) => [
        name,
        {
            type: "semantic",
            cssVar: `--refineui-color-alias-${toKebab(name)}`,
            resolvesTo: {
                light: {
                    foundation: pair.light,
                    value: colors[pair.light],
                },
                dark: {
                    foundation: pair.dark,
                    value: colors[pair.dark],
                },
            },
        },
    ]),
);

writeSpec("trace-v2.json", {
    schemaVersion: 2,
    contractLayer: "semantic-token-trace",
    generatedAt: new Date().toISOString(),
    tokens: semanticTraceV2,
});

const semanticGraphNodes = [];
const semanticGraphEdges = [];
const nodeIds = new Set();

function addSemanticNode(id, layer) {
    if (nodeIds.has(id)) return;
    nodeIds.add(id);
    semanticGraphNodes.push({ id, layer });
}

for (const [name, pair] of Object.entries(SEMANTIC_PALETTE_PAIRS)) {
    const semanticId = `semantic.${name}`;
    addSemanticNode(semanticId, "semantic");
    const lightId = `foundation.${pair.light}`;
    const darkId = `foundation.${pair.dark}`;
    addSemanticNode(lightId, "foundation");
    addSemanticNode(darkId, "foundation");
    semanticGraphEdges.push({ from: semanticId, to: lightId, context: "light" });
    semanticGraphEdges.push({ from: semanticId, to: darkId, context: "dark" });
}

writeSpec("token-graph.json", {
    schemaVersion: 2,
    contractLayer: "semantic-token-graph",
    nodes: semanticGraphNodes,
    edges: semanticGraphEdges,
});

console.log("Token spec generation complete.");
