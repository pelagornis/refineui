import type { AlertVariant } from "./types";

export const alertStyles = {
    iconSlot:
        "relative box-border flex size-refineui-size-xxlarge min-w-refineui-size-xxlarge shrink-0 items-center justify-center overflow-hidden rounded-refineui-circle",
    bodyCol: "flex min-w-0 flex-1 flex-col gap-refineui-size-xsmall",
    root: "box-border flex items-start rounded-refineui-large border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary px-refineui-size-large py-refineui-size-medium",
    contentCol: "flex min-w-0 flex-1 flex-col gap-refineui-size-medium",
    row: "flex w-full flex-row items-start gap-refineui-size-medium",
    actionRow: "flex w-full flex-row flex-wrap items-center justify-end gap-refineui-size-medium",
    titleBase: "m-0 w-full min-w-0 refineui-typo-caption-1 font-medium",
    descriptionBase: "w-full min-w-0 refineui-typo-caption-1 font-medium",
} as const;

export const variantTitleClass: Record<AlertVariant, string> = {
    default: "text-refineui-alias-foreground-primary",
    info: "text-refineui-alias-foreground-info",
    success: "text-refineui-alias-foreground-success",
    warning: "text-refineui-alias-foreground-warning",
    danger: "text-refineui-alias-foreground-error",
    custom: "text-refineui-alias-foreground-discovery",
};

export const variantDescriptionClass: Record<AlertVariant, string> = {
    default: "text-refineui-alias-foreground-secondary",
    info: "text-refineui-alias-background-info",
    success: "text-refineui-alias-background-success",
    warning: "text-refineui-alias-background-warning",
    danger: "text-refineui-alias-background-error",
    custom: "text-refineui-alias-background-discovery",
};

export const variantIconNames: Record<AlertVariant, string> = {
    default: "circle",
    info: "info",
    success: "checkmark",
    warning: "warning",
    danger: "error-circle",
    custom: "star",
};

