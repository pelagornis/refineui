import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/** Visual language aligned with `menuStyles` — frosted fill/blur in refineui.css */
const dropdownPanelChrome =
    "box-border flex w-refineui-dropdown-menu-width min-w-refineui-dropdown-menu-width flex-col overflow-hidden rounded-refineui-xx-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-surface-frosted shadow-refineui-2 outline-none backdrop-blur-refineui-surface-frost";

export const dropdownStyles = {
    menuShell: clsx(
        dropdownPanelChrome,
        "max-w-[min(100vw-16px,calc(100vw-2rem))]",
    ),
    submenuShell: clsx(
        dropdownPanelChrome,
        "data-[state=open]:[animation:refineui-fade-enter_var(--refineui-motion-duration-fast)_var(--refineui-motion-easing-standard)] motion-reduce:animation-none",
    ),
    menuViewport: "box-border flex flex-col gap-px p-refineui-size-xx-small",
    label: clsx(
        componentTextClass(componentTypographyTokens.dropdown.label),
        "shrink-0 px-refineui-size-x-small py-refineui-size-xxx-small text-refineui-alias-foreground-tertiary",
    ),
    item: clsx(
        componentTextClass(componentTypographyTokens.dropdown.item),
        "flex w-full cursor-pointer items-center justify-between gap-refineui-size-x-small rounded-refineui-large border-none bg-transparent p-refineui-size-x-small text-start text-refineui-alias-foreground-primary outline-none transition-[background-color,transform] duration-[var(--refineui-motion-duration-fast)] hover:bg-refineui-alias-background-primary-hover hover:text-refineui-alias-foreground-primary-hover active:bg-refineui-alias-background-primary-active active:text-refineui-alias-foreground-primary data-[selected=true]:bg-refineui-alias-background-primary-hover data-[selected=true]:text-refineui-alias-foreground-primary data-[state=selected]:bg-refineui-alias-background-primary-hover data-[state=selected]:text-refineui-alias-foreground-primary data-[state=pressed]:bg-refineui-alias-background-primary-active data-[state=pressed]:text-refineui-alias-foreground-primary disabled:cursor-not-allowed disabled:text-refineui-alias-foreground-disabled",
    ),
    shortcut: clsx(
        componentTextClass(componentTypographyTokens.dropdown.shortcut),
        "ms-auto shrink-0 tracking-wide text-refineui-alias-foreground-tertiary",
    ),
} as const;
