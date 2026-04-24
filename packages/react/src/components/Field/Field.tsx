import { clsx } from "clsx";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { FieldSizeContext, useFieldSize } from "./context";
import { fieldLabelTypo, fieldStyles } from "./style";
import type { FieldErrorProps, FieldHintProps, FieldLabelProps, FieldProps, FieldRequiredProps } from "./types";

export function Field({ size = "md", className, ...props }: FieldProps) {
    return (
        <FieldSizeContext.Provider value={size}>
            <div data-refineui="field" data-size={size} className={clsx(fieldStyles.root, className)} {...props} />
        </FieldSizeContext.Provider>
    );
}

export function FieldLabel({ className, ...props }: FieldLabelProps) {
    const size = useFieldSize();
    return (
        <label
            className={clsx(fieldStyles.label, fieldLabelTypo[size], className)}
            style={{ color: resolveColorTokenValue(componentColorTokens.field.label) }}
            {...props}
        />
    );
}

export function FieldRequired({ className, ...props }: FieldRequiredProps) {
    return (
        <span
            className={clsx(fieldStyles.required, className)}
            style={{ color: resolveColorTokenValue(componentColorTokens.field.required) }}
            {...props}
        >
            *
        </span>
    );
}

export function FieldHint({ className, ...props }: FieldHintProps) {
    return (
        <div
            className={clsx(fieldStyles.feedback, className)}
            style={{ color: resolveColorTokenValue(componentColorTokens.field.hint) }}
            {...props}
        />
    );
}

export function FieldError({ className, ...props }: FieldErrorProps) {
    return (
        <div
            role="alert"
            className={clsx(fieldStyles.feedback, className)}
            style={{ color: resolveColorTokenValue(componentColorTokens.field.error) }}
            {...props}
        />
    );
}
