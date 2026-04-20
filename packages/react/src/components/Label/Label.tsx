import { clsx } from "clsx";
import { labelSizeTypo, labelStyles } from "./style";
import type { LabelProps } from "./types";

export function Label({
    required,
    size = "md",
    disabled = false,
    children,
    className,
    ...props
}: LabelProps) {
    return (
        <label
            data-refineui="label"
            data-size={size}
            data-disabled={disabled || undefined}
            aria-disabled={disabled || undefined}
            className={clsx(
                labelStyles.base,
                labelSizeTypo[size],
                disabled
                    ? labelStyles.disabled
                    : labelStyles.enabled,
                className,
            )}
            {...props}
        >
            {children}
            {required && (
                <span
                    className={labelStyles.required}
                    aria-hidden
                >
                    *
                </span>
            )}
        </label>
    );
}
