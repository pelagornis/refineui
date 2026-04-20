import type { HTMLAttributes, ReactNode } from "react";

export type ChipVariant = "default" | "outline" | "filled";
export type ChipSize = "sm" | "md" | "lg";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
    avatar?: ReactNode;
    disabled?: boolean;
    onRemove?: () => void;
    size?: ChipSize;
    variant?: ChipVariant;
}

