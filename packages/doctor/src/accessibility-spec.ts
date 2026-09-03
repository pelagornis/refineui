import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type AccessibilityAttributeContract = {
    required: boolean;
    type?: "boolean" | "string" | "token";
};

export type AccessibilitySlotContract = {
    element?: "button" | "div" | "input";
    role?: string;
    native?: boolean;
    requiredAttributes?: Record<string, AccessibilityAttributeContract>;
    relationships?: Array<{
        attribute: "aria-controls" | "aria-labelledby" | "aria-describedby";
        target: string;
        targetAttribute?: "id";
        required: boolean;
    }>;
};

export type AccessibilitySlotEntry = Readonly<{
    componentId: string;
    slotId: string;
    contract: AccessibilitySlotContract;
}>;

type ComponentManifest = {
    components: Array<{
        id: string;
        spec: string;
    }>;
};

type ComponentSpec = {
    component: string;
    accessibility?: Record<string, AccessibilitySlotContract>;
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

let cachedSlots: AccessibilitySlotEntry[] | null = null;

export function loadAccessibilitySlots(): AccessibilitySlotEntry[] {
    if (cachedSlots) return cachedSlots;

    const root = resolveSpecRoot();
    if (!root) {
        cachedSlots = [];
        return cachedSlots;
    }

    const manifest = readJson<ComponentManifest>(join(root, "manifest.json"));
    const entries: AccessibilitySlotEntry[] = [];

    for (const item of manifest.components) {
        const specPath = join(root, item.spec.replace(/^\.\//, ""));
        if (!existsSync(specPath)) continue;
        const spec = readJson<ComponentSpec>(specPath);
        if (!spec.accessibility) continue;

        for (const [slotId, contract] of Object.entries(spec.accessibility)) {
            entries.push({ componentId: spec.component, slotId, contract });
        }
    }

    cachedSlots = entries;
    return cachedSlots;
}

export function resetAccessibilitySpecCache(): void {
    cachedSlots = null;
}

/** JSX attribute name variants (aria-expanded vs ariaExpanded). */
export function toJsxAttrNames(attr: string): string[] {
    if (!attr.includes("-")) return [attr];
    const camel = attr.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    return [attr, camel];
}

export function extractAttributeExpression(content: string, attr: string): string | null {
    for (const name of toJsxAttrNames(attr)) {
        const expr = new RegExp(`${name}=\\{([^}]+)\\}`, "s");
        const match = content.match(expr);
        if (match) return match[1].trim();
    }
    return null;
}

export function extractAttributeStringLiteral(content: string, attr: string): string | null {
    for (const name of toJsxAttrNames(attr)) {
        const dquoted = new RegExp(`${name}="([^"]*)"`);
        const squoted = new RegExp(`${name}='([^']*)'`);
        const m1 = content.match(dquoted);
        if (m1) return m1[1];
        const m2 = content.match(squoted);
        if (m2) return m2[1];
    }
    return null;
}

export function hasAttribute(content: string, attr: string): boolean {
    return (
        extractAttributeExpression(content, attr) !== null ||
        extractAttributeStringLiteral(content, attr) !== null
    );
}

export function fileContainsSlot(content: string, slotId: string): boolean {
    return (
        content.includes(`data-refineui="${slotId}"`) ||
        content.includes(`data-refineui={'${slotId}'}`) ||
        content.includes(`data-refineui={"${slotId}"}`)
    );
}

export function usesNativeElement(content: string, element: string): boolean {
    const re = new RegExp(`<${element}[\\s>]`);
    return re.test(content);
}

export function usesDivAsInteractiveRoot(content: string, slotId: string): boolean {
    if (!fileContainsSlot(content, slotId)) return false;
    return /<div[^>]*data-refineui=/.test(content) && fileContainsSlot(content, slotId);
}
