import { clsx } from "clsx";
import { useId, useRef } from "react";
import { RadioInput } from "./RadioInput";
import { radioStyles } from "./style";
import type { RadioProps } from "./types";

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
                radioStyles.root,
                description ? radioStyles.rootWithDescription : radioStyles.rootWithoutDescription,
                disabled ? radioStyles.rootDisabled : radioStyles.rootEnabled,
                className,
            )}
        >
            <RadioInput
                id={inputId}
                disabled={disabled}
                {...props}
                className={clsx(
                    description && radioStyles.inputWithDescriptionOffset,
                    disabled && radioStyles.rootDisabled,
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
                <span className={radioStyles.textWrap}>
                    {label && (
                        <span
                            className={clsx(
                                radioStyles.label,
                                disabled ? radioStyles.textDisabled : radioStyles.labelEnabled,
                            )}
                        >
                            {label}
                        </span>
                    )}
                    {description && (
                        <span
                            className={clsx(
                                radioStyles.description,
                                disabled ? radioStyles.textDisabled : radioStyles.descriptionEnabled,
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
