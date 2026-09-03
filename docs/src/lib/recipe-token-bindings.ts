/**
 * Shared recipe → token bindings for TokenInspector.
 */
import type { TokenTraceRef } from "./token-trace";
import { filterAlertRecipeBindings } from "./alert-recipe-tokens";
import { filterButtonRecipeBindings } from "./button-recipe-tokens";

export type RecipeTokenBinding = Readonly<{
    slot: string;
    variant?: string;
    property: string;
    trace: TokenTraceRef;
    recipeClass: string;
}>;

export const ACCORDION_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "item",
        property: "background",
        trace: { kind: "component", path: "accordion.content.background" },
        recipeClass: "bg-refineui-alias-background-primary-hover",
    },
    {
        slot: "trigger",
        property: "foreground",
        trace: { kind: "component", path: "accordion.trigger.foreground" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "content",
        property: "foreground",
        trace: { kind: "component", path: "accordion.content.foreground" },
        recipeClass: "text-refineui-alias-foreground-secondary",
    },
];

export const DIALOG_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "panel",
        property: "background",
        trace: { kind: "component", path: "dialog.panel.background" },
        recipeClass: "bg-refineui-alias-background-primary",
    },
    {
        slot: "title",
        property: "foreground",
        trace: { kind: "component", path: "dialog.title.foreground" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "description",
        property: "foreground",
        trace: { kind: "component", path: "dialog.description.foreground" },
        recipeClass: "text-refineui-alias-foreground-secondary",
    },
];

export const BADGE_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "root",
        variant: "default",
        property: "background",
        trace: { kind: "component", path: "badge.default.background" },
        recipeClass: "bg-refineui-alias-background-brand",
    },
    {
        slot: "root",
        variant: "default",
        property: "foreground",
        trace: { kind: "component", path: "badge.default.foreground" },
        recipeClass: "text-refineui-alias-foreground-inversed",
    },
    {
        slot: "root",
        variant: "success",
        property: "background",
        trace: { kind: "component", path: "badge.success.background" },
        recipeClass: "bg-refineui-alias-background-success",
    },
    {
        slot: "root",
        variant: "danger",
        property: "background",
        trace: { kind: "component", path: "badge.danger.background" },
        recipeClass: "bg-refineui-alias-background-error",
    },
    {
        slot: "root",
        variant: "warning",
        property: "background",
        trace: { kind: "component", path: "badge.warning.background" },
        recipeClass: "bg-refineui-alias-background-warning",
    },
    {
        slot: "root",
        variant: "outline",
        property: "border",
        trace: { kind: "component", path: "badge.outline.border" },
        recipeClass: "border-refineui-alias-border-default",
    },
];

export const TOAST_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "root",
        property: "background",
        trace: { kind: "component", path: "toast.background" },
        recipeClass: "bg-refineui-alias-surface-popover",
    },
    {
        slot: "message",
        property: "foreground",
        trace: { kind: "component", path: "toast.message" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "icon",
        variant: "default",
        property: "foreground",
        trace: { kind: "component", path: "toast.accent.default" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "icon",
        variant: "success",
        property: "foreground",
        trace: { kind: "component", path: "toast.accent.success" },
        recipeClass: "text-refineui-alias-foreground-success",
    },
    {
        slot: "icon",
        variant: "error",
        property: "foreground",
        trace: { kind: "component", path: "toast.accent.error" },
        recipeClass: "text-refineui-alias-foreground-error",
    },
    {
        slot: "icon",
        variant: "warning",
        property: "foreground",
        trace: { kind: "component", path: "toast.accent.warning" },
        recipeClass: "text-refineui-alias-foreground-warning",
    },
];

export const TABS_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "list",
        property: "border",
        trace: { kind: "component", path: "tabs.listLine" },
        recipeClass: "after:bg-refineui-alias-border-default",
    },
    {
        slot: "indicator",
        property: "background",
        trace: { kind: "component", path: "tabs.selectedLine" },
        recipeClass: "bg-refineui-alias-background-brand",
    },
    {
        slot: "trigger",
        property: "foreground",
        trace: { kind: "component", path: "tabs.itemForeground" },
        recipeClass: "text-refineui-alias-foreground-tertiary",
    },
    {
        slot: "trigger",
        variant: "selected",
        property: "foreground",
        trace: { kind: "component", path: "tabs.selectedForeground" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
];

export const CHIP_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "root",
        variant: "default",
        property: "background",
        trace: { kind: "component", path: "chip.default.background" },
        recipeClass: "bg-refineui-alias-background-surface",
    },
    {
        slot: "root",
        variant: "default",
        property: "foreground",
        trace: { kind: "component", path: "chip.default.foreground" },
        recipeClass: "text-refineui-alias-foreground-brand",
    },
    {
        slot: "root",
        variant: "outline",
        property: "border",
        trace: { kind: "component", path: "chip.outline.border" },
        recipeClass: "border-refineui-alias-border-default",
    },
    {
        slot: "root",
        variant: "filled",
        property: "background",
        trace: { kind: "component", path: "chip.filled.background" },
        recipeClass: "bg-refineui-alias-background-brand",
    },
    {
        slot: "root",
        variant: "filled",
        property: "foreground",
        trace: { kind: "component", path: "chip.filled.foreground" },
        recipeClass: "text-refineui-alias-foreground-inversed",
    },
];

