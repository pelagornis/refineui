import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";
import type { KeyboardEvent } from "react";
import { WebIcon } from "../../WebIcon";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";
import { stepperConnectorVars, stepperStyles } from "./style";
import type {
    StepperContentProps,
    StepperDescriptionProps,
    StepperIndicatorProps,
    StepperItemProps,
    StepperListProps,
    StepperOrientation,
    StepperProps,
    StepperSeparatorProps,
    StepperState,
    StepperTitleProps,
} from "./types";

type StepperContextValue = {
    value: number;
    setValue: (next: number) => void;
    orientation: StepperOrientation;
    interactive: boolean;
};

type StepperItemContextValue = {
    state: StepperState;
    disabled: boolean;
};

/**
 * Render-order registry so separators don’t rely on `node.type ===` checks
 * (those break across Vite/tsup duplicate module instances).
 */
type StepperListRegistry = {
    /** Call during StepperItem render. */
    noteItem: (itemValue: number) => void;
    /** Call during StepperSeparator render — uses the most recently noted item. */
    takeSeparatorState: () => "complete" | "upcoming";
};

const StepperContext = createContext<StepperContextValue | null>(null);
const StepperItemContext = createContext<StepperItemContextValue | null>(null);
const StepperListRegistryContext = createContext<StepperListRegistry | null>(null);

function useStepperContext(component: string): StepperContextValue {
    const v = useContext(StepperContext);
    if (!v) throw new Error(`${component} must be used within Stepper.`);
    return v;
}

function useStepperItemContext(component: string): StepperItemContextValue {
    const v = useContext(StepperItemContext);
    if (!v) throw new Error(`${component} must be used within StepperItem.`);
    return v;
}

function resolveState(itemValue: number, active: number): StepperState {
    if (itemValue < active) return "complete";
    if (itemValue === active) return "current";
    return "upcoming";
}

export function Stepper({
    children,
    className,
    style,
    value: valueControlled,
    defaultValue = 0,
    onValueChange,
    orientation = "horizontal",
    ...props
}: StepperProps) {
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
            orientation,
            interactive: typeof onValueChange === "function" || !isControlled,
        }),
        [value, setValue, orientation, onValueChange, isControlled],
    );

    return (
        <StepperContext.Provider value={ctx}>
            <div
                data-refineui="stepper"
                data-orientation={orientation}
                className={clsx(stepperStyles.root, className)}
                style={{ ...stepperConnectorVars, ...style }}
                {...props}
            >
                {children}
            </div>
        </StepperContext.Provider>
    );
}

export function StepperList({ className, children, ...props }: StepperListProps) {
    const { orientation, value } = useStepperContext("StepperList");
    const cursorRef = useRef<number | null>(null);

    // Reset before this render’s children run so note/take order is per pass.
    cursorRef.current = null;

    const registry = useMemo<StepperListRegistry>(
        () => ({
            noteItem(itemValue: number) {
                cursorRef.current = itemValue;
            },
            takeSeparatorState() {
                const prev = cursorRef.current;
                return prev != null && prev < value ? "complete" : "upcoming";
            },
        }),
        [value],
    );

    return (
        <StepperListRegistryContext.Provider value={registry}>
            <ol
                data-refineui="stepper-list"
                data-orientation={orientation}
                className={clsx(
                    stepperStyles.list,
                    orientation === "vertical"
                        ? stepperStyles.listVertical
                        : stepperStyles.listHorizontal,
                    className,
                )}
                {...props}
            >
                {children}
            </ol>
        </StepperListRegistryContext.Provider>
    );
}

