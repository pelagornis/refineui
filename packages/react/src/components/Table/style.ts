import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * RefineUI Table — surface chrome strips · inset body rows.
 * Header/footer + hover/selected live in `refineui.css` (token CSS variables).
 */
export const tableStyles = {
    wrapper: clsx(
        "relative box-border w-full overflow-x-auto",
        "px-refineui-size-small pb-refineui-size-small",
    ),
    table: "w-full caption-bottom border-separate text-start",
    header: "",
    body: "",
    footer: "",
    row: clsx(
        "transition-[background-color,box-shadow,border-radius]",
        "duration-[var(--refineui-motion-duration-fast)]",
        "ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    head: clsx(
        componentTextClass(componentTypographyTokens.table.head),
        "h-refineui-control-height-sm whitespace-nowrap px-refineui-size-medium",
        "align-middle font-medium text-refineui-alias-foreground-tertiary",
    ),
    cell: clsx(
        componentTextClass(componentTypographyTokens.table.cell),
        "h-refineui-control-height-md whitespace-nowrap px-refineui-size-medium",
        "align-middle text-refineui-alias-foreground-primary",
    ),
    caption: clsx(
        componentTextClass(componentTypographyTokens.table.caption),
        "mt-refineui-size-medium px-refineui-size-x-small text-refineui-alias-foreground-tertiary",
    ),
} as const;
