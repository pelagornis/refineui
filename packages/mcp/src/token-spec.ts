import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function resolveTokensSpecPath(...segments: string[]): string | null {
    const candidates = [
        join(__dirname, "../../tokens/dist/spec", ...segments),
        join(process.cwd(), "node_modules/@refineui/tokens/dist/spec", ...segments),
        join(process.cwd(), "packages/tokens/dist/spec", ...segments),
    ];
    for (const path of candidates) {
        if (existsSync(path)) return path;
    }
    return null;
}

function resolveReactSpecPath(...segments: string[]): string | null {
    const candidates = [
        join(__dirname, "../../react/dist/spec", ...segments),
        join(__dirname, "../../react/spec", ...segments),
        join(process.cwd(), "node_modules/@refineui/react/dist/spec", ...segments),
        join(process.cwd(), "node_modules/@refineui/react/spec", ...segments),
        join(process.cwd(), "packages/react/dist/spec", ...segments),
        join(process.cwd(), "packages/react/spec", ...segments),
    ];
    for (const path of candidates) {
        if (existsSync(path)) return path;
    }
    return null;
}

function readJson(path: string | null): unknown {
    if (!path || !existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf8"));
}

function normalizeTokenQuery(name: string): string {
    return name.replace(/^component\./, "").trim();
}

function buildChainFromTraceV2(entry: {
    type?: string;
    resolvesTo?: {
        semantic?: string;
        light?: { foundation: string; value: string };
        dark?: { foundation: string; value: string };
    };
}): string[] {
    const chain: string[] = [];
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

export function inspectToken(name: string) {
    const componentTrace = readJson(resolveReactSpecPath("token-trace-v2.json")) as {
        tokens?: Record<
            string,
            {
                type: string;
                resolvesTo: {
                    semantic: string;
                    light: { foundation: string; value: string | null };
                    dark: { foundation: string; value: string | null };
                };
            }
        >;
    } | null;

    const query = normalizeTokenQuery(name);
    const componentKey = Object.keys(componentTrace?.tokens ?? {}).find(
        (k) => k === query || k.endsWith(`.${query}`) || k.includes(query),
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
                `light → foundation.${entry.resolvesTo.light.foundation} → ${entry.resolvesTo.light.value}`,
                `dark → foundation.${entry.resolvesTo.dark.foundation} → ${entry.resolvesTo.dark.value}`,
            ],
            resolvesTo: entry.resolvesTo,
        };
    }

    const semanticTrace = readJson(resolveTokensSpecPath("trace-v2.json")) as {
        tokens?: Record<
            string,
            {
                cssVar: string;
                resolvesTo: {
                    light: { foundation: string; value: string };
                    dark: { foundation: string; value: string };
                };
            }
        >;
    } | null;

    const semanticKey =
        Object.keys(semanticTrace?.tokens ?? {}).find(
            (k) => k === name || k.toLowerCase() === name.toLowerCase(),
        ) ?? null;

    if (semanticKey && semanticTrace?.tokens?.[semanticKey]) {
        const entry = semanticTrace.tokens[semanticKey];
        return {
            query: name,
            layer: "semantic",
            token: semanticKey,
            cssVar: entry.cssVar,
            chain: buildChainFromTraceV2({ type: "semantic", resolvesTo: { ...entry.resolvesTo, semantic: semanticKey } }),
            resolvesTo: entry.resolvesTo,
        };
    }

    return {
        query: name,
        error: "Token not found in trace spec. Run build:tokens and build:react.",
        hint: "Try button.primary.background, backgroundBrand, or inspect token-graph.json",
    };
}

export function getComponentSpec(name: string) {
    const manifest = readJson(resolveReactSpecPath("manifest.json")) as {
        components?: Array<{ id: string; spec: string; name: string }>;
    } | null;
    if (!manifest?.components) {
        return { error: "Component manifest not found." };
    }
    const key = name.toLowerCase();
    const entry = manifest.components.find((c) => c.id === key || c.name.toLowerCase() === key);
    if (!entry) {
        return {
            error: `No component spec for "${name}".`,
            available: manifest.components.map((c) => c.id),
        };
    }
    const spec = readJson(resolveReactSpecPath(entry.spec.replace(/^\.\//, "")));
    return { ...entry, spec };
}

export function getComponentRecipe(name: string) {
    const spec = getComponentSpec(name);
    if ("error" in spec && spec.error) return spec;
    const componentSpec = spec.spec as { recipe?: string } | null;
    if (!componentSpec?.recipe) {
        return { error: "No recipe reference on component spec.", component: spec };
    }
    return {
        component: (spec as { id: string }).id ?? name,
        recipe: componentSpec.recipe,
        note: "Recipe defines appearance; Component Spec defines contract.",
    };
}

export function getTokenSpecIndex() {
    return (
        readJson(resolveReactSpecPath("contract-index.json")) ??
        readJson(resolveTokensSpecPath("index.json"))
    );
}

export function listComponentSpecs() {
    const manifest = readJson(resolveReactSpecPath("manifest.json"));
    return manifest ?? { error: "manifest.json not found" };
}
