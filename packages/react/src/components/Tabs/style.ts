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
        "after:pointer-events-none after:absolute after:inset-inline-0 after:bottom-0",
        "after:h-(--refineui-stroke-width-thin) after:bg-refineui-alias-border-default data-[ready=false]:[&_[data-refineui=tab][data-selected=true]]:after:block data-[ready=false]:[&_[data-refineui=tab][data-selected=true]]:after:h-(--refineui-stroke-width-thick) data-[ready=false]:[&_[data-refineui=tab][data-selected=true]]:after:bg-refineui-alias-background-brand",
    ),
    indicator: clsx(
        "pointer-events-none absolute bottom-0 start-0 z-[1] block",
        "h-(--refineui-stroke-width-thick) bg-refineui-alias-background-brand",
        "will-change-[transform,width] opacity-0 data-[ready=true]:opacity-100 transition-none data-[animate=true]:transition-[transform,width] data-[animate=true]:duration-[var(--refineui-motion-duration-medium)] data-[animate=true]:ease-[var(--refineui-motion-easing-emphasized)] motion-reduce:transition-none",
    ),
    trigger: clsx(
        componentTextClass(componentTypographyTokens.tabs),
        "relative z-[1] box-border inline-flex min-h-0 min-w-0 shrink-0 items-center justify-center",
        "gap-refineui-size-x-small border-none bg-transparent",
        "px-refineui-size-medium py-refineui-size-x-small outline-none",
        "transition-colors duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)] active:transform-none",
    ),
    triggerDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    triggerEnabled: "cursor-pointer hover:text-refineui-alias-foreground-primary-hover",
    triggerSelectedEnabled: "text-refineui-alias-foreground-primary hover:text-refineui-alias-foreground-primary",
    triggerSelectedDisabled: "text-refineui-alias-foreground-disabled",
    triggerUnselected: "text-refineui-alias-foreground-tertiary",
} as const;
