/**
 * Token trace loaders — component trace (react dist/spec) + semantic trace (tokens dist/spec).
 * Source of truth: build outputs from `bun run build:react` and `bun run build:tokens`.
 */

export type FoundationResolution = Readonly<{
    foundation: string;
    value: string | null;
}>;

export type ComponentTraceEntry = Readonly<{
    type: "component";
    source: string;
    resolvesTo: Readonly<{
        semantic: string;
        light: FoundationResolution | null;
        dark: FoundationResolution | null;
    }>;
}>;

export type SemanticTraceEntry = Readonly<{
    type: "semantic";
    cssVar: string;
    resolvesTo: Readonly<{
        light: FoundationResolution;
        dark: FoundationResolution;
    }>;
}>;

export type ComponentTokenTraceDocument = Readonly<{
    schemaVersion: number;
    tokens: Readonly<Record<string, ComponentTraceEntry>>;
}>;

export type SemanticTokenTraceDocument = Readonly<{
    schemaVersion: number;
    tokens: Readonly<Record<string, SemanticTraceEntry>>;
}>;

export type TokenTraceRef =
    | Readonly<{ kind: "component"; path: string }>
    | Readonly<{ kind: "semantic"; name: string }>;

export type ResolvedTokenTrace = Readonly<{
    traceKey: string;
    layer: "component" | "semantic";
    semantic: string;
    lightFoundation: string;
    darkFoundation: string;
    lightValue: string;
    darkValue: string;
    source?: string;
    cssVar?: string;
}>;

const componentTraceModule = import.meta.glob<ComponentTokenTraceDocument>(
    "../../../packages/react/dist/spec/token-trace-v2.json",
    { eager: true, import: "default" },
);

const semanticTraceModule = import.meta.glob<SemanticTokenTraceDocument>(
    "../../../packages/tokens/dist/spec/trace-v2.json",
    { eager: true, import: "default" },
);

function firstModuleValue<T>(modules: Record<string, T>): T | null {
    const values = Object.values(modules);
    return values.length > 0 ? values[0]! : null;
}

export function loadComponentTokenTrace(): ComponentTokenTraceDocument | null {
    return firstModuleValue(componentTraceModule);
}

export function loadSemanticTokenTrace(): SemanticTokenTraceDocument | null {
    return firstModuleValue(semanticTraceModule);
}

export function resolveTokenTrace(ref: TokenTraceRef): ResolvedTokenTrace | null {
    if (ref.kind === "component") {
        const doc = loadComponentTokenTrace();
        const entry = doc?.tokens[ref.path];
        if (!entry) return null;

        const { semantic, light, dark } = entry.resolvesTo;
        return {
            traceKey: ref.path,
            layer: "component",
            semantic,
            lightFoundation: light?.foundation ?? "—",
            darkFoundation: dark?.foundation ?? "—",
            lightValue: light?.value ?? "—",
            darkValue: dark?.value ?? "—",
            source: entry.source,
        };
    }

    const doc = loadSemanticTokenTrace();
    const entry = doc?.tokens[ref.name];
    if (!entry) return null;

    return {
        traceKey: `semantic.${ref.name}`,
        layer: "semantic",
        semantic: ref.name,
        lightFoundation: entry.resolvesTo.light.foundation,
        darkFoundation: entry.resolvesTo.dark.foundation,
        lightValue: entry.resolvesTo.light.value,
        darkValue: entry.resolvesTo.dark.value,
        cssVar: entry.cssVar,
    };
}

export function listComponentTokenPaths(prefix: string): string[] {
    const doc = loadComponentTokenTrace();
    if (!doc) return [];
    return Object.keys(doc.tokens)
        .filter((path) => path.startsWith(`${prefix}.`))
        .sort();
}

export function resolveComponentTokenPaths(prefix: string): ResolvedTokenTrace[] {
    return listComponentTokenPaths(prefix)
        .map((path) => resolveTokenTrace({ kind: "component", path }))
        .filter((row): row is ResolvedTokenTrace => row !== null);
}
