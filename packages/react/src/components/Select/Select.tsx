import { clsx } from "clsx";
import type { SelectHTMLAttributes } from "react";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
    options: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
    /** Web Kit: Input과 동일하게 오류 시 red500 테두리 */
    error?: boolean;
    success?: boolean;
    /** Web Kit `Input` `518:7373`와 동일 필드 크기 — HTML `size`(표시 행 수)와 구분 */
    size?: "sm" | "md" | "lg";
}

const sizeClass: Record<NonNullable<SelectProps["size"]>, string> = {
    sm: "min-h-refineui-control-height-sm rounded-refineui-medium px-refineui-size-medium py-refineui-size-small refineui-typo-caption-1",
    md: "min-h-refineui-control-height-md rounded-refineui-large px-refineui-size-large py-refineui-size-medium refineui-typo-body-2",
    lg: "min-h-refineui-control-height-lg rounded-refineui-xlarge px-refineui-size-large py-refineui-size-large refineui-typo-body-1",
};

/** 네이티브 `<select>` — Web Kit 단독 `Select` 세트 없음; 필드 스타일은 **Input** `518:7373`과 동일(`size`). */
export function Select({
    options,
    placeholder,
    fullWidth = false,
    error = false,
    success = false,
    size = "md",
    disabled,
    className,
    ...props
}: SelectProps) {
    const borderColor = disabled
        ? resolveColorTokenValue(componentColorTokens.select.border.disabled)
        : error
          ? resolveColorTokenValue(componentColorTokens.select.border.error)
          : success
            ? resolveColorTokenValue(componentColorTokens.select.border.success)
            : resolveColorTokenValue(componentColorTokens.select.border.default);

    return (
        <select
            data-refineui="select"
            data-size={size}
            data-error={error || undefined}
            aria-invalid={error || undefined}
            disabled={disabled}
            className={clsx(
                "box-border border-refineui-thin outline-none transition-[border-color,box-shadow,background-color] duration-150",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                fullWidth && "w-full",
                sizeClass[size],
                className,
            )}
            style={{
                borderColor,
                color: resolveColorTokenValue(componentColorTokens.select.text),
                backgroundColor: disabled
                    ? resolveColorTokenValue(componentColorTokens.select.disabledBackground)
                    : resolveColorTokenValue(componentColorTokens.select.background),
            }}
            {...props}
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
