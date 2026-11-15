import type { ButtonHTMLAttributes } from "react";

export type DateInputMode = "single" | "range";

export interface DateInputProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "defaultValue" | "onChange" | "size" | "value"> {
    /** `"range"` opens a two-month Calendar and selects a start and end date. */
    mode?: DateInputMode;
    /** Controlled selected date. */
    value?: Date;
    /** Initial selected date for uncontrolled use. */
    defaultValue?: Date;
    /** Called when a day is selected from the calendar. */
    onValueChange?: (value: Date) => void;
    /** Controlled range start (range mode). */
    rangeStart?: Date;
    /** Controlled range end (range mode). */
    rangeEnd?: Date;
    /** Initial range start for uncontrolled range mode. */
    defaultRangeStart?: Date;
    /** Initial range end for uncontrolled range mode. */
    defaultRangeEnd?: Date;
    /** Called whenever the range changes (range mode). `end` is undefined until the second day is picked. */
    onRangeChange?: (start: Date | undefined, end: Date | undefined) => void;
    /** Placeholder shown when no date is selected. */
    placeholder?: string;
    /** Locale passed to Intl.DateTimeFormat. */
    locale?: string;
    /** First calendar weekday: Sunday (0) or Monday (1). */
    weekStartsOn?: 0 | 1;
    error?: boolean;
    success?: boolean;
    fullWidth?: boolean;
    size?: "sm" | "md" | "lg";
}
