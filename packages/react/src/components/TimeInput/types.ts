import type { ButtonHTMLAttributes } from "react";

export interface TimeInputProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "defaultValue" | "onChange" | "size" | "value"> {
    /** Controlled 24-hour value in `HH:mm` format. */
    value?: string;
    /** Initial 24-hour value in `HH:mm` format for uncontrolled use. */
    defaultValue?: string;
    /** Called when a selected time is applied. */
    onValueChange?: (value: string) => void;
    placeholder?: string;
    /** Minute increments shown in the picker. Defaults to one-minute increments. */
    minuteStep?: 1 | 5 | 10 | 15 | 30;
    /** Use a 12-hour picker with an AM/PM column, while preserving the HH:mm value format. */
    hourCycle?: "24h" | "12h";
    error?: boolean;
    success?: boolean;
    fullWidth?: boolean;
    size?: "sm" | "md" | "lg";
}
