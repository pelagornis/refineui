import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const menuStyles = {
    /** Panel chrome — Web Kit Menu `633:4268` (fill matches Dropdown elevated panel for contrast on docs) */
    panel:
        "box-border flex w-refineui-menu-panel-width flex-col gap-px overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-xx-small shadow-refineui-2",
    root: "relative inline-flex items-center leading-none",
    triggerFallback: "cursor-pointer border-none bg-transparent p-0 font-inherit text-inherit",
    /** Portal shell — position/z-index from `MenuPopover` fixed style */
    popover: "z-refineui-messages",
    list:
        "box-border flex w-full min-w-refineui-menu-panel-width flex-col gap-px overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-xx-small shadow-refineui-2 outline-none",
    subPanel:
        "box-border flex w-refineui-menu-panel-width min-w-refineui-menu-panel-width flex-col gap-px overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-xx-small shadow-refineui-2 outline-none",
    section: "flex w-full items-center overflow-hidden px-refineui-size-x-small py-refineui-size-x-small",
    sectionText: clsx(
        componentTextClass(componentTypographyTokens.menu.section),
        "text-refineui-alias-foreground-tertiary",
    ),
    dividerWrap: "flex w-full items-center px-refineui-size-x-small py-refineui-size-xxx-small",
    dividerLine: "h-px w-full shrink-0 bg-refineui-alias-border-default",
    itemBase:
        "block w-full rounded-refineui-large border-none bg-transparent p-refineui-size-x-small text-left outline-none",
    itemDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    itemEnabled: "cursor-pointer text-refineui-alias-foreground-primary",
    row: "flex items-center gap-refineui-size-x-small",
    iconWrap: "inline-flex shrink-0 items-center justify-center text-current [&>span]:leading-none",
    textCol: "flex min-w-0 flex-1 flex-col gap-refineui-size-xxx-small px-refineui-size-xxx-small",
    title: clsx(componentTextClass(componentTypographyTokens.menu.item), "truncate"),
    description: clsx(componentTextClass(componentTypographyTokens.menu.description), "truncate"),
    descriptionEnabled: "text-refineui-alias-foreground-tertiary",
    descriptionDisabled: "text-refineui-alias-foreground-disabled",
    rightWrap: "flex shrink-0 items-center gap-refineui-size-x-small",
    shortcut: clsx(
        componentTextClass(componentTypographyTokens.menu.shortcut),
        "tracking-wide text-refineui-alias-foreground-tertiary",
    ),
} as const;
