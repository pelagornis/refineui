import { clsx } from "clsx";
import type { CSSProperties, KeyboardEvent, RefObject } from "react";
import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    useLayoutEffect,
} from "react";
import { segmentedControlStyles } from "./style";
import type { SegmentedControlItemProps, SegmentedControlProps } from "./types";

const ITEM_SELECTOR = '[data-refineui="segmented-control-item"]';
const ITEM_ENABLED_SELECTOR = `${ITEM_SELECTOR}:not([disabled])`;

type SegmentedControlContextValue = {
    selectedValue: string;
    setSelectedValue: (next: string) => void;
    groupRef: RefObject<HTMLDivElement | null>;
};

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

function useSegmentedControlContext(component: string): SegmentedControlContextValue {
    const v = useContext(SegmentedControlContext);
    if (!v) throw new Error(`${component} must be used within SegmentedControl.`);
    return v;
}

type IndicatorBox = {
    left: number;
    width: number;
    ready: boolean;
};

export function SegmentedControl({
    children,
    className,
    defaultValue = "",
    value: valueControlled,
    onValueChange,
    ...props
}: SegmentedControlProps) {
    const isControlled = valueControlled !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValue = isControlled ? valueControlled! : internalValue;

    const setSelectedValue = useCallback(
        (next: string) => {
            if (!isControlled) setInternalValue(next);
            onValueChange?.(next);
        },
        [isControlled, onValueChange],
    );

    const groupRef = useRef<HTMLDivElement | null>(null);

    const ctx = useMemo(
        () => ({
            selectedValue,
            setSelectedValue,
            groupRef,
        }),
        [selectedValue, setSelectedValue],
    );

    const [indicator, setIndicator] = useState<IndicatorBox>({
        left: 0,
        width: 0,
        ready: false,
    });

    const updateIndicator = useCallback(() => {
        const group = groupRef.current;
        if (!group) return;
        const selected = group.querySelector<HTMLElement>(
            `${ITEM_SELECTOR}[data-selected="true"]`,
        );
        if (!selected) {
            setIndicator((prev) => ({ ...prev, width: 0, ready: false }));
            return;
        }
        setIndicator({
            left: selected.offsetLeft,
            width: selected.offsetWidth,
            ready: true,
        });
    }, []);

    useLayoutEffect(() => {
        updateIndicator();
    }, [updateIndicator, selectedValue, children]);

    useEffect(() => {
        const group = groupRef.current;
        if (!group) return;

        const ro = new ResizeObserver(() => {
            updateIndicator();
        });
        ro.observe(group);
        for (const item of Array.from(group.querySelectorAll(ITEM_SELECTOR))) {
            ro.observe(item);
        }

        window.addEventListener("resize", updateIndicator);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", updateIndicator);
        };
    }, [updateIndicator, children]);

    const indicatorStyle: CSSProperties = {
        width: indicator.width,
        transform: `translate3d(${indicator.left}px, 0, 0)`,
    };

    return (
        <SegmentedControlContext.Provider value={ctx}>
            <div
                ref={groupRef}
                data-refineui="segmented-control"
                role="radiogroup"
                aria-orientation="horizontal"
                className={clsx(segmentedControlStyles.root, className)}
                {...props}
            >
                <div
                    data-refineui="segmented-control-indicator"
                    data-ready={indicator.ready ? "true" : undefined}
                    aria-hidden
                    className={segmentedControlStyles.indicator}
                    style={indicatorStyle}
                />
                {children}
            </div>
        </SegmentedControlContext.Provider>
    );
}

export const SegmentedControlItem = forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
    function SegmentedControlItem(
        { value, disabled, className, children, onKeyDown, onClick, ...rest },
        ref,
    ) {
        const ctx = useSegmentedControlContext("SegmentedControlItem");
        const selected = ctx.selectedValue === value;

        const moveSelection = useCallback(
            (delta: number) => {
                const root = ctx.groupRef.current;
                if (!root) return;
                const arr = Array.from(root.querySelectorAll<HTMLButtonElement>(ITEM_ENABLED_SELECTOR));
                const n = arr.length;
                if (n === 0) return;
                const ix = arr.findIndex((b) => b.dataset.segmentValue === value);
                if (ix < 0) return;
                const next = arr[(ix + delta + n) % n];
                const nextValue = next?.dataset.segmentValue;
                next?.focus();
                if (nextValue) ctx.setSelectedValue(nextValue);
            },
            [ctx, value],
        );

        const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
            onKeyDown?.(e);
            if (e.defaultPrevented) return;
            switch (e.key) {
                case "ArrowRight":
                case "ArrowDown":
                    e.preventDefault();
                    moveSelection(1);
                    break;
                case "ArrowLeft":
                case "ArrowUp":
                    e.preventDefault();
                    moveSelection(-1);
                    break;
                case "Home": {
                    e.preventDefault();
                    const first = ctx.groupRef.current?.querySelector<HTMLButtonElement>(ITEM_ENABLED_SELECTOR);
                    const nextValue = first?.dataset.segmentValue;
                    first?.focus();
                    if (nextValue) ctx.setSelectedValue(nextValue);
                    break;
                }
                case "End": {
                    e.preventDefault();
                    const all = ctx.groupRef.current?.querySelectorAll<HTMLButtonElement>(ITEM_ENABLED_SELECTOR);
                    if (!all?.length) break;
                    const last = all[all.length - 1];
                    const nextValue = last?.dataset.segmentValue;
                    last?.focus();
                    if (nextValue) ctx.setSelectedValue(nextValue);
                    break;
                }
                default:
                    break;
            }
        };

        return (
            <button
                ref={ref}
                type="button"
                data-refineui="segmented-control-item"
                data-segment-value={value}
                data-selected={selected ? "true" : "false"}
                role="radio"
                aria-checked={selected}
                aria-disabled={disabled || undefined}
                disabled={disabled}
                tabIndex={selected && !disabled ? 0 : -1}
                className={clsx(
                    segmentedControlStyles.item,
                    disabled ? segmentedControlStyles.itemDisabled : segmentedControlStyles.itemEnabled,
                    selected && !disabled && segmentedControlStyles.itemSelectedEnabled,
                    selected && disabled && segmentedControlStyles.itemSelectedDisabled,
                    !selected && segmentedControlStyles.itemUnselected,
                    className,
                )}
                onClick={(e) => {
                    onClick?.(e);
                    if (!disabled && !e.defaultPrevented) ctx.setSelectedValue(value);
                }}
                onKeyDown={handleKeyDown}
                {...rest}
            >
                {children}
            </button>
        );
    },
);
