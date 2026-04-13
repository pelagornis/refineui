import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

/** Web Kit COMPONENT_SET `Tag` `574:6578` — 코드 export 이름은 `Chip`, 문서·`Tag`는 동일 컴포넌트 */
export type ChipVariant = "default" | "outline" | "filled";
export type ChipSize = "sm" | "md" | "lg";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
    /** Figma `showAvater` — 앞쪽 슬롯(아바타 등) */
    avatar?: ReactNode;
    disabled?: boolean;
    onRemove?: () => void;
    size?: ChipSize;
    variant?: ChipVariant;
}

const variantClass: Record<ChipVariant, string> = {
    default: "border-none bg-refineui-neutral-white text-refineui-primary-black",
    outline:
        "border-refineui-thin border-refineui-neutral-300 box-border bg-refineui-neutral-white text-refineui-primary-black",
    filled: "border-none bg-refineui-primary-black text-refineui-neutral-white",
};

const disabledVariantClass: Record<ChipVariant, string> = {
    default: "border-none bg-refineui-neutral-150 text-refineui-neutral-400",
    outline:
        "border-refineui-thin border-refineui-neutral-250 box-border bg-refineui-neutral-150 text-refineui-neutral-400",
    filled: "border-none bg-refineui-neutral-200 text-refineui-neutral-400",
};

const sizeTypo: Record<ChipSize, string> = {
    lg: "refineui-typo-body-1",
    md: "refineui-typo-body-3",
    sm: "refineui-typo-caption-1",
};

const sizeIcon: Record<ChipSize, number> = {
    lg: iconSizes.large,
    md: iconSizes.medium,
    sm: iconSizes.xsmall,
};

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
    const iconSize = sizeIcon[size];

    return (
        <span
            data-refineui="chip"
            data-variant={variant}
            data-size={size}
            {...(disabled ? { "data-disabled": true } : {})}
            aria-disabled={disabled || undefined}
            className={clsx(
                "inline-flex items-center gap-refineui-size-xsmall rounded-refineui-medium p-refineui-size-small",
                sizeTypo[size],
                disabled ? disabledVariantClass[variant] : variantClass[variant],
                className,
            )}
            {...props}
        >
            {avatar ? <span className="inline-flex shrink-0 items-center">{avatar}</span> : null}
            {children}
            {onRemove && (
                <button
                    type="button"
                    data-refineui="chip-remove"
                    disabled={disabled}
                    aria-label="Remove"
                    className={clsx(
                        "inline-flex items-center justify-center border-none bg-transparent p-0 leading-none text-inherit",
                        disabled ? "cursor-not-allowed" : "cursor-pointer opacity-70 hover:opacity-100",
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
