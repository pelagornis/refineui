import type { FoundationSizeName, SemanticColorName, SpacingTokens, StrokeWidthTokens } from "@refineui/tokens";
import type { LayoutAlign, LayoutDirection, LayoutGap, LayoutJustify, LayoutWrap } from "./types";

export function layoutKebab(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .replace(/([a-zA-Z])(\d)/g, "$1-$2")
        .toLowerCase();
}

export function layoutAliasColorVar(name: SemanticColorName): string {
    return `var(--refineui-color-alias-${layoutKebab(name)})`;
}

export function layoutFoundationSizeVar(name: FoundationSizeName): string {
    return `var(--refineui-size-${layoutKebab(name)})`;
}

export function layoutStrokeVar(name: keyof StrokeWidthTokens): string {
    const rest = name.replace(/^strokeWidth/, "");
    const kebab = rest.charAt(0).toLowerCase() + rest.slice(1);
    return `var(--refineui-stroke-width-${layoutKebab(kebab)})`;
}

export function layoutRadiusVar(name: string): string {
    return `var(--refineui-radius-${layoutKebab(name)})`;
}

export const layoutGapClass = {
    sizeNone: "gap-refineui-size-none",
    sizeXXXSmall: "gap-refineui-size-xxx-small",
    sizeXXSmall: "gap-refineui-size-xx-small",
    sizeXSmall: "gap-refineui-size-x-small",
    sizeSmall: "gap-refineui-size-small",
    sizeMedium: "gap-refineui-size-medium",
    sizeLarge: "gap-refineui-size-large",
    sizeXLarge: "gap-refineui-size-x-large",
    sizeXXLarge: "gap-refineui-size-xx-large",
    sizeXXXLarge: "gap-refineui-size-xxx-large",
} as const satisfies Record<keyof SpacingTokens, string>;

export const layoutPaddingXClass = {
    sizeNone: "px-refineui-size-none",
    sizeXXXSmall: "px-refineui-size-xxx-small",
    sizeXXSmall: "px-refineui-size-xx-small",
    sizeXSmall: "px-refineui-size-x-small",
    sizeSmall: "px-refineui-size-small",
    sizeMedium: "px-refineui-size-medium",
    sizeLarge: "px-refineui-size-large",
    sizeXLarge: "px-refineui-size-x-large",
    sizeXXLarge: "px-refineui-size-xx-large",
    sizeXXXLarge: "px-refineui-size-xxx-large",
} as const satisfies Record<keyof SpacingTokens, string>;

export const layoutDirectionClass: Record<LayoutDirection, string> = {
    row: "flex-row",
    column: "flex-col",
    "row-reverse": "flex-row-reverse",
    "column-reverse": "flex-col-reverse",
};

export const layoutColumnGapClass = {
    sizeNone: "gap-x-refineui-size-none",
    sizeXXXSmall: "gap-x-refineui-size-xxx-small",
    sizeXXSmall: "gap-x-refineui-size-xx-small",
    sizeXSmall: "gap-x-refineui-size-x-small",
    sizeSmall: "gap-x-refineui-size-small",
    sizeMedium: "gap-x-refineui-size-medium",
    sizeLarge: "gap-x-refineui-size-large",
    sizeXLarge: "gap-x-refineui-size-x-large",
    sizeXXLarge: "gap-x-refineui-size-xx-large",
    sizeXXXLarge: "gap-x-refineui-size-xxx-large",
} as const satisfies Record<keyof SpacingTokens, string>;

export const layoutRowGapClass = {
    sizeNone: "gap-y-refineui-size-none",
    sizeXXXSmall: "gap-y-refineui-size-xxx-small",
    sizeXXSmall: "gap-y-refineui-size-xx-small",
    sizeXSmall: "gap-y-refineui-size-x-small",
    sizeSmall: "gap-y-refineui-size-small",
    sizeMedium: "gap-y-refineui-size-medium",
    sizeLarge: "gap-y-refineui-size-large",
    sizeXLarge: "gap-y-refineui-size-x-large",
    sizeXXLarge: "gap-y-refineui-size-xx-large",
    sizeXXXLarge: "gap-y-refineui-size-xxx-large",
} as const satisfies Record<keyof SpacingTokens, string>;

export const layoutAlignClass: Record<LayoutAlign, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
};

export const layoutJustifyClass: Record<LayoutJustify, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
};

export const layoutWrapClass: Record<LayoutWrap, string> = {
    nowrap: "flex-nowrap",
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
};

export const layoutSpacingVar = {
    sizeNone: "var(--refineui-spacing-size-none)",
    sizeXXXSmall: "var(--refineui-spacing-size-xxx-small)",
    sizeXXSmall: "var(--refineui-spacing-size-xx-small)",
    sizeXSmall: "var(--refineui-spacing-size-x-small)",
    sizeSmall: "var(--refineui-spacing-size-small)",
    sizeMedium: "var(--refineui-spacing-size-medium)",
    sizeLarge: "var(--refineui-spacing-size-large)",
    sizeXLarge: "var(--refineui-spacing-size-x-large)",
    sizeXXLarge: "var(--refineui-spacing-size-xx-large)",
    sizeXXXLarge: "var(--refineui-spacing-size-xxx-large)",
} as const satisfies Record<LayoutGap, string>;

export const layoutStyles = {
    stack: "box-border min-w-0",
    grid: "box-border grid min-w-0 w-full",
    gridItem: "box-border min-w-0",
    container: "box-border mx-auto w-full max-w-full",
    box: "box-border min-w-0",
    spacer: "box-border min-h-0 min-w-0 flex-1 self-stretch",
} as const;

export const GRID_COLUMN_MIN = 1;
export const GRID_COLUMN_MAX = 12;

export function resolveGridSpan(span: number): number {
    const n = Math.floor(span);
    if (!Number.isFinite(n)) return GRID_COLUMN_MIN;
    return Math.min(GRID_COLUMN_MAX, Math.max(GRID_COLUMN_MIN, n));
}
