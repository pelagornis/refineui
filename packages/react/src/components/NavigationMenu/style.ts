import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

const topLevelItem = clsx(
    componentTextClass(componentTypographyTokens.navigationMenu.trigger),
    "box-border inline-flex h-refineui-button-min-height-md min-w-refineui-navigation-menu-item-min-width cursor-pointer items-center justify-center gap-refineui-size-x-small",
    "rounded-refineui-x-large border-none bg-transparent px-refineui-size-medium py-refineui-size-x-small",
    "text-refineui-alias-foreground-primary outline-none leading-none",
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
    trigger: clsx(topLevelItem, "m-0 appearance-none font-inherit hover:bg-refineui-alias-background-primary-hover hover:text-refineui-alias-foreground-primary-hover active:bg-refineui-alias-background-primary-active active:text-refineui-alias-foreground-primary focus-visible:outline-[length:var(--refineui-stroke-width-thick)] focus-visible:[outline-color:var(--refineui-focus-color)] focus-visible:[outline-offset:var(--refineui-focus-offset)]"),
    triggerOpen: "bg-refineui-alias-background-primary-hover text-refineui-alias-foreground-primary",
    triggerDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    chevron,
    chevronOpen: "rotate-180",
    content: clsx(
        "box-border outline-none",
        "transition-opacity duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    /** Default compact panel, anchored to the triggering navigation item. */
    contentDropdown: "min-w-refineui-dropdown-menu-width",
    /**
     * Wide, viewport-aware panel. Width and inner composition stay with the
     * consuming navigation so this remains a content-agnostic primitive.
     */
    contentFloating: clsx(
        "max-w-full origin-top will-change-[opacity,translate]",
        "transition-[opacity,translate] duration-[var(--refineui-motion-duration-normal)] ease-[var(--refineui-motion-easing-emphasized)]",
    ),
    /** Header-connected, full-width product navigation surface. */
    contentOverlay: clsx(
        "fixed inset-x-0 bottom-0 origin-top",
    ),
    /** Optional boundary for demos and embedded navigation experiences. */
    contentContained: "absolute",
    contentOverlayContained: "absolute inset-x-0 bottom-0",
    overlayBackdrop: clsx(
        "absolute inset-0 bg-refineui-alias-surface-overlay",
        "transition-[opacity,backdrop-filter] duration-[var(--refineui-motion-duration-panel)] ease-[var(--refineui-motion-easing-panel)]",
    ),
    overlayBackdropEnter: "[animation:refineui-navigation-overlay-backdrop-enter_var(--refineui-motion-duration-panel)_var(--refineui-motion-easing-panel)_both] motion-reduce:animation-none",
    overlayBackdropExit: "[animation:refineui-navigation-overlay-backdrop-exit_var(--refineui-motion-duration-panel)_var(--refineui-motion-easing-panel)_both] motion-reduce:animation-none",
    contentPanel: "box-border flex flex-col gap-px overflow-hidden rounded-refineui-xx-large border-refineui-hairline border-refineui-alias-border-default p-refineui-size-xx-small shadow-refineui-2",
    /** Compact dropdowns retain the Menu's translucent frosted material. */
    contentPanelDropdown: "bg-refineui-alias-surface-frosted backdrop-blur-refineui-surface-frost",
    /** Wide panels prioritize readable product navigation over glass transparency. */
    contentPanelFloating: clsx(
        "bg-refineui-alias-background-primary backdrop-blur-refineui-surface-frost",
    ),
    contentPanelOverlay: clsx(
        "relative flex w-full justify-center overflow-hidden rounded-none border-x-0 border-b-refineui-hairline border-t-0 p-0 border-refineui-alias-border-default bg-refineui-alias-background-primary shadow-refineui-2",
        "transition-[height,opacity] duration-[var(--refineui-motion-duration-panel)] ease-[var(--refineui-motion-easing-panel)]",
        "data-[state=open]:[animation:refineui-navigation-overlay-enter_var(--refineui-motion-duration-panel)_var(--refineui-motion-easing-panel)_both] motion-reduce:animation-none",
    ),
    contentPanelOverlayExit: "[animation:refineui-navigation-overlay-exit_var(--refineui-motion-duration-panel)_var(--refineui-motion-easing-panel)_both] motion-reduce:animation-none",
    link: clsx(topLevelItem, "no-underline hover:bg-refineui-alias-background-primary-hover hover:text-refineui-alias-foreground-primary-hover active:bg-refineui-alias-background-primary-active active:text-refineui-alias-foreground-primary focus-visible:outline-[length:var(--refineui-stroke-width-thick)] focus-visible:[outline-color:var(--refineui-focus-color)] focus-visible:[outline-offset:var(--refineui-focus-offset)] aria-disabled:pointer-events-none"),
    linkActive: "bg-refineui-alias-background-primary-hover text-refineui-alias-foreground-primary",
    linkDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    /** Dense row inside a content panel — same density as Menu item. */
    linkInContent: clsx(
        componentTextClass(componentTypographyTokens.navigationMenu.contentLink),
        "box-border flex w-full cursor-pointer items-center gap-refineui-size-x-small",
        "rounded-refineui-large border-none bg-transparent p-refineui-size-x-small text-start no-underline outline-none",
        "text-refineui-alias-foreground-primary",
        "transition-[background-color,color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)] hover:bg-refineui-alias-background-primary-hover hover:text-refineui-alias-foreground-primary-hover active:bg-refineui-alias-background-primary-active active:text-refineui-alias-foreground-primary aria-disabled:pointer-events-none",
    ),
    /** Optional — prefer omitting; kept for API compatibility. */
    indicator: "hidden",
} as const;
