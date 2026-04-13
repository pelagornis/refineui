import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";
import { useState } from "react";

function clampPct(n: number) {
    if (Number.isNaN(n)) return 0;
    return Math.min(100, Math.max(0, n));
}

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size"> {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    onChange?: (value: number) => void;
    /** Web Kit Slider `526:1556` — Small: 레일 2px, Medium: 레일 4px */
    size?: "sm" | "md";
}

export function Slider({
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    onChange,
    onInput,
    size = "md",
    className,
    style,
    ...props
}: SliderProps) {
    const [internalFillPct, setInternalFillPct] = useState(() => {
        const v =
            defaultValue !== undefined ? Number(defaultValue) : (min + max) / 2;
        return clampPct(((v - min) / (max - min)) * 100);
    });

    const fillPct =
        value !== undefined
            ? clampPct(((Number(value) - min) / (max - min)) * 100)
            : internalFillPct;

    return (
        <input
            type="range"
            data-refineui="slider"
            data-size={size}
            min={min}
            max={max}
            step={step}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => {
                onChange?.(Number(e.target.value));
            }}
            onInput={(e) => {
                if (value === undefined) {
                    const v = Number(e.currentTarget.value);
                    setInternalFillPct(clampPct(((v - min) / (max - min)) * 100));
                }
                onInput?.(e);
            }}
            className={clsx(
                "h-refineui-slider-interaction-height w-full cursor-pointer",
                className,
            )}
            style={{
                ...style,
                ["--refineui-slider-fill" as string]: `${fillPct}%`,
            }}
            {...props}
        />
    );
}
