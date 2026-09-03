import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type EnvironmentContext =
    | "prefers-reduced-motion"
    | "forced-colors"
    | "prefers-contrast"
    | "prefers-color-scheme"
    | "pointer"
    | "viewport"
    | "dir";

export type EnvironmentContractEntry = Readonly<{
    componentId: string;
    exportName: string;
    dataRefineui: readonly string[];
    environments: readonly EnvironmentContext[];
}>;

type ComponentManifest = {
    components: Array<{
        id: string;
        spec: string;
        export: string;
        dataRefineui: string[];
    }>;
};

type ComponentSpec = {
    component: string;
    states?: { environment?: string[] };
    dom?: Record<string, { states?: { environment?: string[] } }>;
};

function resolveSpecRoot(): string | null {
    const here = dirname(fileURLToPath(import.meta.url));
    const candidates = [
        join(here, "../../react/spec"),
        join(here, "../../react/dist/spec"),
        join(process.cwd(), "packages/react/spec"),
        join(process.cwd(), "packages/react/dist/spec"),
    ];
    for (const path of candidates) {
        if (existsSync(join(path, "manifest.json"))) return path;
    }
    return null;
}

function readJson<T>(path: string): T {
    return JSON.parse(readFileSync(path, "utf8")) as T;
}

function collectEnvironments(spec: ComponentSpec): EnvironmentContext[] {
    const values = new Set<string>();
    for (const env of spec.states?.environment ?? []) values.add(env);
    if (spec.dom) {
        for (const slot of Object.values(spec.dom)) {
            for (const env of slot.states?.environment ?? []) values.add(env);
        }
    }
    return Array.from(values) as EnvironmentContext[];
}

let cached: EnvironmentContractEntry[] | null = null;

export function loadEnvironmentContracts(): EnvironmentContractEntry[] {
    if (cached) return cached;

    const root = resolveSpecRoot();
    if (!root) {
        cached = [];
        return cached;
    }

    const manifest = readJson<ComponentManifest>(join(root, "manifest.json"));
    const entries: EnvironmentContractEntry[] = [];

    for (const item of manifest.components) {
        const specPath = join(root, item.spec.replace(/^\.\//, ""));
        if (!existsSync(specPath)) continue;
        const spec = readJson<ComponentSpec>(specPath);
        const environments = collectEnvironments(spec);
        if (environments.length === 0) continue;

        entries.push({
            componentId: spec.component,
            exportName: item.export,
            dataRefineui: item.dataRefineui,
            environments,
        });
    }

    cached = entries;
    return cached;
}

export function resetEnvironmentSpecCache(): void {
    cached = null;
}

/** Extract a top-level `@media (...)` body (brace-balanced). */
function extractMediaBlock(css: string, marker: string): string | null {
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

/** Extract `@media (forced-colors: active) { ... }` body (brace-balanced). */
export function extractForcedColorsBlock(css: string): string | null {
    return extractMediaBlock(css, "@media (forced-colors: active)");
}

/** Extract `@media (prefers-contrast: more) { ... }` body (brace-balanced). */
export function extractPrefersContrastBlock(css: string): string | null {
    return extractMediaBlock(css, "@media (prefers-contrast: more)");
}

export function blockReferencesSlot(block: string, slotId: string): boolean {
    return (
        block.includes(`data-refineui="${slotId}"`) ||
        block.includes(`data-refineui='${slotId}'`)
    );
}

/**
 * Interactive slots that must appear in forced-colors CSS when declared.
 * Roots / triggers only — composed Button slots (close/action) use `button`.
 */
export function interactiveSlotsForForcedColors(dataRefineui: readonly string[]): string[] {
    const preferred = dataRefineui.filter(
        (id) =>
            id === "button" ||
            id === "alert" ||
            id === "dialog" ||
            id.endsWith("-trigger"),
    );
    return preferred.length > 0 ? preferred : [...dataRefineui].slice(0, 1);
}
