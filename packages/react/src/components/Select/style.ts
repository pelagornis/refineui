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
        "transition-[color,background-color,border-color,transform] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)] hover:!bg-refineui-alias-background-primary-hover hover:!text-refineui-alias-foreground-primary-hover active:!bg-refineui-alias-background-primary-active active:!text-refineui-alias-foreground-primary data-[state=open]:!bg-refineui-alias-background-primary-hover data-[state=open]:!text-refineui-alias-foreground-primary-hover data-[pressed]:!bg-refineui-alias-background-primary-active data-[pressed]:!text-refineui-alias-foreground-primary focus-visible:!bg-refineui-alias-background-primary-hover focus-visible:!text-refineui-alias-foreground-primary-hover",
    ),
    /** Ghost plate — same gap/radius as filled, no field border (Button ghost-like). */
    triggerGhost: clsx(
        "box-border inline-flex cursor-pointer items-center justify-between",
        "gap-refineui-size-x-small rounded-refineui-large",
        "border-refineui-none border-transparent bg-transparent",
        "px-refineui-size-x-small py-refineui-size-xx-small",
        "text-refineui-alias-foreground-primary outline-none",
        "transition-[color,background-color,transform] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)] hover:bg-refineui-alias-background-primary-hover hover:text-refineui-alias-foreground-primary-hover active:bg-refineui-alias-background-primary-active active:text-refineui-alias-foreground-primary data-[state=open]:bg-refineui-alias-background-primary-hover data-[state=open]:text-refineui-alias-foreground-primary-hover data-[pressed]:bg-refineui-alias-background-primary-active data-[pressed]:text-refineui-alias-foreground-primary focus-visible:bg-refineui-alias-background-primary-hover focus-visible:text-refineui-alias-foreground-primary-hover",
    ),
    /** Flush shell — consumer / parent owns padding, radius, surface. */
    triggerPlain: clsx(
        "box-border inline-flex cursor-pointer items-center outline-none",
        "transition-[transform] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    triggerInner: "min-w-0 flex-1 overflow-hidden text-start",
    triggerOpen: "text-refineui-alias-foreground-primary",
    triggerDisabled:
        "cursor-not-allowed border-refineui-alias-border-disabled bg-refineui-alias-background-surface-disabled text-refineui-alias-foreground-disabled",
    triggerGhostDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    triggerPlainDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    value: "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start",
    iconWrap: "inline-flex size-refineui-icon-xsmall shrink-0 items-center justify-center",
    chevron:
        "shrink-0 transition-transform duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    chevronOpen: "rotate-180",
    /* No overflow-hidden — it isolates descendants and kills panel `backdrop-filter`. */
    positioner: "z-refineui-popup flex flex-col",
    contentShell:
        "box-border flex w-full min-h-0 flex-col overflow-hidden rounded-refineui-xx-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-surface-frosted p-refineui-size-xx-small shadow-refineui-2 outline-none backdrop-blur-refineui-surface-frost",
    contentPopper: "h-auto max-h-[var(--refineui-select-content-available-height,100dvh)]",
    /** The positioner owns alignment height; the frosted surface only covers its content. */
    contentItemAligned: "h-fit max-h-full self-start",
    viewportPopper:
        "relative flex max-h-full min-h-0 min-w-full w-full flex-col",
    viewportItemAligned:
        "relative flex h-auto min-h-0 min-w-full w-full max-h-full flex-none flex-col",
    scrollAreaRootPopper: "relative flex max-h-full min-h-0 flex-col",
    scrollAreaRootItemAligned: "relative flex h-auto min-h-0 max-h-full flex-none flex-col",

    group: "flex flex-col gap-px",
    label: clsx(
        componentTextClass(componentTypographyTokens.select.label),
        "px-refineui-size-x-small py-refineui-size-xxx-small text-refineui-alias-foreground-tertiary",
    ),
    separator: "my-refineui-size-x-small h-px bg-refineui-alias-border-default",

    item: clsx(
        componentTextClass(componentTypographyTokens.select.item),
        "relative flex cursor-pointer items-center gap-refineui-size-x-small rounded-refineui-large border-refineui-none bg-transparent p-refineui-size-x-small text-refineui-alias-foreground-primary outline-none transition-[background-color,transform] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)] hover:bg-refineui-alias-background-primary-hover hover:text-refineui-alias-foreground-primary-hover active:bg-refineui-alias-background-primary-active active:text-refineui-alias-foreground-primary data-[selected=true]:bg-refineui-alias-background-primary-hover data-[selected=true]:text-refineui-alias-foreground-primary data-[state=selected]:bg-refineui-alias-background-primary-hover data-[state=selected]:text-refineui-alias-foreground-primary data-[state=hover]:bg-refineui-alias-background-primary-hover data-[state=hover]:text-refineui-alias-foreground-primary-hover data-[state=pressed]:bg-refineui-alias-background-primary-active data-[state=pressed]:text-refineui-alias-foreground-primary aria-disabled:cursor-not-allowed aria-disabled:bg-refineui-alias-background-surface-disabled aria-disabled:!text-refineui-alias-foreground-disabled aria-disabled:transform-none",
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
