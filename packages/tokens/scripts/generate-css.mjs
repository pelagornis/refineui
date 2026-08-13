/**
 * Emit `@refineui/tokens` CSS artifacts into `dist/`:
 * - css-variables.css — :root / dark semantic + motion + theme elevation
 * - tailwind-theme.css — @theme
 * - refineui-typography.css — @utility refineui-typo-*
 *
 * Web Kit `componentSizes` alias Foundation size vars (no raw px dump).
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const NS = "refineui";
const tokensDist = join(__dirname, "../dist/index.mjs");

const {
    borderRadii,
    colors,
    componentSizes,
    componentSizeFoundationKeys,
    foundationSizes,
    iconSizes,
    motion,
    opacities,
    overlays,
    semanticColors,
    semanticShadows,
    shadow2Lighter,
    spacings,
    strokeWidths,
    toBoxShadow,
    typographys,
    SEMANTIC_TEXT,
    zIndex,
} = await import(tokensDist);

function toKebab(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
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

/** Semantic text roles → Foundation typography vars (`--refineui-text-body-md-font-size`, …) */
function semanticTextAliasLines() {
    const props = ["font-family", "font-size", "font-weight", "line-height"];
    return Object.entries(SEMANTIC_TEXT).flatMap(([role, foundation]) => {
        const roleKebab = toKebab(role);
        const foundationKebab = toKebab(foundation);
        return props.map(
            (prop) =>
                `  --refineui-text-${roleKebab}-${prop}: var(--refineui-typography-${foundationKebab}-${prop});`,
        );
    });
}

/** Explicit light/dark elevations + theme-switched `--refineui-elevation-N` */
function shadowElevationLines() {
    const root = [];
    const dark = [];
    const theme = [];

    for (const [name, pair] of Object.entries(semanticShadows)) {
        const n = name.replace(/^shadow/, "");
        const lightVal = toBoxShadow(pair.light);
        const darkVal = toBoxShadow(pair.dark);

        root.push(`  --refineui-elevation-${n}light: ${lightVal};`);
        root.push(`  --refineui-elevation-${n}dark: ${darkVal};`);
        root.push(`  --refineui-elevation-${n}: var(--refineui-elevation-${n}light);`);

        dark.push(`  --refineui-elevation-${n}: var(--refineui-elevation-${n}dark);`);

        theme.push(`  --shadow-${NS}-${n}light: var(--refineui-elevation-${n}light);`);
        theme.push(`  --shadow-${NS}-${n}dark: var(--refineui-elevation-${n}dark);`);
        theme.push(`  --shadow-${NS}-${n}: var(--refineui-elevation-${n});`);
    }

    const softer = toBoxShadow(shadow2Lighter);
    root.push(`  --refineui-elevation-2lighter: ${softer};`);
    theme.push(`  --shadow-${NS}-2lighter: var(--refineui-elevation-2lighter);`);

    return { root, dark, theme };
}

/**
 * Foundation motion steps + Semantic role aliases (typography-style cascade).
 *
 * Foundation:  --refineui-foundation-motion-duration-150: 150ms
 * Semantic:    --refineui-motion-duration-fast: var(--refineui-foundation-motion-duration-150)
 *
 * Scale roles (`enter` / `press` / `hoverGrow`) are primary; component aliases
 * (`dialog-enter-scale`, `button-active-scale`, `slider-thumb-hover-scale`) point at roles.
 */
