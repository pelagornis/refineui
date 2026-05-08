import { clsx } from "clsx";
import { spinnerLabelTypo, spinnerRingClass, spinnerStyles } from "./style";
import type { SpinnerProps } from "./types";

export function Spinner({
    size = "md",
    label,
    labelPosition = "right",
    className,
    ...props
}: SpinnerProps) {
    const hasLabel = label != null && label !== "";

    const icon = (
        <div
            data-refineui="spinner"
            data-size={size}
            className={clsx(
                spinnerStyles.ringBase,
                spinnerRingClass[size],
            )}
            aria-hidden={hasLabel ? true : undefined}
        />
    );

    const labelEl = <span className={clsx(spinnerLabelTypo[size], spinnerStyles.label)}>{label}</span>;

    if (!hasLabel) {
        return (
            <div role="status" aria-label="Loading" className={className} {...props}>
                {icon}
            </div>
        );
    }

    const row = labelPosition === "left" || labelPosition === "right";
    const iconFirst = labelPosition === "left" || labelPosition === "top";

    return (
        <div
            role="status"
            aria-label="Loading"
            className={clsx(
                spinnerStyles.withLabel,
                row ? "flex-row" : "flex-col",
                className,
            )}
            {...props}
        >
            {iconFirst ? (
                <>
                    {icon}
                    {labelEl}
                </>
            ) : (
                <>
                    {labelEl}
                    {icon}
                </>
            )}
        </div>
    );
}
