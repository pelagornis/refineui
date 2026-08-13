import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * Pill Tabs — vivid brand indicator that slides between triggers.
 * Colors/spacing from semantic + spacing tokens only.
 */
export const tabsStyles = {
    list: clsx(
        "relative box-border inline-flex max-w-full w-fit flex-nowrap items-center gap-refineui-size-none",
        "overflow-x-auto rounded-refineui-circle border-refineui-thin border-refineui-alias-border-default",
        "bg-refineui-alias-background-brand-subtle p-refineui-size-xx-small",
    ),
    indicator: clsx(
        "pointer-events-none absolute top-refineui-size-xx-small bottom-refineui-size-xx-small left-0 z-0",
        "rounded-refineui-circle bg-refineui-alias-background-brand shadow-refineui-2",
        "will-change-[transform,width]",
    ),
    trigger: clsx(
        componentTextClass(componentTypographyTokens.tabs),
        "relative z-[1] box-border inline-flex min-h-0 min-w-0 shrink-0 items-center justify-center gap-refineui-size-xx-small",
        "rounded-refineui-circle border-none bg-transparent px-refineui-size-medium py-refineui-size-x-small outline-none",
        "transition-colors duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    triggerDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    triggerEnabled: "cursor-pointer",
    triggerSelectedEnabled: "text-refineui-alias-foreground-on-brand",
    triggerSelectedDisabled: "text-refineui-alias-foreground-disabled",
    triggerUnselected: "text-refineui-alias-foreground-secondary",
} as const;