function interactionMotionLines() {
    const root = [];

    for (const [k, v] of Object.entries(motion.duration)) {
        const step = k.replace(/^duration/, "") || "0";
        root.push(`  --refineui-foundation-motion-duration-${step}: ${v};`);
    }
    for (const [k, v] of Object.entries(motion.easing)) {
        const rest = k.replace(/^easing/, "");
        const kb = toKebab(rest.charAt(0).toLowerCase() + rest.slice(1));
        root.push(`  --refineui-foundation-motion-easing-${kb}: ${v};`);
    }
    for (const [k, v] of Object.entries(motion.scale)) {
        const step = k.replace(/^scale/, "");
        root.push(`  --refineui-foundation-motion-scale-${step}: ${v};`);
    }
    for (const [k, v] of Object.entries(motion.distance)) {
        const step = k.replace(/^distance/, "");
        root.push(`  --refineui-foundation-motion-distance-${step}: ${v};`);
    }

    /** Semantic duration role → Foundation duration step suffix */
    const durationStepByRole = {
        instant: "0",
        fast: "150",
        normal: "180",
        medium: "200",
        slow: "240",
        overlay: "280",
        panel: "320",
        accordionPanel: "380",
        accordionContent: "260",
        skeleton: "1500",
        spinner: "800",
    };
    for (const [role, step] of Object.entries(durationStepByRole)) {
        root.push(
            `  --refineui-motion-duration-${toKebab(role)}: var(--refineui-foundation-motion-duration-${step});`,
        );
    }

    /** Semantic easing role → Foundation easing kebab (matches easing* key rest) */
    const easingStepByRole = {
        standard: "standard",
        emphasized: "emphasized",
        panel: "panel",
        content: "content",
        linear: "linear",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
    };
    for (const [role, step] of Object.entries(easingStepByRole)) {
        root.push(
            `  --refineui-motion-easing-${toKebab(role)}: var(--refineui-foundation-motion-easing-${step});`,
        );
    }

    // Role scales (preferred in new CSS)
    root.push(`  --refineui-motion-scale-enter: var(--refineui-foundation-motion-scale-96);`);
    root.push(`  --refineui-motion-scale-press: var(--refineui-foundation-motion-scale-98);`);
    root.push(
        `  --refineui-motion-scale-hover-grow: var(--refineui-foundation-motion-scale-115);`,
    );
    // Component aliases → role scales (Dialog / Button / Slider existing vars)
    root.push(`  --refineui-motion-dialog-enter-scale: var(--refineui-motion-scale-enter);`);
    root.push(`  --refineui-motion-button-active-scale: var(--refineui-motion-scale-press);`);
    root.push(
        `  --refineui-motion-slider-thumb-hover-scale: var(--refineui-motion-scale-hover-grow);`,
    );

    root.push(
        `  --refineui-motion-distance-float: var(--refineui-foundation-motion-distance-4);`,
    );

    return root;
}

function opacityEntries() {
    return Object.entries(opacities).map(([k, v]) => {
        const rest = k.replace(/^opacity/, "");
        const kebab = toKebab(rest.charAt(0).toLowerCase() + rest.slice(1));
        return { kebab, value: v };
    });
}

