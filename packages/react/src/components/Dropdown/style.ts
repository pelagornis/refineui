import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/** Visual language aligned with `menuStyles` — shared panel/item chrome. */
export const dropdownStyles = {
    label: clsx(
        componentTextClass(componentTypographyTokens.dropdown.label),
        "shrink-0 px-refineui-size-x-small py-refineui-size-x-small text-refineui-alias-foreground-tertiary",
    ),
    item: clsx(
        componentTextClass(componentTypographyTokens.dropdown.item),
        "flex w-full cursor-pointer items-center justify-between gap-refineui-size-x-small rounded-refineui-large border-none bg-transparent p-refineui-size-x-small text-left text-refineui-alias-foreground-primary outline-none disabled:cursor-not-allowed disabled:text-refineui-alias-foreground-disabled",
    ),
    shortcut: clsx(
        componentTextClass(componentTypographyTokens.dropdown.shortcut),
        "ml-auto shrink-0 tracking-wide text-refineui-alias-foreground-tertiary",
    ),
} as const;
