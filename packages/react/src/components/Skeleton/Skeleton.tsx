import type { HTMLAttributes } from "react";
import { useEffect } from "react";
import { colors, borderRadii, sizes } from "@refineui/tokens";

const STYLE_ID = "refineui-skeleton-styles";

function injectSkeletonStyles() {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `@keyframes refineui-skeleton-pulse{0%,100%{opacity:1}50%{opacity:.5}}`;
    document.head.appendChild(style);
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    width?: number | string;
    height?: number | string;
}

export function Skeleton({ width, height = sizes.skeletonDefaultHeight, style, ...props }: SkeletonProps) {
    useEffect(injectSkeletonStyles, []);
    return (
        <div
            data-refineui="skeleton"
            aria-hidden
            style={{
                width: width ?? "100%",
                height,
                borderRadius: borderRadii.roundedSmall,
                backgroundColor: colors.neutral200,
                animation: "refineui-skeleton-pulse 1.5s ease-in-out infinite",
                ...style,
            }}
            {...props}
        />
    );
}
