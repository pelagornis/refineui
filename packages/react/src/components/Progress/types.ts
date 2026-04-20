import type { HTMLAttributes } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    /** Web Kit `Progress bar` `452:3994` — Small(2px) / Large(4px) */
    size?: "sm" | "lg";
}

