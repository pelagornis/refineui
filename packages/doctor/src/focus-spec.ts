import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type FocusVisualContract = Readonly<{
    required: boolean;
    selector: string;
}>;

export type FocusBehaviorContract = Readonly<{
    trap?: boolean;
    initial?: string;
    return?: string;
    roving?: boolean;
}>;

export type FocusContractEntry = Readonly<{
    componentId: string;
    exportName: string;
    dataRefineui: readonly string[];
    focus: Readonly<{
        visual?: FocusVisualContract;
        behavior?: FocusBehaviorContract;
    }>;
    declaresFocusVisiblePseudo: boolean;
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
    states?: { pseudo?: string[] };
    dom?: Record<string, { states?: { pseudo?: string[] } }>;
    focus?: {
        visual?: FocusVisualContract;
        behavior?: FocusBehaviorContract;
    };
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

function specDeclaresFocusVisible(spec: ComponentSpec): boolean {
    if (spec.states?.pseudo?.includes("focus-visible")) return true;
    if (!spec.dom) return false;
    return Object.values(spec.dom).some((slot) => slot.states?.pseudo?.includes("focus-visible"));
}

let cached: FocusContractEntry[] | null = null;

export function loadFocusContracts(): FocusContractEntry[] {
    if (cached) return cached;

    const root = resolveSpecRoot();
    if (!root) {
        cached = [];
        return cached;
    }

    const manifest = readJson<ComponentManifest>(join(root, "manifest.json"));
    const entries: FocusContractEntry[] = [];

    for (const item of manifest.components) {
        const specPath = join(root, item.spec.replace(/^\.\//, ""));
        if (!existsSync(specPath)) continue;
        const spec = readJson<ComponentSpec>(specPath);
        if (!spec.focus) continue;

        entries.push({
            componentId: spec.component,
            exportName: item.export,
            dataRefineui: item.dataRefineui,
            focus: spec.focus,
            declaresFocusVisiblePseudo: specDeclaresFocusVisible(spec),
        });
    }

    cached = entries;
    return cached;
}

export function resetFocusSpecCache(): void {
    cached = null;
}

export function hasFocusVisibleVisualContract(
    dataRefineui: readonly string[],
    cssContent: string,
    componentContent: string,
    declaresFocusVisiblePseudo: boolean,
): boolean {
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

    if (
        /<Button\b/.test(componentContent) &&
        cssContent.includes('[data-refineui="button"]:focus-visible')
    ) {
        return true;
    }

    return false;
}

export function hasFocusTrapPattern(componentContent: string): boolean {
    return /useFocusTrap\s*\(/.test(componentContent);
}

export function hasFocusReturnPattern(componentContent: string, hookContent: string): boolean {
    return (
        /previousFocus/.test(componentContent) ||
        (/useFocusTrap/.test(componentContent) && /previousFocus/.test(hookContent))
    );
}

export function hasFocusInitialPattern(componentContent: string, hookContent: string): boolean {
    return (
        /focusableIn/.test(componentContent) ||
        (/useFocusTrap/.test(componentContent) &&
            (/nodes\[0\]/.test(hookContent) || /focusableIn/.test(hookContent)))
    );
}

export function resolveFocusTrapHookPath(workspaceRoot: string): string | null {
    const candidates = [
        join(workspaceRoot, "src/hooks/useFocusTrap.ts"),
        join(workspaceRoot, "src/hooks/useFocusTrap.tsx"),
    ];
    for (const path of candidates) {
        if (existsSync(path)) return path;
    }
    return null;
}

export function readFileIfExists(path: string | null): string {
    if (!path || !existsSync(path)) return "";
    return readFileSync(path, "utf8");
}
