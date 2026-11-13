import type { HTMLAttributes } from "react";

export type MarkerVariant = "default" | "divider";

export interface MarkerProps extends HTMLAttributes<HTMLDivElement> {
    /** Informational row, or a labeled divider between conversation events. */
    variant?: MarkerVariant;
}

export type MarkerIconProps = HTMLAttributes<HTMLSpanElement>;
export type MarkerContentProps = HTMLAttributes<HTMLSpanElement>;
