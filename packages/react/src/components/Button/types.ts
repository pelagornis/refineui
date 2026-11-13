import type { ButtonHTMLAttributes } from "react";

/** Web Kit `Button` `79:3304` — Style: Primary · Secondary · Outline · Ghost */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

/** Web Kit Size — Small / Medium / Large */
export type ButtonSize = "sm" | "md" | "lg";

/** Web Kit Layout — Label / Icon-only (MCP `Layout=Icon`). */
export type ButtonLayout = "label" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Apply Button styling and behavior to a single child element, such as an anchor. */
    asChild?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    layout?: ButtonLayout;
    fullWidth?: boolean;
}

