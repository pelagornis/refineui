import type { HTMLAttributes } from "react";
import { colors, spacings, borderRadii, shadows, toBoxShadow, strokeWidths } from "@refineui/tokens";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "elevated" | "outlined";
}

export function Card({ variant = "elevated", style, ...props }: CardProps) {
    return (
        <div
            data-refineui="card"
            style={{
                backgroundColor: colors.neutralWhite,
                borderRadius: borderRadii.roundedXXLarge,
                padding: spacings.sizeLarge,
                boxShadow: variant === "elevated" ? toBoxShadow(shadows.shadow4Light) : undefined,
                border: variant === "outlined" ? `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}` : undefined,
                boxSizing: "border-box",
                ...style,
            }}
            {...props}
        />
    );
}
