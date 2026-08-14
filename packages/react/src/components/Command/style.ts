import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const commandStyles = {
    root: clsx(
        "flex w-full flex-col overflow-hidden outline-none",
        "rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default",
        "bg-refineui-alias-background-primary text-refineui-alias-foreground-primary",
        "shadow-refineui-2",
    ),
    /** Nested inside Dialog panel — Dialog already supplies radius / elevation */
    rootInDialog: "rounded-none border-none shadow-none",
    dialogContentPanel: {
        padding: 0,
        overflow: "hidden",
    } as const,
    inputWrap: "p-refineui-size-medium",
    /** Grow with content; scroll only when a parent (e.g. Dialog max-height) constrains the panel */
    list: "min-h-0 flex-1 overflow-y-auto overflow-x-hidden outline-none",
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
        "px-refineui-size-x-small py-refineui-size-small text-left outline-none",
    ),
    itemDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    itemEnabled: "cursor-pointer text-refineui-alias-foreground-primary",
    iconWrap: "inline-flex shrink-0 items-center justify-center text-current [&>span]:leading-none",
    label: "min-w-0 flex-1 truncate text-left",
    rightWrap: "ml-auto flex shrink-0 items-center gap-refineui-size-x-small",
    shortcut: clsx(
        componentTextClass(componentTypographyTokens.command.shortcut),
        "shrink-0 tracking-wide text-refineui-alias-foreground-tertiary",
    ),
} as const;
