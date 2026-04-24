import type { ButtonSize, ButtonVariant } from "./types";

export const buttonStyles = {
    base: "box-border inline-flex cursor-pointer items-center justify-center border transition-[opacity,background-color,border-color,color,transform] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    iconGhost:
        "border-refineui-none border border-transparent bg-transparent text-refineui-alias-foreground-secondary hover:text-refineui-alias-foreground-primary-hover",
} as const;

export const buttonVariantClass: Record<ButtonVariant, string> = {
    primary:
        "border-refineui-none border border-transparent bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    secondary:
        "border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-surface text-refineui-alias-foreground-primary",
    outline:
        "border-refineui-thin border-refineui-alias-border-default bg-transparent text-refineui-alias-foreground-primary",
    ghost: "border-refineui-none border border-transparent bg-transparent text-refineui-alias-foreground-primary",
};

/** Figma `Layout=Label` — gap sizeXSmall, padding per MCP. */
export const buttonLabelSizeClass: Record<ButtonSize, string> = {
    sm: "min-h-refineui-button-min-height-sm gap-refineui-size-x-small rounded-refineui-large px-refineui-size-medium py-refineui-size-xsmall refineui-typo-body-3",
    md: "min-h-refineui-button-min-height-md gap-refineui-size-x-small rounded-refineui-xlarge px-refineui-size-medium py-refineui-size-small refineui-typo-body-1",
    lg: "min-h-refineui-button-min-height-lg gap-refineui-size-x-small rounded-refineui-xxlarge px-refineui-size-large py-refineui-size-medium refineui-typo-sub-title-1",
};

/** Figma `Layout=Icon` — square min width/height per size, gap 0, padding and radius per MCP. */
export const buttonIconSizeClass: Record<ButtonSize, string> = {
    sm: "min-h-refineui-button-min-height-sm min-w-refineui-button-min-height-sm shrink-0 gap-0 rounded-refineui-large p-refineui-size-xsmall leading-none",
    md: "min-h-refineui-button-min-height-md min-w-refineui-button-min-height-md shrink-0 gap-0 rounded-refineui-xlarge p-refineui-size-small leading-none",
    lg: "min-h-refineui-button-min-height-lg min-w-refineui-button-min-height-lg shrink-0 gap-0 rounded-refineui-xxlarge p-refineui-size-medium leading-none",
};

