import type { HTMLAttributes } from "react";

export type BadgeVariant = "default" | "neutral" | "outline" | "success" | "warning" | "danger";
export type BadgeLayout = "label" | "number";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    layout?: BadgeLayout;
}

