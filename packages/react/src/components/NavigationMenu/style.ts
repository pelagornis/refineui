import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * Site / app top navigation — token-based composition.
 * Top-level hover plate uses primary surface tokens; content rows match Menu item.
 */
export const navigationMenuStyles = {
    root: "relative isolate z-refineui-messages flex w-full max-w-max items-center",
    list: "relative m-0 flex list-none flex-wrap items-center gap-refineui-size-xx-small p-0",
    item: "relative inline-flex items-center",
    trigger: clsx(
        componentTextClass(componentTypographyTokens.navigationMenu.trigger),
        "box-border inline-flex cursor-pointer items-center justify-center gap-refineui-size-xxx-small",
        "rounded-refineui-large border-none bg-transparent px-refineui-size-medium py-refineui-size-x-small",
        "text-refineui-alias-foreground-tertiary outline-none",
        "transition-[color,background-color] duration-[var(--refineui-motion-duration-fast)]",
    ),
    triggerOpen: "text-refineui-alias-foreground-primary",
    triggerDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    chevron:
        "shrink-0 transition-transform duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    chevronOpen: "rotate-180",
    content: clsx(
        /** Flush under trigger so pointer does not leave the item while moving into the panel. */
        "absolute left-0 top-full z-refineui-messages pt-refineui-size-xx-small",
        "box-border min-w-refineui-menu-panel-width",
        "outline-none",
    ),
    contentPanel: clsx(
        "box-border overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default",
        "bg-refineui-alias-background-primary p-refineui-size-xx-small shadow-refineui-2",
    ),
    link: clsx(
        componentTextClass(componentTypographyTokens.navigationMenu.link),
        "box-border inline-flex cursor-pointer items-center",
        "rounded-refineui-large px-refineui-size-medium py-refineui-size-x-small no-underline outline-none",
        "text-refineui-alias-foreground-tertiary",
        "transition-[color,background-color] duration-[var(--refineui-motion-duration-fast)]",
    ),
    linkActive: "font-medium text-refineui-alias-foreground-primary",
    linkDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    /** Dense row inside a content panel — same density as Menu item. */
    linkInContent: clsx(
        componentTextClass(componentTypographyTokens.navigationMenu.contentLink),
        "box-border flex w-full cursor-pointer items-center",
        "rounded-refineui-large border-none bg-transparent p-refineui-size-x-small text-left no-underline outline-none",
        "text-refineui-alias-foreground-primary",
        "transition-[background-color,color] duration-[var(--refineui-motion-duration-fast)]",
    ),
    /** Optional — prefer omitting; kept for API compatibility. */
    indicator: "hidden",
} as const;
