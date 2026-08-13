import { clsx } from "clsx";
import { componentSizes } from "../../componentSizes";
import { toggleStyles } from "./style";
import type { ToggleProps } from "./types";

export function Toggle({
    checked = false,
    onCheckedChange,
    onClick,
    className,
    disabled,
    ...props
}: ToggleProps) {
    const trackClass = disabled
        ? checked
            ? toggleStyles.disabledChecked
            : toggleStyles.disabledUnchecked
        : checked
          ? toggleStyles.checked
          : toggleStyles.unchecked;

    const thumbClass = disabled
        ? checked
            ? toggleStyles.thumbDisabledChecked
            : toggleStyles.thumbDisabledUnchecked
        : toggleStyles.thumbDefault;

    return (
        <button
            type="button"
            data-refineui="switch"
            data-checked={checked ? "true" : "false"}
            role="switch"
            aria-checked={checked}
            className={clsx(toggleStyles.root, trackClass, className)}
            onClick={(e) => {
                onCheckedChange?.(!checked);
                onClick?.(e);
            }}
            disabled={disabled}
            {...props}
        >
            <span
                className={clsx(toggleStyles.thumb, thumbClass)}
                style={{
                    transform: checked ? `translateX(${componentSizes.switchThumb})` : "translateX(0)",
                }}
            />
        </button>
    );
}
