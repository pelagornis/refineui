import type { SpinnerSize } from "./types";

export const spinnerStyles = {
    ringBase:
        "box-border rounded-refineui-circle border-solid border-refineui-alias-background-brand-subtle border-t-refineui-alias-background-brand",
    label: "text-refineui-alias-foreground-primary",
    withLabel: "inline-flex items-center justify-center gap-refineui-size-small",
} as const;

export const spinnerRingClass: Record<SpinnerSize, string> = {
    xs: "size-refineui-spinner-size-xsmall [border-width:var(--refineui-size-spinner-ring-width-xsmall)]",
    sm: "size-refineui-spinner-size-small [border-width:var(--refineui-size-spinner-ring-width-small)]",
    md: "size-refineui-spinner-size-medium [border-width:var(--refineui-size-spinner-ring-width-medium)]",
    lg: "size-refineui-spinner-size-large [border-width:var(--refineui-size-spinner-ring-width-large)]",
    xl: "size-refineui-spinner-size-xlarge [border-width:var(--refineui-size-spinner-ring-width-xlarge)]",
    xxl: "size-refineui-spinner-size-xxlarge [border-width:var(--refineui-size-spinner-ring-width-xxlarge)]",
};

export const spinnerLabelTypo: Record<SpinnerSize, string> = {
    xs: "refineui-typo-caption-1",
    sm: "refineui-typo-body-2",
    md: "refineui-typo-body-1",
    lg: "refineui-typo-sub-title-2",
    xl: "refineui-typo-sub-title-1",
    xxl: "refineui-typo-title-3",
};

