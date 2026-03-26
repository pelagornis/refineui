import type { HTMLAttributes } from "react";
import { colors, spacings, borderRadii, typographys, strokeWidths, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export type ChipVariant = "default" | "outline" | "filled";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: ChipVariant;
    onRemove?: () => void;
}

const variantStyles: Record<ChipVariant, React.CSSProperties> = {
    default: { backgroundColor: colors.neutral200, color: colors.primaryBlack, border: "none" },
    outline: {
        backgroundColor: "transparent",
        color: colors.primaryBlack,
        border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
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
            style={{
                ...typographys.caption1,
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
                        marginLeft: spacings.sizeXXSmall,
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
