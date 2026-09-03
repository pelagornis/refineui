/**
 * Expand Component Spec coverage to all shipped components.
 * Preserves hand-authored pilot specs (alert, button, accordion, dialog).
 * Usage: node packages/react/scripts/expand-component-specs.mjs
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const reactRoot = join(__dirname, "..");
const componentsRoot = join(reactRoot, "src/components");
const specDir = join(reactRoot, "spec/components");
const manifestPath = join(reactRoot, "spec/manifest.json");

const PRESERVE = new Set(["alert", "button", "accordion", "dialog"]);

/**
 * Catalog expansion = anatomy + variants + layout (+ data-state when known).
 * Do NOT auto-declare focus / keyboard / accessibility / forced-colors —
 * Doctor validates declared contracts; deepen those fields per-component later.
 *
 * @type {Record<string, { export: string; sourceDirs: string[]; rootAttr: string; recipe?: string; tokens?: string; variants?: Record<string, string[]>; states?: { component?: Record<string, string[]> }; skip?: boolean }>}
 */
const CATALOG = {
    accordion: { export: "Accordion", sourceDirs: ["Accordion"], rootAttr: "accordion", recipe: "accordion" },
    alert: { export: "Alert", sourceDirs: ["Alert"], rootAttr: "alert", recipe: "alert", tokens: "alert" },
    avatar: {
        export: "Avatar",
        sourceDirs: ["Avatar"],
        rootAttr: "avatar",
        variants: { size: ["xs", "sm", "md", "lg", "xl"], layout: ["image", "icon", "initials"] },
    },
    avatars: {
        export: "Avatars",
        sourceDirs: ["Avatars", "Avatar"],
        rootAttr: "avatars",
        variants: { size: ["xs", "sm", "md", "lg", "xl"], layout: ["stack", "spread"] },
    },
    badge: {
        export: "Badge",
        sourceDirs: ["Badge"],
        rootAttr: "badge",
        variants: {
            variant: ["default", "neutral", "outline", "success", "warning", "danger"],
            layout: ["label", "number"],
        },
    },
    box: { export: "Box", sourceDirs: ["Layout"], rootAttr: "box" },
    breadcrumb: { export: "Breadcrumb", sourceDirs: ["Breadcrumb"], rootAttr: "breadcrumb" },
    bubble: {
        export: "Bubble",
        sourceDirs: ["Bubble"],
        rootAttr: "bubble",
        variants: {
            variant: ["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"],
        },
    },
    button: { export: "Button", sourceDirs: ["Button"], rootAttr: "button", recipe: "button", tokens: "button" },
    calendar: { export: "Calendar", sourceDirs: ["Calendar"], rootAttr: "calendar" },
    card: {
        export: "Card",
        sourceDirs: ["Card"],
        rootAttr: "card",
        variants: { variant: ["elevated", "outlined"] },
        states: {
            component: { "data-state": ["default", "hover", "pressed", "disabled"] },
        },
    },
    carousel: { export: "Carousel", sourceDirs: ["Carousel"], rootAttr: "carousel" },
    chart: { export: "Chart", sourceDirs: ["Chart"], rootAttr: "chart" },
    checkbox: {
        export: "Checkbox",
        sourceDirs: ["Checkbox"],
        rootAttr: "checkbox",
        variants: { variant: ["default", "circular"] },
    },
    chip: {
        export: "Chip",
        sourceDirs: ["Chip"],
        rootAttr: "chip",
        variants: { variant: ["default", "outline", "filled"], size: ["sm", "md", "lg"] },
    },
    command: { export: "Command", sourceDirs: ["Command"], rootAttr: "command" },
    container: { export: "Container", sourceDirs: ["Layout"], rootAttr: "container" },
    dialog: { export: "Dialog", sourceDirs: ["Dialog"], rootAttr: "dialog", recipe: "dialog", tokens: "dialog" },
    divider: {
        export: "Divider",
        sourceDirs: ["Divider"],
        rootAttr: "divider",
        variants: { layout: ["default", "content", "icon"] },
    },
    drawer: {
        export: "Drawer",
        sourceDirs: ["Drawer"],
        rootAttr: "drawer",
        variants: { type: ["overlay", "inline"], size: ["sm", "md", "lg"] },
        states: {
            component: { "data-state": ["open", "closed"] },
        },
    },
    dropdown: { export: "Dropdown", sourceDirs: ["Dropdown"], rootAttr: "dropdown-menu" },
    field: {
        export: "Field",
        sourceDirs: ["Field"],
        rootAttr: "field",
        variants: { size: ["sm", "md", "lg"] },
    },
    footer: { export: "Footer", sourceDirs: ["Footer"], rootAttr: "footer" },
    grid: { export: "Grid", sourceDirs: ["Layout"], rootAttr: "grid" },
    input: {
        export: "Input",
        sourceDirs: ["Input"],
        rootAttr: "input",
        variants: { size: ["sm", "md", "lg"] },
    },
    "input-otp": {
        export: "InputOTP",
        sourceDirs: ["InputOTP"],
        rootAttr: "input-otp",
        variants: { size: ["sm", "md", "lg"] },
    },
    label: {
        export: "Label",
        sourceDirs: ["Label"],
        rootAttr: "label",
        variants: { size: ["sm", "md", "lg"] },
    },
    link: { export: "Link", sourceDirs: ["Link"], rootAttr: "link" },
    menu: { export: "Menu", sourceDirs: ["Menu"], rootAttr: "menu" },
    "navigation-menu": {
        export: "NavigationMenu",
        sourceDirs: ["NavigationMenu"],
        rootAttr: "navigation-menu",
    },
    pagination: { export: "Pagination", sourceDirs: ["Pagination"], rootAttr: "pagination" },
    popover: { export: "PopOver", sourceDirs: ["PopOver"], rootAttr: "popover" },
    progress: {
        export: "Progress",
        sourceDirs: ["Progress"],
        rootAttr: "progress",
        variants: { size: ["sm", "lg"] },
    },
    "progress-stepper": {
        export: "ProgressStepper",
        sourceDirs: ["ProgressStepper"],
        rootAttr: "progress-stepper",
        states: {
            component: { "data-state": ["complete", "current", "upcoming"] },
        },
    },
    radio: { export: "Radio", sourceDirs: ["Radio"], rootAttr: "radio" },
    resizable: {
        export: "Resizable",
        sourceDirs: ["Resizable"],
        rootAttr: "resizable-panel-group",
        variants: { orientation: ["horizontal", "vertical"] },
    },
    "scroll-area": {
        export: "ScrollArea",
        sourceDirs: ["ScrollArea"],
        rootAttr: "scroll-area",
        variants: { type: ["hover", "always"] },
        states: {
            component: { "data-state": ["visible", "hidden"] },
        },
    },
    "search-field": {
        export: "SearchField",
        sourceDirs: ["SearchField"],
        rootAttr: "search-field",
        variants: { appearance: ["filled", "plain"] },
    },
    "segmented-control": {
        export: "SegmentedControl",
        sourceDirs: ["SegmentedControl"],
        rootAttr: "segmented-control",
    },
    select: { export: "Select", sourceDirs: ["Select"], rootAttr: "select-trigger" },
    sidebar: { export: "Sidebar", sourceDirs: ["Sidebar"], rootAttr: "sidebar" },
    skeleton: { export: "Skeleton", sourceDirs: ["Skeleton"], rootAttr: "skeleton" },
    slider: {
        export: "Slider",
        sourceDirs: ["Slider"],
        rootAttr: "slider",
        variants: { size: ["sm", "md"] },
    },
    spacer: { export: "Spacer", sourceDirs: ["Layout"], rootAttr: "spacer" },
    "spin-button": {
        export: "SpinButton",
        sourceDirs: ["SpinButton"],
        rootAttr: "spinbutton",
        variants: { size: ["sm", "md", "lg"] },
    },
    spinner: {
        export: "Spinner",
        sourceDirs: ["Spinner"],
        rootAttr: "spinner",
        variants: { size: ["xs", "sm", "md", "lg", "xl", "xxl"] },
    },
    stack: { export: "Stack", sourceDirs: ["Layout"], rootAttr: "stack" },
    stepper: {
        export: "Stepper",
        sourceDirs: ["Stepper"],
        rootAttr: "stepper",
        states: {
            component: { "data-state": ["complete", "current", "upcoming"] },
        },
    },
    switch: { export: "Switch", sourceDirs: ["Switch", "Toggle"], rootAttr: "switch" },
    table: { export: "Table", sourceDirs: ["Table"], rootAttr: "table" },
    tabs: { export: "Tabs", sourceDirs: ["Tabs"], rootAttr: "tabs" },
    tag: {
        export: "Tag",
        sourceDirs: ["Chip"],
        rootAttr: "chip",
        variants: { variant: ["default", "outline", "filled"], size: ["sm", "md", "lg"] },
    },
    text: { export: "Text", sourceDirs: ["Text"], rootAttr: "text" },
    textarea: { export: "Textarea", sourceDirs: ["Textarea"], rootAttr: "textarea" },
    toast: {
        export: "Toast",
        sourceDirs: ["Toast"],
        rootAttr: "toast",
        variants: { variant: ["default", "success", "error", "warning"] },
    },
    tooltip: { export: "Tooltip", sourceDirs: ["Tooltip"], rootAttr: "tooltip" },
    tree: {
        export: "Tree",
        sourceDirs: ["Tree"],
        rootAttr: "tree",
        variants: { size: ["sm", "md", "lg"] },
    },
};

