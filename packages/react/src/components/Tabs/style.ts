import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * Page / section Tabs — underline track, sliding brand indicator, tabpanels.
 * Token composition (Web Kit `Tabs` pill visual ships as SegmentedControl).
 */
export const tabsStyles = {
    root: "flex w-full min-w-0 flex-col gap-refineui-size-medium",
    list: clsx(
        "relative flex w-full min-w-0 flex-nowrap items-stretch overflow-x-auto",
        "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0",
        "after:h-(--refineui-stroke-width-thin) after:bg-refineui-alias-border-default",
    ),
    indicator: clsx(
        "pointer-events-none absolute bottom-0 left-0 z-[1] block",
        "h-(--refineui-stroke-width-thick) bg-refineui-alias-background-brand",
        "will-change-[transform,width]",
    ),
    trigger: clsx(
        componentTextClass(componentTypographyTokens.tabs),
        "relative z-[1] box-border inline-flex min-h-0 min-w-0 shrink-0 items-center justify-center",
        "gap-refineui-size-x-small border-none bg-transparent",
        "px-refineui-size-medium py-refineui-size-x-small outline-none",
        "transition-colors duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    triggerDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    triggerEnabled: "cursor-pointer",
    triggerSelectedEnabled: "text-refineui-alias-foreground-primary",
    triggerSelectedDisabled: "text-refineui-alias-foreground-disabled",
    triggerUnselected: "text-refineui-alias-foreground-tertiary",
} as const;
