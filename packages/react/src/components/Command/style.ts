import { clsx } from "clsx";
import type { CSSProperties } from "react";
import { foundationSizes } from "@refineui/tokens";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/** Same cap as Dropdown menus — explicit px so ScrollArea gets a real height. */
const COMMAND_LIST_MAX_HEIGHT = `min(60vh, ${foundationSizes.foundationSize3200})`;

export const commandStyles = {
    root: clsx(
        "flex w-full flex-col overflow-hidden outline-none",
        "rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default",
        "bg-refineui-alias-background-primary text-refineui-alias-foreground-primary",
        "shadow-refineui-2",
    ),
    /** Nested inside Dialog panel — Dialog already supplies radius / elevation */
    rootInDialog: "min-h-0 w-full flex-col overflow-hidden rounded-none border-none shadow-none",
    dialogContentPanel: {
        padding: 0,
        overflow: "hidden",
    } as const,
    dialogBody: "flex min-h-0 w-full flex-col overflow-hidden",
    inputWrap: "shrink-0 p-refineui-size-medium",
    /** Fixed list height — command palettes need an explicit cap (not content-sized flex). */
    listShell: "box-border w-full overflow-hidden",
    list: "h-full min-h-0 w-full",
    listShellHeight: {
        height: COMMAND_LIST_MAX_HEIGHT,
        maxHeight: COMMAND_LIST_MAX_HEIGHT,
    } satisfies CSSProperties,
    listViewport: "outline-none",
    listInner:
        "flex flex-col gap-refineui-size-xxx-small px-refineui-size-medium py-refineui-size-small",
    empty: clsx(
        componentTextClass(componentTypographyTokens.command.empty),
        "px-refineui-size-medium py-refineui-size-xx-large text-center text-refineui-alias-foreground-tertiary",
    ),
    group: "flex flex-col gap-refineui-size-xxx-small overflow-hidden",
    groupHeading: clsx(
        componentTextClass(componentTypographyTokens.command.group),
        "flex w-full items-center overflow-hidden px-refineui-size-x-small pb-refineui-size-xxx-small pt-refineui-size-x-small text-refineui-alias-foreground-tertiary",
    ),
    separatorWrap: "flex w-full items-center px-refineui-size-x-small py-refineui-size-x-small",
    separatorLine: "h-px w-full shrink-0 bg-refineui-alias-border-default",
    itemBase: clsx(
        componentTextClass(componentTypographyTokens.command.item),
        "flex w-full items-center gap-refineui-size-x-small rounded-refineui-large border-none bg-transparent",
        "px-refineui-size-x-small py-refineui-size-small text-start outline-none",
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
