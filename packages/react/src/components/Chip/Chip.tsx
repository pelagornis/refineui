import { clsx } from "clsx";
import { WebIcon } from "../../WebIcon";
import { chipDisabledVariantClass, chipSizeIcon, chipSizeTypo, chipStyles, chipVariantClass } from "./style";
import type { ChipProps } from "./types";

export function Chip({
    variant = "default",
    size = "lg",
    disabled = false,
    avatar,
    onRemove,
    children,
    className,
    ...props
}: ChipProps) {
    const iconSize = chipSizeIcon[size];

    return (
        <span
            data-refineui="chip"
            data-variant={variant}
            data-size={size}
            {...(disabled ? { "data-disabled": true } : {})}
            aria-disabled={disabled || undefined}
            className={clsx(
                chipStyles.root,
                chipSizeTypo[size],
                disabled ? chipDisabledVariantClass[variant] : chipVariantClass[variant],
                className,
            )}
            {...props}
        >
            {avatar ? <span className={chipStyles.avatarWrap}>{avatar}</span> : null}
            {children}
            {onRemove && (
                <button
                    type="button"
                    data-refineui="chip-remove"
                    disabled={disabled}
                    aria-label="Remove"
                    className={clsx(
                        chipStyles.removeBtnBase,
                        disabled ? chipStyles.removeBtnDisabled : chipStyles.removeBtnEnabled,
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                >
                    <WebIcon name="dismiss" size={iconSize} color="currentColor" />
                </button>
            )}
        </span>
    );
}
