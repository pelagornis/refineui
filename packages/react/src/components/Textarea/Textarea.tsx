import { clsx } from "clsx";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
    success?: boolean;
    fullWidth?: boolean;
}

export function Textarea({
    error = false,
    success = false,
    fullWidth = false,
    disabled,
    className,
    ...props
}: TextareaProps) {
    const borderClass = disabled
        ? "border-refineui-thin border-refineui-alias-border-default"
        : error
          ? "border-refineui-thin border-refineui-alias-background-error"
          : success
            ? "border-refineui-thin border-refineui-alias-background-success"
            : "border-refineui-thin border-refineui-alias-border-default";

    return (
        <textarea
            data-refineui="textarea"
            data-size="md"
            data-error={error ? "true" : undefined}
            data-success={success ? "true" : undefined}
            disabled={disabled}
            className={clsx(
                "refineui-typo-body-2 min-h-refineui-control-textarea-min resize-y rounded-refineui-large px-refineui-size-small py-refineui-size-medium text-refineui-alias-foreground-primary placeholder:text-refineui-alias-foreground-placeholder outline-none transition-[border-color,box-shadow,background-color] duration-150",
                borderClass,
                disabled ? "bg-refineui-alias-background-surface-disabled" : "bg-refineui-alias-background-primary",
                fullWidth && "w-full",
                className,
            )}
            {...props}
        />
    );
}
