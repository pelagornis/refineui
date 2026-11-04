import { clsx } from "clsx";
import type { CSSProperties } from "react";
import { foundationSizes, iconSizes } from "@refineui/tokens";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass, sizedComponentTextClass } from "../../typography";
import type { CommandSize } from "./types";

/** List grows with its results up to this cap, then scrolls. */
const COMMAND_LIST_MAX_HEIGHT = `min(60vh, ${foundationSizes.foundationSize3200})`;

export const commandStyles = {
    /** Detached layout: the search field and the results panel are separate surfaces, so the root has none. */
    root: "flex w-full flex-col gap-refineui-size-small text-refineui-alias-foreground-primary outline-none",
    rootInDialog: "min-h-0 w-full",
    /** Dialog panel stays transparent — the field and results panel float on the scrim themselves. */
    dialogContentPanel: {
        padding: 0,
        overflow: "visible",
        backgroundColor: "transparent",
        boxShadow: "none",
        borderRadius: 0,
    } as const,
    dialogBody: "flex min-h-0 w-full flex-col",
    inputWrap: "shrink-0",
    /**
     * Results surface. Height is measured from the results (animated in refineui.css), capped by `maxHeight`.
     * Radius comes from `--refineui-command-list-radius` (per size, refineui.css) so the scrollbar inset can share it.
     */
    listShell: clsx(
        "box-border w-full overflow-hidden",
        "border-refineui-hairline border-refineui-alias-border-default",
        "bg-refineui-alias-background-primary shadow-refineui-2",
    ),
    list: "h-full min-h-0 w-full",
    listShellMaxHeight: {
        maxHeight: COMMAND_LIST_MAX_HEIGHT,
    } satisfies CSSProperties,
    listViewport: "outline-none",
    listInner:
        "relative flex flex-col gap-refineui-size-xxx-small px-refineui-size-medium py-refineui-size-small",
    /** Sliding highlight behind the selected item; geometry is measured, so physical `left`/`top` (inline) are intentional. */
    indicator:
        "pointer-events-none absolute rounded-refineui-large bg-refineui-alias-background-surface-hover",
    empty: clsx(
        componentTextClass(componentTypographyTokens.command.empty),
        "px-refineui-size-medium py-refineui-size-xx-large text-center text-refineui-alias-foreground-tertiary",
    ),
    /** `overflow-clip`, not hidden: a hidden group would become the scroll container the edge effect tracks. */
    group: "flex flex-col gap-refineui-size-xxx-small overflow-clip",
    groupHeading: clsx(
        componentTextClass(componentTypographyTokens.command.group),
        "flex w-full items-center overflow-hidden px-refineui-size-x-small py-refineui-size-xxx-small text-refineui-alias-foreground-tertiary",
    ),
    separatorWrap: "flex w-full items-center px-refineui-size-x-small py-refineui-size-x-small",
    separatorLine: "h-px w-full shrink-0 bg-refineui-alias-border-default",
    itemBase: clsx(
        "relative flex w-full items-center gap-refineui-size-x-small rounded-refineui-large border-none bg-transparent",
        "px-refineui-size-x-small text-start outline-none",
    ),
    itemDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    itemEnabled: "cursor-pointer text-refineui-alias-foreground-primary",
    iconWrap: "inline-flex shrink-0 items-center justify-center text-current [&>span]:leading-none",
    label: "min-w-0 flex-1 truncate text-start",
    rightWrap: "ms-auto flex shrink-0 items-center gap-refineui-size-x-small",
    shortcut: clsx(
        componentTextClass(componentTypographyTokens.command.shortcut),
        "shrink-0 tracking-wide text-refineui-alias-foreground-tertiary",
    ),
} as const;

export const commandItemSizeClass: Record<CommandSize, string> = {
    sm: clsx(sizedComponentTextClass(componentTypographyTokens.command.item, "sm"), "py-refineui-size-xx-small"),
    md: clsx(sizedComponentTextClass(componentTypographyTokens.command.item, "md"), "py-refineui-size-small"),
    lg: clsx(sizedComponentTextClass(componentTypographyTokens.command.item, "lg"), "py-refineui-size-medium"),
};

export const commandItemIconSize: Record<CommandSize, number> = {
    sm: iconSizes.xsmall,
    md: iconSizes.small,
    lg: iconSizes.medium,
};
