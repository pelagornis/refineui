/**
 * Badge recipe — visual mapping only.
 * Contract: packages/react/spec/components/badge.json
 * Tokens: componentColorTokens.badge
 */
import { clsx } from "clsx";
import { componentTypographyTokens } from "../tokens/componentTypographyTokens";
import { componentTextClass } from "../typography";
import { defineRecipe } from "./types";
import type { BadgeVariant } from "../components/Badge/types";

export const badgeVariantClass: Record<BadgeVariant, string> = {
    default: "bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    neutral: "bg-refineui-alias-background-primary text-refineui-alias-foreground-primary",
    outline:
        "border-refineui-thin border-refineui-alias-border-default border bg-transparent text-refineui-alias-foreground-primary box-border",
    success: "bg-refineui-alias-background-success text-refineui-alias-foreground-inversed",
    warning: "bg-refineui-alias-background-warning text-refineui-alias-foreground-inversed",
    danger: "bg-refineui-alias-background-error text-refineui-alias-foreground-inversed",
};

export const badgeRecipe = defineRecipe({
    name: "badge",
    base: clsx(
        componentTextClass(componentTypographyTokens.badge),
        "inline-flex items-center justify-center py-refineui-size-xxsmall px-refineui-size-small",
    ),
    variants: {
        variant: badgeVariantClass,
        layout: {
            label: "rounded-refineui-medium",
            number: "rounded-refineui-circle",
        },
    },
    defaultVariants: {
        variant: "default",
        layout: "label",
    },
});

export const badgeStyles = {
    base: badgeRecipe.base,
    number: badgeRecipe.variants?.layout.number ?? "rounded-refineui-circle",
    label: badgeRecipe.variants?.layout.label ?? "rounded-refineui-medium",
} as const;
