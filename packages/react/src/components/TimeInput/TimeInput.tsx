import { clsx } from "clsx";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { useOptionalFieldSize } from "../Field/context";
import { Popover, PopoverContent, PopoverTrigger } from "../PopOver";
import { ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "../ScrollArea";
import { timeInputStyles } from "./style";
import type { TimeInputProps } from "./types";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type TimeParts = { hour: number; minute: number };

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const HOURS_12 = Array.from({ length: 12 }, (_, index) => index + 1);
const PERIODS = ["AM", "PM"] as const;

function parseTime(value?: string): TimeParts {
    const match = value?.match(/^(\d{2}):(\d{2})$/);
    if (!match) return { hour: 0, minute: 0 };
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour > 23 || minute > 59) return { hour: 0, minute: 0 };
    return { hour, minute };
}

function formatTime({ hour, minute }: TimeParts) {
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function hour12(hour: number) {
    return hour % 12 || 12;
}

function period(hour: number): (typeof PERIODS)[number] {
    return hour >= 12 ? "PM" : "AM";
}

function to24Hour(hour: number, meridiem: (typeof PERIODS)[number]) {
    return (hour % 12) + (meridiem === "PM" ? 12 : 0);
}

function formatDisplay(value: string | undefined, hourCycle: NonNullable<TimeInputProps["hourCycle"]>) {
    if (!value || hourCycle === "24h") return value;
    const time = parseTime(value);
    return `${String(hour12(time.hour)).padStart(2, "0")}:${String(time.minute).padStart(2, "0")} ${period(time.hour)}`;
}

export function TimeInput({
    value: valueProp,
    defaultValue,
    onValueChange,
    placeholder = "Select time",
    minuteStep = 1,
    hourCycle = "24h",
    error = false,
    success = false,
    fullWidth = false,
    size: sizeProp,
    disabled = false,
    className,
    "aria-label": ariaLabel,
    ...props
}: TimeInputProps) {
    const fieldSize = useOptionalFieldSize();
    const size = sizeProp ?? fieldSize ?? "lg";
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
    const [open, setOpen] = useState(false);
    const value = valueProp ?? internalValue;
    const [draft, setDraft] = useState<TimeParts>(() => parseTime(value));
    const minutes = useMemo(() => Array.from({ length: 60 / minuteStep }, (_, index) => index * minuteStep), [minuteStep]);

    useEffect(() => {
        if (open) setDraft(parseTime(value));
    }, [open, value]);

    const commit = (nextDraft: TimeParts) => {
        const nextValue = formatTime(nextDraft);
        setDraft(nextDraft);
        if (valueProp === undefined) setInternalValue(nextValue);
        onValueChange?.(nextValue);
    };

    return (
        <Popover open={open} onOpenChange={setOpen} className={clsx(fullWidth && "w-full")}>
            <PopoverTrigger>
                <button
                    type="button"
                    data-refineui="time-input"
                    data-size={size}
                    data-error={error || undefined}
                    data-success={success || undefined}
                    data-placeholder={!value || undefined}
                    disabled={disabled}
                    aria-label={ariaLabel ?? formatDisplay(value, hourCycle) ?? placeholder}
                    className={clsx(timeInputStyles.trigger(size, error, success, disabled), className)}
                    {...props}
                >
                    <span className={clsx(timeInputStyles.value, !value && timeInputStyles.placeholder)}>{formatDisplay(value, hourCycle) ?? placeholder}</span>
                    <WebIcon name="clock" size={iconSizes.small} color="currentColor" className={timeInputStyles.icon} fallback="◷" aria-hidden />
                </button>
            </PopoverTrigger>
            <PopoverContent placement="bottom" align="end" fitContent className={timeInputStyles.panel}>
                <div className={timeInputStyles.wheel}>
                    {/* Apple-style selection band shared by every column; rows scroll underneath it. */}
                    <div aria-hidden className={timeInputStyles.selectionBand} />
                    {hourCycle === "12h" && (
                        <TimeColumn
                            label="Period"
                            values={[...PERIODS]}
                            selected={period(draft.hour)}
                            onSelect={(meridiem) => commit({ ...draft, hour: to24Hour(hour12(draft.hour), meridiem as (typeof PERIODS)[number]) })}
                        />
                    )}
                    <TimeColumn
                        label="Hour"
                        values={hourCycle === "12h" ? HOURS_12 : HOURS}
                        selected={hourCycle === "12h" ? hour12(draft.hour) : draft.hour}
                        onSelect={(hour) => commit({ ...draft, hour: hourCycle === "12h" ? to24Hour(hour, period(draft.hour)) : hour })}
                    />
                    <span aria-hidden className={timeInputStyles.separator}>:</span>
                    <TimeColumn label="Minute" values={minutes} selected={draft.minute} onSelect={(minute) => commit({ ...draft, minute })} />
                </div>
            </PopoverContent>
        </Popover>
    );
}

const SCROLL_SETTLE_MS = 120;

/**
 * One wheel column (Apple date-picker style): a snapping ScrollArea whose centred row is the
 * selection. Scrolling settles on a row and selects it; clicking a row scrolls it to the centre;
 * arrow keys / Home / End step through values.
 */
function TimeColumn<T extends string | number>({ label, values, selected, onSelect }: { label: string; values: T[]; selected: T; onSelect: (value: T) => void }) {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const settleTimer = useRef<number | undefined>(undefined);
    const mounted = useRef(false);
    const selectedIndex = Math.max(0, values.indexOf(selected));

    const rowHeight = () => viewportRef.current?.querySelector<HTMLElement>("[data-time-input-option]")?.offsetHeight || 0;

    // Keep the selected row centred: instantly on open, smoothly afterwards.
    useIsomorphicLayoutEffect(() => {
        const viewport = viewportRef.current;
        const height = rowHeight();
        if (!viewport || !height) return;
        const top = selectedIndex * height;
        if (Math.abs(viewport.scrollTop - top) > 1) {
            viewport.scrollTo?.({ top, behavior: mounted.current ? "smooth" : "auto" });
            if (!mounted.current && !viewport.scrollTo) viewport.scrollTop = top;
        }
        mounted.current = true;
    }, [selectedIndex]);

    useEffect(() => () => window.clearTimeout(settleTimer.current), []);

    const settle = () => {
        const viewport = viewportRef.current;
        const height = rowHeight();
        if (!viewport || !height) return;
        const index = Math.min(values.length - 1, Math.max(0, Math.round(viewport.scrollTop / height)));
        if (values[index] !== selected) onSelect(values[index]);
    };

    const step = (index: number) => {
        const next = values[Math.min(values.length - 1, Math.max(0, index))];
        if (next !== undefined && next !== selected) onSelect(next);
    };

    return (
        <div className={timeInputStyles.column} data-time-input-column={label.toLowerCase()}>
            <ScrollArea type="hover" className={timeInputStyles.scrollArea}>
                <ScrollAreaViewport
                    ref={viewportRef}
                    role="listbox"
                    aria-label={label}
                    tabIndex={0}
                    className={timeInputStyles.viewport}
                    style={{ paddingBlock: "calc((var(--refineui-size-time-input-wheel-height) - var(--refineui-size-foundation-size-320)) / 2)" }}
                    onScroll={() => {
                        window.clearTimeout(settleTimer.current);
                        settleTimer.current = window.setTimeout(settle, SCROLL_SETTLE_MS);
                    }}
                    onKeyDown={(event) => {
                        const keys: Record<string, number> = { ArrowUp: selectedIndex - 1, ArrowDown: selectedIndex + 1, Home: 0, End: values.length - 1 };
                        if (!(event.key in keys)) return;
                        event.preventDefault();
                        step(keys[event.key]);
                    }}
                >
                    {values.map((value) => (
                        <button
                            key={value}
                            type="button"
                            tabIndex={-1}
                            data-scroll-edge-item
                            data-time-input-option={value}
                            data-selected={selected === value || undefined}
                            aria-pressed={selected === value}
                            className={clsx(timeInputStyles.option, selected === value && timeInputStyles.optionSelected)}
                            onClick={() => onSelect(value)}
                        >
                            {typeof value === "number" ? String(value).padStart(2, "0") : value}
                        </button>
                    ))}
                </ScrollAreaViewport>
                {/* Declared so the viewport scrolls on the y axis; hidden — the wheel needs no rail. */}
                <ScrollAreaScrollbar orientation="vertical" className={timeInputStyles.scrollbar}>
                    <ScrollAreaThumb />
                </ScrollAreaScrollbar>
            </ScrollArea>
        </div>
    );
}
