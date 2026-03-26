import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { colors, spacings, typographys, sizes } from "@refineui/tokens";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

export function Checkbox({ label, id, style, ...props }: CheckboxProps) {
    const uid = useId();
    const inputId = id ?? uid;

    return (
        <label
            htmlFor={inputId}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: spacings.sizeSmall,
                cursor: props.disabled ? "not-allowed" : "pointer",
                ...style,
            }}
        >
            <input
                id={inputId}
                type="checkbox"
                data-refineui="checkbox"
                style={{
                    width: sizes.controlCheckboxRadio,
                    height: sizes.controlCheckboxRadio,
                    accentColor: colors.primaryBlack,
                    cursor: "pointer",
                }}
                {...props}
            />
            {label && (
                <span style={{ ...typographys.body3, color: colors.primaryBlack }}>
                    {label}
                </span>
            )}
        </label>
    );
}
