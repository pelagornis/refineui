import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    error?: boolean;
    success?: boolean;
    fullWidth?: boolean;
    /** Web Kit COMPONENT_SET `Input` `518:7373` — Small / Medium / Large (HTML `size` 속성과 구분) */
    size?: "sm" | "md" | "lg";
}

const sizeClass: Record<NonNullable<InputProps["size"]>, string> = {
    sm: "min-h-refineui-control-height-sm rounded-refineui-medium px-refineui-size-medium py-refineui-size-small refineui-typo-caption-1",
    md: "min-h-refineui-control-height-md rounded-refineui-large px-refineui-size-large py-refineui-size-medium refineui-typo-body-2",
    lg: "min-h-refineui-control-height-lg rounded-refineui-xlarge px-refineui-size-large py-refineui-size-large refineui-typo-body-1",
};

/** Web Kit COMPONENT_SET `Input` `518:7373` — `docs/design-specs-web-kit.md` §2. */
export function Input({
    error = false,
    success = false,
    fullWidth = false,
    size = "md",
    disabled,
    className,
    ...props
}: InputProps) {
    const borderClass = disabled
        ? "border-refineui-thin border-refineui-alias-border-disabled"
        : error
          ? "border-refineui-thin border-refineui-alias-border-error"
          : success
            ? "border-refineui-thin border-refineui-alias-border-success"
            : "border-refineui-thin border-refineui-alias-border-default";

    return (
        <input
            data-refineui="input"
            data-size={size}
            data-error={error || undefined}
            data-success={success || undefined}
            disabled={disabled}
            className={clsx(
                "box-border outline-none transition-[border-color,box-shadow,background-color] duration-150",
                "text-refineui-alias-foreground-primary",
                borderClass,
                disabled
                    ? "bg-refineui-alias-background-surface-disabled"
                    : "bg-refineui-alias-background-primary",
                fullWidth && "w-full",
                sizeClass[size],
                className,
            )}
            {...props}
        />
    );
}
