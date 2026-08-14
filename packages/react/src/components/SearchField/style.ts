import { iconSizes } from "@refineui/tokens";
import { formControlTypoClass } from "../../formControlSizes";

export const searchFieldLeadingIconSize = iconSizes.medium;
export const searchFieldClearIconSize = iconSizes.small;

export const searchFieldStyles = {
    root: [
        "box-border flex w-full min-w-0 items-center gap-refineui-size-x-small overflow-hidden outline-none",
        formControlTypoClass.md,
        "transition-[background-color,border-color]",
        "duration-[var(--refineui-motion-duration-fast)]",
        "ease-[var(--refineui-motion-easing-emphasized)]",
    ].join(" "),
    rootFilled: [
        "h-refineui-control-height-md min-h-refineui-control-height-md",
        "rounded-refineui-x-large px-refineui-size-large",
        "border-refineui-thin border-transparent",
        /** Same soft plate as InputOTP slots */
        "bg-refineui-alias-background-surface-selected",
    ].join(" "),
    rootPlain: [
        "h-auto min-h-0 rounded-none border-none bg-transparent px-0 py-0",
    ].join(" "),
    rootDisabled:
        "border-refineui-alias-border-disabled bg-refineui-alias-background-surface-disabled",
    rootPlainDisabled: "bg-transparent",
    icon: "inline-flex shrink-0 items-center justify-center text-refineui-alias-foreground-tertiary",
    iconDisabled: "text-refineui-alias-foreground-disabled",
    input:
        "min-w-0 flex-1 appearance-none border-none bg-transparent p-0 text-refineui-alias-foreground-primary outline-none placeholder:text-refineui-alias-foreground-placeholder disabled:cursor-not-allowed disabled:text-refineui-alias-foreground-disabled",
    clear:
        "inline-flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 leading-none text-refineui-alias-foreground-tertiary",
    clearDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
} as const;
