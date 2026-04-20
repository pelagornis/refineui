import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    width?: number | string;
    height?: number | string;
    /** Web Kit COMPONENT_SET `Skeleton` `570:6175` — Rectangle / Circle */
    shape?: "rectangle" | "circle";
}

