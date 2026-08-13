import { clsx } from "clsx";
import { textareaBorderClass, textareaStyles } from "./style";
import type { TextareaProps } from "./types";

export function Textarea({
    error = false,
    success = false,
    fullWidth = false,
    disabled,
    className,
    ...props
}: TextareaProps) {
    const borderClass = disabled
        ? textareaBorderClass.disabled
        : error
          ? textareaBorderClass.error
          : success
            ? textareaBorderClass.success
            : textareaBorderClass.default;

    return (
        <textarea
            data-refineui="textarea"
            data-error={error || undefined}
            data-success={success || undefined}
            disabled={disabled}
            aria-invalid={error || undefined}
            className={clsx(
                textareaStyles.base,
                textareaStyles.field,
                textareaStyles.text,
                textareaStyles.disabledText,
                borderClass,
                disabled ? textareaStyles.disabledBg : textareaStyles.defaultBg,
                fullWidth && "w-full",
                className,
            )}
            {...props}
        />
    );
}
