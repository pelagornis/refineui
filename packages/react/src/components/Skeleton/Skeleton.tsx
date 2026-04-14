import { clsx } from "clsx";
import type { CSSProperties, HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    width?: number | string;
    height?: number | string;
    /** Web Kit COMPONENT_SET `Skeleton` `570:6175` — Rectangle / Circle */
    shape?: "rectangle" | "circle";
}

/** Web Kit COMPONENT_SET `Skeleton` `570:6175` — 배경·쉬머 색은 MCP Alias, 애니메이션은 **`refineui.css`**. */
export function Skeleton({
    width,
    height,
    shape = "rectangle",
    className,
    style,
    ...props
}: SkeletonProps) {
    const defaultLine = "var(--refineui-size-skeleton-default-height)";
    const isCircle = shape === "circle";

    let w: number | string | undefined;
    let h: number | string | undefined;

    if (isCircle) {
        if (width != null && height == null) {
            w = width;
            h = width;
        } else if (height != null && width == null) {
            w = height;
            h = height;
        } else if (width == null && height == null) {
            w = defaultLine;
            h = defaultLine;
        } else {
            w = width ?? defaultLine;
            h = height ?? defaultLine;
        }
    } else {
        h = height ?? defaultLine;
        w = width ?? "100%";
    }

    const dimStyle: CSSProperties = { width: w, height: h };

    return (
        <div
            data-refineui="skeleton"
            data-shape={shape}
            aria-hidden
            className={clsx(
                isCircle ? "rounded-refineui-circle" : "rounded-refineui-large",
                className,
            )}
            style={{ ...dimStyle, ...style }}
            {...props}
        />
    );
}