export const SEGMENTED_CONTROL_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "root",
        property: "background",
        trace: { kind: "component", path: "segmentedControl.barBackground" },
        recipeClass: "bg-refineui-alias-background-brand-subtle",
    },
    {
        slot: "root",
        property: "border",
        trace: { kind: "component", path: "segmentedControl.barBorder" },
        recipeClass: "border-refineui-alias-border-default",
    },
    {
        slot: "indicator",
        property: "background",
        trace: { kind: "component", path: "segmentedControl.selectedBackground" },
        recipeClass: "bg-refineui-alias-background-brand",
    },
    {
        slot: "item",
        property: "foreground",
        trace: { kind: "component", path: "segmentedControl.itemForeground" },
        recipeClass: "text-refineui-alias-foreground-secondary",
    },
    {
        slot: "item",
        variant: "selected",
        property: "foreground",
        trace: { kind: "component", path: "segmentedControl.selectedForeground" },
        recipeClass: "text-refineui-alias-foreground-on-brand",
    },
];

export const SWITCH_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "track",
        variant: "on",
        property: "background",
        trace: { kind: "component", path: "switch.track.on" },
        recipeClass: "bg-refineui-alias-background-brand",
    },
    {
        slot: "track",
        variant: "off",
        property: "background",
        trace: { kind: "component", path: "switch.track.off" },
        recipeClass: "bg-refineui-alias-background-primary-active",
    },
    {
        slot: "thumb",
        property: "background",
        trace: { kind: "component", path: "switch.thumb.default" },
        recipeClass: "bg-refineui-alias-background-primary",
    },
];

export const CHECKBOX_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "label",
        property: "foreground",
        trace: { kind: "component", path: "checkbox.label.default" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "description",
        property: "foreground",
        trace: { kind: "component", path: "checkbox.label.description" },
        recipeClass: "text-refineui-alias-foreground-secondary",
    },
    {
        slot: "checkIcon",
        property: "foreground",
        trace: { kind: "component", path: "checkbox.checkIcon.default" },
        recipeClass: "text-refineui-alias-foreground-inversed",
    },
];

export const SELECT_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "trigger",
        property: "background",
        trace: { kind: "component", path: "select.background" },
        recipeClass: "bg-refineui-alias-background-primary",
    },
    {
        slot: "trigger",
        property: "border",
        trace: { kind: "component", path: "select.border.default" },
        recipeClass: "border-refineui-alias-border-default",
    },
    {
        slot: "trigger",
        property: "foreground",
        trace: { kind: "component", path: "select.text" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "trigger",
        property: "placeholder",
        trace: { kind: "component", path: "select.placeholder" },
        recipeClass: "text-refineui-alias-foreground-placeholder",
    },
];

