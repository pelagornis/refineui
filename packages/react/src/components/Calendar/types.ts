import type { HTMLAttributes } from "react";

export type CalendarMode = "single" | "range";

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    mode?: CalendarMode;
    value?: Date;
    onChange?: (date: Date) => void;
    rangeStart?: Date;
    rangeEnd?: Date;
    onRangeChange?: (start: Date | undefined, end: Date | undefined) => void;
    weekStartsOn?: 0 | 1;
    defaultMonth?: Date;
}

