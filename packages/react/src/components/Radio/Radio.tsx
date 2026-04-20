import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";
import { useId, useRef } from "react";
import { RadioInput } from "./RadioInput";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    description?: string;
    allowUncheck?: boolean;
}

export function Radio({
    label,
    description,
    id,
    className,
    disabled,
    allowUncheck = true,
    onClick,
    ...props
}: RadioProps) {
    const uid = useId();
    const inputId = id ?? uid;
    const showText = Boolean(label || description);
    const wasCheckedRef = useRef(false);

    return (
        <label
            htmlFor={inputId}
            className={clsx(
                "inline-flex gap-refineui-size-medium p-refineui-size-xxsmall",
                description ? "items-start" : "items-center",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                className,
            )}
        >
            <RadioInput
                id={inputId}
                disabled={disabled}
                {...props}
                className={clsx(
                    description && "mt-refineui-size-xxsmall",
                    disabled && "cursor-not-allowed",
                )}
                onMouseDown={(e) => {
                    props.onMouseDown?.(e);
                    wasCheckedRef.current = e.currentTarget.checked;
                }}
                onClick={(e) => {
                    onClick?.(e);
                    if (
                        e.defaultPrevented ||
                        !allowUncheck ||
                        disabled ||
                        !wasCheckedRef.current
                    ) {
                        return;
                    }
                    e.preventDefault();
                    e.currentTarget.checked = false;
                    e.currentTarget.dispatchEvent(new Event("input", { bubbles: true }));
                    e.currentTarget.dispatchEvent(new Event("change", { bubbles: true }));
                }}
            />
            {showText && (
                <span className="flex min-w-0 flex-col gap-refineui-size-small">
                    {label && (
                        <span
                            className={clsx(
                                "refineui-typo-caption-1",
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
                                "refineui-typo-caption-3",
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
