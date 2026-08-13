import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const paginationStyles = {
    root: "flex flex-wrap items-center gap-refineui-size-medium",
    listWrap: "flex flex-wrap items-center gap-refineui-size-medium",
    itemShell:
        "box-border inline-flex h-refineui-pagination-button-min-width min-h-refineui-pagination-button-min-width w-refineui-pagination-button-min-width min-w-refineui-pagination-button-min-width shrink-0 items-center justify-center rounded-refineui-x-large border-refineui-thin p-refineui-size-x-small outline-none transition-[background-color,border-color,box-shadow,transform,color] duration-[var(--refineui-motion-duration-fast)]",
    page: clsx(
        componentTextClass(componentTypographyTokens.pagination),
        "border-refineui-alias-border-default bg-refineui-alias-background-primary font-medium text-refineui-alias-foreground-primary no-underline",
    ),
    nav:
        "cursor-pointer border-refineui-alias-border-default bg-refineui-alias-background-primary disabled:cursor-not-allowed disabled:border-refineui-alias-border-disabled disabled:bg-refineui-alias-background-surface-disabled",
    ellipsis:
        "pointer-events-none border-transparent bg-transparent text-refineui-alias-foreground-secondary",
} as const;