/**
 * @param {string} dir
 * @returns {string[]}
 */
function collectDataRefineui(dir) {
    if (!existsSync(dir)) return [];
    /** @type {Set<string>} */
    const values = new Set();
    const walk = (path) => {
        for (const entry of readdirSync(path, { withFileTypes: true })) {
            const full = join(path, entry.name);
            if (entry.isDirectory()) {
                walk(full);
                continue;
            }
            if (!/\.(tsx|ts)$/.test(entry.name)) continue;
            const text = readFileSync(full, "utf8");
            for (const match of text.matchAll(/data-refineui="([^"]+)"/g)) {
                values.add(match[1]);
            }
        }
    };
    walk(dir);
    return [...values].sort();
}

/**
 * @param {string} rootAttr
 * @param {string[]} attrs
 */
function buildAnatomy(rootAttr, attrs) {
    /** @type {Record<string, string>} */
    const anatomy = { root: rootAttr };
    for (const attr of attrs) {
        if (attr === rootAttr) continue;
        const key = attr.startsWith(`${rootAttr}-`)
            ? attr.slice(rootAttr.length + 1).replace(/-/g, "_")
            : attr.replace(/-/g, "_");
        anatomy[key] = attr;
    }
    return anatomy;
}

/**
 * @param {string} id
 * @param {(typeof CATALOG)[string]} meta
 * @param {string[]} attrs
 */
