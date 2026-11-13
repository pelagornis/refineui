/**
 * Compile component-owned Tailwind classes into the package stylesheet so
 * consumers do not need to include RefineUI in their own source scanner.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(packageRoot, "refineui.css");
const compiler = await compile(`
@import "../tokens/tailwind.css";

@theme {
    @keyframes refineui-chart-bar-enter {
        from { transform: scaleY(0); }
        to { transform: scaleY(1); }
    }
    @keyframes refineui-chart-line-enter {
        from { stroke-dashoffset: 1; }
        to { stroke-dashoffset: 0; }
    }
    @keyframes refineui-chart-point-enter {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes refineui-fade-enter {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes refineui-fade-exit {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes refineui-navigation-overlay-enter {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes refineui-navigation-overlay-backdrop-enter {
        from { opacity: 0; backdrop-filter: blur(0); }
        to { opacity: 1; backdrop-filter: blur(var(--refineui-blur-overlay-scrim)); }
    }
    @keyframes refineui-navigation-overlay-exit {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes refineui-navigation-overlay-backdrop-exit {
        from { opacity: 1; backdrop-filter: blur(var(--refineui-blur-overlay-scrim)); }
        to { opacity: 0; backdrop-filter: blur(0); }
    }
}

@supports (animation-timeline: view()) {
    @property --refineui-scroll-edge-end { syntax: "<number>"; inherits: false; initial-value: 0; }
    @property --refineui-scroll-edge-start { syntax: "<number>"; inherits: false; initial-value: 0; }
    @keyframes refineui-scroll-edge-falloff {
        cover 0% { --refineui-scroll-edge-end: 1; }
        cover 25% { --refineui-scroll-edge-end: 0; }
        cover 75% { --refineui-scroll-edge-start: 0; }
        cover 100% { --refineui-scroll-edge-start: 1; }
    }
    [data-refineui="scroll-area"] [data-scroll-edge-item] {
        --refineui-scroll-edge-amount: max(calc(var(--refineui-scroll-edge-end) * var(--refineui-scroll-edge-bottom, 0)), calc(var(--refineui-scroll-edge-start) * var(--refineui-scroll-edge-top, 0)));
        filter: blur(calc(var(--refineui-blur-scroll-edge) * var(--refineui-scroll-edge-amount)));
        animation: refineui-scroll-edge-falloff linear both;
        animation-timeline: view();
    }
}

@media (prefers-reduced-transparency: reduce) {
    [data-refineui="dialog"] > [role="presentation"], [data-refineui="drawer"] > [role="presentation"] { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    [data-refineui="menu"], [data-refineui="dropdown-menu"], [data-refineui="select-menu"], [data-refineui="floating-surface"], [data-refineui="sidebar-peek-panel"], [data-refineui="navigation-menu-content-panel"] { background-color: var(--refineui-color-alias-background-primary) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
}

:root {
    --refineui-focus-color: var(--refineui-color-primary-black);
    --refineui-focus-offset: var(--refineui-spacing-size-xxx-small);
    --refineui-bg: var(--refineui-color-neutral-white);
    --refineui-text: var(--refineui-color-primary-black);
    --refineui-border: var(--refineui-color-neutral-300);
    --refineui-placeholder: var(--refineui-color-neutral-450);
    --refineui-btn-primary-hover: var(--refineui-color-alias-background-brand-hover);
    --refineui-btn-primary-pressed: var(--refineui-color-alias-background-brand-active);
}
[data-theme="dark"], .dark {
    --refineui-focus-color: var(--refineui-color-neutral-white);
    --refineui-bg: var(--refineui-color-neutral-900);
    --refineui-text: var(--refineui-color-neutral-250);
    --refineui-border: var(--refineui-color-neutral-700);
    --refineui-placeholder: var(--refineui-color-neutral-550);
    --refineui-btn-primary-hover: var(--refineui-color-alias-background-brand-hover);
    --refineui-btn-primary-pressed: var(--refineui-color-alias-background-brand-active);
    --refineui-btn-danger-hover: var(--refineui-color-red-500);
}
[data-refineui] { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
@media (prefers-contrast: more) {
    [data-refineui="button"], [data-refineui="select-trigger"], [data-refineui="accordion-trigger"], [data-refineui="dialog"], [data-refineui="drawer"], [data-refineui="alert"], [data-refineui="input"], [data-refineui="textarea"], [data-refineui="checkbox"], [data-refineui="radio"], [data-refineui="switch"], [data-refineui="tab"], [data-refineui="badge"], [data-refineui="toast"], [data-refineui="chip"], [data-refineui="segmented-control"], [data-refineui="segmented-control-item"] { border-width: var(--refineui-stroke-width-thick); }
    [data-refineui="toast"] { border-style: solid; border-color: var(--refineui-color-alias-border-default); background-color: var(--refineui-color-alias-surface-popover) !important; backdrop-filter: none; -webkit-backdrop-filter: none; }
    [data-refineui="floating-surface"] { background-color: var(--refineui-color-alias-surface-popover) !important; backdrop-filter: none; -webkit-backdrop-filter: none; }
    [data-refineui="floating-outline"] path { stroke-width: var(--refineui-stroke-width-thick); }
    [data-refineui="dialog"] > [role="presentation"], [data-refineui="drawer"] > [role="presentation"] { backdrop-filter: none; -webkit-backdrop-filter: none; }
    [data-refineui="link"], [data-refineui="breadcrumb-link"], [data-refineui="sidebar-link"] { text-decoration-thickness: from-font; text-underline-offset: 0.12em; }
}
@media (forced-colors: active) {
    [data-refineui="button"]:focus-visible, [data-refineui="accordion-trigger"]:focus-visible, [data-refineui="select-trigger"]:focus-visible, [data-refineui="navigation-menu-trigger"]:focus-visible, [data-refineui="tree-item-trigger"]:focus-visible, [data-refineui="tab"]:focus-visible, [data-refineui="switch"]:focus-visible, [data-refineui="link"]:focus-visible, [data-refineui="pagination"]:focus-visible, [data-refineui="chip-remove"]:focus-visible, [data-refineui="carousel"]:focus-visible, [data-refineui="carousel-nav"]:focus-visible, [data-refineui="segmented-control-item"]:focus-visible, [data-refineui="menu-item"]:focus-visible, [data-refineui="dropdown-item"]:focus-visible, [data-refineui="command-item"]:focus-visible, [data-refineui="calendar-day"]:focus-visible, [data-refineui="sidebar-link"]:focus-visible, [data-refineui="breadcrumb-link"]:focus-visible, [data-refineui="footer-link"]:focus-visible, [data-refineui="search-field-clear"]:focus-visible, [data-refineui="spinbutton-step"]:focus-visible, [data-refineui="radio"]:focus-visible, [data-refineui="slider"]:focus-visible { outline: 2px solid Highlight; outline-offset: var(--refineui-focus-offset); }
    [data-refineui="button"], [data-refineui="select-trigger"], [data-refineui="chip"], [data-refineui="segmented-control"], [data-refineui="segmented-control-item"], [data-refineui="tab"], [data-refineui="switch"], [data-refineui="breadcrumb"], [data-refineui="calendar"], [data-refineui="checkbox"], [data-refineui="footer"], [data-refineui="progress-stepper"], [data-refineui="scroll-area"], [data-refineui="search-field"], [data-refineui="sidebar"], [data-refineui="spinbutton"], [data-refineui="stepper"], [data-refineui="popover"], [data-refineui="badge"], [data-refineui="input"], [data-refineui="textarea"], [data-refineui="toast"], [data-refineui="link"] { border-color: ButtonBorder; }
    [data-refineui="alert"], [data-refineui="card"], [data-refineui="toast"], [data-refineui="popover"], [data-refineui="drawer"], [data-refineui="tooltip"], [data-refineui="menu"], [data-refineui="dropdown-menu"], [data-refineui="select-menu"], [data-refineui="command-list"], [data-refineui="dialog"] { border-color: CanvasText; }
    [data-refineui="toast"] { background-color: Canvas; backdrop-filter: none; -webkit-backdrop-filter: none; }
    [data-refineui="menu"], [data-refineui="dropdown-menu"], [data-refineui="select-menu"], [data-refineui="popover"], [data-refineui="tooltip-panel"], [data-refineui="navigation-menu-content-panel"], [data-refineui="sidebar-peek-panel"] { background-color: Canvas !important; backdrop-filter: none; -webkit-backdrop-filter: none; }
    [data-refineui="floating-chrome"], [data-refineui="command-indicator"] { display: none; }
    [data-refineui="command"] { color: CanvasText; }
    [data-refineui="command-item"][data-selected="true"] { outline: 2px solid Highlight; outline-offset: calc(var(--refineui-focus-offset) * -1); }
    [data-refineui="dialog"] > [role="presentation"], [data-refineui="drawer"] > [role="presentation"] { backdrop-filter: none; -webkit-backdrop-filter: none; }
    [data-refineui="toast-icon"] { color: ButtonText; forced-color-adjust: none; }
    [data-refineui="dialog"], [data-refineui="drawer"], [data-refineui="popover"], [data-refineui="tooltip-panel"] { border: var(--refineui-stroke-width-thin) solid CanvasText; }
    [data-refineui="popover"]:focus-visible { outline: 2px solid Highlight; outline-offset: var(--refineui-focus-offset); }
}
`, {
    base: packageRoot,
    onDependency: () => {},
});
const scanner = new Scanner({
    sources: [{ base: packageRoot, pattern: "src/**/*.{ts,tsx}", negated: false }],
});
const candidates = scanner.scan();

/** Keep utilities in Tailwind's layer so consumers can override component
 * defaults with their own Tailwind classes without specificity workarounds. */
const compiledCss = compiler.build(candidates);

writeFileSync(
    outputPath,
    `/* Generated by scripts/generate-refineui-tailwind.mjs — do not edit. */\n@import "@refineui/web-icons/dist/fonts/refineui-system-icons.css";\n${compiledCss.trimEnd()}\n`,
);
console.log(`Generated Tailwind stylesheet (${candidates.length} candidates).`);
