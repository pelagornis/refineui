import type { SpinnerSize } from "./types";
import { buildSemanticTextClassMap } from "../../typography";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";

export const spinnerStyles = {
    ringBase:
        "box-border rounded-refineui-circle border-solid border-refineui-alias-background-brand-subtle border-t-refineui-alias-background-brand",
    label: "text-refineui-alias-foreground-primary",
    withLabel: "inline-flex items-center justify-center gap-refineui-size-x-small",
} as const;

export const spinnerRingClass: Record<SpinnerSize, string> = {
    xs: "size-refineui-spinner-size-x-small [border-width:var(--refineui-size-spinner-ring-width-x-small)]",
    sm: "size-refineui-spinner-size-small [border-width:var(--refineui-size-spinner-ring-width-small)]",
    md: "size-refineui-spinner-size-medium [border-width:var(--refineui-size-spinner-ring-width-medium)]",
    lg: "size-refineui-spinner-size-large [border-width:var(--refineui-size-spinner-ring-width-large)]",
    xl: "size-refineui-spinner-size-x-large [border-width:var(--refineui-size-spinner-ring-width-x-large)]",
    xxl: "size-refineui-spinner-size-xx-large [border-width:var(--refineui-size-spinner-ring-width-xx-large)]",
};

export const spinnerLabelTypo: Record<SpinnerSize, string> = buildSemanticTextClassMap(
    componentTypographyTokens.spinner,
);
