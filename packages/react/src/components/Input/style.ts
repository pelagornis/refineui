import type { InputProps } from "./types";
import { formControlInputSizeClass } from "../../formControlSizes";

export const inputStyles = {
    base: "box-border appearance-none outline-none transition-[border-color,box-shadow,background-color] duration-[var(--refineui-motion-duration-fast)]",
    text: "text-refineui-alias-foreground-primary placeholder:text-refineui-alias-foreground-placeholder",
    disabledText: "disabled:text-refineui-alias-foreground-disabled",
    disabledBg: "bg-refineui-alias-background-surface-disabled",
    defaultBg: "bg-refineui-alias-background-primary",
} as const;

export const inputSizeClass: Record<NonNullable<InputProps["size"]>, string> = formControlInputSizeClass;

export const inputBorderClass = {
    disabled: "border-refineui-thin border-refineui-alias-border-disabled",
    error: "border-refineui-thin border-refineui-alias-border-error",
    success: "border-refineui-thin border-refineui-alias-border-success",
    default: "border-refineui-thin border-refineui-alias-border-default",
} as const;
