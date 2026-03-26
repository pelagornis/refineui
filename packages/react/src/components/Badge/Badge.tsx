import type { HTMLAttributes } from "react";
import { colors, spacings, borderRadii, typographys, strokeWidths } from "@refineui/tokens";

/**
 * Web Kit `Badge` (Figma MCP `270:3353`) · `Badge Number` (`276:515`)
 * — padding: py sizeXXSmall(2px) px sizeSmall(6px)
 * — label: radius roundedMedium(6px) / number: roundedCircle
 * — 타이포: Caption 2 (12 Regular / 16)
 * — Default·Success·Warning·Danger: 흰색 글자 + 채도 있는 배경 / Secondary·Outline: 검정 글자
 * — Hover·Pressed: `refineui.css` `[data-refineui="badge"][data-variant=…]` (label·number 공통)
 */
export type BadgeVariant = "default" | "neutral" | "outline" | "success" | "warning" | "danger";

/** `label`: 텍스트 배지 · `number`: 숫자/카운트용 원형 배지 */
export type BadgeLayout = "label" | "number";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    layout?: BadgeLayout;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
    default: { backgroundColor: colors.primaryBlack, color: colors.neutralWhite },
    /** Figma `Secondary` — primaryLightGray */
    neutral: { backgroundColor: colors.primaryLightGray, color: colors.neutralBlack },
    outline: {
        backgroundColor: "transparent",
        color: colors.neutralBlack,
        border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
        boxSizing: "border-box",
    },
    success: { backgroundColor: colors.green500, color: colors.neutralWhite },
    /** Figma `Warning` — orange 스케일 (노랑 아님) */
    warning: { backgroundColor: colors.orange500, color: colors.neutralWhite },
    danger: { backgroundColor: colors.red500, color: colors.neutralWhite },
};

export function Badge({ variant = "default", layout = "label", style, ...props }: BadgeProps) {
    return (
        <span
            data-refineui="badge"
            data-variant={variant}
            data-layout={layout}
            style={{
                ...typographys.caption2,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: `${spacings.sizeXXSmall} ${spacings.sizeSmall}`,
                borderRadius: layout === "number" ? borderRadii.roundedCircle : borderRadii.roundedMedium,
                ...variantStyles[variant],
                ...style,
            }}
            {...props}
        />
    );
}
