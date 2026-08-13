import { clsx } from "clsx";
import { inputBorderClass, inputSizeClass, inputStyles } from "./style";
import type { InputProps } from "./types";
import { useOptionalFieldSize } from "../Field/context";

export function Input({
    error = false,
    success = false,
    fullWidth = false,
    size: sizeProp,
    disabled,
    className,
    ...props
}: InputProps) {
    const fieldSize = useOptionalFieldSize();
    const size = sizeProp ?? fieldSize ?? "lg";
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
            aria-invalid={error || undefined}
            className={clsx(
                inputStyles.base,
                inputStyles.text,
                inputStyles.disabledText,
                borderClass,
                disabled ? inputStyles.disabledBg : inputStyles.defaultBg,
                fullWidth && "w-full",
                inputSizeClass[size],
                className,
            )}
            {...props}
        />
    );
}
