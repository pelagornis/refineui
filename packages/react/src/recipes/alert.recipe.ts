/**
 * Alert slot recipe — visual mapping only.
 * Contract (anatomy, states, a11y): packages/react/spec/components/alert.json
 * Tokens: componentColorTokens.alert → semantic aliases
 */
import { componentTypographyTokens } from "../tokens/componentTypographyTokens";
import { componentTextClass } from "../typography";
import { defineSlotRecipe, resolveSlotClasses } from "./types";
import type { AlertVariant } from "../components/Alert/types";

const titleTypography = componentTextClass(componentTypographyTokens.alert.title);
const descriptionTypography = componentTextClass(componentTypographyTokens.alert.description);

/** Semantic alias classes aligned with componentColorTokens.alert.accent / .description */
const variantSlotClasses: Record<AlertVariant, Readonly<Record<string, string>>> = {
    default: {
        root: "bg-refineui-alias-background-primary",
        icon: "text-refineui-alias-foreground-primary",
        title: "text-refineui-alias-foreground-primary",
        description: "text-refineui-alias-foreground-secondary",
    },
    info: {
        root: "bg-refineui-alias-background-primary",
        icon: "text-refineui-alias-foreground-info",
        title: "text-refineui-alias-foreground-info",
        description: "text-refineui-alias-foreground-info",
    },
    success: {
        root: "bg-refineui-alias-background-primary",
        icon: "text-refineui-alias-foreground-success",
        title: "text-refineui-alias-foreground-success",
        description: "text-refineui-alias-foreground-success",
    },
    warning: {
        root: "bg-refineui-alias-background-primary",
        icon: "text-refineui-alias-foreground-warning",
        title: "text-refineui-alias-foreground-warning",
        description: "text-refineui-alias-foreground-warning",
    },
    danger: {
        root: "bg-refineui-alias-background-primary",
        icon: "text-refineui-alias-foreground-error",
        title: "text-refineui-alias-foreground-error",
        description: "text-refineui-alias-foreground-error",
    },
    custom: {
        root: "bg-refineui-alias-background-primary",
        icon: "text-refineui-alias-foreground-discovery",
        title: "text-refineui-alias-foreground-discovery",
        description: "text-refineui-alias-foreground-discovery",
    },
};

export const alertRecipe = defineSlotRecipe({
    name: "alert",
    slots: [
        "root",
        "icon",
        "content",
        "row",
        "body",
        "title",
        "description",
        "actions",
        "action",
        "close",
    ],
    base: {
        root: "box-border flex items-start border-refineui-thin border-refineui-alias-border-default px-refineui-size-large py-refineui-size-medium",
        icon: "relative box-border flex size-refineui-size-xx-large min-w-refineui-size-xx-large shrink-0 items-center justify-center overflow-hidden rounded-refineui-circle",
        content: "flex min-w-0 flex-1 flex-col gap-refineui-size-medium",
        row: "flex w-full flex-row items-start gap-refineui-size-medium",
        body: "flex min-w-0 flex-1 flex-col gap-refineui-size-xx-small",
        title: `${titleTypography} m-0 w-full min-w-0 font-medium`,
        description: `${descriptionTypography} w-full min-w-0 font-medium`,
        actions: "flex w-full flex-row flex-wrap items-center justify-end gap-refineui-size-medium",
        action: "",
        close: "",
    },
    variants: {
        variant: {
            default: variantSlotClasses.default,
            info: variantSlotClasses.info,
            success: variantSlotClasses.success,
            warning: variantSlotClasses.warning,
            danger: variantSlotClasses.danger,
            custom: variantSlotClasses.custom,
        },
    },
    defaultVariants: {
        variant: "info",
    },
});

export const alertVariantIcons: Record<AlertVariant, string> = {
    default: "circle",
    info: "info",
    success: "checkmark",
    warning: "warning",
    danger: "error-circle",
    custom: "star",
};

export function resolveAlertSlotClasses(
    slot: string,
    variant: AlertVariant,
): string {
    return resolveSlotClasses(alertRecipe, slot, { variant });
}

/** Static base slot classes (variant-agnostic) — for docs and style re-exports. */
export const alertStyles = {
    root: alertRecipe.base.root,
    icon: alertRecipe.base.icon,
    content: alertRecipe.base.content,
    row: alertRecipe.base.row,
    body: alertRecipe.base.body,
    title: alertRecipe.base.title,
    description: alertRecipe.base.description,
    actions: alertRecipe.base.actions,
    action: alertRecipe.base.action,
    close: alertRecipe.base.close,
} as const;

export { variantSlotClasses as alertVariantSlotClasses };
