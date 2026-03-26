import type { HTMLAttributes, ReactNode } from "react";
import { colors, spacings, typographys } from "@refineui/tokens";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
    label?: ReactNode;
    error?: ReactNode;
    hint?: ReactNode;
    required?: boolean;
    children: ReactNode;
}

export function Field({
    label,
    error,
    hint,
    required,
    children,
    style,
    ...props
}: FieldProps) {
    return (
        <div data-refineui="field" style={{ marginBottom: spacings.sizeMedium, ...style }} {...props}>
            {label && (
                <label
                    style={{
                        display: "block",
                        marginBottom: spacings.sizeXSmall,
                        ...typographys.body3,
                        color: colors.primaryBlack,
                    }}
                >
                    {label}
                    {required && <span style={{ color: colors.red500, marginLeft: spacings.sizeXXSmall }}>*</span>}
                </label>
            )}
            {children}
            {error && (
                <div role="alert" style={{ marginTop: spacings.sizeXSmall, ...typographys.caption1, color: colors.red500 }}>
                    {error}
                </div>
            )}
            {hint && !error && (
                <div style={{ marginTop: spacings.sizeXSmall, ...typographys.caption1, color: colors.neutral600 }}>
                    {hint}
                </div>
            )}
        </div>
    );
}
