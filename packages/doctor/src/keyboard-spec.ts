import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type KeyboardAction =
    | "activate"
    | "close"
    | "next-trigger"
    | "previous-trigger"
    | "first-trigger"
    | "last-trigger";

export type KeyboardBindingContract = Readonly<{
    action: KeyboardAction;
    native?: boolean;
}>;

export type KeyboardContractEntry = Readonly<{
    componentId: string;
    exportName: string;
    dataRefineui: readonly string[];
    bindings: Readonly<Record<string, KeyboardBindingContract>>;
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
    keyboard?: Record<string, KeyboardAction | KeyboardBindingContract>;
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

function normalizeBinding(raw: KeyboardAction | KeyboardBindingContract): KeyboardBindingContract {
    if (typeof raw === "string") return { action: raw };
    return raw;
}

let cached: KeyboardContractEntry[] | null = null;

export function loadKeyboardContracts(): KeyboardContractEntry[] {
    if (cached) return cached;

    const root = resolveSpecRoot();
    if (!root) {
        cached = [];
        return cached;
    }

    const manifest = readJson<ComponentManifest>(join(root, "manifest.json"));
    const entries: KeyboardContractEntry[] = [];

    for (const item of manifest.components) {
        const specPath = join(root, item.spec.replace(/^\.\//, ""));
        if (!existsSync(specPath)) continue;
        const spec = readJson<ComponentSpec>(specPath);
        if (!spec.keyboard || Object.keys(spec.keyboard).length === 0) continue;

        const bindings: Record<string, KeyboardBindingContract> = {};
        for (const [key, raw] of Object.entries(spec.keyboard)) {
            bindings[key] = normalizeBinding(raw);
        }

        entries.push({
            componentId: spec.component,
            exportName: item.export,
            dataRefineui: item.dataRefineui,
            bindings,
        });
    }

    cached = entries;
    return cached;
}

export function resetKeyboardSpecCache(): void {
    cached = null;
}

export function collectComponentSources(workspaceRoot: string, exportName: string): string[] {
    const dir = join(workspaceRoot, "src/components", exportName);
    if (!existsSync(dir)) return [];

    const files: string[] = [];
    const walk = (current: string) => {
        for (const entry of readdirSync(current, { withFileTypes: true })) {
            const full = join(current, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (/\.(tsx|jsx|ts)$/.test(entry.name)) files.push(full);
        }
    };
    walk(dir);
    return files;
}

export function readWorkspaceFile(path: string): string {
    if (!existsSync(path)) return "";
    return readFileSync(path, "utf8");
}

export function hasKeyHandler(content: string, key: string): boolean {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return (
        new RegExp(`case\\s+["']${escaped}["']`).test(content) ||
        new RegExp(`\\.key\\s*===\\s*["']${escaped}["']`).test(content) ||
        new RegExp(`key\\s*===\\s*["']${escaped}["']`).test(content)
    );
}

const ACTION_PATTERNS: Record<KeyboardAction, RegExp[]> = {
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
        /["']Escape["'][\s\S]{0,120}clear\s*\(/,
    ],
    "first-trigger": [
        /focusFirst\s*\(/,
        /focusTrigger\s*\(\s*0\s*\)/,
        /case\s+["']Home["'][\s\S]{0,280}\??\.focus\s*\(/,
        /["']Home["'][\s\S]{0,280}\??\.focus\s*\(/,
        /setActiveIndex\s*\(\s*(?:enabledItems\.length\s*>\s*0\s*\?\s*)?0/,
        /scrollTo\s*\(\s*0\s*\)/,
        /["']Home["'][\s\S]{0,400}setSelectedValue/,
        /case\s+["']Home["'][\s\S]{0,280}minSize/,
    ],
    "last-trigger": [
        /focusLast\s*\(/,
        /case\s+["']End["'][\s\S]{0,280}\??\.focus\s*\(/,
        /["']End["'][\s\S]{0,280}\??\.focus\s*\(/,
        /setActiveIndex\s*\(\s*enabledItems\.length\s*-\s*1/,
        /scrollTo\s*\(\s*(?:Math\.max\s*\(\s*0\s*,\s*)?count\s*-\s*1/,
        /["']End["'][\s\S]{0,400}setSelectedValue/,
        /case\s+["']End["'][\s\S]{0,600}maxSize/,
        /case\s+["']End["'][\s\S]{0,280}pairSum/,
    ],
    "next-trigger": [
        /focusByDelta\([^,]+,\s*1\)/,
        /focusNext/i,
        /moveFocus\s*\(\s*1\s*\)/,
        /moveSelection\s*\(\s*1\s*\)/,
        /scrollNext\s*\(/,
        /setActiveIndex\s*\(\s*\(prev\)\s*=>\s*Math\.min/,
        /focusAt\s*\(\s*index\s*\+\s*1\s*\)/,
    ],
    "previous-trigger": [
        /focusByDelta\([^,]+,\s*-1\)/,
        /focusPrevious/i,
        /moveFocus\s*\(\s*-1\s*\)/,
        /moveSelection\s*\(\s*-1\s*\)/,
        /scrollPrev\s*\(/,
        /setActiveIndex\s*\(\s*\(prev\)\s*=>\s*Math\.max/,
        /focusAt\s*\(\s*index\s*-\s*1\s*\)/,
    ],
};

export function hasActionPattern(content: string, action: KeyboardAction): boolean {
    const patterns = ACTION_PATTERNS[action];
    return patterns.some((pattern) => pattern.test(content));
}

export function isFullyNativeKeyboard(bindings: Readonly<Record<string, KeyboardBindingContract>>): boolean {
    const values = Object.values(bindings);
    return values.length > 0 && values.every((b) => b.native === true);
}
