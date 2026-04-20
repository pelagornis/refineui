import type { HTMLAttributes, ReactNode } from "react";

export type TooltipVariant = "default" | "inverted";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "content"> {
    trigger: ReactNode;
    content: ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
    variant?: TooltipVariant;
    delayMs?: number;
}

