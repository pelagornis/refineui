import { clsx } from "clsx";
import { inputBorderClass, inputSizeClass, inputStyles } from "./style";
import type { InputProps } from "./types";

export function Input({
    error = false,
    success = false,
    fullWidth = false,
    size = "md",
    disabled,
    className,
    ...props
}: InputProps) {
    const borderClass = disabled
        ? inputBorderClass.disabled
        : error
          ? inputBorderClass.error
          : success
            ? inputBorderClass.success
            : inputBorderClass.default;

    return (
        <input
            data-refineui="input"
            data-size={size}
            data-error={error || undefined}
            data-success={success || undefined}
            disabled={disabled}
            className={clsx(
                inputStyles.base,
                inputStyles.text,
                borderClass,
                disabled
                    ? inputStyles.disabledBg
                    : inputStyles.defaultBg,
                fullWidth && "w-full",
                inputSizeClass[size],
                className,
            )}
            {...props}
        />
    );
}
