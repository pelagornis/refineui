import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * RefineUI Table — surface chrome strips · inset body rows.
 * Header/footer + hover/selected live in `refineui.css` (token CSS variables).
 */
export const tableStyles = {
    /** Overflow lives on composed `ScrollArea` when the table is constrained. */
    wrapper: clsx(
        "relative box-border w-full min-w-0",
        "px-refineui-size-small pb-refineui-size-small",
    ),
    table: "w-full border-separate border-spacing-y-refineui-size-xx-small caption-bottom text-start",
    header: "[&_th]:bg-refineui-alias-background-surface-active [&_th]:shadow-[inset_0_calc(-1*var(--refineui-stroke-width-thin))_0_0_var(--refineui-color-alias-border-subtle)] [&_th:first-child]:rounded-s-refineui-large [&_th:last-child]:rounded-e-refineui-large",
    body: "",
    footer: "[&_td]:bg-refineui-alias-background-surface-active [&_td]:font-medium [&_td]:text-refineui-alias-foreground-secondary [&_td:first-child]:rounded-s-refineui-large [&_td:last-child]:rounded-e-refineui-large",
    row: clsx(
        "transition-[background-color,box-shadow,border-radius]",
        "duration-[var(--refineui-motion-duration-fast)]",
        "ease-[var(--refineui-motion-easing-ease-out)] hover:[&>td]:bg-refineui-alias-background-surface-hover hover:[&>td:first-child]:rounded-s-refineui-large hover:[&>td:last-child]:rounded-e-refineui-large data-[state=selected]:[&>td]:bg-refineui-alias-background-surface-selected data-[state=selected]:[&>td:first-child]:rounded-s-refineui-large data-[state=selected]:[&>td:last-child]:rounded-e-refineui-large",
    ),
    head: clsx(
        componentTextClass(componentTypographyTokens.table.head),
        "h-refineui-control-height-sm whitespace-nowrap px-refineui-size-medium",
        /** Explicit start — UA `th { text-align: center }` otherwise wins over table inherit. */
        "align-middle text-start font-medium text-refineui-alias-foreground-tertiary",
    ),
    cell: clsx(
        componentTextClass(componentTypographyTokens.table.cell),
        "h-refineui-control-height-md whitespace-nowrap px-refineui-size-medium",
        "align-middle text-start text-refineui-alias-foreground-primary",
    ),
    caption: clsx(
        componentTextClass(componentTypographyTokens.table.caption),
        /** Explicit start — UA caption is centered by default. */
        "mt-refineui-size-medium px-refineui-size-x-small text-start text-refineui-alias-foreground-tertiary",
    ),
} as const;
