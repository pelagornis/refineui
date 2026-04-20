import { clsx } from "clsx";
import type { LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

const sizeTypo: Record<NonNullable<LabelProps["size"]>, string> = {
    sm: "refineui-typo-caption-1",
    md: "refineui-typo-body-2",
    lg: "refineui-typo-body-1",
};

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
                "mb-refineui-size-xsmall block",
                sizeTypo[size],
                disabled
                    ? "text-refineui-alias-foreground-disabled"
                    : "text-refineui-alias-foreground-primary",
                className,
            )}
            {...props}
        >
            {children}
            {required && (
                <span
                    className="ml-refineui-size-xxsmall text-refineui-alias-foreground-error"
                    aria-hidden
                >
                    *
                </span>
            )}
        </label>
    );
}
