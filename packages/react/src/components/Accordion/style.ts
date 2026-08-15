import { iconSizes } from "@refineui/tokens";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { sizedComponentTextClass } from "../../typography";
import type { AccordionSize } from "./context";

export const accordionStyles = {
    root: "flex flex-col gap-refineui-size-x-small",
    itemOpen:
        "overflow-hidden rounded-refineui-x-large bg-refineui-alias-background-primary-hover transition-[background-color] duration-[var(--refineui-motion-duration-fast)]",
    triggerBase:
        "flex min-h-refineui-control-touch-min w-full cursor-pointer items-center justify-between gap-refineui-size-medium rounded-refineui-x-large border-none bg-transparent px-refineui-size-medium py-refineui-size-x-small text-left text-refineui-alias-foreground-primary outline-none transition-[background-color,transform] duration-[var(--refineui-motion-duration-fast)]",
    triggerRow: "flex min-w-0 flex-1 items-center gap-refineui-size-medium",
    chevron:
        "shrink-0 transition-transform duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    chevronOpen: "rotate-180",
    panelOuter: "min-h-0 overflow-hidden",
    /** Flush under trigger when open — no top gap that breaks the item shell */
    panelPad: "box-border px-refineui-size-medium pb-refineui-size-medium pt-refineui-size-none",
    panelBody: "text-refineui-alias-foreground-secondary",
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
