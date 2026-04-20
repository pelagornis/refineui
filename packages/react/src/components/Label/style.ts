import type { LabelProps } from "./types";

export const labelStyles = {
    base: "mb-refineui-size-xsmall block",
    disabled: "text-refineui-alias-foreground-disabled",
    enabled: "text-refineui-alias-foreground-primary",
    required: "ml-refineui-size-xxsmall text-refineui-alias-foreground-error",
} as const;

export const labelSizeTypo: Record<NonNullable<LabelProps["size"]>, string> = {
    sm: "refineui-typo-caption-1",
    md: "refineui-typo-body-2",
    lg: "refineui-typo-body-1",
};

