import type { HTMLAttributes } from "react";
import { colors, spacings, borderRadii, sizes } from "@refineui/tokens";

export type ProgressVariant = "default" | "success" | "warning" | "danger";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    variant?: ProgressVariant;
}

const variantColors: Record<ProgressVariant, string> = {
    default: colors.primaryBlack,
    success: colors.green500,
    warning: colors.yellow500,
    danger: colors.red500,
};

export function Progress({
    value,
    max = 100,
    variant = "default",
    style,
    ...props
}: ProgressProps) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div
            data-refineui="progress"
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            style={{
                height: sizes.progressTrackHeight,
                borderRadius: borderRadii.roundedCircle,
                backgroundColor: colors.neutral200,
                overflow: "hidden",
                ...style,
            }}
            {...props}
        >
            <div
                style={{
                    width: `${pct}%`,
                    height: "100%",
                    backgroundColor: variantColors[variant],
                    borderRadius: borderRadii.roundedCircle,
                    transition: "width 0.3s ease",
                }}
            />
        </div>
    );
}
