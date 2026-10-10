import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

const topLevelItem = clsx(
    componentTextClass(componentTypographyTokens.navigationMenu.trigger),
    "box-border inline-flex h-refineui-button-min-height-md min-w-refineui-navigation-menu-item-min-width cursor-pointer items-center justify-center gap-refineui-size-x-small",
    "rounded-refineui-x-large border-none bg-transparent px-refineui-size-medium py-refineui-size-x-small",
    "text-refineui-alias-foreground-tertiary outline-none leading-none",
    "transition-[color,background-color,box-shadow] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
);

const chevron = clsx(
    "shrink-0 transition-transform duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
);

/**
 * Site / app top navigation — token-based composition.
 * Top-level hover plate uses primary surface tokens; content rows match Menu item.
 */
export const navigationMenuStyles = {
    root: "relative isolate z-refineui-messages flex w-full max-w-max items-center",
    list: "relative m-0 flex list-none flex-wrap items-center gap-refineui-size-xxx-small p-0",
    item: "relative inline-flex items-center",
    trigger: clsx(topLevelItem, "m-0 appearance-none font-inherit"),
    triggerOpen: "bg-refineui-alias-background-primary-hover text-refineui-alias-foreground-primary",
    triggerDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    chevron,
    chevronOpen: "rotate-180",
    content: clsx(
        /** Flush under trigger so pointer does not leave the item while moving into the panel. */
        "absolute start-0 top-full z-refineui-messages pt-refineui-size-xx-small",
        "box-border min-w-refineui-navigation-menu-panel-width",
        "outline-none",
    ),
    contentPanel: clsx(
        "box-border flex flex-col gap-px overflow-hidden rounded-refineui-xx-large border-refineui-hairline border-refineui-alias-border-default",
        "p-refineui-size-xx-small shadow-refineui-2",
    ),
    link: clsx(topLevelItem, "no-underline"),
    linkActive: "bg-refineui-alias-background-primary-hover text-refineui-alias-foreground-primary",
    linkDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    /** Dense row inside a content panel — same density as Menu item. */
    linkInContent: clsx(
        componentTextClass(componentTypographyTokens.navigationMenu.contentLink),
        "box-border flex w-full cursor-pointer items-center gap-refineui-size-x-small",
        "rounded-refineui-large border-none bg-transparent p-refineui-size-x-small text-start no-underline outline-none",
        "text-refineui-alias-foreground-primary",
        "transition-[background-color,color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    /** Optional — prefer omitting; kept for API compatibility. */
    indicator: "hidden",
} as const;
