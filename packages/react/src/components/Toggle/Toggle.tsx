import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { componentSizes } from "../../componentSizes";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

/** Web Kit COMPONENT_SET `Switch` `270:3057` — `Switch`는 동일 구현을 재보냅니다. */
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
                "box-border flex w-refineui-switch-width items-center rounded-refineui-circle border-none p-refineui-switch-padding transition-colors duration-200",
                disabled
                    ? "cursor-not-allowed bg-refineui-neutral-250"
                    : checked
                      ? "cursor-pointer bg-refineui-primary-black"
                      : "cursor-pointer bg-refineui-neutral-300",
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
                    "block h-refineui-switch-thumb w-refineui-switch-thumb rounded-refineui-circle transition-[transform,background-color] duration-200",
                    disabled ? "bg-refineui-neutral-500" : "bg-refineui-neutral-white",
                )}
                style={{
                    transform: checked ? `translateX(${componentSizes.switchThumb})` : "translateX(0)",
                }}
            />
        </button>
    );
}
