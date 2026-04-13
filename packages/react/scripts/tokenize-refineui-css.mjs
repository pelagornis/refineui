/**
 * refineui.css의 팔레트 hex를 @refineui/tokens `css-variables.css`의 `var(--refineui-color-*)`로 치환.
 * 실행: node packages/react/scripts/tokenize-refineui-css.mjs (repo 루트에서)
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

/* 팔레트 3자리·문서용 단축 hex */
css = css.replace(/#333\b/g, "var(--refineui-color-neutral-750)");
css = css.replace(/#888888/gi, "var(--refineui-color-neutral-550)");

/** 긴 hex 먼저 */
const hexes = [...byHex.keys()].sort((a, b) => b.length - a.length);

for (const hex of hexes) {
    const re = new RegExp(hex.replace(/#/g, "\\#"), "gi");
    css = css.replace(re, () => byHex.get(hex.toLowerCase()));
}

writeFileSync(pathCss, css, "utf8");
console.log("Tokenized color hex in", pathCss);
