import type { BadgeVariant } from "./types";

export const badgeStyles = {
    base: "refineui-typo-caption-2 inline-flex items-center justify-center py-refineui-size-xxsmall px-refineui-size-small",
    number: "rounded-refineui-circle",
    label: "rounded-refineui-medium",
} as const;

export const badgeVariantClass: Record<BadgeVariant, string> = {
    default: "bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    neutral: "bg-refineui-alias-background-primary text-refineui-alias-foreground-primary",
    outline:
        "border-refineui-thin border-refineui-alias-border-default border bg-transparent text-refineui-alias-foreground-primary box-border",
    success: "bg-refineui-alias-background-success text-refineui-alias-foreground-inversed",
    warning: "bg-refineui-alias-background-warning text-refineui-alias-foreground-inversed",
    danger: "bg-refineui-alias-background-error text-refineui-alias-foreground-inversed",
};

