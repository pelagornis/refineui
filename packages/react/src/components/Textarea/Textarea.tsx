import type { TextareaHTMLAttributes } from "react";
import { colors, spacings, borderRadii, typographys, strokeWidths, sizes } from "@refineui/tokens";

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
    style,
    ...props
}: TextareaProps) {
    const borderColor = error ? colors.red500 : success ? colors.green500 : colors.neutral300;
    const bg = disabled ? colors.neutral150 : colors.neutralWhite;
    const border = disabled ? colors.neutral250 : borderColor;

    return (
        <textarea
            data-refineui="textarea"
            disabled={disabled}
            style={{
                ...typographys.body2,
                padding: `${spacings.sizeMedium} ${spacings.sizeLarge}`,
                borderRadius: borderRadii.roundedLarge,
                border: `${strokeWidths.strokeWidthThin} solid ${border}`,
                backgroundColor: bg,
                color: colors.primaryBlack,
                width: fullWidth ? "100%" : undefined,
                outline: "none",
                resize: "vertical",
                minHeight: sizes.controlTextareaMin,
                boxSizing: "border-box",
                transition: "border-color 0.15s, box-shadow 0.15s, background-color 0.15s",
                ...style,
            }}
            {...props}
        />
    );
}
