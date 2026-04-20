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
    return (
        <button
            type="button"
            data-refineui="switch"
            data-checked={checked ? "true" : "false"}
            role="switch"
            aria-checked={checked}
            className={clsx(
                toggleStyles.root,
                disabled
                    ? toggleStyles.disabled
                    : checked
                      ? toggleStyles.checked
                      : toggleStyles.unchecked,
                className,
            )}
            onClick={(e) => {
                onCheckedChange?.(!checked);
                onClick?.(e);
            }}
            disabled={disabled}
            {...props}
        >
            <span
                className={clsx(
                    toggleStyles.thumb,
                    disabled ? toggleStyles.thumbDisabled : toggleStyles.thumbDefault,
                )}
                style={{
                    transform: checked ? `translateX(${componentSizes.switchThumb})` : "translateX(0)",
                }}
            />
        </button>
    );
}
