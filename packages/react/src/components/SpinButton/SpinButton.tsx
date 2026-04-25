import { clsx } from "clsx";
import { useEffect, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { spinButtonShellClass, spinButtonStepHeight, spinButtonStyles, spinButtonValueTypo } from "./style";
import type { SpinButtonProps } from "./types";

export function SpinButton({
    value,
    onChange,
    placeholder,
    min,
    max,
    step = 1,
    size = "md",
    disabled = false,
    className,
    onKeyDown,
    ...props
}: SpinButtonProps) {
    const [draftValue, setDraftValue] = useState(String(value));

    useEffect(() => {
        setDraftValue(String(value));
    }, [value]);

    const clampValue = (next: number) => {
        if (min !== undefined && next < min) return min;
        if (max !== undefined && next > max) return max;
        return next;
    };

    const commitInputValue = () => {
        const trimmed = draftValue.trim();
        if (trimmed.length === 0) {
            setDraftValue(String(value));
            return;
        }
        const parsed = Number(trimmed);
        if (Number.isNaN(parsed)) {
            setDraftValue(String(value));
            return;
        }
        const normalized = clampValue(parsed);
        setDraftValue(String(normalized));
        if (normalized !== value) {
            onChange(normalized);
        }
    };

    const inc = () => {
        if (disabled) return;
        const next = clampValue(value + step);
        if (next === value) return;
        onChange(next);
    };
    const dec = () => {
        if (disabled) return;
        const next = clampValue(value - step);
        if (next === value) return;
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
                    onChange(clampValue(up));
                    break;
                }
                case "PageDown": {
                    e.preventDefault();
                    const down = value - bigStep;
                    onChange(clampValue(down));
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
                case "Enter":
                    e.preventDefault();
                    commitInputValue();
                    break;
                default:
                    break;
            }
        }
        onKeyDown?.(e);
    };

    const atMax = max !== undefined && value >= max;
    const atMin = min !== undefined && value <= min;

    const borderClass = disabled ? spinButtonStyles.borderDisabled : spinButtonStyles.borderDefault;

    return (
        <div
            role="spinbutton"
            aria-label={props["aria-label"] ?? "Spin button"}
            aria-disabled={disabled || undefined}
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            tabIndex={-1}
            data-refineui="spinbutton"
            data-size={size}
            data-disabled={disabled ? "true" : undefined}
            className={clsx(
                spinButtonStyles.root,
                borderClass,
                disabled ? spinButtonStyles.bgDisabled : spinButtonStyles.bgDefault,
                spinButtonShellClass[size],
                className,
            )}
            {...props}
            onKeyDown={handleKeyDown}
        >
            <div
                aria-live="polite"
                aria-atomic="true"
                className={clsx(
                    spinButtonStyles.value,
                    spinButtonValueTypo[size],
                    disabled ? spinButtonStyles.valueTextDisabled : spinButtonStyles.valueTextDefault,
                    disabled ? spinButtonStyles.bgDisabled : spinButtonStyles.bgDefault,
                )}
            >
                <input
                    type="text"
                    inputMode="decimal"
                    value={draftValue}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={clsx(
                        spinButtonStyles.valueInput,
                        disabled ? spinButtonStyles.valueTextDisabled : spinButtonStyles.valueTextDefault,
                    )}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDraftValue(e.target.value)}
                    onBlur={commitInputValue}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            commitInputValue();
                            e.currentTarget.blur();
                        }
                    }}
                />
            </div>
            <div
                className={clsx(
                    spinButtonStyles.stepper,
                    disabled ? spinButtonStyles.bgDisabled : spinButtonStyles.bgDefault,
                )}
            >
                <button
                    type="button"
                    data-refineui="spinbutton-step"
                    aria-label="Increase"
                    onClick={inc}
                    disabled={disabled || atMax}
                    className={clsx(
                        spinButtonStyles.stepButtonBase,
                        spinButtonStyles.stepButtonUpPadding,
                        spinButtonStepHeight[size],
                        disabled || atMax
                            ? spinButtonStyles.stepButtonDisabled
                            : spinButtonStyles.stepButtonEnabled,
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
                        spinButtonStyles.stepButtonBase,
                        spinButtonStyles.stepButtonDownPadding,
                        spinButtonStepHeight[size],
                        disabled || atMin
                            ? spinButtonStyles.stepButtonDisabled
                            : spinButtonStyles.stepButtonEnabled,
                    )}
                >
                    <WebIcon name="chevron-down" size={iconSizes.xxsmall} color="currentColor" fallback="▼" />
                </button>
            </div>
        </div>
    );
}
