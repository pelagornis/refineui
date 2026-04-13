import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

/**
 * Web Kit `Badge` (Figma MCP `270:3353`) · `Badge Number` (`276:515`)
 * — padding: py sizeXXSmall(2px) px sizeSmall(6px)
 * — label: radius roundedMedium(6px) / number: roundedCircle
 * — 타이포: Caption 2 (12 Regular / 16)
 * — Default·Success·Warning·Danger: 흰색 글자 + 채도 있는 배경 / Secondary·Outline: 검정 글자
 * — Hover·Pressed: `refineui.css` `[data-refineui="badge"][data-variant=…]` (label·number 공통)
 */
export type BadgeVariant = "default" | "neutral" | "outline" | "success" | "warning" | "danger";

/** `label`: 텍스트 배지 · `number`: 숫자/카운트용 원형 배지 */
export type BadgeLayout = "label" | "number";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    layout?: BadgeLayout;
}

const variantClass: Record<BadgeVariant, string> = {
    default: "bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    neutral: "bg-refineui-alias-background-primary text-refineui-alias-foreground-primary",
    outline:
        "border-refineui-thin border-refineui-alias-border-default border bg-transparent text-refineui-alias-foreground-primary box-border",
    success: "bg-refineui-alias-background-success text-refineui-alias-foreground-inversed",
    warning: "bg-refineui-alias-background-warning text-refineui-alias-foreground-inversed",
    danger: "bg-refineui-alias-background-error text-refineui-alias-foreground-inversed",
};

export function Badge({ variant = "default", layout = "label", className, ...props }: BadgeProps) {
    return (
        <span
            data-refineui="badge"
            data-variant={variant}
            data-layout={layout}
            className={clsx(
                "refineui-typo-caption-2 inline-flex items-center justify-center py-refineui-size-xxsmall px-refineui-size-small",
                layout === "number" ? "rounded-refineui-circle" : "rounded-refineui-medium",
                variantClass[variant],
                className,
            )}
            {...props}
        />
    );
}
