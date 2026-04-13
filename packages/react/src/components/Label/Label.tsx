import { clsx } from "clsx";
import type { LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
    /** Web Kit COMPONENT_SET `Label` `216:1681` — Small / Medium / Large (Figma 기본 변형은 Large; React는 폼 `Field`/`Input`과 맞추기 위해 `md` 기본) */
    size?: "sm" | "md" | "lg";
    /** Web Kit `disabled` — 글자색 `neutral400` */
    disabled?: boolean;
}

const sizeTypo: Record<NonNullable<LabelProps["size"]>, string> = {
    sm: "refineui-typo-caption-1",
    md: "refineui-typo-body-2",
    lg: "refineui-typo-body-1",
};

/** Web Kit COMPONENT_SET `Label` `216:1681` — `docs/design-specs-web-kit.md` Field·Label 절. */
export function Label({
    required,
    size = "md",
    disabled = false,
    children,
    className,
    ...props
}: LabelProps) {
    return (
        <label
            data-refineui="label"
            data-size={size}
            data-disabled={disabled || undefined}
            aria-disabled={disabled || undefined}
            className={clsx(
                "mb-refineui-size-xsmall block",
                sizeTypo[size],
                disabled ? "text-refineui-neutral-400" : "text-refineui-primary-black",
                className,
            )}
            {...props}
        >
            {children}
            {required && (
                <span className="ml-refineui-size-xxsmall text-refineui-red-700" aria-hidden>
                    *
                </span>
            )}
        </label>
    );
}
