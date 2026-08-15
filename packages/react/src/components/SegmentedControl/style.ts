import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * Compact mutually exclusive choice — sliding brand indicator on a pill track.
 * Colors/spacing from semantic + spacing tokens only.
 */
export const segmentedControlStyles = {
    root: clsx(
        "relative box-border inline-flex max-w-full w-fit flex-nowrap items-stretch gap-refineui-size-none",
        "overflow-hidden rounded-refineui-circle border-refineui-thin border-refineui-alias-border-default",
        "bg-refineui-alias-background-brand-subtle",
    ),
    indicator: clsx(
        "pointer-events-none absolute inset-y-0 left-0 z-0 block h-full",
        "rounded-refineui-circle bg-refineui-alias-background-brand shadow-refineui-2",
        "will-change-[transform,width]",
    ),
    item: clsx(
        componentTextClass(componentTypographyTokens.segmentedControl),
        "relative z-[1] box-border inline-flex min-h-0 min-w-0 shrink-0 items-center justify-center gap-refineui-size-xx-small",
        "rounded-refineui-circle border-none bg-transparent px-refineui-size-medium py-refineui-size-x-small outline-none",
        "transition-colors duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    itemDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    itemEnabled: "cursor-pointer",
    itemSelectedEnabled: "text-refineui-alias-foreground-on-brand",
    itemSelectedDisabled: "text-refineui-alias-foreground-disabled",
    itemUnselected: "text-refineui-alias-foreground-secondary",
} as const;
