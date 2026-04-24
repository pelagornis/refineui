import type { InputProps } from "./types";

export const inputStyles = {
    base: "box-border outline-none transition-[border-color,box-shadow,background-color] duration-[var(--refineui-motion-duration-fast)]",
    text: "text-refineui-alias-foreground-primary",
    disabledBg: "bg-refineui-alias-background-surface-disabled",
    defaultBg: "bg-refineui-alias-background-primary",
} as const;

export const inputSizeClass: Record<NonNullable<InputProps["size"]>, string> = {
    sm: "min-h-refineui-control-height-sm rounded-refineui-medium px-refineui-size-medium py-refineui-size-small refineui-typo-caption-1",
    md: "min-h-refineui-control-height-md rounded-refineui-large px-refineui-size-large py-refineui-size-medium refineui-typo-body-2",
    lg: "min-h-refineui-control-height-lg rounded-refineui-xlarge px-refineui-size-large py-refineui-size-large refineui-typo-body-1",
};

export const inputBorderClass = {
    disabled: "border-refineui-thin border-refineui-alias-border-disabled",
    error: "border-refineui-thin border-refineui-alias-border-error",
    success: "border-refineui-thin border-refineui-alias-border-success",
    default: "border-refineui-thin border-refineui-alias-border-default",
} as const;

