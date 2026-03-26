import type { HTMLAttributes } from "react";
import { colors, borderRadii, sizes, iconSizes } from "@refineui/tokens";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
    size?: SpinnerSize;
}

const spinnerDimPx = (s: SpinnerSize) =>
    s === "sm" ? iconSizes.lg : s === "md" ? Number.parseInt(sizes.avatarSm, 10) : Number.parseInt(sizes.controlHeightLg, 10);

const spinKeyframes = `
@keyframes refineui-spin {
  to { transform: rotate(360deg); }
}
`;

export function Spinner({ size = "md", style, ...props }: SpinnerProps) {
    const dim = spinnerDimPx(size);
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: spinKeyframes }} />
            <div
                role="status"
                aria-label="Loading"
                style={{
                    width: dim,
                    height: dim,
                    border: `${sizes.spinnerRingWidth} solid ${colors.neutral200}`,
                    borderTopColor: colors.primaryBlack,
                    borderRadius: borderRadii.roundedCircle,
                    animation: "refineui-spin 0.8s linear infinite",
                    ...style,
                }}
                {...props}
            />
        </>
    );
}
