/**
 * Replace px/scale in refineui.css with `@refineui/tokens` `css-variables.css` vars.
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pathCss = join(__dirname, "../refineui.css");
let css = readFileSync(pathCss, "utf8");

const pairs = [
    [
        /var\(--refineui-btn-primary-hover,\s*var\(--refineui-color-neutral-700\)\)/g,
        "var(--refineui-btn-primary-hover)",
    ],
    [
        /var\(--refineui-btn-primary-pressed,\s*var\(--refineui-color-neutral-black\)\)/g,
        "var(--refineui-btn-primary-pressed)",
    ],
    ["min-width: 36px", "min-width: var(--refineui-size-pagination-button-min-width)"],
    ["min-height: 36px", "min-height: var(--refineui-size-pagination-button-min-width)"],
    ["padding: 8px", "padding: var(--refineui-spacing-size-350)"],
    ["border-radius: 8px", "border-radius: var(--refineui-radius-rounded-large)"],
    ["border: 1px solid", "border: var(--refineui-stroke-width-thin) solid"],
    ["border-width: 2px", "border-width: var(--refineui-stroke-width-thick)"],
    [
        "padding: 7px",
        "padding: calc(var(--refineui-spacing-size-350) - var(--refineui-stroke-width-thin))",
    ],
    [
        "transform: scale(0.98)",
        "transform: scale(var(--refineui-motion-button-active-scale))",
    ],
    ["outline: 2px solid", "outline: var(--refineui-stroke-width-thick) solid"],
    ["outline-offset: 2px", "outline-offset: var(--refineui-spacing-size-xx-small)"],
    ["text-underline-offset: 2px", "text-underline-offset: var(--refineui-spacing-size-xx-small)"],
    ["border-radius: 4px", "border-radius: var(--refineui-radius-rounded-small)"],
    ["border-radius: 9999px", "border-radius: var(--refineui-radius-rounded-circle)"],
    ["border: 2px solid", "border: var(--refineui-stroke-width-thick) solid"],
    ["box-shadow: 0 0 0 1px", "box-shadow: 0 0 0 var(--refineui-stroke-width-thin)"],
    ["box-shadow: 0 0 0 2px", "box-shadow: 0 0 0 var(--refineui-stroke-width-thick)"],
    ["  height: 4px", "  height: var(--refineui-size-slider-track-height-md)"],
    ["  height: 2px", "  height: var(--refineui-size-slider-track-height-sm)"],
    ["  border-radius: 2px", "  border-radius: var(--refineui-radius-rounded-xsmall)"],
    ["width: 16px", "width: var(--refineui-size-control-checkbox)"],
    ["height: 16px", "height: var(--refineui-size-control-checkbox)"],
    ["margin-top: -6px", "margin-top: calc(-1 * var(--refineui-spacing-size-small))"],
    [
        "margin-top: -7px",
        "margin-top: calc(-1 * (var(--refineui-spacing-size-small) + var(--refineui-spacing-size-minimal)))",
    ],
    [
        "transform: scale(1.15)",
        "transform: scale(var(--refineui-motion-slider-thumb-hover-scale))",
    ],
];

for (const [a, b] of pairs) {
    if (typeof a === "string") {
        css = css.split(a).join(b);
    } else {
        css = css.replace(a, b);
    }
}

writeFileSync(pathCss, css, "utf8");
console.log("Applied dimension tokens to", pathCss);