function iconSizeLines() {
    return Object.entries(iconSizes).map(
        ([k, v]) => `  --refineui-icon-size-${toKebab(k)}: ${v}px;`,
    );
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

function componentSizeRootLines() {
    const lines = [];
    for (const [k, foundationKey] of Object.entries(componentSizeFoundationKeys)) {
        const foundationKebab = toKebab(foundationKey);
        lines.push(
            `  --refineui-size-${toKebab(k)}: var(--refineui-size-${foundationKebab});`,
        );
    }
    /** Viewport unit — not a Foundation px step */
    lines.push(
        `  --refineui-size-dialog-max-height-viewport: ${componentSizes.dialogMaxHeightViewport};`,
    );
    return lines;
}

function componentSizeThemeLines() {
    const lines = Object.keys(componentSizeFoundationKeys).map((k) => {
        const kb = toKebab(k);
        return `  --spacing-${NS}-${kb}: var(--refineui-size-${kb});`;
    });
    lines.push(
        `  --spacing-${NS}-dialog-max-height-viewport: var(--refineui-size-dialog-max-height-viewport);`,
    );
    return lines;
}

function emitTailwindThemeLines(shadowTheme, zTheme) {
    const lines = [];
    for (const k of Object.keys(colors)) {
        lines.push(`  --color-${NS}-${toKebab(k)}: var(--refineui-color-${toKebab(k)});`);
    }
    for (const k of Object.keys(spacings)) {
        lines.push(`  --spacing-${NS}-${toKebab(k)}: var(--refineui-spacing-${toKebab(k)});`);
    }
    for (const { kebab } of strokeWidthEntries()) {
        lines.push(`  --border-width-${NS}-${kebab}: var(--refineui-stroke-width-${kebab});`);
    }
    for (const k of Object.keys(borderRadii)) {
        lines.push(
            `  --radius-${NS}-${radiusUtilitySuffix(k)}: var(--refineui-radius-${toKebab(k)});`,
        );
    }
    for (const k of Object.keys(foundationSizes)) {
        lines.push(`  --spacing-${NS}-${toKebab(k)}: var(--refineui-size-${toKebab(k)});`);
    }
    for (const k of Object.keys(iconSizes)) {
        lines.push(`  --spacing-${NS}-icon-${toKebab(k)}: var(--refineui-icon-size-${toKebab(k)});`);
    }
    lines.push(...componentSizeThemeLines());
    for (const { kebab } of opacityEntries()) {
        lines.push(`  --opacity-${NS}-${kebab}: var(--refineui-opacity-${kebab});`);
    }
    // Backdrop overlays theme via semantic alias
    lines.push(`  --color-${NS}-overlay-backdrop: var(--refineui-overlay-backdrop);`);
    lines.push(
        `  --color-${NS}-overlay-ghost-button-hover-dark: var(--refineui-overlay-ghost-button-hover-dark);`,
    );
    for (const k of Object.keys(semanticColors)) {
        lines.push(`  --color-${NS}-alias-${toKebab(k)}: var(--refineui-color-alias-${toKebab(k)});`);
    }
    lines.push(...shadowTheme);
    lines.push(...zTheme);
    return lines.sort();
}

const { rootLines: typoRoot, utilityBlocks } = typographyBlocks();
const { root: elevRoot, dark: elevDark, theme: shadowTheme } = shadowElevationLines();
const { root: zRoot, theme: zTheme } = zIndexLines();

const tokensDistDir = join(__dirname, "../dist");

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
    "  /* Foundation layout sizes */",
    ...emitCssVarBlock("size", foundationSizes),
    "  /* Web Kit component sizes → Foundation vars */",
    ...componentSizeRootLines(),
    "  /* Icon sizes */",
    ...iconSizeLines(),
    "  /* Opacity */",
    ...opacityEntries().map(
        ({ kebab, value }) => `  --refineui-opacity-${kebab}: ${value};`,
    ),
    "  /* Motion — Foundation steps + Semantic role aliases */",
    ...interactionMotionLines(),
    "  /* Overlays — backdrop tracks semantic surfaceOverlay for theme */",
    `  --refineui-overlay-backdrop: var(--refineui-color-alias-surface-overlay);`,
    `  --refineui-overlay-ghost-button-hover-dark: ${overlays.ghostButtonHoverDark};`,
    "  /* Typography presets */",
    ...typoRoot,
    "  /* Semantic text roles (alias Foundation typography) */",
    ...semanticTextAliasLines(),
    "  /* Elevation (box-shadow) — *-light/*-dark explicit; bare = theme */",
    ...elevRoot,
    "  /* Z-index */",
    ...zRoot,
    "  /* Semantic colors — Light mode */",
    ...Object.entries(semanticColors).map(
        ([k, v]) => `  --refineui-color-alias-${toKebab(k)}: ${v.light};`,
    ),
];

const darkInner = [
    ...Object.entries(semanticColors).map(
        ([k, v]) => `  --refineui-color-alias-${toKebab(k)}: ${v.dark};`,
    ),
    "  /* Theme-aware elevation */",
    ...elevDark,
];

const cssDest = join(tokensDistDir, "css-variables.css");
writeFileSync(
    cssDest,
    `:root {\n${rootInner.join("\n")}\n}\n\n[data-theme="dark"], .dark {\n${darkInner.join("\n")}\n}\n`,
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
