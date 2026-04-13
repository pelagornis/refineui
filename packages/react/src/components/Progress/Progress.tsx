import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    /** Web Kit `Progress bar` `452:3994` — Small(2px) / Large(4px) */
    size?: "sm" | "lg";
}

/** Web Kit COMPONENT_SET `Progress bar` `452:3994` — 트랙 채움색은 `colors.primaryBlack`. */
export function Progress({
    value,
    max = 100,
    size = "sm",
    className,
    ...props
}: ProgressProps) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div
            data-refineui="progress"
            data-size={size}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            className={clsx(
                "overflow-hidden rounded-refineui-circle bg-refineui-neutral-400",
                size === "lg" ? "h-refineui-progress-track-height-lg" : "h-refineui-progress-track-height-sm",
                className,
            )}
            {...props}
        >
            <div
                className="h-full rounded-refineui-circle bg-refineui-primary-black transition-[width] duration-300 ease-out"
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}
