import type { ButtonHTMLAttributes } from "react";
import { colors, spacings, borderRadii, sizes } from "@refineui/tokens";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export function Toggle({
    checked = false,
    onCheckedChange,
    onClick,
    style,
    disabled,
    ...props
}: ToggleProps) {
    return (
        <button
            type="button"
            data-refineui="switch"
            role="switch"
            aria-checked={checked}
            style={{
                width: sizes.switchWidth,
                height: sizes.switchHeight,
                padding: sizes.switchPadding,
                borderRadius: borderRadii.roundedCircle,
                border: "none",
                backgroundColor: checked ? colors.primaryBlack : colors.neutral300,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                transition: "background-color 0.2s",
                ...style,
            }}
            onClick={(e) => {
                onCheckedChange?.(!checked);
                onClick?.(e);
            }}
            disabled={disabled}
            {...props}
        >
            <span
                style={{
                    display: "block",
                    width: sizes.switchThumb,
                    height: sizes.switchThumb,
                    borderRadius: borderRadii.roundedCircle,
                    backgroundColor: colors.neutralWhite,
                    transform: checked ? `translateX(${sizes.switchThumb})` : "translateX(0)",
                    transition: "transform 0.2s",
                }}
            />
        </button>
    );
}
