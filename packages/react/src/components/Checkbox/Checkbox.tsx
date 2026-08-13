import { clsx } from "clsx";
import type { ChangeEvent } from "react";
import { useId, useState } from "react";
import { iconSizes } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { WebIcon } from "../../WebIcon";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { checkboxStyles } from "./style";
import type { CheckboxProps } from "./types";

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
                checkboxStyles.root,
                description ? checkboxStyles.textTop : checkboxStyles.textCenter,
                disabled ? checkboxStyles.disabledCursor : checkboxStyles.enabledCursor,
                className,
            )}
        >
            <span
                className={clsx(
                    checkboxStyles.controlWrap,
                    description && checkboxStyles.controlWrapDesc,
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
                        checkboxStyles.input,
                        disabled && checkboxStyles.inputDisabled,
                    )}
                    {...props}
                />
                <span
                    data-refineui="checkbox"
                    data-variant={variant}
                    data-checked={checked ? "true" : "false"}
                    data-disabled={disabled ? "true" : undefined}
                    aria-hidden
                    className={checkboxStyles.visual}
                >
                    {checked && (
                        <WebIcon
                            name="checkmark"
                            size={iconSizes.small}
                            color={checkColor}
                            iconStyle="filled"
                        />
                    )}
                </span>
            </span>
            {showText && (
                <span className={checkboxStyles.textCol}>
                    {label && (
                        <span
                            className={clsx(
                                checkboxStyles.label,
                                disabled
                                    ? checkboxStyles.textDisabled
                                    : checkboxStyles.textEnabled,
                            )}
                        >
                            {label}
                        </span>
                    )}
                    {description && (
                        <span
                            className={clsx(
                                checkboxStyles.desc,
                                disabled
                                    ? checkboxStyles.textDisabled
                                    : checkboxStyles.descEnabled,
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
