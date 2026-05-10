/**
 * Replace palette hex in refineui.css with `var(--refineui-color-*)` from `@refineui/tokens` `css-variables.css`.
 * Run: node packages/react/scripts/tokenize-refineui-css.mjs (from repo root)
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { colors } = await import(join(__dirname, "../../tokens/dist/index.mjs"));

function toKebab(str) {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/([a-zA-Z])(\d)/g, "$1-$2")
        .toLowerCase();
}

const pathCss = join(__dirname, "../refineui.css");
let css = readFileSync(pathCss, "utf8");

/** hex → var(--refineui-color-*) */
const byHex = new Map();
for (const [k, v] of Object.entries(colors)) {
    const name = `var(--refineui-color-${toKebab(k)})`;
    byHex.set(v.toLowerCase(), name);
}

/* Palette 3-digit / doc shorthand hex */
css = css.replace(/#333\b/g, "var(--refineui-color-neutral-750)");
css = css.replace(/#888888/gi, "var(--refineui-color-neutral-550)");

/** Longer hex first */
const hexes = [...byHex.keys()].sort((a, b) => b.length - a.length);

for (const hex of hexes) {
    const re = new RegExp(hex.replace(/#/g, "\\#"), "gi");
    css = css.replace(re, () => byHex.get(hex.toLowerCase()));
}

writeFileSync(pathCss, css, "utf8");
console.log("Tokenized color hex in", pathCss);
