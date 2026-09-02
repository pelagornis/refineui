import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { sizedComponentTextClass } from "../../typography";
import type { TreeSize } from "./context";

/**
 * Hierarchical list — token composition (no Web Kit COMPONENT_SET; mirrors Sidebar link density).
 * Selection / hover paint the full row; depth indent lives on the inner content only.
 */
export const treeStyles = {
    root: "m-0 flex list-none flex-col gap-px p-0",
    item: "m-0 list-none p-0",
    group: "m-0 flex min-h-0 list-none flex-col gap-px overflow-hidden p-0",
    panel: "min-h-0 overflow-hidden",
    panelInner: "min-h-0",
    row: clsx(
        "box-border flex w-full min-w-0 cursor-pointer items-center",
        "rounded-refineui-large border-none bg-transparent",
        "px-refineui-size-medium py-refineui-size-x-small",
        "text-refineui-alias-foreground-tertiary outline-none",
        "transition-[color,background-color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    rowSelected: "font-medium text-refineui-alias-foreground-primary",
    rowDisabled: "cursor-not-allowed",
    rowMain: "flex min-w-0 flex-1 items-center gap-refineui-size-x-small",
    chevronButton: clsx(
        "inline-flex shrink-0 items-center justify-center",
        "size-refineui-icon-xsmall rounded-refineui-large border-none bg-transparent p-0",
        "text-current outline-none",
        "transition-transform duration-[var(--refineui-motion-duration-medium)] ease-[var(--refineui-motion-easing-emphasized)]",
    ),
    chevronExpanded: "rotate-90",
    chevronSpacer: "size-refineui-icon-xsmall shrink-0",
    label: "min-w-0 flex-1 truncate text-start",
} as const;

export const treeIconSize: Record<TreeSize, number> = {
    sm: iconSizes.xxsmall,
    md: iconSizes.xsmall,
    lg: iconSizes.xsmall,
};

export const treeItemTypo = {
    sm: sizedComponentTextClass(componentTypographyTokens.tree.item, "sm"),
    md: sizedComponentTextClass(componentTypographyTokens.tree.item, "md"),
    lg: sizedComponentTextClass(componentTypographyTokens.tree.item, "lg"),
} as const;
