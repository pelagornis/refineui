import type { InputHTMLAttributes } from "react";
import { colors, spacings, borderRadii, sizes } from "@refineui/tokens";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    onChange?: (value: number) => void;
}

export function Slider({
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    style,
    ...props
}: SliderProps) {
    return (
        <input
            type="range"
            data-refineui="slider"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange?.(Number(e.target.value))}
            style={{
                width: "100%",
                height: sizes.sliderTrackHeight,
                borderRadius: borderRadii.roundedCircle,
                accentColor: colors.primaryBlack,
                cursor: "pointer",
                ...style,
            }}
            {...props}
        />
    );
}
