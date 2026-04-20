import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    description?: string;
    label?: string;
    variant?: "default" | "circular";
}

