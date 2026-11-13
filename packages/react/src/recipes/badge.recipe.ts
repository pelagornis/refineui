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
    default: "bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed hover:bg-refineui-alias-background-brand-hover active:bg-refineui-alias-background-brand-active",
    neutral: "bg-refineui-alias-background-brand-subtle text-refineui-alias-foreground-brand-strong hover:bg-refineui-alias-background-primary-hover active:bg-refineui-alias-background-primary-active",
    outline:
        "border-refineui-thin border-refineui-alias-border-default border bg-transparent text-refineui-alias-foreground-primary box-border active:border-refineui-alias-border-strong",
    success: "bg-refineui-alias-background-success text-refineui-alias-foreground-inversed hover:bg-refineui-alias-background-success-hover active:bg-refineui-alias-background-success-subtle",
    warning: "bg-refineui-alias-background-warning text-refineui-alias-foreground-inversed hover:bg-refineui-alias-background-warning-hover active:bg-refineui-alias-background-warning-subtle",
    danger: "bg-refineui-alias-background-error text-refineui-alias-foreground-inversed hover:bg-refineui-alias-background-error-hover active:bg-refineui-alias-background-error-subtle",
};

export const badgeRecipe = defineRecipe({
    name: "badge",
    base: clsx(
        componentTextClass(componentTypographyTokens.badge),
        "inline-flex items-center justify-center py-refineui-size-xxsmall px-refineui-size-small transition-[background-color,border-color] duration-[var(--refineui-motion-duration-fast)]",
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
