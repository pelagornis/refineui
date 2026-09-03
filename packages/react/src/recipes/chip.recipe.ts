/**
 * Chip recipe — visual mapping only.
 * Contract: packages/react/spec/components/chip.json (Tag re-exports Chip)
 * Tokens: componentColorTokens.chip
 */
import { iconSizes } from "@refineui/tokens";
import { buildSemanticTextClassMap } from "../typography";
import { componentTypographyTokens } from "../tokens/componentTypographyTokens";
import { defineRecipe } from "./types";
import type { ChipSize, ChipVariant } from "../components/Chip/types";

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

export const chipSizeClass: Record<ChipSize, string> = {
    sm: "min-h-refineui-chip-min-height-sm px-refineui-size-x-small",
    md: "min-h-refineui-chip-min-height-md px-refineui-size-x-small",
    lg: "min-h-refineui-chip-min-height-lg px-refineui-size-small",
};

export const chipSizeTypo: Record<ChipSize, string> = buildSemanticTextClassMap(componentTypographyTokens.chip);

export const chipSizeIcon: Record<ChipSize, number> = {
    sm: iconSizes.xxsmall,
    md: iconSizes.xsmall,
    lg: iconSizes.small,
};

export const chipRecipe = defineRecipe({
    name: "chip",
    base: "box-border inline-flex max-w-full items-center gap-refineui-size-xx-small rounded-refineui-medium",
    variants: {
        variant: chipVariantClass,
        size: chipSizeClass,
    },
    defaultVariants: {
        variant: "default",
        size: "md",
    },
    cssStates: ["hover", "active", "focus-visible", "disabled"],
});

export const chipStyles = {
    root: chipRecipe.base,
    avatarWrap: "inline-flex shrink-0 items-center",
    removeBtnBase: "inline-flex items-center justify-center border-none bg-transparent p-0 leading-none text-inherit",
    removeBtnDisabled: "cursor-not-allowed",
    removeBtnEnabled: "cursor-pointer opacity-70 hover:opacity-100",
} as const;
