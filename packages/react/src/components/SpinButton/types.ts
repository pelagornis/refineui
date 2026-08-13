import type { HTMLAttributes } from "react";

export interface SpinButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    /** Field size — shares Input / Select control height tokens (`sm` / `md` / `lg`). */
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

