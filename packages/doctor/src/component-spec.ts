import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type ComponentManifest = {
    schemaVersion: number;
    contractLayer: string;
    components: Array<{
        name: string;
        id: string;
        spec: string;
        recipe?: string;
        export: string;
        dataRefineui: string[];
    }>;
};

type ComponentSpec = {
    component: string;
    dom?: Record<
        string,
        {
            states?: {
                component?: Record<string, string[]>;
            };
        }
    >;
};

export type LoadedComponentSpec = Readonly<{
    manifest: ComponentManifest;
    specs: Readonly<Record<string, ComponentSpec>>;
    dataStateSchema: Readonly<Record<string, readonly string[]>>;
}>;

function resolveSpecRoot(): string | null {
    const here = dirname(fileURLToPath(import.meta.url));
    const candidates = [
        join(here, "../../react/spec"),
        join(here, "../../react/dist/spec"),
        join(process.cwd(), "node_modules/@refineui/react/spec"),
        join(process.cwd(), "node_modules/@refineui/react/dist/spec"),
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

function buildDataStateSchema(
    root: string,
    manifest: ComponentManifest,
    specs: Record<string, ComponentSpec>,
): Record<string, readonly string[]> {
    const schema: Record<string, readonly string[]> = {};

    for (const entry of manifest.components) {
        const spec =
            specs[entry.id] ??
            readJson<ComponentSpec>(join(root, entry.spec.replace(/^\.\//, "")));
        if (!spec.dom) continue;

        for (const [dataRefineui, domContract] of Object.entries(spec.dom)) {
            const values = domContract.states?.component?.["data-state"];
            if (values?.length) schema[dataRefineui] = values;
        }
    }

    return schema;
}

let cached: LoadedComponentSpec | null = null;

export function loadComponentSpecs(): LoadedComponentSpec | null {
    if (cached) return cached;

    const root = resolveSpecRoot();
    if (!root) return null;

    const manifest = readJson<ComponentManifest>(join(root, "manifest.json"));
    const specs: Record<string, ComponentSpec> = {};

    for (const entry of manifest.components) {
        const path = join(root, entry.spec.replace(/^\.\//, ""));
        if (existsSync(path)) specs[entry.id] = readJson<ComponentSpec>(path);
    }

    cached = {
        manifest,
        specs,
        dataStateSchema: buildDataStateSchema(root, manifest, specs),
    };
    return cached;
}

export function resetComponentSpecCache(): void {
    cached = null;
}