export const SPINNER_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "ring",
        property: "track",
        trace: { kind: "component", path: "spinner.track" },
        recipeClass: "border-refineui-alias-background-brand-subtle",
    },
    {
        slot: "ring",
        property: "indicator",
        trace: { kind: "component", path: "spinner.indicator" },
        recipeClass: "border-t-refineui-alias-background-brand",
    },
    {
        slot: "label",
        property: "foreground",
        trace: { kind: "component", path: "spinner.label" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
];

export const INPUT_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "root",
        property: "text",
        trace: { kind: "component", path: "input.text" },
        recipeClass:
            "text-refineui-alias-foreground-primary placeholder:text-refineui-alias-foreground-placeholder",
    },
    {
        slot: "root",
        property: "placeholder",
        trace: { kind: "component", path: "input.placeholder" },
        recipeClass: "placeholder:text-refineui-alias-foreground-placeholder",
    },
    {
        slot: "root",
        property: "background",
        trace: { kind: "component", path: "input.background" },
        recipeClass: "bg-refineui-alias-background-primary",
    },
    {
        slot: "root",
        property: "disabledBackground",
        trace: { kind: "component", path: "input.disabledBackground" },
        recipeClass: "bg-refineui-alias-background-surface-disabled",
    },
    {
        slot: "root",
        property: "border.default",
        trace: { kind: "component", path: "input.border.default" },
        recipeClass: "border-refineui-thin border-refineui-alias-border-default",
    },
    {
        slot: "root",
        property: "border.focus",
        trace: { kind: "component", path: "input.border.focus" },
        recipeClass: "border-refineui-thin border-refineui-alias-border-strong",
    },
    {
        slot: "root",
        property: "border.error",
        trace: { kind: "component", path: "input.border.error" },
        recipeClass: "border-refineui-thin border-refineui-alias-border-error",
    },
    {
        slot: "root",
        property: "border.success",
        trace: { kind: "component", path: "input.border.success" },
        recipeClass: "border-refineui-thin border-refineui-alias-border-success",
    },
    {
        slot: "root",
        property: "border.disabled",
        trace: { kind: "component", path: "input.border.disabled" },
        recipeClass: "border-refineui-thin border-refineui-alias-border-disabled",
    },
];

export const RADIO_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "label",
        property: "default",
        trace: { kind: "component", path: "radio.label.default" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "label",
        property: "description",
        trace: { kind: "component", path: "radio.label.description" },
        recipeClass: "text-refineui-alias-foreground-secondary",
    },
    {
        slot: "label",
        property: "disabled",
        trace: { kind: "component", path: "radio.label.disabled" },
        recipeClass: "text-refineui-alias-foreground-disabled",
    },
    {
        slot: "control",
        property: "dot",
        trace: { kind: "component", path: "radio.control.dot" },
        recipeClass: "bg-refineui-alias-background-brand",
    },
    {
        slot: "control",
        property: "dotHover",
        trace: { kind: "component", path: "radio.control.dotHover" },
        recipeClass: "bg-refineui-alias-background-brand-active",
    },
    {
        slot: "control",
        property: "background",
        trace: { kind: "component", path: "radio.control.background" },
        recipeClass: "bg-refineui-alias-background-primary",
    },
    {
        slot: "control",
        property: "disabledDot",
        trace: { kind: "component", path: "radio.control.disabledDot" },
        recipeClass: "bg-refineui-alias-foreground-disabled",
    },
    {
        slot: "control",
        property: "border.default",
        trace: { kind: "component", path: "radio.control.borderDefault" },
        recipeClass: "border-refineui-thin border-refineui-alias-border-default",
    },
    {
        slot: "control",
        property: "border.focus",
        trace: { kind: "component", path: "radio.control.borderFocus" },
        recipeClass: "border-refineui-thin border-refineui-alias-border-strong",
    },
    {
        slot: "control",
        property: "border.disabled",
        trace: { kind: "component", path: "radio.control.borderDisabled" },
        recipeClass: "border-refineui-thin border-refineui-alias-border-disabled",
    },
];

export const LINK_RECIPE_TOKEN_BINDINGS: readonly RecipeTokenBinding[] = [
    {
        slot: "root",
        property: "default",
        trace: { kind: "component", path: "link.default" },
        recipeClass: "text-refineui-alias-foreground-link",
    },
    {
        slot: "root",
        property: "hover",
        trace: { kind: "component", path: "link.hover" },
        recipeClass: "text-refineui-alias-foreground-link-hover",
    },
    {
        slot: "root",
        property: "active",
        trace: { kind: "component", path: "link.active" },
        recipeClass: "text-refineui-alias-foreground-link-active",
    },
    {
        slot: "root",
        property: "visited",
        trace: { kind: "component", path: "link.visited" },
        recipeClass: "text-refineui-alias-foreground-link-visited",
    },
    {
        slot: "root",
        property: "disabled",
        trace: { kind: "component", path: "link.disabled" },
        recipeClass: "text-refineui-alias-foreground-disabled",
    },
    {
        slot: "root",
        property: "subtle.default",
        trace: { kind: "component", path: "link.subtle.default" },
        recipeClass: "text-refineui-alias-foreground-secondary",
    },
    {
        slot: "root",
        property: "subtle.hover",
        trace: { kind: "component", path: "link.subtle.hover" },
        recipeClass: "text-refineui-alias-foreground-primary",
    },
    {
        slot: "root",
        property: "subtle.active",
        trace: { kind: "component", path: "link.subtle.active" },
        recipeClass: "text-refineui-alias-foreground-brand-strong",
    },
];

