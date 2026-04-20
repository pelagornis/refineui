import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
    options: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
    error?: boolean;
    success?: boolean;
    size?: "sm" | "md" | "lg";
}

