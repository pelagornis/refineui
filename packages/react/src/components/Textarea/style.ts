import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * Web Kit Textarea `529:5454` — single size:
 * minHeight `controlTextareaMin`, radius `roundedLarge`, body2,
 * padding py `sizeMedium` / px `sizeXSmall` (differs from Input md).
 */
export const textareaStyles = {
    base: "box-border appearance-none outline-none transition-[border-color,box-shadow,background-color] duration-[var(--refineui-motion-duration-fast)]",
    field: clsx(
        componentTextClass(componentTypographyTokens.textarea),
        "min-h-refineui-control-textarea-min resize-y rounded-refineui-large px-refineui-size-x-small py-refineui-size-medium",
    ),
    text: "text-refineui-alias-foreground-primary placeholder:text-refineui-alias-foreground-placeholder",
    disabledText: "disabled:text-refineui-alias-foreground-disabled",
    disabledBg: "bg-refineui-alias-background-surface-disabled",
    defaultBg: "bg-refineui-alias-background-primary",
} as const;

/** Same border aliases as Input / Select trigger */
export const textareaBorderClass = {
    disabled: "border-refineui-thin border-refineui-alias-border-disabled",
    error: "border-refineui-thin border-refineui-alias-border-error",
    success: "border-refineui-thin border-refineui-alias-border-success",
    default: "border-refineui-thin border-refineui-alias-border-default",
} as const;
