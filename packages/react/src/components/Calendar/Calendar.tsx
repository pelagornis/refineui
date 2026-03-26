import type { HTMLAttributes } from "react";
import { useState } from "react";
import { colors, spacings, borderRadii, typographys, sizes, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export type CalendarLocale = "ko" | "en";

export type CalendarMode = "single" | "range";

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    /** 기본 `single`. `range`일 때 `rangeStart` / `rangeEnd` / `onRangeChange` 사용 */
    mode?: CalendarMode;
    value?: Date;
    onChange?: (date: Date) => void;
    rangeStart?: Date;
    rangeEnd?: Date;
    onRangeChange?: (start: Date | undefined, end: Date | undefined) => void;
    /** 요일·월 제목 형식. 기본 `en` (Sun–Sat, October 2025) */
    locale?: CalendarLocale;
    /** 0=일요일 시작(MCP), 1=월요일 시작 */
    weekStartsOn?: 0 | 1;
    /** 최초 표시 월 (`value` / 범위 시작이 없을 때) */
    defaultMonth?: Date;
}

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

const DAY_PX = sizes.calendarDaySize;
const NAV_PX = "28px";

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

function getWeekdayLabels(locale: CalendarLocale, weekStartsOn: 0 | 1) {
    const src = locale === "ko" ? WEEKDAYS_KO : WEEKDAYS_EN;
    return [...src.slice(weekStartsOn), ...src.slice(0, weekStartsOn)];
}

