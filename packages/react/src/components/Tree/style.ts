import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { sizedComponentTextClass } from "../../typography";
import type { TreeSize } from "./context";

/**
 * Hierarchical list — token composition (no Web Kit COMPONENT_SET; mirrors Sidebar / Menu density).
 * Selection / hover paint the full row; depth indent lives on the inner content only.
 */
export const treeStyles = {
    root: "m-0 flex list-none flex-col gap-refineui-size-none p-0",
    item: "m-0 list-none p-0",
    group: "m-0 flex min-h-0 list-none flex-col gap-refineui-size-none overflow-hidden p-0",
    panel: "min-h-0 overflow-hidden",
    panelInner: "min-h-0",
    row: clsx(
        "box-border flex min-h-refineui-control-touch-min w-full min-w-0 cursor-pointer items-center",
        "rounded-refineui-large border-none bg-transparent",
        "px-refineui-size-medium py-refineui-size-x-small",
        "text-refineui-alias-foreground-tertiary outline-none",
        "transition-[color,background-color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-emphasized)]",
        "hover:bg-refineui-alias-background-surface-hover hover:text-refineui-alias-foreground-primary",
        "focus-visible:bg-refineui-alias-background-surface-hover focus-visible:text-refineui-alias-foreground-primary",
        "active:bg-refineui-alias-background-surface-active",
    ),
    rowSelected: clsx(
        "bg-refineui-alias-background-surface-selected font-medium text-refineui-alias-foreground-primary",
        "hover:bg-refineui-alias-background-surface-selected",
        "active:bg-refineui-alias-background-surface-active",
    ),
    rowDisabled: clsx(
        "cursor-not-allowed text-refineui-alias-foreground-disabled",
        "hover:bg-transparent hover:text-refineui-alias-foreground-disabled",
        "active:bg-transparent",
    ),
    rowMain: "flex min-w-0 flex-1 items-center gap-refineui-size-x-small",
    chevronButton: clsx(
        "inline-flex shrink-0 items-center justify-center",
        "size-refineui-size-x-large rounded-refineui-medium border-none bg-transparent p-0",
        "text-current outline-none",
        "transition-transform duration-[var(--refineui-motion-duration-medium)] ease-[var(--refineui-motion-easing-emphasized)]",
        "hover:bg-refineui-alias-background-surface-hover",
        "active:bg-refineui-alias-background-surface-active",
    ),
    chevronExpanded: "rotate-90",
    chevronSpacer: "size-refineui-size-x-large shrink-0",
    label: "min-w-0 flex-1 truncate text-start",
} as const;

export const treeIconSize: Record<TreeSize, number> = {
    sm: iconSizes.xsmall,
    md: iconSizes.small,
    lg: iconSizes.medium,
};

export const treeItemTypo = {
    sm: sizedComponentTextClass(componentTypographyTokens.tree.item, "sm"),
    md: sizedComponentTextClass(componentTypographyTokens.tree.item, "md"),
    lg: sizedComponentTextClass(componentTypographyTokens.tree.item, "lg"),
} as const;
