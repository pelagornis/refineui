import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const commandStyles = {
    root: "flex w-full flex-col overflow-hidden rounded-refineui-large bg-refineui-alias-background-primary text-refineui-alias-foreground-primary outline-none",
    dialogContentPanel: {
        padding: 0,
        overflow: "hidden",
    } as const,
    inputWrap:
        "flex items-center gap-refineui-size-x-small border-b-refineui-hairline border-refineui-alias-border-default px-refineui-size-x-small",
    inputIcon: "inline-flex shrink-0 items-center justify-center text-refineui-alias-foreground-tertiary",
    input: clsx(
        componentTextClass(componentTypographyTokens.command.input),
        "h-refineui-control-height-md w-full min-w-0 flex-1 border-none bg-transparent outline-none placeholder:text-refineui-alias-foreground-placeholder disabled:cursor-not-allowed disabled:text-refineui-alias-foreground-disabled",
    ),
    list: "max-h-[min(50vh,var(--refineui-size-foundation-size-3200))] overflow-y-auto overflow-x-hidden outline-none",
    listInner: "flex flex-col gap-px p-refineui-size-xx-small",
    empty: clsx(
        componentTextClass(componentTypographyTokens.command.empty),
        "px-refineui-size-x-small py-refineui-size-large text-center text-refineui-alias-foreground-tertiary",
    ),
    group: "flex flex-col gap-px overflow-hidden",
    groupHeading: clsx(
        componentTextClass(componentTypographyTokens.command.group),
        "flex w-full items-center overflow-hidden px-refineui-size-x-small py-refineui-size-x-small text-refineui-alias-foreground-tertiary",
    ),
    separatorWrap: "flex w-full items-center px-refineui-size-x-small py-refineui-size-xxx-small",
    separatorLine: "h-px w-full shrink-0 bg-refineui-alias-border-default",
    itemBase: clsx(
        componentTextClass(componentTypographyTokens.command.item),
        "flex w-full items-center gap-refineui-size-x-small rounded-refineui-large border-none bg-transparent p-refineui-size-x-small text-left outline-none",
    ),
    itemDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    itemEnabled: "cursor-pointer text-refineui-alias-foreground-primary",
    itemSelected: "bg-refineui-alias-background-surface-hover",
    iconWrap: "inline-flex shrink-0 items-center justify-center text-current [&>span]:leading-none",
    shortcut: clsx(
        componentTextClass(componentTypographyTokens.command.shortcut),
        "ml-auto shrink-0 tracking-wide text-refineui-alias-foreground-tertiary",
    ),
} as const;