export function StepperItem({
    value: itemValue,
    disabled = false,
    className,
    onClick,
    onKeyDown,
    children,
    ...props
}: StepperItemProps) {
    const { value, setValue, orientation, interactive } = useStepperContext("StepperItem");
    const registry = useContext(StepperListRegistryContext);
    registry?.noteItem(itemValue);

    const state = resolveState(itemValue, value);
    const canActivate = interactive && !disabled;

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
        () => ({ state, disabled }),
        [state, disabled],
    );

    return (
        <StepperItemContext.Provider value={itemCtx}>
            <li
                data-refineui="stepper-item"
                data-state={state}
                data-disabled={disabled ? "true" : undefined}
                aria-current={state === "current" ? "step" : undefined}
                tabIndex={canActivate ? 0 : undefined}
                className={clsx(
                    stepperStyles.item,
                    orientation === "vertical"
                        ? stepperStyles.itemVertical
                        : stepperStyles.itemHorizontal,
                    canActivate && stepperStyles.itemInteractive,
                    disabled && stepperStyles.itemDisabled,
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
        </StepperItemContext.Provider>
    );
}

export function StepperIndicator({ className, children, ...props }: StepperIndicatorProps) {
    const { state } = useStepperItemContext("StepperIndicator");

    const stateClass =
        state === "complete"
            ? stepperStyles.indicatorComplete
            : state === "current"
              ? stepperStyles.indicatorCurrent
              : stepperStyles.indicatorUpcoming;

  const content =
        state === "upcoming" ? (
            children
        ) : (
            <WebIcon
                name="checkmark"
                size={iconSizes.xsmall}
                color="currentColor"
                iconStyle="filled"
                fallback="✓"
                className="items-center justify-center"
            />
        );

    return (
        <span
            data-refineui="stepper-indicator"
            data-state={state}
            aria-hidden
            className={clsx(stepperStyles.indicator, stateClass, className)}
            {...props}
        >
            {content}
        </span>
    );
}

export function StepperContent({ className, ...props }: StepperContentProps) {
    const { orientation } = useStepperContext("StepperContent");
    useStepperItemContext("StepperContent");
    return (
        <div
            data-refineui="stepper-content"
            className={clsx(
                stepperStyles.content,
                orientation === "vertical"
                    ? stepperStyles.contentVertical
                    : stepperStyles.contentHorizontal,
                className,
            )}
            {...props}
        />
    );
}

export function StepperTitle({ className, ...props }: StepperTitleProps) {
    const { state } = useStepperItemContext("StepperTitle");
    const stateClass =
        state === "complete"
            ? stepperStyles.titleComplete
            : state === "current"
              ? stepperStyles.titleCurrent
              : stepperStyles.titleUpcoming;

    return (
        <span
            data-refineui="stepper-title"
            data-state={state}
            className={clsx(stepperStyles.title, stateClass, className)}
            {...props}
        />
    );
}

export function StepperDescription({ className, ...props }: StepperDescriptionProps) {
    const { state } = useStepperItemContext("StepperDescription");
    const stateClass =
        state === "complete"
            ? stepperStyles.descriptionComplete
            : state === "current"
              ? stepperStyles.descriptionCurrent
              : stepperStyles.descriptionUpcoming;

    return (
        <span
            data-refineui="stepper-description"
            data-state={state}
            className={clsx(stepperStyles.description, stateClass, className)}
            {...props}
        />
    );
}

export function StepperSeparator({ className, ...props }: StepperSeparatorProps) {
    const { orientation } = useStepperContext("StepperSeparator");
    const registry = useContext(StepperListRegistryContext);
    const state = registry?.takeSeparatorState() ?? "upcoming";
    const vertical = orientation === "vertical";

    return (
        <li
            data-refineui="stepper-separator"
            data-orientation={orientation}
            data-state={state}
            role="presentation"
            aria-hidden
            className={clsx(
                stepperStyles.separator,
                vertical ? stepperStyles.separatorVertical : stepperStyles.separatorHorizontal,
                className,
            )}
            {...props}
        >
            <span
                data-refineui="stepper-separator-rail"
                className={clsx(
                    stepperStyles.separatorRail,
                    vertical
                        ? stepperStyles.separatorRailVertical
                        : stepperStyles.separatorRailHorizontal,
                )}
            >
                <span
                    data-refineui="stepper-separator-track"
                    className={stepperStyles.separatorTrack}
                />
                <span
                    data-refineui="stepper-separator-fill"
                    data-state={state}
                    className={clsx(
                        stepperStyles.separatorFill,
                        vertical
                            ? stepperStyles.separatorFillVertical
                            : stepperStyles.separatorFillHorizontal,
                    )}
                />
            </span>
        </li>
    );
}

Stepper.displayName = "Stepper";
StepperList.displayName = "StepperList";
StepperItem.displayName = "StepperItem";
StepperIndicator.displayName = "StepperIndicator";
StepperContent.displayName = "StepperContent";
StepperTitle.displayName = "StepperTitle";
StepperDescription.displayName = "StepperDescription";
StepperSeparator.displayName = "StepperSeparator";
