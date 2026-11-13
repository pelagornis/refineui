import { iconSizes } from "@refineui/tokens";
import { formControlRowShellSizeClass, formControlTypoClass, type FormControlSize } from "../../formControlSizes";

export const searchFieldLeadingIconSize: Record<FormControlSize, number> = {
    sm: iconSizes.small,
    md: iconSizes.medium,
    lg: iconSizes.large,
};

export const searchFieldClearIconSize: Record<FormControlSize, number> = {
    sm: iconSizes.xsmall,
    md: iconSizes.small,
    lg: iconSizes.small,
};

export const searchFieldStyles = {
    root: [
        "box-border flex w-full min-w-0 items-center gap-refineui-size-x-small overflow-hidden outline-none",
        "transition-[background-color,border-color]",
        "duration-[var(--refineui-motion-duration-fast)]",
        "ease-[var(--refineui-motion-easing-emphasized)] caret-refineui-alias-foreground-primary hover:bg-refineui-alias-background-surface-active focus-within:border-refineui-alias-border-default data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-refineui-alias-border-disabled data-[disabled=true]:bg-refineui-alias-background-surface-disabled",
    ].join(" "),
    rootFilled: [
        "border-refineui-thin border-transparent",
        /** Same soft plate as InputOTP slots */
        "bg-refineui-alias-background-surface-hover",
    ].join(" "),
    rootPlain: [
        "h-auto min-h-0 rounded-none border-none bg-transparent px-0 py-0 hover:bg-transparent focus-within:border-transparent",
    ].join(" "),
    rootDisabled:
        "border-refineui-alias-border-disabled bg-refineui-alias-background-surface-disabled",
    rootPlainDisabled: "bg-transparent",
    icon: "inline-flex shrink-0 items-center justify-center text-refineui-alias-foreground-tertiary",
    iconDisabled: "text-refineui-alias-foreground-disabled",
    input:
        "min-w-0 flex-1 appearance-none border-none bg-transparent p-0 text-refineui-alias-foreground-primary outline-none placeholder:text-refineui-alias-foreground-placeholder disabled:cursor-not-allowed disabled:text-refineui-alias-foreground-disabled [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
    clear:
        "inline-flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 leading-none text-refineui-alias-foreground-tertiary hover:text-refineui-alias-foreground-primary active:transform-none",
    clearDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
} as const;

/** Filled shell per size — height, radius, inline padding. */
export const searchFieldFilledSizeClass = formControlRowShellSizeClass;

export const searchFieldTypoClass = formControlTypoClass;
