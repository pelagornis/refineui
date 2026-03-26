import type { CSSProperties, ReactNode } from "react";
import { iconSizes } from "@refineui/tokens";
import { getIconChar, getFontFamily } from "@refineui/web-icons";

export interface WebIconProps {
    name: string;
    size?: number;
    color?: string;
    style?: CSSProperties;
    /** 글리프가 없을 때 표시 */
    fallback?: ReactNode;
    /** 접근성: 라벨이 없으면 aria-hidden */
    "aria-label"?: string;
}

/** @refineui/web-icons (RefineUI System Icons) 글리프 */
export function WebIcon({
    name,
    size = iconSizes.lg,
    color,
    style,
    fallback = null,
    "aria-label": ariaLabel,
}: WebIconProps) {
    const char = getIconChar(name, "regular", size);
    if (char == null) return <>{fallback}</>;

    return (
        <span
            role={ariaLabel ? "img" : undefined}
            aria-label={ariaLabel}
            aria-hidden={!ariaLabel}
            style={{
                display: "inline-flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: size,
                minWidth: size,
                height: size,
                minHeight: size,
                flexShrink: 0,
                fontFamily: getFontFamily("regular"),
                fontSize: size,
                lineHeight: 1,
                color,
                ...style,
            }}
        >
            {char}
        </span>
    );
}
