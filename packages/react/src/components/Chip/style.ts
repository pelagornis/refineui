import { iconSizes } from "@refineui/tokens";
import type { ChipSize, ChipVariant } from "./types";

export const chipStyles = {
    root: "inline-flex items-center gap-refineui-size-xsmall rounded-refineui-medium p-refineui-size-small",
    avatarWrap: "inline-flex shrink-0 items-center",
    removeBtnBase: "inline-flex items-center justify-center border-none bg-transparent p-0 leading-none text-inherit",
    removeBtnDisabled: "cursor-not-allowed",
    removeBtnEnabled: "cursor-pointer opacity-70 hover:opacity-100",
} as const;

export const chipVariantClass: Record<ChipVariant, string> = {
    default: "border-none bg-refineui-alias-background-surface text-refineui-alias-foreground-brand",
    outline:
        "border-refineui-thin border-refineui-alias-border-default box-border bg-transparent text-refineui-alias-foreground-brand",
    filled: "border-none bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
};

export const chipDisabledVariantClass: Record<ChipVariant, string> = {
    default: "border-none bg-refineui-alias-background-surface-disabled text-refineui-alias-foreground-disabled",
    outline:
        "border-refineui-thin border-refineui-alias-border-disabled box-border bg-transparent text-refineui-alias-foreground-disabled",
    filled: "border-none bg-refineui-alias-background-surface-disabled text-refineui-alias-foreground-disabled",
};

export const chipSizeTypo: Record<ChipSize, string> = {
    lg: "refineui-typo-body-1",
    md: "refineui-typo-body-3",
    sm: "refineui-typo-caption-1",
};

export const chipSizeIcon: Record<ChipSize, number> = {
    lg: iconSizes.large,
    md: iconSizes.medium,
    sm: iconSizes.xsmall,
};

