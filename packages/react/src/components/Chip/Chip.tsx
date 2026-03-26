import type { CSSProperties, HTMLAttributes } from "react";
import { colors, spacings, borderRadii, typographys, strokeWidths, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export type ChipVariant = "default" | "outline" | "filled";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: ChipVariant;
    onRemove?: () => void;
}

/** Web Kit `Tag` (Chip) — 라벨형 Badge와 동일: padding·radius·Caption 2, Secondary=primaryLightGray */
const variantStyles: Record<ChipVariant, CSSProperties> = {
    default: { backgroundColor: colors.primaryLightGray, color: colors.neutralBlack, border: "none" },
    outline: {
        backgroundColor: "transparent",
        color: colors.neutralBlack,
        border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
        boxSizing: "border-box",
    },
    filled: { backgroundColor: colors.primaryBlack, color: colors.neutralWhite, border: "none" },
};

export function Chip({
    variant = "default",
    onRemove,
    children,
    style,
    ...props
}: ChipProps) {
    return (
        <span
            data-refineui="chip"
            data-variant={variant}
            style={{
                ...typographys.caption2,
                display: "inline-flex",
                alignItems: "center",
                gap: spacings.sizeXSmall,
                padding: `${spacings.sizeXXSmall} ${spacings.sizeSmall}`,
                borderRadius: borderRadii.roundedMedium,
                ...variantStyles[variant],
                ...style,
            }}
            {...props}
        >
            {children}
            {onRemove && (
                <button
                    type="button"
                    data-refineui="chip-remove"
                    aria-label="Remove"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        lineHeight: 1,
                        opacity: 0.7,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "inherit",
                    }}
                >
                    <WebIcon name="dismiss" size={iconSizes.md} color="currentColor" />
                </button>
            )}
        </span>
    );
}
