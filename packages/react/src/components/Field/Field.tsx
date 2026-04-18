import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
    label?: ReactNode;
    error?: ReactNode;
    hint?: ReactNode;
    required?: boolean;
    /** Figma `Field` `size` — 라벨 타이포: sm → caption1, md → body2, lg → body1 */
    size?: "sm" | "md" | "lg";
    children: ReactNode;
}

const labelTypo: Record<NonNullable<FieldProps["size"]>, string> = {
    sm: "refineui-typo-caption-1",
    md: "refineui-typo-body-2",
    lg: "refineui-typo-body-1",
};

/** Web Kit COMPONENT_SET `Field` `525:1074` — `docs/design-specs-web-kit.md` Field 절. */
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
        <div data-refineui="field" data-size={size} className={clsx("mb-refineui-size-medium", className)} {...props}>
            {label && (
                <label
                    className={clsx("mb-refineui-size-xsmall block", labelTypo[size])}
                    style={{ color: resolveColorTokenValue(componentColorTokens.field.label) }}
                >
                    {label}
                    {required && (
                        <span className="ml-refineui-size-xxsmall" style={{ color: resolveColorTokenValue(componentColorTokens.field.required) }}>
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {error && (
                <div
                    role="alert"
                    className="refineui-typo-caption-3 mt-refineui-size-xsmall"
                    style={{ color: resolveColorTokenValue(componentColorTokens.field.error) }}
                >
                    {error}
                </div>
            )}
            {hint && !error && (
                <div
                    className="refineui-typo-caption-3 mt-refineui-size-xsmall"
                    style={{ color: resolveColorTokenValue(componentColorTokens.field.hint) }}
                >
                    {hint}
                </div>
            )}
        </div>
    );
}
