import { clsx } from "clsx";
import {
    Children,
    createContext,
    isValidElement,
    useCallback,
    useContext,
    useMemo,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from "react";
import { progressStepperStyles, progressStepperVars } from "./style";
import type {
    ProgressStepperItemProps,
    ProgressStepperLabelProps,
    ProgressStepperListProps,
    ProgressStepperMarkerProps,
    ProgressStepperProps,
    ProgressStepperState,
} from "./types";

type ProgressStepperContextValue = {
    value: number;
    setValue: (next: number) => void;
    interactive: boolean;
};

type ProgressStepperItemContextValue = {
    state: ProgressStepperState;
    disabled: boolean;
    markerLeft: string;
};

type ProgressStepperListLayout = {
    count: number;
    sorted: number[];
};

const ProgressStepperContext = createContext<ProgressStepperContextValue | null>(null);
const ProgressStepperItemContext = createContext<ProgressStepperItemContextValue | null>(null);
const ProgressStepperListLayoutContext = createContext<ProgressStepperListLayout | null>(null);

function useProgressStepperContext(component: string): ProgressStepperContextValue {
    const v = useContext(ProgressStepperContext);
    if (!v) throw new Error(`${component} must be used within ProgressStepper.`);
    return v;
}

function useProgressStepperItemContext(component: string): ProgressStepperItemContextValue {
    const v = useContext(ProgressStepperItemContext);
    if (!v) throw new Error(`${component} must be used within ProgressStepperItem.`);
    return v;
}

function resolveState(itemValue: number, active: number): ProgressStepperState {
    if (itemValue < active) return "complete";
    if (itemValue === active) return "current";
    return "upcoming";
}

function readItemValues(children: ReactNode): number[] {
    return Children.toArray(children).flatMap((child) => {
        if (!isValidElement(child)) return [];
        const value = (child.props as { value?: unknown }).value;
        return typeof value === "number" ? [value] : [];
    });
}

/**
 * Fill stays a pill. Width = current pip right + track/2 (the fill cap radius).
 */
function pipLeftForIndex(index: number, count: number): string {
    const inset = "var(--refineui-progress-stepper-inset)";
    const pip = "var(--refineui-progress-stepper-pip)";
    if (count <= 1) return inset;
    return `calc(${inset} + ${index} * (100% - ${inset} - ${inset} - ${pip}) / ${count - 1})`;
}

function fillWidthForStep(index: number, count: number): string {
    const inset = "var(--refineui-progress-stepper-inset)";
    const pip = "var(--refineui-progress-stepper-pip)";
    const cap = "var(--refineui-progress-stepper-track)";
    if (count <= 1 || index >= count - 1) return "100%";
    return `calc(${inset} + ${index} * (100% - ${inset} - ${inset} - ${pip}) / ${count - 1} + ${pip} + (${cap} / 2))`;
}

export function ProgressStepper({
    children,
    className,
    style,
    value: valueControlled,
    defaultValue = 0,
    onValueChange,
    ...props
}: ProgressStepperProps) {
    const isControlled = valueControlled !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = isControlled ? valueControlled! : internalValue;

    const setValue = useCallback(
        (next: number) => {
            if (!isControlled) setInternalValue(next);
            onValueChange?.(next);
        },
        [isControlled, onValueChange],
    );

    const ctx = useMemo(
        () => ({
            value,
            setValue,
            interactive: typeof onValueChange === "function" || !isControlled,
        }),
        [value, setValue, onValueChange, isControlled],
    );

    return (
        <ProgressStepperContext.Provider value={ctx}>
            <div
                data-refineui="progress-stepper"
                className={clsx(progressStepperStyles.root, className)}
                style={{ ...progressStepperVars, ...style }}
                {...props}
            >
                {children}
            </div>
        </ProgressStepperContext.Provider>
    );
}

export function ProgressStepperList({ className, children, style, ...props }: ProgressStepperListProps) {
    const { value } = useProgressStepperContext("ProgressStepperList");
    const itemValues = readItemValues(children);
    const count = itemValues.length;
    const sorted = [...itemValues].sort((a, b) => a - b);
    const min = sorted[0] ?? 0;
    const max = sorted[count - 1] ?? 0;
    const clamped = Math.min(max, Math.max(min, value));
    const index = sorted.reduce((last, stepValue, i) => (stepValue <= clamped ? i : last), 0);
    const layout = useMemo<ProgressStepperListLayout>(
        () => ({ count, sorted: [...itemValues].sort((a, b) => a - b) }),
        [count, itemValues],
    );
    const fillWidth = fillWidthForStep(index, count);

    return (
        <ProgressStepperListLayoutContext.Provider value={layout}>
            <div
                data-refineui="progress-stepper-list-wrap"
                className={progressStepperStyles.listWrap}
            >
                <div
                    data-refineui="progress-stepper-track"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={count}
                    aria-valuenow={count <= 0 ? 0 : index + 1}
                    className={progressStepperStyles.track}
                >
                    <span
                        data-refineui="progress-stepper-fill"
                        className={progressStepperStyles.fill}
                        style={{ width: fillWidth }}
                    />
                </div>
                <ol
                    data-refineui="progress-stepper-list"
                    className={clsx(progressStepperStyles.list, className)}
                    style={style}
                    {...props}
                >
                    {children}
                </ol>
            </div>
        </ProgressStepperListLayoutContext.Provider>
    );
}

export function ProgressStepperItem({
    value: itemValue,
    disabled = false,
    className,
    onClick,
    onKeyDown,
    children,
    ...props
}: ProgressStepperItemProps) {
    const { value, setValue, interactive } = useProgressStepperContext("ProgressStepperItem");
    const layout = useContext(ProgressStepperListLayoutContext);
    const state = resolveState(itemValue, value);
    const canActivate = interactive && !disabled;
    const stepIndex = layout == null ? 0 : layout.sorted.indexOf(itemValue);
    const markerLeft = pipLeftForIndex(stepIndex < 0 ? 0 : stepIndex, layout?.count ?? 1);

    const activate = () => {
        if (!canActivate) return;
        setValue(itemValue);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || !canActivate) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activate();
        }
    };

    const itemCtx = useMemo(
        () => ({ state, disabled, markerLeft }),
        [state, disabled, markerLeft],
    );

    return (
        <ProgressStepperItemContext.Provider value={itemCtx}>
            <li
                data-refineui="progress-stepper-item"
                data-state={state}
                data-disabled={disabled ? "true" : undefined}
                aria-current={state === "current" ? "step" : undefined}
                tabIndex={canActivate ? 0 : undefined}
                className={clsx(
                    progressStepperStyles.item,
                    canActivate && progressStepperStyles.itemInteractive,
                    disabled && progressStepperStyles.itemDisabled,
                    className,
                )}
                onClick={(e) => {
                    onClick?.(e);
                    if (!e.defaultPrevented) activate();
                }}
                onKeyDown={handleKeyDown}
                {...props}
            >
                {children}
            </li>
        </ProgressStepperItemContext.Provider>
    );
}

