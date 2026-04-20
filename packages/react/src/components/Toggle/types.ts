import type { ButtonHTMLAttributes } from "react";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

