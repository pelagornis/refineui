import type { HTMLAttributes, KeyboardEvent } from "react";
import { colors, spacings, borderRadii, typographys, strokeWidths, sizes, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export interface SpinButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

export function SpinButton({
    value,
    onChange,
    min,
    max,
    step = 1,
    style,
    ...props
}: SpinButtonProps) {
    const inc = () => {
        const next = value + step;
        if (max !== undefined && next > max) return;
        onChange(next);
    };
    const dec = () => {
        const next = value - step;
        if (min !== undefined && next < min) return;
        onChange(next);
    };

    const bigStep = step * 10;

    const onGroupKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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
    };

    return (
        <div
            role="group"
            aria-label="Spin button"
            onKeyDown={onGroupKeyDown}
            style={{
                display: "inline-flex",
                alignItems: "stretch",
                border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
                borderRadius: borderRadii.roundedMedium,
                overflow: "hidden",
                minHeight: sizes.controlHeightMd,
                ...style,
            }}
            {...props}
        >
            <div
                aria-live="polite"
                aria-atomic="true"
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: `0 ${spacings.sizeMedium}`,
                    minWidth: sizes.spinValueMinWidth,
                    ...typographys.body2,
                    color: colors.primaryBlack,
                    backgroundColor: colors.neutralWhite,
                }}
            >
                {value}
            </div>
            <div style={{ display: "flex", flexDirection: "column", borderLeft: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}` }}>
                <button
                    type="button"
                    data-refineui="spinbutton"
                    aria-label="Increase"
                    onClick={inc}
                    disabled={max !== undefined && value >= max}
                    style={{
                        width: sizes.spinStepperWidth,
                        height: sizes.spinStepperStepHeight,
                        border: "none",
                        background: colors.neutral200,
                        cursor: max !== undefined && value >= max ? "not-allowed" : "pointer",
                        opacity: max !== undefined && value >= max ? 0.5 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.primaryBlack,
                    }}
                >
                    <WebIcon name="chevron-up" size={iconSizes.md} color="currentColor" fallback="▲" />
                </button>
                <button
                    type="button"
                    data-refineui="spinbutton"
                    aria-label="Decrease"
                    onClick={dec}
                    disabled={min !== undefined && value <= min}
                    style={{
                        width: sizes.spinStepperWidth,
                        height: sizes.spinStepperStepHeight,
                        border: "none",
                        borderTop: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
                        background: colors.neutral200,
                        cursor: min !== undefined && value <= min ? "not-allowed" : "pointer",
                        opacity: min !== undefined && value <= min ? 0.5 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.primaryBlack,
                    }}
                >
                    <WebIcon name="chevron-down" size={iconSizes.md} color="currentColor" fallback="▼" />
                </button>
            </div>
        </div>
    );
}
