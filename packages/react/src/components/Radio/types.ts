import type { InputHTMLAttributes } from "react";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    description?: string;
    allowUncheck?: boolean;
}

export interface RadioInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

