import { clsx } from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";

/** Web Kit `Button` `79:3304` — Style: Primary · Secondary · Outline · Ghost */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

/** Web Kit Size — Small / Medium / Large */
export type ButtonSize = "sm" | "md" | "lg";

/** Web Kit Layout — Label(텍스트·좌우 아이콘) / Icon(아이콘만, MCP `Layout=Icon`) */
export type ButtonLayout = "label" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    layout?: ButtonLayout;
    fullWidth?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
    primary:
        "border-refineui-none border border-transparent bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    secondary:
        "border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-surface text-refineui-alias-foreground-primary",
    outline:
        "border-refineui-thin border-refineui-alias-border-default bg-transparent text-refineui-alias-foreground-primary",
    ghost: "border-refineui-none border border-transparent bg-transparent text-refineui-alias-foreground-primary",
};

/** Figma `Layout=Label` — gap sizeXSmall, padding MCP 표 */
const labelSizeClass: Record<ButtonSize, string> = {
    sm: "min-h-refineui-button-min-height-sm gap-refineui-size-x-small rounded-refineui-small px-refineui-size-medium py-refineui-size-xsmall refineui-typo-body-3",
    md: "min-h-refineui-button-min-height-md gap-refineui-size-x-small rounded-refineui-medium px-refineui-size-medium py-refineui-size-small refineui-typo-body-1",
    lg: "min-h-refineui-button-min-height-lg gap-refineui-size-x-small rounded-refineui-large px-refineui-size-large py-refineui-size-medium refineui-typo-sub-title-1",
};

/** Figma `Layout=Icon` — 정사각(min·w = Size별 높이), gap 0, padding·radius는 MCP */
const iconSizeClass: Record<ButtonSize, string> = {
    sm: "min-h-refineui-button-min-height-sm min-w-refineui-button-min-height-sm shrink-0 gap-0 rounded-refineui-small p-refineui-size-xsmall leading-none",
    md: "min-h-refineui-button-min-height-md min-w-refineui-button-min-height-md shrink-0 gap-0 rounded-refineui-medium p-refineui-size-small leading-none",
    lg: "min-h-refineui-button-min-height-lg min-w-refineui-button-min-height-lg shrink-0 gap-0 rounded-refineui-large p-refineui-size-medium leading-none",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        variant = "primary",
        size = "md",
        layout = "label",
        fullWidth = false,
        className,
        disabled,
        type = "button",
        "aria-disabled": ariaDisabledProp,
        ...rest
    },
    ref,
) {
    const inactive =
        Boolean(disabled) || ariaDisabledProp === true || ariaDisabledProp === "true";

    const variantStyles =
        variant === "ghost" && layout === "icon"
            ? "border-refineui-none border border-transparent bg-transparent text-refineui-alias-foreground-secondary hover:text-refineui-alias-foreground-primary-hover"
            : variantClass[variant];

    const sizeStyles = layout === "icon" ? iconSizeClass[size] : labelSizeClass[size];

    /** MCP `Layout=Icon`: Primary·Ghost는 테두리 없음 — `border`(1px)가 min 크기 안을 잡아먹지 않게 제거 */
    const iconNoStroke =
        layout === "icon" && (variant === "primary" || variant === "ghost") ? "border-0" : null;

    return (
        <button
            ref={ref}
            type={type}
            data-refineui="button"
            data-variant={variant}
            data-size={size}
            data-layout={layout}
            data-inactive={inactive ? "true" : undefined}
            className={clsx(
                "box-border inline-flex cursor-pointer items-center justify-center border transition-[opacity,background-color,border-color,color,transform] duration-150 ease-out",
                variantStyles,
                sizeStyles,
                iconNoStroke,
                fullWidth && "w-full",
                inactive && "cursor-not-allowed",
                className,
            )}
            disabled={disabled}
            aria-disabled={inactive ? true : ariaDisabledProp ?? undefined}
            {...rest}
        />
    );
});
