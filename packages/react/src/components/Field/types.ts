import type { HTMLAttributes, ReactNode } from "react";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
    label?: ReactNode;
    error?: ReactNode;
    hint?: ReactNode;
    required?: boolean;
    size?: "sm" | "md" | "lg";
    children: ReactNode;
}

