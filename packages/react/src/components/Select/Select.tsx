import { clsx } from "clsx";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { selectSizeClass, selectStyles } from "./style";
import type { SelectProps } from "./types";

export function Select({
    options,
    placeholder,
    fullWidth = false,
    error = false,
    success = false,
    size = "md",
    disabled,
    className,
    ...props
}: SelectProps) {
    const borderColor = disabled
        ? resolveColorTokenValue(componentColorTokens.select.border.disabled)
        : error
          ? resolveColorTokenValue(componentColorTokens.select.border.error)
          : success
            ? resolveColorTokenValue(componentColorTokens.select.border.success)
            : resolveColorTokenValue(componentColorTokens.select.border.default);

    return (
        <select
            data-refineui="select"
            data-size={size}
            data-error={error || undefined}
            aria-invalid={error || undefined}
            disabled={disabled}
            className={clsx(
                selectStyles.base,
                disabled ? selectStyles.disabledCursor : selectStyles.enabledCursor,
                fullWidth && "w-full",
                selectSizeClass[size],
                className,
            )}
            style={{
                borderColor,
                color: resolveColorTokenValue(componentColorTokens.select.text),
                backgroundColor: disabled
                    ? resolveColorTokenValue(componentColorTokens.select.disabledBackground)
                    : resolveColorTokenValue(componentColorTokens.select.background),
            }}
            {...props}
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
