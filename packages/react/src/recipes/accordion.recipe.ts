/**
 * Accordion slot recipe — visual mapping only.
 * Contract: packages/react/spec/components/accordion.json
 * Tokens: componentColorTokens.accordion
 */
import { iconSizes } from "@refineui/tokens";
import { componentTypographyTokens } from "../tokens/componentTypographyTokens";
import { sizedComponentTextClass } from "../typography";
import { defineSlotRecipe, resolveSlotClasses } from "./types";
import type { AccordionSize } from "../components/Accordion/context";

export const accordionRecipe = defineSlotRecipe({
    name: "accordion",
    slots: ["root", "item", "trigger", "triggerRow", "chevron", "panel", "panelPad", "content"],
    base: {
        root: "flex flex-col gap-refineui-size-x-small",
        item: "overflow-hidden rounded-refineui-x-large transition-[background-color] duration-[var(--refineui-motion-duration-fast)]",
        trigger:
            "flex min-h-refineui-control-touch-min w-full cursor-pointer items-center justify-between gap-refineui-size-medium rounded-refineui-x-large border-none bg-transparent px-refineui-size-medium py-refineui-size-x-small text-start text-refineui-alias-foreground-primary outline-none transition-[background-color,transform] duration-[var(--refineui-motion-duration-fast)]",
        triggerRow: "flex min-w-0 flex-1 items-center gap-refineui-size-medium",
        chevron:
            "shrink-0 transition-transform duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
        panel: "min-h-0 overflow-hidden",
        panelPad: "box-border px-refineui-size-medium pb-refineui-size-medium pt-refineui-size-none",
        content: "text-refineui-alias-foreground-secondary",
    },
    variants: {
        size: {
            sm: {},
            md: {},
            lg: {},
        },
    },
    defaultVariants: {
        size: "md",
    },
});

/** Open-item background — applied when data-state=open (matches prior itemOpen). */
export const accordionItemOpenClass = "bg-refineui-alias-background-primary-hover";

export const accordionChevronOpenClass = "rotate-180";

export function resolveAccordionSlotClasses(slot: string, size: AccordionSize = "md"): string {
    return resolveSlotClasses(accordionRecipe, slot, { size });
}

/** Compatible map for Accordion components (pre-recipe import sites). */
export const accordionStyles = {
    root: accordionRecipe.base.root,
    itemOpen: `${accordionRecipe.base.item} ${accordionItemOpenClass}`,
    triggerBase: accordionRecipe.base.trigger,
    triggerRow: accordionRecipe.base.triggerRow,
    chevron: accordionRecipe.base.chevron,
    chevronOpen: accordionChevronOpenClass,
    panelOuter: accordionRecipe.base.panel,
    panelPad: accordionRecipe.base.panelPad,
    panelBody: accordionRecipe.base.content,
} as const;

export const accordionIconSize: Record<AccordionSize, number> = {
    sm: iconSizes.xsmall,
    md: iconSizes.small,
    lg: iconSizes.medium,
};

export const triggerTypo = {
    sm: sizedComponentTextClass(componentTypographyTokens.accordion.trigger, "sm"),
    md: sizedComponentTextClass(componentTypographyTokens.accordion.trigger, "md"),
    lg: sizedComponentTextClass(componentTypographyTokens.accordion.trigger, "lg"),
} as const;

export const contentTypo = {
    sm: sizedComponentTextClass(componentTypographyTokens.accordion.content, "sm"),
    md: sizedComponentTextClass(componentTypographyTokens.accordion.content, "md"),
    lg: sizedComponentTextClass(componentTypographyTokens.accordion.content, "lg"),
} as const;
