import type { SelectSize } from "./types";
import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass, sizedComponentTextClass } from "../../typography";

// Select trigger/menu chrome — see Navigation Menu for compact plate patterns.
export const selectStyles = {
    root: "relative inline-block",
    trigger: clsx(
        "box-border inline-flex cursor-pointer items-center justify-between",
        "gap-refineui-size-x-small rounded-refineui-large",
        "border-refineui-hairline border-refineui-alias-border-default",
        "bg-refineui-alias-background-primary px-refineui-size-medium py-refineui-size-x-small",
        "text-refineui-alias-foreground-primary outline-none",
        "transition-[color,background-color,border-color] duration-[var(--refineui-motion-duration-fast)]",
    ),
    triggerInner: "min-w-0 flex-1 overflow-hidden text-left",
    triggerOpen: "text-refineui-alias-foreground-primary",
    triggerDisabled:
        "cursor-not-allowed border-refineui-alias-border-disabled bg-refineui-alias-background-surface-disabled text-refineui-alias-foreground-disabled",
    value: "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left",
    iconWrap: "inline-flex size-refineui-icon-xsmall shrink-0 items-center justify-center",
    chevron:
        "shrink-0 transition-transform duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    chevronOpen: "rotate-180",
    positioner: "z-refineui-popup flex flex-col overflow-hidden",
    contentShell:
        "box-border flex w-full min-h-0 flex-col overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-xx-small shadow-refineui-2 outline-none",
    contentPopper: "h-auto max-h-[var(--refineui-select-content-available-height,100dvh)]",
    contentItemAligned: "max-h-full",
    viewportPopper:
        "relative flex max-h-full min-h-0 min-w-full w-full flex-col",
    viewportItemAligned:
        "relative flex min-h-0 min-w-full w-full max-h-full flex-1 flex-col",
    scrollAreaRootPopper: "relative flex max-h-full min-h-0 flex-col",
    scrollAreaRootItemAligned: "relative flex h-full min-h-0 flex-1 flex-col",

    group: "flex flex-col gap-px",
    label: clsx(
        componentTextClass(componentTypographyTokens.select.label),
        "px-refineui-size-x-small py-refineui-size-x-small text-refineui-alias-foreground-tertiary",
    ),
    separator: "my-refineui-size-x-small h-px bg-refineui-alias-border-default",

    item: clsx(
        componentTextClass(componentTypographyTokens.select.item),
        "relative flex cursor-pointer items-center gap-refineui-size-x-small rounded-refineui-large border-refineui-none bg-transparent p-refineui-size-x-small text-refineui-alias-foreground-primary outline-none transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:text-refineui-alias-foreground-disabled",
    ),
    itemActive: "bg-refineui-alias-background-primary-hover",
    itemDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    itemIndicator: "inline-flex size-refineui-icon-xsmall shrink-0 items-center justify-center",
    itemText: "min-w-0 flex-1 truncate",
} as const;

const triggerMinHeight: Record<SelectSize, string> = {
    sm: "min-h-refineui-button-min-height-sm",
    md: "min-h-refineui-button-min-height-md",
    lg: "min-h-refineui-button-min-height-lg",
};

export const selectTriggerSizeClass: Record<SelectSize, string> = {
    sm: [triggerMinHeight.sm, sizedComponentTextClass(componentTypographyTokens.select.trigger, "sm")].join(" "),
    md: [triggerMinHeight.md, sizedComponentTextClass(componentTypographyTokens.select.trigger, "md")].join(" "),
    lg: [triggerMinHeight.lg, sizedComponentTextClass(componentTypographyTokens.select.trigger, "lg")].join(" "),
};
