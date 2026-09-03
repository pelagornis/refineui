import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type LayoutContract = Readonly<{
    direction?: "logical" | "physical";
    rtl?: boolean;
}>;

export type LayoutContractEntry = Readonly<{
    componentId: string;
    exportName: string;
    layout: LayoutContract;
}>;

type ComponentManifest = {
    components: Array<{
        id: string;
        spec: string;
        export: string;
    }>;
};

type ComponentSpec = {
    component: string;
    layout?: LayoutContract;
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

let cached: LayoutContractEntry[] | null = null;

export function loadLayoutContracts(): LayoutContractEntry[] {
    if (cached) return cached;

    const root = resolveSpecRoot();
    if (!root) {
        cached = [];
        return cached;
    }

    const manifest = readJson<ComponentManifest>(join(root, "manifest.json"));
    const entries: LayoutContractEntry[] = [];

    for (const item of manifest.components) {
        const specPath = join(root, item.spec.replace(/^\.\//, ""));
        if (!existsSync(specPath)) continue;
        const spec = readJson<ComponentSpec>(specPath);
        if (!spec.layout) continue;
        if (spec.layout.direction !== "logical" && spec.layout.rtl !== true) continue;

        entries.push({
            componentId: spec.component,
            exportName: item.export,
            layout: spec.layout,
        });
    }

    cached = entries;
    return cached;
}

export function resetLayoutSpecCache(): void {
    cached = null;
}

/** Physical LTR/RTL utilities that break under `[dir="rtl"]`. */
export const PHYSICAL_DIRECTION_PATTERNS: ReadonlyArray<{
    id: string;
    pattern: RegExp;
    expected: string;
}> = [
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
    { id: "rounded-r", pattern: /\brounded-r(?:-\w+)?\b/, expected: "rounded-e*" },
];

export type PhysicalDirectionHit = Readonly<{
    id: string;
    expected: string;
    line: number;
    snippet: string;
}>;

export function findPhysicalDirectionHits(content: string): PhysicalDirectionHit[] {
    const hits: PhysicalDirectionHit[] = [];
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
                snippet: trimmed.slice(0, 120),
            });
        }
    });

    return hits;
}
