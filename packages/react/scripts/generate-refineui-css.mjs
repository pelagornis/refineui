/**
 * RefineUI CSS 산출물 (`@refineui/tokens/dist`에 기록):
 * - css-variables.css — :root var(--refineui-*)
 * - tailwind-theme.css — @theme
 * - refineui-typography.css — @utility refineui-typo-*
 *
 * `@refineui/tokens` 빌드 산출물 + `componentSizes`를 합쳐 레이아웃 치수 변수를 완성한다.
 * 실행: `pnpm --filter @refineui/react build` (tsup 이후).
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const NS = "refineui";

const tokensDist = join(__dirname, "../../tokens/dist/index.mjs");
const reactDist = join(__dirname, "../dist/index.js");

const {
    borderRadii,
    colors,
    motion,
    overlays,
    semanticColors,
    shadows,
    spacings,
    strokeWidths,
    toBoxShadow,
    typographys,
    zIndex,
} = await import(tokensDist);

const { componentSizes, foundationSizes } = await import(reactDist);

const mergedSizes = { ...foundationSizes, ...componentSizes };

function toKebab(str) {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/([a-zA-Z])(\d)/g, "$1-$2")
        .toLowerCase();
}

function emitCssVarBlock(cssPrefix, obj) {
    return Object.entries(obj).map(
        ([k, v]) => `  --refineui-${cssPrefix}-${toKebab(k)}: ${v};`,
    );
}

function strokeWidthEntries() {
    return Object.entries(strokeWidths).map(([k, v]) => {
        const rest = k.replace(/^strokeWidth/, "");
        const kebab = toKebab(rest.charAt(0).toLowerCase() + rest.slice(1));
        return { kebab, value: v };
    });
}

function radiusUtilitySuffix(radiusKey) {
    const kb = toKebab(radiusKey);
    return kb.startsWith("rounded-") ? kb.slice("rounded-".length) : kb;
}

function zIndexKebab(key) {
    const rest = key.replace(/^zIndex/, "");
    return toKebab(rest.charAt(0).toLowerCase() + rest.slice(1));
}

/** 타이포 CSS 변수 + @utility 블록 문자열 */
function typographyBlocks() {
    const rootLines = [];
    const utilityBlocks = [];
    const TYPO_PROPS = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing"];

    for (const [name, t] of Object.entries(typographys)) {
        const kb = toKebab(name);
        const decls = [];
        for (const prop of TYPO_PROPS) {
            const v = t[prop];
            if (v == null) continue;
            const pk = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
            rootLines.push(`  --refineui-typography-${kb}-${pk}: ${v};`);
            decls.push(`  ${pk}: var(--refineui-typography-${kb}-${pk});`);
        }
        if (decls.length) {
            utilityBlocks.push(`@utility refineui-typo-${kb} {\n${decls.join("\n")}\n}`);
        }
    }
    return { rootLines, utilityBlocks };
}

function shadowElevationLines() {
    const root = [];
    const theme = [];
    for (const [name, level] of Object.entries(shadows)) {
        const kb = toKebab(name);
        const suff = kb.startsWith("shadow-") ? kb.slice("shadow-".length) : kb;
        const val = toBoxShadow(level);
        root.push(`  --refineui-elevation-${suff}: ${val};`);
        theme.push(`  --shadow-${NS}-${suff}: var(--refineui-elevation-${suff});`);
    }
    return { root, theme };
}

function zIndexLines() {
    const root = [];
    const theme = [];
    for (const [k, v] of Object.entries(zIndex)) {
        const kb = zIndexKebab(k);
        root.push(`  --refineui-z-${kb}: ${v};`);
        theme.push(`  --z-index-${NS}-${kb}: var(--refineui-z-${kb});`);
    }
    return { root, theme };
}

