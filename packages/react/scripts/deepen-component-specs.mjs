/**
 * Merge deep contracts (a11y / keyboard / focus / environment / layout)
 * into catalog Component Specs. Preserves anatomy/variants from expand script.
 *
 * Usage: node packages/react/scripts/deepen-component-specs.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const specDir = join(__dirname, "../spec/components");
const PRESERVE = new Set(["alert", "button", "accordion", "dialog"]);

/** @type {Record<string, Partial<{
 *   states: object;
 *   accessibility: object;
 *   keyboard: object;
 *   focus: object;
 *   layout: object;
 *   dom: object;
 * }>>} */
const DEEP = {
    tabs: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            "tabs-list": {
                element: "div",
                role: "tablist",
            },
            tab: {
                element: "button",
                role: "tab",
                requiredAttributes: {
                    "aria-selected": { required: true, type: "boolean" },
                    "aria-controls": { required: true, type: "string" },
                },
            },
        },
        keyboard: {
            ArrowRight: "next-trigger",
            ArrowDown: "next-trigger",
            ArrowLeft: "previous-trigger",
            ArrowUp: "previous-trigger",
            Home: "first-trigger",
            End: "last-trigger",
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
            behavior: { roving: true },
        },
        layout: { direction: "logical", rtl: true },
    },
    select: {
        states: {
            pseudo: ["focus-visible"],
            component: { "data-state": ["open", "closed", "pressed", "selected"] },
            environment: ["forced-colors", "dir"],
        },
        dom: {
            "select-trigger": {
                states: { component: { "data-state": ["open", "closed"] } },
            },
            "select-item": {
                states: { component: { "data-state": ["pressed", "selected"] } },
            },
        },
        accessibility: {
            "select-trigger": {
                element: "button",
                role: "combobox",
                requiredAttributes: {
                    "aria-expanded": { required: true, type: "boolean" },
                },
            },
            "select-menu": { element: "div", role: "listbox" },
            "select-item": {
                element: "div",
                role: "option",
                requiredAttributes: {
                    "aria-selected": { required: true, type: "boolean" },
                },
            },
        },
        keyboard: {
            Escape: "close",
            ArrowDown: "next-trigger",
            ArrowUp: "previous-trigger",
            Home: "first-trigger",
            End: "last-trigger",
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    menu: {
        states: {
            pseudo: ["focus-visible"],
            component: { "data-state": ["open", "closed", "default", "hover", "pressed", "active", "disabled"] },
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            menu: { element: "div", role: "menu" },
            "menu-item": { element: "div", role: "menuitem" },
        },
        keyboard: {
            Escape: "close",
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    dropdown: {
        states: {
            pseudo: ["focus-visible"],
            component: { "data-state": ["pressed", "selected", "open"] },
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            "dropdown-menu": { element: "div", role: "menu" },
            "dropdown-item": { element: "div", role: "menuitem" },
        },
        keyboard: {
            Escape: "close",
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    command: {
        states: {
            pseudo: ["focus-visible"],
            component: { "data-state": ["disabled", "active", "default"] },
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            "command-item": {
                element: "div",
                role: "option",
                requiredAttributes: {
                    "aria-selected": { required: true, type: "boolean" },
                },
            },
        },
        keyboard: {
            ArrowDown: "next-trigger",
            ArrowUp: "previous-trigger",
            Home: "first-trigger",
            End: "last-trigger",
            Enter: "activate",
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    "navigation-menu": {
        states: {
            pseudo: ["focus-visible"],
            component: { "data-state": ["open", "closed"] },
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            "navigation-menu-trigger": {
                element: "button",
                requiredAttributes: {
                    "aria-expanded": { required: true, type: "boolean" },
                    "aria-controls": { required: true, type: "string" },
                },
            },
            "navigation-menu-content": { element: "div", role: "region" },
        },
        keyboard: {
            Escape: "close",
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
    },
    tree: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            tree: { element: "div", role: "tree" },
            "tree-item": {
                element: "div",
                role: "treeitem",
                requiredAttributes: {
                    "aria-selected": { required: true, type: "boolean" },
                },
            },
            "tree-item-trigger": { element: "button" },
        },
        keyboard: {
            ArrowDown: "next-trigger",
            ArrowUp: "previous-trigger",
            Home: "first-trigger",
            End: "last-trigger",
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
            behavior: { roving: true },
        },
        layout: { direction: "logical", rtl: true },
    },
    carousel: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            carousel: { element: "div" },
            "carousel-item": { element: "div", role: "group" },
            "carousel-indicator": {
                element: "button",
                role: "tab",
                requiredAttributes: {
                    "aria-selected": { required: true, type: "boolean" },
                },
            },
        },
        keyboard: {
            ArrowRight: "next-trigger",
            ArrowLeft: "previous-trigger",
            Home: "first-trigger",
            End: "last-trigger",
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
    },
    "segmented-control": {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            "segmented-control": { element: "div", role: "radiogroup" },
            "segmented-control-item": {
                element: "button",
                role: "radio",
                requiredAttributes: {
                    "aria-checked": { required: true, type: "boolean" },
                },
            },
        },
        keyboard: {
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
            behavior: { roving: true },
        },
        layout: { direction: "logical", rtl: true },
    },
    "search-field": {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            "search-field-input": {
                element: "input",
                native: true,
            },
            "search-field-clear": {
                element: "button",
                native: true,
            },
        },
        keyboard: {
            Escape: "close",
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    calendar: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            calendar: { element: "div", role: "grid" },
            "calendar-day": { element: "button", role: "gridcell" },
        },
        keyboard: {
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
    },
    chip: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            "chip-remove": {
                element: "button",
                native: true,
            },
        },
        keyboard: {
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    tag: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            "chip-remove": {
                element: "button",
                native: true,
            },
        },
        keyboard: {
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    pagination: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        keyboard: {
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    link: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        keyboard: {
            Enter: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    breadcrumb: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            "breadcrumb-page": {
                element: "div",
                role: "link",
            },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    sidebar: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    footer: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    toast: {
        states: {
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            toast: { element: "div", role: "status" },
        },
        layout: { direction: "logical", rtl: true },
    },
    progress: {
        accessibility: {
            progress: {
                element: "div",
                role: "progressbar",
            },
        },
        layout: { direction: "logical", rtl: true },
    },
    spinner: {
        accessibility: {
            spinner: { element: "div", role: "status" },
        },
        layout: { direction: "logical", rtl: true },
    },
    field: {
        accessibility: {
            "field-error": { element: "div", role: "alert" },
        },
        layout: { direction: "logical", rtl: true },
    },
    divider: {
        accessibility: {
            divider: { element: "div", role: "separator" },
        },
    },
    skeleton: {
        accessibility: {
            skeleton: { element: "div" },
        },
        layout: { direction: "logical", rtl: true },
    },
    input: {
        accessibility: {
            input: { element: "input", native: true },
        },
        layout: { direction: "logical", rtl: true },
    },
    textarea: {
        accessibility: {
            textarea: { element: "input", native: true },
        },
        layout: { direction: "logical", rtl: true },
    },
    "input-otp": {
        accessibility: {
            "input-otp": { element: "div", role: "group" },
        },
        keyboard: {
            ArrowLeft: "previous-trigger",
            ArrowRight: "next-trigger",
        },
        layout: { direction: "logical", rtl: true },
    },
    resizable: {
        accessibility: {
            "resizable-handle": {
                element: "div",
                role: "separator",
            },
        },
        keyboard: {
            Home: "first-trigger",
            End: "last-trigger",
        },
    },
    "progress-stepper": {
        states: {
            component: { "data-state": ["complete", "current", "upcoming"] },
            environment: ["forced-colors", "dir"],
        },
        dom: {
            "progress-stepper-item": {
                states: { component: { "data-state": ["complete", "current", "upcoming"] } },
            },
        },
        accessibility: {
            "progress-stepper-track": {
                element: "div",
                role: "progressbar",
            },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
    },
    stepper: {
        states: {
            component: { "data-state": ["complete", "current", "upcoming"] },
            environment: ["forced-colors", "dir"],
        },
        dom: {
            "stepper-item": {
                states: { component: { "data-state": ["complete", "current", "upcoming"] } },
            },
        },
        keyboard: {
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        layout: { direction: "logical", rtl: true },
    },
    checkbox: {
        states: {
            environment: ["forced-colors", "dir"],
        },
        keyboard: {
            Space: { action: "activate", native: true },
        },
        layout: { direction: "logical", rtl: true },
    },
    switch: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            switch: {
                element: "button",
                role: "switch",
                native: true,
            },
        },
        keyboard: {
            Enter: { action: "activate", native: true },
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    "spin-button": {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            spinbutton: {
                element: "div",
                role: "spinbutton",
            },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    slider: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            slider: {
                element: "input",
                native: true,
            },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    radio: {
        states: {
            pseudo: ["focus-visible"],
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            radio: {
                element: "input",
                native: true,
            },
        },
        keyboard: {
            Space: { action: "activate", native: true },
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
        },
        layout: { direction: "logical", rtl: true },
    },
    tooltip: {
        states: {
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            tooltip: { element: "div", role: "tooltip" },
        },
        keyboard: {
            Escape: "close",
        },
        layout: { direction: "logical", rtl: true },
    },
    popover: {
        states: {
            environment: ["forced-colors", "dir"],
        },
        accessibility: {
            popover: {
                element: "div",
                role: "dialog",
            },
        },
        keyboard: {
            Escape: "close",
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
            behavior: { trap: true, initial: "first-focusable", return: "trigger" },
        },
    },
    drawer: {
        states: {
            component: { "data-state": ["open", "closed"] },
            environment: ["forced-colors", "dir"],
        },
        dom: {
            drawer: {
                states: { component: { "data-state": ["open", "closed"] } },
            },
        },
        accessibility: {
            drawer: {
                element: "div",
                role: "dialog",
            },
        },
        keyboard: {
            Escape: "close",
        },
        focus: {
            visual: { required: true, selector: ":focus-visible" },
            behavior: { trap: true, initial: "first-focusable", return: "trigger" },
        },
        layout: { direction: "logical", rtl: true },
    },
    badge: {
        layout: { direction: "logical", rtl: true },
    },
    box: {
        layout: { direction: "logical", rtl: true },
    },
    stack: {
        layout: { direction: "logical", rtl: true },
    },
    grid: {
        layout: { direction: "logical", rtl: true },
    },
    container: {
        layout: { direction: "logical", rtl: true },
    },
    spacer: {
        layout: { direction: "logical", rtl: true },
    },
    card: {
        states: {
            component: { "data-state": ["default", "hover", "pressed", "disabled"] },
            environment: ["forced-colors", "dir"],
        },
        dom: {
            card: {
                states: { component: { "data-state": ["default", "hover", "pressed", "disabled"] } },
            },
        },
        layout: { direction: "logical", rtl: true },
    },
    text: {
        layout: { direction: "logical", rtl: true },
    },
    avatars: {
        layout: { direction: "logical", rtl: true },
    },
    "scroll-area": {
        states: {
            component: { "data-state": ["visible", "hidden"] },
            environment: ["forced-colors", "dir"],
        },
        dom: {
            "scroll-area-scrollbar": {
                states: { component: { "data-state": ["visible", "hidden"] } },
            },
        },
        layout: { direction: "logical", rtl: true },
    },

};

function mergeDeep(id) {
    const path = join(specDir, `${id}.json`);
    if (!existsSync(path)) {
        console.warn("missing", id);
        return;
    }
    const base = JSON.parse(readFileSync(path, "utf8"));
    const patch = DEEP[id];
    if (!patch) return;

    for (const [key, value] of Object.entries(patch)) {
        if (value && typeof value === "object" && !Array.isArray(value) && key !== "layout" && key !== "focus") {
            base[key] = { ...(base[key] ?? {}), ...value };
        } else if (key === "keyboard" && value && Object.keys(value).length === 0) {
            // skip empty keyboard
        } else {
            base[key] = value;
        }
    }

    // Clean empty keyboard
    if (base.keyboard && Object.keys(base.keyboard).length === 0) delete base.keyboard;

    writeFileSync(path, `${JSON.stringify(base, null, 2)}\n`);
    console.log("deepened", id);
}

for (const id of Object.keys(DEEP)) {
    if (PRESERVE.has(id)) {
        console.log("preserve", id);
        continue;
    }
    mergeDeep(id);
}

console.log("done");
