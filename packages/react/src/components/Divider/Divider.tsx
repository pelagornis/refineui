import type { HTMLAttributes } from "react";
import { colors, spacings, strokeWidths } from "@refineui/tokens";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
    orientation?: "horizontal" | "vertical";
}

export function Divider({ orientation = "horizontal", style, ...props }: DividerProps) {
    return (
        <hr
            data-refineui="divider"
            role="separator"
            style={{
                border: "none",
                borderTop: orientation === "horizontal" ? `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}` : "none",
                borderLeft: orientation === "vertical" ? `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}` : "none",
                margin: orientation === "horizontal" ? `${spacings.sizeMedium} 0` : `0 ${spacings.sizeMedium}`,
                width: orientation === "horizontal" ? "100%" : undefined,
                height: orientation === "vertical" ? "100%" : undefined,
                minHeight: orientation === "vertical" ? 24 : undefined,
                ...style,
            }}
            {...props}
        />
    );
}
