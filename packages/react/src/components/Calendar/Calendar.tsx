import { clsx } from "clsx";
import { useState } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";
import { calendarStyles } from "./style";
import type { CalendarProps } from "./types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    );
}

function normalizeRange(start?: Date, end?: Date) {
    if (!start || !end) return { start, end };
    const t0 = startOfDay(start).getTime();
    const t1 = startOfDay(end).getTime();
    return t0 <= t1 ? { start, end } : { start: end, end: start };
}

function getWeekdayLabels(weekStartsOn: 0 | 1) {
    return [...WEEKDAYS.slice(weekStartsOn), ...WEEKDAYS.slice(0, weekStartsOn)];
}

function formatMonthName(year: number, month: number) {
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(year, month, 1));
}

type MonthOffset = -1 | 0 | 1;
type GridCell = { day: number; monthOffset: MonthOffset };

function getMonthGrid(year: number, month: number, weekStartsOn: 0 | 1): GridCell[] {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const jsDay = first.getDay();
    const startPad = (jsDay - weekStartsOn + 7) % 7;

    const result: GridCell[] = [];
    const prevMonthLast = new Date(year, month, 0).getDate();
    for (let i = 0; i < startPad; i++) {
        result.push({ day: prevMonthLast - startPad + i + 1, monthOffset: -1 });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        result.push({ day: d, monthOffset: 0 });
    }
    const remaining = 42 - result.length;
    for (let i = 1; i <= remaining; i++) {
        result.push({ day: i, monthOffset: 1 });
    }
    return result;
}

function chunkWeeks(cells: GridCell[]): GridCell[][] {
    const weeks: GridCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
}

