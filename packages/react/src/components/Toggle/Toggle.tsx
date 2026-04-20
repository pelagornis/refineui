import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { componentSizes } from "../../componentSizes";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

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
                "box-border flex w-refineui-switch-width items-center rounded-refineui-xlarge border-none p-refineui-switch-padding transition-colors duration-200",
                disabled
                    ? "cursor-not-allowed bg-refineui-alias-background-brand-disabled"
                    : checked
                      ? "cursor-pointer bg-refineui-alias-background-brand"
                      : "cursor-pointer bg-refineui-alias-background-primary-active",
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
                    "block h-refineui-switch-thumb w-refineui-switch-thumb rounded-refineui-xlarge transition-[transform,background-color] duration-200",
                    disabled ? "bg-refineui-alias-background-brand-subtle" : "bg-refineui-alias-background-primary",
                )}
                style={{
                    transform: checked ? `translateX(${componentSizes.switchThumb})` : "translateX(0)",
                }}
            />
        </button>
    );
}