function formatMonthTitle(year: number, month: number, locale: CalendarLocale) {
    if (locale === "ko") {
        return `${year}년 ${month + 1}월`;
    }
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
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

const r8 = borderRadii.roundedLarge;

export function Calendar({
    mode = "single",
    value,
    onChange,
    rangeStart,
    rangeEnd,
    onRangeChange,
    locale = "en",
    weekStartsOn = 0,
    defaultMonth,
    style,
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
    const weekdayLabels = getWeekdayLabels(locale, weekStartsOn);

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

    const caption = typographys.caption1;
    const baseSize = {
        width: DAY_PX,
        height: DAY_PX,
        minWidth: DAY_PX,
        minHeight: DAY_PX,
    } as const;

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
                data-current-month={isCurrentMonth ? "" : undefined}
                data-other-month={!isCurrentMonth ? "" : undefined}
                role="gridcell"
                onClick={() => handleDayClick(day, monthOffset)}
                style={{
                    ...baseSize,
                    border: "none",
                    cursor: "pointer",
                    borderRadius: r8,
                    background: colors.primaryBlack,
                    color: colors.neutralWhite,
                    ...caption,
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                }}
            >
                {day}
            </button>
        );

        const grayMiddle = () => (
            <button
                key={key}
                type="button"
                data-refineui="calendar-day"
                data-current-month={isCurrentMonth ? "" : undefined}
                data-other-month={!isCurrentMonth ? "" : undefined}
                role="gridcell"
                onClick={() => handleDayClick(day, monthOffset)}
                style={{
                    ...baseSize,
                    border: "none",
                    cursor: "pointer",
                    borderRadius: borderRadii.roundedNone,
                    background: colors.neutral100,
                    color: colors.primaryBlack,
                    ...caption,
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                }}
            >
                {day}
            </button>
        );

        const endpointBlack = (radius: string, endpoint: "start" | "end") => (
            <button
                key={key}
                type="button"
                data-refineui="calendar-day"
                data-current-month={isCurrentMonth ? "" : undefined}
                data-other-month={!isCurrentMonth ? "" : undefined}
                data-range-endpoint={endpoint}
                role="gridcell"
                onClick={() => handleDayClick(day, monthOffset)}
                style={{
                    ...baseSize,
                    border: "none",
                    cursor: "pointer",
                    borderRadius: radius,
                    background: colors.primaryBlack,
                    color: colors.neutralWhite,
                    ...caption,
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                }}
            >
                {day}
            </button>
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
                    role="gridcell"
                    onClick={() => handleDayClick(day, monthOffset)}
                    style={{
                        ...baseSize,
                        border: "none",
                        cursor: "pointer",
                        borderRadius: r8,
                        background: showBlackOther ? colors.primaryBlack : "transparent",
                        color: showBlackOther ? colors.neutralWhite : colors.neutral400,
                        ...caption,
                        padding: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxSizing: "border-box",
                    }}
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
            if (isStart && !isEnd) return endpointBlack(`${r8} 0 0 ${r8}`, "start");
            if (!isStart && isEnd) return endpointBlack(`0 ${r8} ${r8} 0`, "end");
        }

        const isSelectedSingle = !isRangeMode && !!value && sameDay(currentDate, value);
        return (
            <button
                key={key}
                type="button"
                data-refineui="calendar-day"
                data-current-month
                role="gridcell"
                onClick={() => handleDayClick(day, monthOffset)}
                style={{
                    ...baseSize,
                    border: "none",
                    cursor: "pointer",
                    borderRadius: r8,
                    background: isSelectedSingle ? colors.primaryBlack : "transparent",
                    color: isSelectedSingle ? colors.neutralWhite : colors.primaryBlack,
                    ...caption,
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                }}
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
            style={{
                display: "flex",
                flexDirection: "column",
                padding: spacings.sizeLarge,
                gap: spacings.sizeNone,
                backgroundColor: colors.neutralWhite,
                borderRadius: borderRadii.roundedLarge,
                minWidth: sizes.calendarMinWidth,
                width: "fit-content",
                boxSizing: "border-box",
                ...style,
            }}
            {...props}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: spacings.sizeSmall,
                    paddingRight: spacings.sizeSmall,
                    paddingBottom: spacings.sizeMedium,
                    ...typographys.body1,
                    color: colors.primaryBlack,
                }}
            >
                <button
                    type="button"
                    data-refineui="calendar-nav"
                    aria-label="Previous month"
                    onClick={() => setView(new Date(year, month - 1))}
                    style={{
                        border: "none",
                        background: colors.neutralWhite,
                        cursor: "pointer",
                        width: NAV_PX,
                        height: NAV_PX,
                        minWidth: NAV_PX,
                        minHeight: NAV_PX,
                        padding: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.primaryBlack,
                        borderRadius: r8,
                        flexShrink: 0,
                    }}
                >
                    <WebIcon name="chevron-left" size={iconSizes.lg} color="currentColor" fallback="‹" />
                </button>
                <span>{formatMonthTitle(year, month, locale)}</span>
                <button
                    type="button"
                    data-refineui="calendar-nav"
                    aria-label="Next month"
                    onClick={() => setView(new Date(year, month + 1))}
                    style={{
                        border: "none",
                        background: colors.neutralWhite,
                        cursor: "pointer",
                        width: NAV_PX,
                        height: NAV_PX,
                        minWidth: NAV_PX,
                        minHeight: NAV_PX,
                        padding: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.primaryBlack,
                        borderRadius: r8,
                        flexShrink: 0,
                    }}
                >
                    <WebIcon name="chevron-right" size={iconSizes.lg} color="currentColor" fallback="›" />
                </button>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(7, ${DAY_PX})`,
                    columnGap: spacings.sizeNone,
                    rowGap: spacings.sizeNone,
                }}
            >
                {weekdayLabels.map((w) => (
                    <div
                        key={w}
                        style={{
                            width: DAY_PX,
                            textAlign: "center",
                            paddingBottom: spacings.sizeSmall,
                            boxSizing: "border-box",
                            ...typographys.caption1,
                            color: colors.neutral600,
                        }}
                    >
                        {w}
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: spacings.sizeSmall,
                }}
            >
                {weeks.map((row, wi) => (
                    <div
                        key={wi}
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(7, ${DAY_PX})`,
                            columnGap: spacings.sizeNone,
                        }}
                    >
                        {row.map((cell, di) => renderDayButton(cell, `d-${wi}-${di}-${cell.monthOffset}-${cell.day}`))}
                    </div>
                ))}
            </div>
        </div>
    );
}
