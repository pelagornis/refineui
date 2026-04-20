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
            data-size="md"
            data-error={error ? "true" : undefined}
            data-success={success ? "true" : undefined}
            disabled={disabled}
            className={clsx(
                textareaStyles.base,
                borderClass,
                disabled ? textareaStyles.bgDisabled : textareaStyles.bgDefault,
                fullWidth && "w-full",
                className,
            )}
            {...props}
        />
    );
}
