/**
 * Segmented Control slot recipe — visual mapping only.
 * Contract: packages/react/spec/components/segmented-control.json
 * Tokens: componentColorTokens.segmentedControl
 */
import { clsx } from "clsx";
import { componentTypographyTokens } from "../tokens/componentTypographyTokens";
import { componentTextClass } from "../typography";
import { defineSlotRecipe, resolveSlotClasses } from "./types";

export const segmentedControlRecipe = defineSlotRecipe({
    name: "segmented-control",
    slots: ["root", "indicator", "item"],
    base: {
        root: clsx(
            "relative box-border inline-flex max-w-full w-fit flex-nowrap items-stretch gap-refineui-size-none",
            /**
             * Scrolls rather than clips: `max-w-full` caps the pill at the container,
             * so at narrow widths `overflow-hidden` would make trailing options
             * unreachable. Scrollbar chrome is suppressed in `refineui.css`.
             */
            "overflow-x-auto overflow-y-hidden rounded-refineui-circle border-refineui-thin border-refineui-alias-border-default",
            "bg-refineui-alias-background-brand-subtle",
        ),
        indicator: clsx(
            "pointer-events-none absolute inset-y-0 start-0 z-0 block h-full",
            "rounded-refineui-circle bg-refineui-alias-background-brand shadow-refineui-2",
            "will-change-[transform,width]",
        ),
        item: clsx(
            componentTextClass(componentTypographyTokens.segmentedControl),
            "relative z-[1] box-border inline-flex min-h-0 min-w-0 shrink-0 items-center justify-center gap-refineui-size-xx-small",
            "rounded-refineui-circle border-none bg-transparent px-refineui-size-medium py-refineui-size-x-small outline-none",
            "transition-colors duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
        ),
    },
});

export function resolveSegmentedControlSlotClasses(slot: string): string {
    return resolveSlotClasses(segmentedControlRecipe, slot);
}

export const segmentedControlStyles = {
    root: segmentedControlRecipe.base.root,
    indicator: segmentedControlRecipe.base.indicator,
    item: segmentedControlRecipe.base.item,
    itemDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    itemEnabled: "cursor-pointer",
    itemSelectedEnabled: "text-refineui-alias-foreground-on-brand",
    itemSelectedDisabled: "text-refineui-alias-foreground-disabled",
    itemUnselected: "text-refineui-alias-foreground-secondary",
} as const;
