import { clsx } from "clsx";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { useId, useState } from "react";
import { iconSizes } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { WebIcon } from "../../WebIcon";
import { componentColorTokens } from "../../tokens/componentColorTokens";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    description?: string;
    label?: string;
    variant?: "default" | "circular";
}

export function Checkbox({
    label,
    description,
    variant = "default",
    id,
    className,
    disabled,
    checked: checkedProp,
    defaultChecked,
    onChange,
    ...props
}: CheckboxProps) {
    const uid = useId();
    const inputId = id ?? uid;
    const showText = Boolean(label || description);
    const isControlled = checkedProp !== undefined;
    const [internalChecked, setInternalChecked] = useState(!!defaultChecked);
    const checked = isControlled ? !!checkedProp : internalChecked;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setInternalChecked(e.target.checked);
        onChange?.(e);
    };

    const checkColor = disabled
        ? resolveColorTokenValue(componentColorTokens.checkbox.checkIcon.disabled)
        : resolveColorTokenValue(componentColorTokens.checkbox.checkIcon.default);

    return (
        <label
            htmlFor={inputId}
            className={clsx(
                "inline-flex gap-refineui-size-small",
                description ? "items-start" : "items-center",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                className,
            )}
        >
            <span
                className={clsx(
                    "relative size-refineui-control-checkbox shrink-0",
                    description && "mt-refineui-size-xxsmall",
                )}
            >
                <input
                    id={inputId}
                    type="checkbox"
                    checked={isControlled ? checkedProp : undefined}
                    defaultChecked={!isControlled ? defaultChecked : undefined}
                    disabled={disabled}
                    onChange={handleChange}
                    className={clsx(
                        "absolute inset-0 z-1 m-0 h-full w-full cursor-pointer opacity-0 outline-none",
                        disabled && "cursor-not-allowed",
                    )}
                    {...props}
                />
                <span
                    data-refineui="checkbox"
                    data-variant={variant}
                    data-checked={checked ? "true" : "false"}
                    data-disabled={disabled ? "true" : undefined}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 box-border flex items-center justify-center"
                >
                    {checked && (
                        <WebIcon
                            name="checkmark"
                            size={iconSizes.xxsmall}
                            color={checkColor}
                            iconStyle="filled"
                        />
                    )}
                </span>
            </span>
            {showText && (
                <span className="flex min-w-0 flex-col gap-refineui-size-small">
                    {label && (
                        <span
                            className={clsx(
                                "refineui-typo-body-2",
                                disabled
                                    ? "text-refineui-alias-foreground-disabled"
                                    : "text-refineui-alias-foreground-primary",
                            )}
                        >
                            {label}
                        </span>
                    )}
                    {description && (
                        <span
                            className={clsx(
                                "refineui-typo-caption-2",
                                disabled
                                    ? "text-refineui-alias-foreground-disabled"
                                    : "text-refineui-alias-foreground-secondary",
                            )}
                        >
                            {description}
                        </span>
                    )}
                </span>
            )}
        </label>
    );
}
