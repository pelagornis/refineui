import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { iconSizes } from "@refineui/tokens";
import { getIconChar, getFontFamily } from "@refineui/web-icons";

export interface WebIconProps {
    name: string;
    size?: number;
    color?: string;
    /** RefineUI System Icons style (default: regular) */
    iconStyle?: "regular" | "filled";
    className?: string;
    style?: CSSProperties;
    /** Shown when the glyph is missing */
    fallback?: ReactNode;
    /** Accessibility: omit label → aria-hidden */
    "aria-label"?: string;
}

/** Glyph from @refineui/web-icons — size/color stay inline on the glyph */
export function WebIcon({
    name,
    size = iconSizes.medium,
    color,
    iconStyle = "regular",
    className,
    style,
    fallback = null,
    "aria-label": ariaLabel,
}: WebIconProps) {
    const char = getIconChar(name, iconStyle, size);
    if (char == null) return <>{fallback}</>;

    return (
        <span
            role={ariaLabel ? "img" : undefined}
            aria-label={ariaLabel}
            aria-hidden={!ariaLabel}
            className={clsx(
                "inline-flex shrink-0 items-center justify-start leading-none",
                className,
            )}
            style={{
                width: size,
                minWidth: size,
                height: size,
                minHeight: size,
                fontFamily: getFontFamily(iconStyle),
                fontSize: size,
                color,
                ...style,
            }}
        >
            {char}
        </span>
    );
}
