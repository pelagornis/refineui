import type { CSSProperties } from "react";
import { strokeWidths } from "@refineui/tokens";

type FrostedBeakProps = {
    width: string;
    height: string;
    rotateDeg: number;
    borderColor: string;
};

const triangleClipPath = "polygon(50% 0, 0 100%, 100% 100%)";

/** Token-colored arrow matched to the resolved base tone of frosted floating panels. */
export function FrostedBeak({ width, height, rotateDeg, borderColor }: FrostedBeakProps) {
    const surfaceStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        clipPath: triangleClipPath,
    };

    return (
        <div
            style={{
                position: "relative",
                width,
                height,
                transform: `rotate(${rotateDeg}deg)`,
                transformOrigin: "center center",
            }}
        >
            <span
                data-refineui="floating-beak-surface"
                style={surfaceStyle}
            />
            <svg
                width={width}
                height={height}
                viewBox="0 0 16 8"
                fill="none"
                aria-hidden
                style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
                <path
                    d="M0 8L8 0L16 8"
                    stroke={borderColor}
                    strokeWidth={strokeWidths.strokeWidthThin}
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}
