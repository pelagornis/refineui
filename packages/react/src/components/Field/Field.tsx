import { clsx } from "clsx";
import type { FieldProps } from "./types";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { fieldLabelTypo, fieldStyles } from "./style";

export function Field({
    label,
    error,
    hint,
    required,
    size = "md",
    children,
    className,
    ...props
}: FieldProps) {
    return (
        <div data-refineui="field" data-size={size} className={clsx(fieldStyles.root, className)} {...props}>
            {label && (
                <label
                    className={clsx(fieldStyles.label, fieldLabelTypo[size])}
                    style={{ color: resolveColorTokenValue(componentColorTokens.field.label) }}
                >
                    {label}
                    {required && (
                        <span className={fieldStyles.required} style={{ color: resolveColorTokenValue(componentColorTokens.field.required) }}>
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {error && (
                <div
                    role="alert"
                    className={fieldStyles.feedback}
                    style={{ color: resolveColorTokenValue(componentColorTokens.field.error) }}
                >
                    {error}
                </div>
            )}
            {hint && !error && (
                <div
                    className={fieldStyles.feedback}
                    style={{ color: resolveColorTokenValue(componentColorTokens.field.hint) }}
                >
                    {hint}
                </div>
            )}
        </div>
    );
}
