import type { ButtonSize, ButtonVariant } from "./types";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { sizedComponentTextClass } from "../../typography";

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

/** Figma `Layout=Label` — gap sizeXXSmall, padding per MCP. */
export const buttonLabelSizeClass: Record<ButtonSize, string> = {
    sm: `min-h-refineui-button-min-height-sm gap-refineui-size-xx-small rounded-refineui-large px-refineui-size-medium py-refineui-size-xx-small ${sizedComponentTextClass(componentTypographyTokens.button, "sm")}`,
    md: `min-h-refineui-button-min-height-md gap-refineui-size-xx-small rounded-refineui-x-large px-refineui-size-medium py-refineui-size-x-small ${sizedComponentTextClass(componentTypographyTokens.button, "md")}`,
    lg: `min-h-refineui-button-min-height-lg gap-refineui-size-xx-small rounded-refineui-xx-large px-refineui-size-large py-refineui-size-medium ${sizedComponentTextClass(componentTypographyTokens.button, "lg")}`,
};

/** Figma `Layout=Icon` — square min width/height per size, gap 0, padding and radius per MCP. */
export const buttonIconSizeClass: Record<ButtonSize, string> = {
    sm: "min-h-refineui-button-min-height-sm min-w-refineui-button-min-height-sm shrink-0 gap-0 rounded-refineui-large p-refineui-size-xx-small leading-none",
    md: "min-h-refineui-button-min-height-md min-w-refineui-button-min-height-md shrink-0 gap-0 rounded-refineui-x-large p-refineui-size-x-small leading-none",
    lg: "min-h-refineui-button-min-height-lg min-w-refineui-button-min-height-lg shrink-0 gap-0 rounded-refineui-xx-large p-refineui-size-medium leading-none",
};