export function Calendar({
    mode = "single",
    value,
    onChange,
    rangeStart,
    rangeEnd,
    onRangeChange,
    weekStartsOn = 0,
    defaultMonth,
    className,
    ...props
}: CalendarProps) {
    const isRangeMode = mode === "range";

    const [internalRange, setInternalRange] = useState<{ start?: Date; end?: Date }>({});
    const effectiveStart = rangeStart ?? internalRange.start;
    const effectiveEnd = rangeEnd ?? internalRange.end;
    const { start: normStart, end: normEnd } = normalizeRange(effectiveStart, effectiveEnd);

    const [view, setView] = useState(() => value ?? normStart ?? defaultMonth ?? new Date());
    const year = view.getFullYear();
    const month = view.getMonth();
    const cells = getMonthGrid(year, month, weekStartsOn);
    const weeks = chunkWeeks(cells);
    const weekdayLabels = getWeekdayLabels(weekStartsOn);
    const monthName = formatMonthName(year, month);

    const getDateFromCell = (d: number, monthOffset: MonthOffset) => new Date(year, month + monthOffset, d);

    const setRange = (start: Date | undefined, end: Date | undefined) => {
        if (onRangeChange) onRangeChange(start, end);
        else setInternalRange({ start, end });
    };

    const handleDayClick = (d: number, monthOffset: MonthOffset) => {
        const date = getDateFromCell(d, monthOffset);
        if (isRangeMode) {
            const s = effectiveStart;
            const e = effectiveEnd;
            if (!s || (s && e)) {
                setRange(date, undefined);
            } else {
                const t = startOfDay(date).getTime();
                const st = startOfDay(s).getTime();
                if (t < st) setRange(date, s);
                else setRange(s, date);
            }
        } else {
            setView(date);
            onChange?.(date);
        }
    };

    const renderDayButton = (cell: GridCell, key: string) => {
        const { day, monthOffset } = cell;
        const currentDate = getDateFromCell(day, monthOffset);
        const isCurrentMonth = monthOffset === 0;
        const t = startOfDay(currentDate).getTime();

        const hasRange = !!(normStart && normEnd);
        const rangeSingleDay = hasRange && sameDay(normStart, normEnd);
        const rangeSpan = hasRange && !rangeSingleDay;
        const pendingStart = isRangeMode && normStart && !normEnd;

        let isStart = false;
        let isEnd = false;
        let inRangeMiddle = false;
        if (rangeSpan && normStart && normEnd) {
            const st = startOfDay(normStart).getTime();
            const en = startOfDay(normEnd).getTime();
            isStart = sameDay(currentDate, normStart);
            isEnd = sameDay(currentDate, normEnd);
            inRangeMiddle = t > st && t < en;
        }

        const blackFull = () => (
            <button
                key={key}
                type="button"
                data-refineui="calendar-day"
                data-selected
                data-current-month={isCurrentMonth ? "" : undefined}
                data-other-month={!isCurrentMonth ? "" : undefined}
                role="gridcell"
                onClick={() => handleDayClick(day, monthOffset)}
                className={clsx(
                    calendarStyles.dayBase,
                    calendarStyles.daySelected,
                )}
            >
                {day}
            </button>
        );

        const grayMiddle = () => (
            <button
                key={key}
                type="button"
                data-refineui="calendar-day"
                data-range-middle
                data-current-month={isCurrentMonth ? "" : undefined}
                data-other-month={!isCurrentMonth ? "" : undefined}
                role="gridcell"
                onClick={() => handleDayClick(day, monthOffset)}
                className={clsx(
                    calendarStyles.dayBase,
                    calendarStyles.dayRangeMiddle,
                )}
            >
                {day}
            </button>
        );

        const endpointRange = (endpoint: "start" | "end") => (
            <div
                key={key}
                className={clsx(
                    calendarStyles.dayWrapEndpoint,
                    endpoint === "start" && calendarStyles.dayWrapEndpointStart,
                    endpoint === "end" && calendarStyles.dayWrapEndpointEnd,
                )}
            >
                <button
                    type="button"
                    data-refineui="calendar-day"
                    data-selected
                    data-current-month={isCurrentMonth ? "" : undefined}
                    data-other-month={!isCurrentMonth ? "" : undefined}
                    data-range-endpoint={endpoint}
                    role="gridcell"
                    onClick={() => handleDayClick(day, monthOffset)}
                    className={clsx(
                        calendarStyles.dayBase,
                        calendarStyles.daySelected,
                    )}
                >
                    {day}
                </button>
            </div>
        );

        if (!isCurrentMonth) {
            const selOther = value && !isRangeMode && sameDay(currentDate, value);
            const inSelectedRange =
                isRangeMode &&
                hasRange &&
                t >= startOfDay(normStart!).getTime() &&
                t <= startOfDay(normEnd!).getTime();
            const showBlackOther = selOther || (inSelectedRange && (sameDay(currentDate, normStart!) || sameDay(currentDate, normEnd!)));
            return (
                <button
                    key={key}
                    type="button"
                    data-refineui="calendar-day"
                    data-other-month
                    {...(showBlackOther ? { "data-selected": "" } : {})}
                    role="gridcell"
                    onClick={() => handleDayClick(day, monthOffset)}
                    className={clsx(
                        calendarStyles.dayBase,
                        showBlackOther
                            ? calendarStyles.daySelected
                            : calendarStyles.dayOtherMonthDefault,
                    )}
                >
                    {day}
                </button>
            );
        }

        if (isRangeMode && pendingStart && normStart && sameDay(currentDate, normStart)) {
            return blackFull();
        }

        if (isRangeMode && rangeSingleDay && normStart && sameDay(currentDate, normStart)) {
            return blackFull();
        }

        if (isRangeMode && rangeSpan) {
            if (inRangeMiddle) return grayMiddle();
            if (isStart && !isEnd) return endpointRange("start");
            if (!isStart && isEnd) return endpointRange("end");
        }

        const isSelectedSingle = !isRangeMode && !!value && sameDay(currentDate, value);
        return (
            <button
                key={key}
                type="button"
                data-refineui="calendar-day"
                data-current-month
                {...(isSelectedSingle ? { "data-selected": "" } : {})}
                role="gridcell"
                onClick={() => handleDayClick(day, monthOffset)}
                className={clsx(
                    calendarStyles.dayBase,
                    isSelectedSingle
                        ? calendarStyles.daySelected
                        : calendarStyles.dayDefault,
                )}
            >
                {day}
            </button>
        );
    };

    return (
        <div
            data-refineui="calendar"
            role="grid"
            aria-label="Calendar"
            className={clsx(
                calendarStyles.root,
                className,
            )}
            {...props}
        >
            <div className={calendarStyles.header}>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    layout="icon"
                    data-calendar-header="nav-prev"
                    aria-label="Previous month"
                    className={calendarStyles.navButton}
                    onClick={() => setView(new Date(year, month - 1))}
                >
                    <WebIcon name="chevron-left" size={iconSizes.small} color="currentColor" fallback="‹" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    layout="label"
                    data-calendar-header="caption-month"
                    aria-label={`Month: ${monthName}`}
                    className={calendarStyles.captionButton}
                >
                    {monthName}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    layout="label"
                    data-calendar-header="caption-year"
                    aria-label={`Year: ${year}`}
                    className={calendarStyles.captionButton}
                >
                    {String(year)}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    layout="icon"
                    data-calendar-header="nav-next"
                    aria-label="Next month"
                    className={calendarStyles.navButton}
                    onClick={() => setView(new Date(year, month + 1))}
                >
                    <WebIcon name="chevron-right" size={iconSizes.small} color="currentColor" fallback="›" />
                </Button>
            </div>

            <div className={calendarStyles.body}>
                <div className={clsx("grid gap-refineui-size-none", calendarStyles.grid7)}>
                    {weekdayLabels.map((w) => (
                        <div
                            key={w}
                            className={calendarStyles.weekday}
                        >
                            {w}
                        </div>
                    ))}
                </div>
                {weeks.map((row, wi) => (
                    <div key={wi} className={clsx("grid gap-refineui-size-none", calendarStyles.grid7)}>
                        {row.map((cell, di) => renderDayButton(cell, `d-${wi}-${di}-${cell.monthOffset}-${cell.day}`))}
                    </div>
                ))}
            </div>
        </div>
    );
}
