import { clsx } from "clsx";
import type { FormControlSize } from "../../formControlSizes";

/**
 * InputOTP — independent soft square `<input>` cells with gap. No merged shell.
 * Digit typography resolves through the size-specific Tailwind class map below.
 */
export const inputOtpStyles = {
    /** Row of separate cells. */
    root: "relative box-border inline-flex items-center gap-refineui-size-small outline-none",
    slot: clsx(
        "box-border appearance-none outline-none",
        "inline-flex shrink-0 cursor-text items-center justify-center",
        "border-refineui-thin border-transparent",
        // Soft grey tile (not white) so cells read on light preview / page.
        "bg-refineui-alias-background-surface-hover",
        "text-center tabular-nums",
        "text-refineui-alias-foreground-primary",
        "transition-[background-color,border-color]",
        "duration-[var(--refineui-motion-duration-fast)]",
        "ease-[var(--refineui-motion-easing-emphasized)]",
        // Empty slots retain the staggered soft pulse until they receive focus or a digit.
        "[&:not(:disabled):not(:focus):not([data-filled])]:animate-pulse",
        "[&:not(:disabled):not(:focus):not([data-filled])]:[animation-duration:var(--refineui-motion-duration-skeleton)]",
        "[&:not(:disabled):not(:focus):not([data-filled])]:[animation-timing-function:var(--refineui-motion-easing-ease-in-out)]",
        "[&:not(:disabled):not(:focus):not([data-filled])]:[animation-delay:calc(var(--refineui-input-otp-slot-index,0)*var(--refineui-motion-duration-fast)*-1)]",
        "motion-reduce:animate-none",
        "caret-refineui-alias-foreground-primary hover:bg-refineui-alias-background-surface-active focus:border-refineui-alias-border-default",
        "disabled:cursor-not-allowed",
        "disabled:border-refineui-alias-border-disabled",
        "disabled:bg-refineui-alias-background-surface-disabled",
        "disabled:text-refineui-alias-foreground-disabled",
    ),
} as const;

export const inputOtpSlotSizeClass: Record<FormControlSize, string> = {
    sm: "size-refineui-control-height-sm rounded-refineui-large p-0 [font-family:var(--refineui-typography-sub-title-1-font-family)] text-[length:var(--refineui-typography-sub-title-1-font-size)] font-[var(--refineui-typography-sub-title-1-font-weight)] leading-[var(--refineui-typography-sub-title-1-line-height)]",
    md: "size-refineui-control-height-md rounded-refineui-x-large p-0 [font-family:var(--refineui-typography-title-3-font-family)] text-[length:var(--refineui-typography-title-3-font-size)] font-[var(--refineui-typography-title-3-font-weight)] leading-[var(--refineui-typography-title-3-line-height)]",
    lg: "size-refineui-control-height-lg rounded-refineui-xx-large p-0 [font-family:var(--refineui-typography-title-2-font-family)] text-[length:var(--refineui-typography-title-2-font-size)] font-[var(--refineui-typography-title-2-font-weight)] leading-[var(--refineui-typography-title-2-line-height)]",
};
