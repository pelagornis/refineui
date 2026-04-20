import type { InputHTMLAttributes } from "react";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size"> {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    onChange?: (value: number) => void;
    /** Web Kit Slider `526:1556` — sm/md rail thickness. */
    size?: "sm" | "md";
}

