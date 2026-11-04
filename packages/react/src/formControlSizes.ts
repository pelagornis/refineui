/** Shared sm / md / lg tiers for Input, SpinButton, SearchField — keep in sync. */
import { componentTypographyTokens, type ControlSize } from "./tokens/componentTypographyTokens";
import { sizedComponentTextClass } from "./typography";

export type FormControlSize = ControlSize;

const minHeight: Record<FormControlSize, string> = {
    sm: "min-h-refineui-control-height-sm",
    md: "min-h-refineui-control-height-md",
    lg: "min-h-refineui-control-height-lg",
};

const fixedHeight: Record<FormControlSize, string> = {
    sm: "h-refineui-control-height-sm min-h-refineui-control-height-sm",
    md: "h-refineui-control-height-md min-h-refineui-control-height-md",
    lg: "h-refineui-control-height-lg min-h-refineui-control-height-lg",
};

const radius: Record<FormControlSize, string> = {
    sm: "rounded-refineui-large",
    md: "rounded-refineui-x-large",
    lg: "rounded-refineui-xx-large",
};

const paddingInline: Record<FormControlSize, string> = {
    sm: "px-refineui-size-medium",
    md: "px-refineui-size-large",
    lg: "px-refineui-size-x-large",
};

const paddingBlock: Record<FormControlSize, string> = {
    sm: "py-refineui-size-x-small",
    md: "py-refineui-size-medium",
    lg: "py-refineui-size-large",
};

const padding: Record<FormControlSize, string> = {
    sm: [paddingInline.sm, paddingBlock.sm].join(" "),
    md: [paddingInline.md, paddingBlock.md].join(" "),
    lg: [paddingInline.lg, paddingBlock.lg].join(" "),
};

const typography: Record<FormControlSize, string> = {
    sm: sizedComponentTextClass(componentTypographyTokens.formControl, "sm"),
    md: sizedComponentTextClass(componentTypographyTokens.formControl, "md"),
    lg: sizedComponentTextClass(componentTypographyTokens.formControl, "lg"),
};

export const formControlTypoClass = typography;

/** `<input>` — flexible height, grows with content if needed */
export const formControlInputSizeClass: Record<FormControlSize, string> = {
    sm: [minHeight.sm, radius.sm, padding.sm, typography.sm].join(" "),
    md: [minHeight.md, radius.md, padding.md, typography.md].join(" "),
    lg: [minHeight.lg, radius.lg, padding.lg, typography.lg].join(" "),
};

/** Fixed-height field shell (SpinButton). Select trigger uses Navigation Menu density instead. */
export const formControlShellSizeClass: Record<FormControlSize, string> = {
    sm: [fixedHeight.sm, radius.sm, padding.sm, typography.sm].join(" "),
    md: [fixedHeight.md, radius.md, padding.md, typography.md].join(" "),
    lg: [fixedHeight.lg, radius.lg, padding.lg, typography.lg].join(" "),
};

/**
 * Single-row field with inline adornments (SearchField) — the fixed height centers the row,
 * so only inline padding applies; typography is set separately so `plain` can reuse it.
 */
export const formControlRowShellSizeClass: Record<FormControlSize, string> = {
    sm: [fixedHeight.sm, radius.sm, paddingInline.sm].join(" "),
    md: [fixedHeight.md, radius.md, paddingInline.md].join(" "),
    lg: [fixedHeight.lg, radius.lg, paddingInline.lg].join(" "),
};

/**
 * SpinButton shell — same control height + radius as other fields,
 * no outer padding (stepper must sit flush on the trailing edge).
 */
export const formControlShellHeightClass: Record<FormControlSize, string> = {
    sm: [fixedHeight.sm, radius.sm].join(" "),
    md: [fixedHeight.md, radius.md].join(" "),
    lg: [fixedHeight.lg, radius.lg].join(" "),
};