export function ProgressStepperMarker({
    className,
    children,
    style,
    ...props
}: ProgressStepperMarkerProps) {
    const { state, markerLeft } = useProgressStepperItemContext("ProgressStepperMarker");

    const stateClass =
        state === "complete"
            ? progressStepperStyles.markerComplete
            : state === "current"
              ? progressStepperStyles.markerCurrent
              : progressStepperStyles.markerUpcoming;

    return (
        <span
            data-refineui="progress-stepper-marker"
            data-state={state}
            aria-hidden
            className={clsx(progressStepperStyles.marker, stateClass, className)}
            style={{ left: markerLeft, ...style }}
            {...props}
        >
            {children}
        </span>
    );
}

export function ProgressStepperLabel({ className, ...props }: ProgressStepperLabelProps) {
    const { state } = useProgressStepperItemContext("ProgressStepperLabel");
    const stateClass =
        state === "complete"
            ? progressStepperStyles.labelComplete
            : state === "current"
              ? progressStepperStyles.labelCurrent
              : progressStepperStyles.labelUpcoming;

    return (
        <span
            data-refineui="progress-stepper-label"
            data-state={state}
            className={clsx(progressStepperStyles.label, stateClass, className)}
            {...props}
        />
    );
}

ProgressStepper.displayName = "ProgressStepper";
ProgressStepperList.displayName = "ProgressStepperList";
ProgressStepperItem.displayName = "ProgressStepperItem";
ProgressStepperMarker.displayName = "ProgressStepperMarker";
ProgressStepperLabel.displayName = "ProgressStepperLabel";
