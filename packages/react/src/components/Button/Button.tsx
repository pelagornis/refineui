import { clsx } from "clsx";
import { forwardRef } from "react";
import { Slot } from "../Slot";
import { buttonIconSizeClass, buttonLabelSizeClass, buttonStyles, buttonVariantClass } from "./style";
import type { ButtonProps } from "./types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        asChild = false,
        variant = "primary",
        size = "md",
        layout = "label",
        fullWidth = false,
        className,
        children,
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
            ? buttonStyles.iconGhost
            : buttonVariantClass[variant];

    const sizeStyles = layout === "icon" ? buttonIconSizeClass[size] : buttonLabelSizeClass[size];

    /** Icon layout: filled variants omit border so a 1px stroke does not shrink the box. */
    const iconNoStroke =
        layout === "icon" && (variant === "primary" || variant === "secondary" || variant === "ghost")
            ? "border-0"
            : null;

    const shared = {
        ref,
        "data-refineui": "button",
        "data-variant": variant,
        "data-size": size,
        "data-layout": layout,
        "data-inactive": inactive ? "true" : undefined,
        className: clsx(
            buttonStyles.base,
            variantStyles,
            sizeStyles,
            iconNoStroke,
            fullWidth && "w-full",
            inactive && "cursor-not-allowed",
            className,
        ),
        "aria-disabled": inactive ? true : ariaDisabledProp ?? undefined,
        ...rest,
    };

    if (asChild) {
        return <Slot {...shared}>{children}</Slot>;
    }

    return (
        <button
            type={type}
            disabled={disabled}
            {...shared}
        >
            {children}
        </button>
    );
});