function emitTailwindThemeLines(shadowTheme, zTheme) {
    const lines = [];
    for (const k of Object.keys(colors)) {
        const kb = toKebab(k);
        lines.push(`  --color-${NS}-${kb}: var(--refineui-color-${kb});`);
    }
    for (const k of Object.keys(spacings)) {
        const kb = toKebab(k);
        lines.push(`  --spacing-${NS}-${kb}: var(--refineui-spacing-${kb});`);
    }
    for (const { kebab } of strokeWidthEntries()) {
        lines.push(`  --border-width-${NS}-${kebab}: var(--refineui-stroke-width-${kebab});`);
    }
    for (const k of Object.keys(borderRadii)) {
        const kb = toKebab(k);
        lines.push(`  --radius-${NS}-${radiusUtilitySuffix(k)}: var(--refineui-radius-${kb});`);
    }
    for (const k of Object.keys(mergedSizes)) {
        const kb = toKebab(k);
        lines.push(`  --spacing-${NS}-${kb}: var(--refineui-size-${kb});`);
    }
    for (const k of Object.keys(overlays)) {
        const kb = toKebab(k);
        lines.push(`  --color-${NS}-overlay-${kb}: var(--refineui-overlay-${kb});`);
    }
    for (const k of Object.keys(semanticColors)) {
        const kb = toKebab(k);
        lines.push(`  --color-${NS}-alias-${kb}: var(--refineui-color-alias-${kb});`);
    }
    lines.push(...shadowTheme);
    lines.push(...zTheme);
    return lines.sort();
}

const { rootLines: typoRoot, utilityBlocks } = typographyBlocks();
const { root: elevRoot, theme: shadowTheme } = shadowElevationLines();
const { root: zRoot, theme: zTheme } = zIndexLines();

const tokensDistDir = join(__dirname, "../../tokens/dist");

const rootInner = [
    "  /* Palette & foundation colors */",
    ...emitCssVarBlock("color", colors),
    "  /* Spacing */",
    ...emitCssVarBlock("spacing", spacings),
    "  /* Stroke width */",
    ...strokeWidthEntries().map(
        ({ kebab, value }) => `  --refineui-stroke-width-${kebab}: ${value};`,
    ),
    "  /* Border radius */",
    ...emitCssVarBlock("radius", borderRadii),
    "  /* Layout sizes (foundationSizes + componentSizes) */",
    ...emitCssVarBlock("size", mergedSizes),
    "  /* Motion */",
    ...emitCssVarBlock("motion", motion),
    "  /* Overlays */",
    ...emitCssVarBlock("overlay", overlays),
    "  /* Typography presets */",
    ...typoRoot,
    "  /* Elevation (box-shadow) */",
    ...elevRoot,
    "  /* Z-index */",
    ...zRoot,
    "  /* Semantic colors — Foundation Alias/Color (Light mode) */",
    ...Object.entries(semanticColors).map(
        ([k, v]) => `  --refineui-color-alias-${toKebab(k)}: ${v.light};`,
    ),
];

const semanticDarkLines = Object.entries(semanticColors).map(
    ([k, v]) => `  --refineui-color-alias-${toKebab(k)}: ${v.dark};`,
);

const cssDest = join(tokensDistDir, "css-variables.css");
writeFileSync(
    cssDest,
    `:root {\n${rootInner.join("\n")}\n}\n\n[data-theme="dark"], .dark {\n${semanticDarkLines.join("\n")}\n}\n`,
    "utf8",
);
console.log("Wrote", cssDest);

const themeDest = join(tokensDistDir, "tailwind-theme.css");
writeFileSync(
    themeDest,
    `@theme {\n${emitTailwindThemeLines(shadowTheme, zTheme).join("\n")}\n}\n`,
    "utf8",
);
console.log("Wrote", themeDest);

const typoCssDest = join(tokensDistDir, "refineui-typography.css");
writeFileSync(typoCssDest, `${utilityBlocks.join("\n\n")}\n`, "utf8");
console.log("Wrote", typoCssDest);
