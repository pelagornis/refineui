import type { LabelHTMLAttributes } from "react";
import { colors, spacings, typographys } from "@refineui/tokens";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export function Label({ required, children, style, ...props }: LabelProps) {
    return (
        <label
            data-refineui="label"
            style={{
                ...typographys.body3,
                color: colors.primaryBlack,
                display: "block",
                marginBottom: spacings.sizeXSmall,
                ...style,
            }}
            {...props}
        >
            {children}
            {required && (
                <span style={{ color: colors.red500, marginLeft: spacings.sizeXXSmall }} aria-hidden>
                    *
                </span>
            )}
        </label>
    );
}