function buildSpec(id, meta, attrs) {
    /** @type {Record<string, unknown>} */
    const spec = {
        $schema: "../schema/component-spec.schema.json",
        component: id,
        version: 1,
        export: meta.export,
        anatomy: buildAnatomy(meta.rootAttr, attrs),
        attributes: {
            "data-refineui": meta.rootAttr,
        },
    };

    if (meta.variants) spec.variants = meta.variants;
    if (meta.recipe) spec.recipe = meta.recipe;
    if (meta.tokens) spec.tokens = { visual: meta.tokens };

    if (meta.states?.component) {
        spec.states = { component: meta.states.component };
    }

    /** @type {Record<string, { states: { component: Record<string, string[]> } }>} */
    const dom = {};

    if (id === "scroll-area") {
        dom["scroll-area-scrollbar"] = {
            states: { component: { "data-state": ["visible", "hidden"] } },
        };
    } else if (id === "progress-stepper") {
        dom["progress-stepper-item"] = {
            states: { component: { "data-state": ["complete", "current", "upcoming"] } },
        };
    } else if (id === "stepper") {
        dom["stepper-item"] = {
            states: { component: { "data-state": ["complete", "current", "upcoming"] } },
        };
    } else if (id === "drawer") {
        dom.drawer = {
            states: { component: { "data-state": ["open", "closed"] } },
        };
    } else if (id === "card" && meta.states?.component) {
        dom.card = {
            states: { component: meta.states.component },
        };
    }

    if (Object.keys(dom).length > 0) spec.dom = dom;

    return spec;
}

mkdirSync(specDir, { recursive: true });

/** @type {Array<{ name: string; id: string; spec: string; recipe?: string; export: string; dataRefineui: string[] }>} */
const manifestComponents = [];

for (const [id, meta] of Object.entries(CATALOG)) {
    if (meta.skip) continue;

    /** @type {Set<string>} */
    const attrSet = new Set();
    for (const dirName of meta.sourceDirs) {
        for (const attr of collectDataRefineui(join(componentsRoot, dirName))) {
            // Layout dirs share many attrs — keep only those matching this root prefix
            if (meta.sourceDirs.includes("Layout") && dirName === "Layout") {
                if (attr === meta.rootAttr || attr.startsWith(`${meta.rootAttr}-`)) {
                    attrSet.add(attr);
                }
                continue;
            }
            // Avatar folder also contains avatars attr — filter for avatar vs avatars
            if (id === "avatar" && attr === "avatars") continue;
            if (id === "avatars" && attr === "avatar") {
                // Avatars may compose Avatar; keep avatars only for clarity
                continue;
            }
            attrSet.add(attr);
        }
    }

    // Ensure root is present
    attrSet.add(meta.rootAttr);
    const attrs = [...attrSet].sort();

    const outPath = join(specDir, `${id}.json`);
    if (!PRESERVE.has(id)) {
        const spec = buildSpec(id, meta, attrs);
        writeFileSync(outPath, `${JSON.stringify(spec, null, 2)}\n`);
        console.log("wrote", id);
    } else {
        console.log("preserve", id);
    }

    const entry = {
        name: meta.export,
        id,
        spec: `./components/${id}.json`,
        export: meta.export,
        dataRefineui: attrs,
    };
    if (meta.recipe) entry.recipe = meta.recipe;
    manifestComponents.push(entry);
}

manifestComponents.sort((a, b) => a.id.localeCompare(b.id));

const manifest = {
    schemaVersion: 1,
    contractLayer: "component-spec",
    contractLayerVersion: "1.1",
    status: "catalog",
    description: "Machine-readable manifest of RefineUI Web Kit components and their contract specs.",
    components: manifestComponents,
};

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`manifest: ${manifestComponents.length} components`);
