import { clsx } from "clsx";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { Label } from "../Label/Label";
import { LabelRequired } from "../Label/LabelRequired";
import { FieldSizeContext, useOptionalFieldSize } from "./context";
import { fieldStyles } from "./style";
import type { FieldErrorProps, FieldHintProps, FieldLabelProps, FieldProps, FieldRequiredProps } from "./types";

export function Field({ size = "lg", className, ...props }: FieldProps) {
    return (
        <FieldSizeContext.Provider value={size}>
            <div data-refineui="field" data-size={size} className={clsx(fieldStyles.root, className)} {...props} />
        </FieldSizeContext.Provider>
    );
}

/** Field-scoped `Label` — inherits `Field` `size` unless `size` is passed explicitly. */
export function FieldLabel({ size: sizeProp, className, ...props }: FieldLabelProps) {
    const fieldSize = useOptionalFieldSize();
    return (
        <Label
            size={sizeProp ?? fieldSize ?? "md"}
            className={clsx(fieldSize != null && fieldStyles.label, className)}
            {...props}
        />
    );
}

/** Field-scoped required mark — same atom as `LabelRequired`. */
export function FieldRequired(props: FieldRequiredProps) {
    return <LabelRequired {...props} />;
}

export function FieldHint({ className, ...props }: FieldHintProps) {
    return (
        <div
            data-refineui="field-hint"
            className={clsx(fieldStyles.feedback, className)}
            style={{ color: resolveColorTokenValue(componentColorTokens.field.hint) }}
            {...props}
        />
    );
}

export function FieldError({ className, ...props }: FieldErrorProps) {
    return (
        <div
            data-refineui="field-error"
            role="alert"
            className={clsx(fieldStyles.feedback, className)}
            style={{ color: resolveColorTokenValue(componentColorTokens.field.error) }}
            {...props}
        />
    );
}
