import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/** Visual language aligned with `menuStyles` — shared panel/item chrome. */
export const dropdownStyles = {
    menuShell:
        "box-border flex w-refineui-dropdown-menu-width min-w-refineui-dropdown-menu-width max-w-[min(100vw-16px,calc(100vw-2rem))] flex-col overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary shadow-refineui-2 outline-none",
    submenuShell:
        "box-border flex w-refineui-dropdown-menu-width min-w-refineui-dropdown-menu-width flex-col overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary shadow-refineui-2 outline-none",
    menuViewport: "box-border flex flex-col gap-px p-refineui-size-xx-small",
    label: clsx(
        componentTextClass(componentTypographyTokens.dropdown.label),
        "shrink-0 px-refineui-size-x-small py-refineui-size-x-small text-refineui-alias-foreground-tertiary",
    ),
    item: clsx(
        componentTextClass(componentTypographyTokens.dropdown.item),
        "flex w-full cursor-pointer items-center justify-between gap-refineui-size-x-small rounded-refineui-large border-none bg-transparent p-refineui-size-x-small text-start text-refineui-alias-foreground-primary outline-none disabled:cursor-not-allowed disabled:text-refineui-alias-foreground-disabled",
    ),
    shortcut: clsx(
        componentTextClass(componentTypographyTokens.dropdown.shortcut),
        "ms-auto shrink-0 tracking-wide text-refineui-alias-foreground-tertiary",
    ),
} as const;
