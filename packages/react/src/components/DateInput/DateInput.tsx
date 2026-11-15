import { clsx } from "clsx";
import { useState } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Calendar } from "../Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../PopOver";
import { useOptionalFieldSize } from "../Field/context";
import { dateInputStyles } from "./style";
import type { DateInputProps } from "./types";

function formatDate(value: Date, locale?: string) {
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(value);
}

function orderRange(start?: Date, end?: Date): [Date | undefined, Date | undefined] {
    if (start && end && end.getTime() < start.getTime()) return [end, start];
    return [start, end];
}

export function DateInput({
    mode = "single",
    value: valueProp,
    defaultValue,
    onValueChange,
    rangeStart: rangeStartProp,
    rangeEnd: rangeEndProp,
    defaultRangeStart,
    defaultRangeEnd,
    onRangeChange,
    placeholder: placeholderProp,
    locale,
    weekStartsOn = 0,
    error = false,
    success = false,
    fullWidth = false,
    size: sizeProp,
    disabled = false,
    className,
    "aria-label": ariaLabel,
    ...props
}: DateInputProps) {
    const fieldSize = useOptionalFieldSize();
    const size = sizeProp ?? fieldSize ?? "lg";
    const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);
    const [open, setOpen] = useState(false);
    const value = valueProp ?? internalValue;
    const isRange = mode === "range";
    const placeholder = placeholderProp ?? (isRange ? "Select date range" : "Select date");

    const [internalRange, setInternalRange] = useState<{ start?: Date; end?: Date }>({
        start: defaultRangeStart,
        end: defaultRangeEnd,
    });
    const [rangeStart, rangeEnd] = orderRange(
        rangeStartProp ?? internalRange.start,
        rangeEndProp ?? internalRange.end,
    );

    const displayValue = isRange
        ? rangeStart
            ? `${formatDate(rangeStart, locale)} – ${rangeEnd ? formatDate(rangeEnd, locale) : "…"}`
            : placeholder
        : value
          ? formatDate(value, locale)
          : placeholder;
    const hasValue = isRange ? Boolean(rangeStart) : Boolean(value);

    const handleRangeChange = (start: Date | undefined, end: Date | undefined) => {
        setInternalRange({ start, end });
        onRangeChange?.(start, end);
    };

    const handleValueChange = (nextValue: Date) => {
        if (valueProp === undefined) setInternalValue(nextValue);
        onValueChange?.(nextValue);
        // Stay open after picking a date; the Popover closes on an outside click or Escape.
    };

    return (
        <Popover open={open} onOpenChange={setOpen} className={clsx(fullWidth && "w-full")}>
            <PopoverTrigger>
                <button
                    type="button"
                    data-refineui="date-input"
                    data-size={size}
                    data-error={error || undefined}
                    data-success={success || undefined}
                    data-mode={mode}
                    data-placeholder={!hasValue || undefined}
                    disabled={disabled}
                    aria-label={ariaLabel ?? displayValue}
                    className={clsx(dateInputStyles.trigger(size, error, success, disabled), className)}
                    {...props}
                >
                    <span className={clsx(dateInputStyles.value, !hasValue && dateInputStyles.placeholder)}>{displayValue}</span>
                    <WebIcon name="calendar" size={iconSizes.small} color="currentColor" className={dateInputStyles.icon} fallback="▦" aria-hidden />
                </button>
            </PopoverTrigger>
            <PopoverContent
                placement="bottom"
                align="end"
                fitContent
                className={dateInputStyles.calendar}
                // The Calendar owns the padding, so the popover hugs it with no extra inset.
                style={{ padding: 0 }}
            >
                {isRange ? (
                    <Calendar
                        mode="range"
                        rangeStart={rangeStart}
                        rangeEnd={rangeEnd}
                        onRangeChange={handleRangeChange}
                        weekStartsOn={weekStartsOn}
                        defaultMonth={rangeStart}
                        className={dateInputStyles.calendarContent}
                    />
                ) : (
                    <Calendar
                        value={value}
                        onChange={handleValueChange}
                        weekStartsOn={weekStartsOn}
                        defaultMonth={value}
                        className={dateInputStyles.calendarContent}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
}
