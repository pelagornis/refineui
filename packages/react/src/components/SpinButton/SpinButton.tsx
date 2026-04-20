import { clsx } from "clsx";
import type { HTMLAttributes, KeyboardEvent } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export interface SpinButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    /** Web Kit COMPONENT_SET `Spin Button` `561:2067` — Small / Medium / Large */
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

const shellClass: Record<NonNullable<SpinButtonProps["size"]>, string> = {
    sm: "min-h-refineui-control-height-sm h-refineui-control-height-sm rounded-refineui-medium",
    md: "min-h-refineui-control-height-md h-refineui-control-height-md rounded-refineui-large",
    lg: "min-h-refineui-control-height-lg h-refineui-control-height-lg rounded-refineui-xlarge",
};

const valueTypo: Record<NonNullable<SpinButtonProps["size"]>, string> = {
    sm: "refineui-typo-caption-1",
    md: "refineui-typo-body-2",
    lg: "refineui-typo-body-1",
};

const stepHeight: Record<NonNullable<SpinButtonProps["size"]>, string> = {
    sm: "h-refineui-spin-stepper-step-height-sm",
    md: "h-refineui-spin-stepper-step-height-md",
    lg: "h-refineui-spin-stepper-step-height-lg",
};

export function SpinButton({
    value,
    onChange,
    min,
    max,
    step = 1,
    size = "md",
    disabled = false,
    className,
    onKeyDown,
    ...props
}: SpinButtonProps) {
    const inc = () => {
        if (disabled) return;
        const next = value + step;
        if (max !== undefined && next > max) return;
        onChange(next);
    };
    const dec = () => {
        if (disabled) return;
        const next = value - step;
        if (min !== undefined && next < min) return;
        onChange(next);
    };

    const bigStep = step * 10;

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!disabled) {
            switch (e.key) {
                case "ArrowUp":
                case "Up":
                    e.preventDefault();
                    inc();
                    break;
                case "ArrowDown":
                case "Down":
                    e.preventDefault();
                    dec();
                    break;
                case "PageUp": {
                    e.preventDefault();
                    const up = value + bigStep;
                    const capped = max !== undefined ? Math.min(up, max) : up;
                    onChange(capped);
                    break;
                }
                case "PageDown": {
                    e.preventDefault();
                    const down = value - bigStep;
                    const capped = min !== undefined ? Math.max(down, min) : down;
                    onChange(capped);
                    break;
                }
                case "Home":
                    if (min !== undefined) {
                        e.preventDefault();
                        onChange(min);
                    }
                    break;
                case "End":
                    if (max !== undefined) {
                        e.preventDefault();
                        onChange(max);
                    }
                    break;
                default:
                    break;
            }
        }
        onKeyDown?.(e);
    };

    const atMax = max !== undefined && value >= max;
    const atMin = min !== undefined && value <= min;

    const borderClass = disabled
        ? "border-refineui-thin border-refineui-alias-border-disabled"
        : "border-refineui-thin border-refineui-alias-border-default";

    return (
        <div
            role="spinbutton"
            aria-label={props["aria-label"] ?? "Spin button"}
            aria-disabled={disabled || undefined}
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            tabIndex={disabled ? -1 : 0}
            data-refineui="spinbutton"
            data-size={size}
            data-disabled={disabled ? "true" : undefined}
            className={clsx(
                "box-border inline-flex items-stretch overflow-hidden outline-none",
                borderClass,
                disabled ? "bg-refineui-alias-background-surface-disabled" : "bg-refineui-alias-background-primary",
                shellClass[size],
                className,
            )}
            {...props}
            onKeyDown={handleKeyDown}
        >
            <div
                aria-live="polite"
                aria-atomic="true"
                className={clsx(
                    "flex min-w-refineui-spin-value-min-width flex-[1_1_auto] items-center pl-refineui-spin-field-padding-inline-start pr-refineui-size-small",
                    valueTypo[size],
                    disabled ? "text-refineui-alias-foreground-disabled" : "text-refineui-alias-foreground-primary",
                    disabled ? "bg-refineui-alias-background-surface-disabled" : "bg-refineui-alias-background-primary",
                )}
            >
                {value}
            </div>
            <div
                className={clsx(
                    "flex w-refineui-spin-stepper-width shrink-0 flex-col",
                    disabled
                        ? "bg-refineui-alias-background-surface-disabled"
                        : "bg-refineui-alias-background-primary",
                )}
            >
                <button
                    type="button"
                    data-refineui="spinbutton-step"
                    aria-label="Increase"
                    onClick={inc}
                    disabled={disabled || atMax}
                    className={clsx(
                        "flex w-refineui-spin-stepper-width items-center justify-center border-none p-0 pt-refineui-size-xsmall text-refineui-alias-foreground-placeholder",
                        stepHeight[size],
                        disabled || atMax
                            ? "cursor-not-allowed bg-refineui-alias-background-surface-disabled opacity-50"
                            : "cursor-pointer bg-refineui-alias-background-primary opacity-100",
                    )}
                >
                    <WebIcon name="chevron-up" size={iconSizes.xxsmall} color="currentColor" fallback="▲" />
                </button>
                <button
                    type="button"
                    data-refineui="spinbutton-step"
                    aria-label="Decrease"
                    onClick={dec}
                    disabled={disabled || atMin}
                    className={clsx(
                        "flex w-refineui-spin-stepper-width items-center justify-center border-none p-0 pb-refineui-size-xsmall text-refineui-alias-foreground-placeholder",
                        stepHeight[size],
                        disabled || atMin
                            ? "cursor-not-allowed bg-refineui-alias-background-surface-disabled opacity-50"
                            : "cursor-pointer bg-refineui-alias-background-primary opacity-100",
                    )}
                >
                    <WebIcon name="chevron-down" size={iconSizes.xxsmall} color="currentColor" fallback="▼" />
                </button>
            </div>
        </div>
    );
}
