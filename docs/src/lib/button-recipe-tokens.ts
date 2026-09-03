/**
 * Button recipe slot → token trace bindings.
 * Aligned with packages/react/src/recipes/button.recipe.ts — not inferred at runtime.
 */
import type { TokenTraceRef } from "./token-trace";

export type ButtonRecipeTokenBinding = Readonly<{
    slot: string;
    variant?: string;
    property: string;
    trace: TokenTraceRef;
    recipeClass: string;
}>;

export const BUTTON_RECIPE_TOKEN_BINDINGS: readonly ButtonRecipeTokenBinding[] = [
    {
        slot: "root",
        variant: "primary",
        property: "background",
        trace: { kind: "component", path: "button.primary.background" },
        recipeClass: "bg-refineui-alias-background-brand",
    },
    {
        slot: "root",
        variant: "primary",
        property: "foreground",
        trace: { kind: "component", path: "button.primary.foreground" },
        recipeClass: "text-refineui-alias-foreground-inversed",
    },
    {
        slot: "root",
        variant: "secondary",
        property: "background",
        trace: { kind: "component", path: "button.secondary.background" },
        recipeClass: "bg-refineui-alias-background-surface",
    },
    {
        slot: "root",
        variant: "secondary",
        property: "foreground",
        trace: { kind: "component", path: "button.secondary.foreground" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "root",
        variant: "secondary",
        property: "border",
        trace: { kind: "component", path: "button.secondary.border" },
        recipeClass: "border-refineui-alias-border-default",
    },
    {
        slot: "root",
        variant: "outline",
        property: "foreground",
        trace: { kind: "component", path: "button.outline.foreground" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "root",
        variant: "outline",
        property: "border",
        trace: { kind: "component", path: "button.outline.border" },
        recipeClass: "border-refineui-alias-border-default",
    },
    {
        slot: "root",
        variant: "ghost",
        property: "foreground",
        trace: { kind: "component", path: "button.ghost.foreground" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
];

export function filterButtonRecipeBindings(variant: string): ButtonRecipeTokenBinding[] {
    return BUTTON_RECIPE_TOKEN_BINDINGS.filter((b) => !b.variant || b.variant === variant);
}
