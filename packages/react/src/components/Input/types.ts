import type { InputHTMLAttributes } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    error?: boolean;
    success?: boolean;
    fullWidth?: boolean;
    size?: "sm" | "md" | "lg";
}

