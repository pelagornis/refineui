import { clsx } from "clsx";
import { useState } from "react";
import { sliderStyles } from "./style";
import type { SliderProps } from "./types";

function clampPct(n: number) {
    if (Number.isNaN(n)) return 0;
    return Math.min(100, Math.max(0, n));
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
                sliderStyles.root,
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
