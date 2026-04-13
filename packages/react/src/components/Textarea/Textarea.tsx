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
        ? "border-refineui-thin border-refineui-neutral-250"
        : error
          ? "border-refineui-thin border-refineui-red-500"
          : success
            ? "border-refineui-thin border-refineui-green-500"
            : "border-refineui-thin border-refineui-neutral-300";

    return (
        <textarea
            data-refineui="textarea"
            data-size="md"
            disabled={disabled}
            className={clsx(
                "refineui-typo-body-2 min-h-refineui-control-textarea-min resize-y rounded-refineui-large px-refineui-size-small py-refineui-size-medium text-refineui-primary-black outline-none transition-[border-color,box-shadow,background-color] duration-150",
                borderClass,
                disabled ? "bg-refineui-neutral-150" : "bg-refineui-neutral-white",
                fullWidth && "w-full",
                className,
            )}
            {...props}
        />
    );
}