const RECIPE_SOURCE: Record<string, string> = {
    alert: "alert.recipe.ts",
    button: "button.recipe.ts",
    accordion: "accordion.recipe.ts",
    dialog: "dialog.recipe.ts",
    badge: "badge.recipe.ts",
    toast: "toast.recipe.ts",
    tabs: "tabs (style → tokens)",
    chip: "chip.recipe.ts",
    tag: "chip.recipe.ts",
    "segmented-control": "segmented-control.recipe.ts",
    switch: "Toggle/style → switch tokens",
    checkbox: "Checkbox/style → tokens",
    select: "Select/style → tokens",
    spinner: "Spinner/style → tokens",
    input: "Input/style → tokens",
    radio: "Radio/style → tokens",
    link: "Link/style → tokens",
};

export const TOKEN_INSPECTOR_COMPONENTS = [
    "alert",
    "button",
    "accordion",
    "dialog",
    "badge",
    "toast",
    "tabs",
    "chip",
    "tag",
    "segmented-control",
    "switch",
    "checkbox",
    "select",
    "spinner",
    "input",
    "radio",
    "link",
] as const;

export type TokenInspectorComponentId = (typeof TOKEN_INSPECTOR_COMPONENTS)[number];

export function isTokenInspectorSupported(component: string): component is TokenInspectorComponentId {
    return (TOKEN_INSPECTOR_COMPONENTS as readonly string[]).includes(component);
}

export function recipeSourceLabel(component: string): string {
    return RECIPE_SOURCE[component] ?? `${component}.recipe.ts`;
}

export function filterRecipeBindings(component: string, variant: string): RecipeTokenBinding[] {
    switch (component) {
        case "alert":
            return filterAlertRecipeBindings(variant);
        case "button":
            return filterButtonRecipeBindings(variant);
        case "badge":
            return BADGE_RECIPE_TOKEN_BINDINGS.filter((b) => !b.variant || b.variant === variant);
        case "toast":
            return TOAST_RECIPE_TOKEN_BINDINGS.filter((b) => !b.variant || b.variant === variant);
        case "tabs":
            return TABS_RECIPE_TOKEN_BINDINGS.filter((b) => !b.variant || b.variant === variant);
        case "chip":
        case "tag":
            return CHIP_RECIPE_TOKEN_BINDINGS.filter((b) => !b.variant || b.variant === variant);
        case "segmented-control":
            return SEGMENTED_CONTROL_RECIPE_TOKEN_BINDINGS.filter(
                (b) => !b.variant || b.variant === variant,
            );
        case "switch":
            return SWITCH_RECIPE_TOKEN_BINDINGS.filter((b) => !b.variant || b.variant === variant);
        case "checkbox":
            return CHECKBOX_RECIPE_TOKEN_BINDINGS.filter((b) => !b.variant || b.variant === variant);
        case "select":
            return SELECT_RECIPE_TOKEN_BINDINGS.filter((b) => !b.variant || b.variant === variant);
        case "spinner":
            return SPINNER_RECIPE_TOKEN_BINDINGS.filter((b) => !b.variant || b.variant === variant);
        case "input":
            return [...INPUT_RECIPE_TOKEN_BINDINGS];
        case "radio":
            return [...RADIO_RECIPE_TOKEN_BINDINGS];
        case "link":
            return [...LINK_RECIPE_TOKEN_BINDINGS];
        case "accordion":
            return [...ACCORDION_RECIPE_TOKEN_BINDINGS];
        case "dialog":
            return [...DIALOG_RECIPE_TOKEN_BINDINGS];
        default:
            return [];
    }
}

export function defaultTokenInspectorVariant(component: string): string {
    switch (component) {
        case "button":
            return "primary";
        case "badge":
        case "chip":
        case "tag":
        case "checkbox":
        case "select":
        case "spinner":
        case "input":
        case "radio":
        case "link":
            return "default";
        case "switch":
            return "on";
        case "toast":
            return "success";
        case "tabs":
        case "segmented-control":
            return "selected";
        case "alert":
            return "info";
        default:
            return "default";
    }
}

export function tokenInspectorVisualPrefix(component: string, specVisual?: string): string {
    if (component === "tag" || component === "chip") return "chip";
    if (component === "segmented-control") return "segmentedControl";
    return specVisual ?? component;
}
