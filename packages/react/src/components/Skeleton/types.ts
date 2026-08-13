import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    width?: number | string;
    height?: number | string;
    /** `rectangle` (default) or `circle` */
    shape?: "rectangle" | "circle";
}

