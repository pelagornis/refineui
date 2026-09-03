/**
 * Alert recipe slot → token trace bindings.
 * Declared mapping aligned with packages/react/src/recipes/alert.recipe.ts — not inferred at runtime.
 */
import type { TokenTraceRef } from "./token-trace";

export type AlertRecipeTokenBinding = Readonly<{
    slot: string;
    variant?: string;
    property: string;
    trace: TokenTraceRef;
    recipeClass: string;
}>;

/** Variant-specific and base visual token bindings for Alert slots. */
export const ALERT_RECIPE_TOKEN_BINDINGS: readonly AlertRecipeTokenBinding[] = [
    {
        slot: "root",
        property: "background",
        trace: { kind: "component", path: "alert.background" },
        recipeClass: "bg-refineui-alias-background-primary",
    },
    {
        slot: "root",
        variant: "danger",
        property: "background",
        trace: { kind: "semantic", name: "backgroundErrorSubtle" },
        recipeClass: "bg-refineui-alias-background-error-subtle",
    },
    {
        slot: "root",
        property: "border",
        trace: { kind: "component", path: "alert.border" },
        recipeClass: "border-refineui-alias-border-default",
    },
    {
        slot: "title",
        variant: "default",
        property: "foreground",
        trace: { kind: "component", path: "alert.title" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "icon",
        variant: "default",
        property: "foreground",
        trace: { kind: "component", path: "alert.accent.default" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "description",
        variant: "default",
        property: "foreground",
        trace: { kind: "component", path: "alert.description.default" },
        recipeClass: "text-refineui-alias-foreground-secondary",
    },
    {
        slot: "icon",
        variant: "info",
        property: "foreground",
        trace: { kind: "semantic", name: "foregroundInfo" },
        recipeClass: "text-refineui-alias-foreground-info",
    },
    {
        slot: "title",
        variant: "info",
        property: "foreground",
        trace: { kind: "semantic", name: "foregroundInfo" },
        recipeClass: "text-refineui-alias-foreground-info",
    },
    {
        slot: "description",
        variant: "info",
        property: "foreground",
        trace: { kind: "semantic", name: "backgroundInfo" },
        recipeClass: "text-refineui-alias-background-info",
    },
    {
        slot: "icon",
        variant: "success",
        property: "foreground",
        trace: { kind: "semantic", name: "foregroundSuccess" },
        recipeClass: "text-refineui-alias-foreground-success",
    },
    {
        slot: "title",
        variant: "success",
        property: "foreground",
        trace: { kind: "semantic", name: "foregroundSuccess" },
        recipeClass: "text-refineui-alias-foreground-success",
    },
    {
        slot: "description",
        variant: "success",
        property: "foreground",
        trace: { kind: "semantic", name: "backgroundSuccess" },
        recipeClass: "text-refineui-alias-background-success",
    },
    {
        slot: "icon",
        variant: "warning",
        property: "foreground",
        trace: { kind: "semantic", name: "foregroundWarning" },
        recipeClass: "text-refineui-alias-foreground-warning",
    },
    {
        slot: "title",
        variant: "warning",
        property: "foreground",
        trace: { kind: "semantic", name: "foregroundWarning" },
        recipeClass: "text-refineui-alias-foreground-warning",
    },
    {
        slot: "description",
        variant: "warning",
        property: "foreground",
        trace: { kind: "semantic", name: "backgroundWarning" },
        recipeClass: "text-refineui-alias-background-warning",
    },
    {
        slot: "icon",
        variant: "danger",
        property: "foreground",
        trace: { kind: "semantic", name: "foregroundError" },
        recipeClass: "text-refineui-alias-foreground-error",
    },
    {
        slot: "title",
        variant: "danger",
        property: "foreground",
        trace: { kind: "semantic", name: "foregroundError" },
        recipeClass: "text-refineui-alias-foreground-error",
    },
    {
        slot: "description",
        variant: "danger",
        property: "foreground",
        trace: { kind: "semantic", name: "backgroundError" },
        recipeClass: "text-refineui-alias-background-error",
    },
    {
        slot: "icon",
        variant: "custom",
        property: "foreground",
        trace: { kind: "semantic", name: "foregroundDiscovery" },
        recipeClass: "text-refineui-alias-foreground-discovery",
    },
    {
        slot: "title",
        variant: "custom",
        property: "foreground",
        trace: { kind: "semantic", name: "foregroundDiscovery" },
        recipeClass: "text-refineui-alias-foreground-discovery",
    },
    {
        slot: "description",
        variant: "custom",
        property: "foreground",
        trace: { kind: "semantic", name: "backgroundDiscovery" },
        recipeClass: "text-refineui-alias-background-discovery",
    },
];

export function filterAlertRecipeBindings(
    variant: string = "info",
): readonly AlertRecipeTokenBinding[] {
    return ALERT_RECIPE_TOKEN_BINDINGS.filter((binding) => {
        if (!binding.variant) {
            if (binding.property === "background" && variant === "danger") return false;
            return true;
        }
        return binding.variant === variant;
    });
}
