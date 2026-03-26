import type { InputHTMLAttributes } from "react";
import { colors, spacings, borderRadii, typographys, strokeWidths, sizes } from "@refineui/tokens";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    success?: boolean;
    fullWidth?: boolean;
}

export function Input({
    error = false,
    success = false,
    fullWidth = false,
    disabled,
    style,
    ...props
}: InputProps) {
    const borderColor = error ? colors.red500 : success ? colors.green500 : colors.neutral300;
    const bg = disabled ? colors.neutral150 : colors.neutralWhite;
    const border = disabled ? colors.neutral250 : borderColor;

    return (
        <input
            data-refineui="input"
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
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s, box-shadow 0.15s, background-color 0.15s",
                ...style,
            }}
            {...props}
        />
    );
}
