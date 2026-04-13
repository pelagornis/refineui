import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { iconSizes } from "@refineui/tokens";
import { getIconChar, getFontFamily } from "@refineui/web-icons";

export interface WebIconProps {
    name: string;
    size?: number;
    color?: string;
    /** RefineUI System Icons 스타일 (기본 regular) */
    iconStyle?: "regular" | "filled";
    className?: string;
    style?: CSSProperties;
    /** 글리프가 없을 때 표시 */
    fallback?: ReactNode;
    /** 접근성: 라벨이 없으면 aria-hidden */
    "aria-label"?: string;
}

/** @refineui/web-icons (RefineUI System Icons) 글리프 — 크기·색은 아이콘 글리프에 맞게 인라인 유지 */
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
