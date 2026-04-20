import type { SpinnerSize } from "./types";

export const spinnerStyles = {
    ringBase:
        "box-border rounded-refineui-circle border-solid border-refineui-alias-background-brand-subtle border-t-refineui-alias-background-brand",
    label: "text-refineui-alias-foreground-primary",
    withLabel: "inline-flex items-center justify-center gap-refineui-size-small",
} as const;

export const spinnerRingClass: Record<SpinnerSize, string> = {
    xSmall:
        "size-refineui-spinner-size-xsmall [border-width:var(--refineui-size-spinner-ring-width-xsmall)]",
    small: "size-refineui-spinner-size-small [border-width:var(--refineui-size-spinner-ring-width-small)]",
    medium:
        "size-refineui-spinner-size-medium [border-width:var(--refineui-size-spinner-ring-width-medium)]",
    large: "size-refineui-spinner-size-large [border-width:var(--refineui-size-spinner-ring-width-large)]",
    xLarge:
        "size-refineui-spinner-size-xlarge [border-width:var(--refineui-size-spinner-ring-width-xlarge)]",
    xxLarge:
        "size-refineui-spinner-size-xxlarge [border-width:var(--refineui-size-spinner-ring-width-xxlarge)]",
};

export const spinnerLabelTypo: Record<SpinnerSize, string> = {
    xSmall: "refineui-typo-caption-1",
    small: "refineui-typo-body-2",
    medium: "refineui-typo-body-1",
    large: "refineui-typo-sub-title-2",
    xLarge: "refineui-typo-sub-title-1",
    xxLarge: "refineui-typo-title-3",
};

