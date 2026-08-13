import type { LabelHTMLAttributes, HTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    /**
     * Convenience: appends `LabelRequired`. Prefer composing `<LabelRequired />` (same as Field).
     */
    required?: boolean;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

export type LabelRequiredProps = HTMLAttributes<HTMLSpanElement>;
