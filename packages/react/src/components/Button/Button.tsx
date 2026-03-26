import { forwardRef, type ButtonHTMLAttributes } from "react";
import { colors, spacings, borderRadii, typographys, strokeWidths } from "@refineui/tokens";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
}

/**
 * Web Kit `Button` (`79:3304`) — Primary·Secondary·Outline·Ghost.
 * Danger는 토큰 red 스케일(알럿 액션 등)용으로 유지.
 */
const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
        backgroundColor: colors.primaryBlack,
        color: colors.neutralWhite,
        border: `${strokeWidths.strokeWidthNone} solid transparent`,
        boxSizing: "border-box",
    },
    secondary: {
        backgroundColor: colors.neutralWhite,
        color: colors.primaryBlack,
        border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
        boxSizing: "border-box",
    },
    outline: {
        backgroundColor: "transparent",
        color: colors.primaryBlack,
        border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
        boxSizing: "border-box",
    },
    ghost: {
        backgroundColor: "transparent",
        color: colors.primaryBlack,
        border: `${strokeWidths.strokeWidthNone} solid transparent`,
        boxSizing: "border-box",
    },
    danger: {
        backgroundColor: colors.red500,
        color: colors.neutralWhite,
        border: `${strokeWidths.strokeWidthNone} solid transparent`,
        boxSizing: "border-box",
    },
};

/** MCP: Small 28 / Medium 36 / Large 48 높이, padding·radius·타이포 티어별 */
const sizeStyles: Record<"sm" | "md" | "lg", React.CSSProperties> = {
    sm: {
        minHeight: "28px",
        padding: `${spacings.sizeXSmall} ${spacings.sizeMedium}`,
        gap: spacings.sizeMedium,
        borderRadius: borderRadii.roundedSmall,
        ...typographys.body3,
    },
    md: {
        minHeight: "36px",
        padding: `${spacings.sizeSmall} ${spacings.sizeMedium}`,
        gap: spacings.sizeMedium,
        borderRadius: borderRadii.roundedMedium,
        ...typographys.body1,
    },
    lg: {
        minHeight: "48px",
        padding: `${spacings.sizeMedium} ${spacings.sizeLarge}`,
        gap: spacings.sizeMedium,
        borderRadius: borderRadii.roundedLarge,
        ...typographys.subTitle1,
    },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = "primary", size = "md", fullWidth = false, style, disabled, type = "button", ...props },
    ref
) {
    return (
        <button
            ref={ref}
            type={type}
            data-refineui="button"
            data-variant={variant}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                width: fullWidth ? "100%" : undefined,
                transition: "opacity 0.15s, background-color 0.15s, border-color 0.15s, transform 0.1s",
                ...sizeStyles[size],
                ...variantStyles[variant],
                ...style,
            }}
            disabled={disabled}
            {...props}
        />
    );
});
