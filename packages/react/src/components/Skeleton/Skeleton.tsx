import { clsx } from "clsx";
import type { CSSProperties } from "react";
import { skeletonStyles } from "./style";
import type { SkeletonProps } from "./types";

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
                isCircle ? skeletonStyles.circle : skeletonStyles.rectangle,
                className,
            )}
            style={{ ...dimStyle, ...style }}
            {...props}
        />
    );
}
