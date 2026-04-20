import { clsx } from "clsx";
import { progressStyles } from "./style";
import type { ProgressProps } from "./types";

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
                progressStyles.root,
                size === "lg" ? progressStyles.sizeLg : progressStyles.sizeSm,
                className,
            )}
            {...props}
        >
            <div
                className={progressStyles.bar}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}
