import type { SelectHTMLAttributes } from "react";
import { colors, spacings, borderRadii, typographys, strokeWidths, sizes } from "@refineui/tokens";

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
    /** Web Kit: Input과 동일하게 오류 시 red500 테두리 */
    error?: boolean;
    success?: boolean;
}

export function Select({
    options,
    placeholder,
    fullWidth = false,
    error = false,
    success = false,
    disabled,
    style,
    ...props
}: SelectProps) {
    const borderColor = error ? colors.red500 : success ? colors.green500 : colors.neutral300;
    const bg = disabled ? colors.neutral150 : colors.neutralWhite;
    const border = disabled ? colors.neutral250 : borderColor;

    return (
        <select
            data-refineui="select"
            data-error={error || undefined}
            aria-invalid={error || undefined}
            disabled={disabled}
            style={{
                ...typographys.body2,
                minHeight: sizes.controlHeightMd,
                padding: `${spacings.sizeMedium} ${spacings.sizeLarge}`,
                borderRadius: borderRadii.roundedLarge,
                border: `${strokeWidths.strokeWidthThin} solid ${border}`,
                backgroundColor: bg,
                color: colors.primaryBlack,
                width: fullWidth ? "100%" : undefined,
                cursor: disabled ? "not-allowed" : "pointer",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s, box-shadow 0.15s, background-color 0.15s",
                ...style,
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
