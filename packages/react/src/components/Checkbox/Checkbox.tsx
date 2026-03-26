import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { colors, spacings, typographys, sizes } from "@refineui/tokens";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

export function Checkbox({ label, id, style, disabled, ...props }: CheckboxProps) {
    const uid = useId();
    const inputId = id ?? uid;

    return (
        <label
            htmlFor={inputId}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: spacings.sizeSmall,
                cursor: disabled ? "not-allowed" : "pointer",
                ...style,
            }}
        >
            <input
                id={inputId}
                type="checkbox"
                data-refineui="checkbox"
                disabled={disabled}
                style={{
                    width: sizes.controlCheckboxRadio,
                    height: sizes.controlCheckboxRadio,
                    cursor: disabled ? "not-allowed" : "pointer",
                }}
                {...props}
            />
            {label && (
                <span
                    style={{
                        ...typographys.body2,
                        color: disabled ? colors.neutral600 : colors.primaryBlack,
                    }}
                >
                    {label}
                </span>
            )}
        </label>
    );
}
