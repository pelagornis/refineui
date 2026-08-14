import { clsx } from "clsx";
import type { FormControlSize } from "../../formControlSizes";

/**
 * InputOTP — independent soft square `<input>` cells with gap. No merged shell.
 * Digit typography lives in `refineui.css` (`[data-size]` → Foundation title scale).
 */
export const inputOtpStyles = {
    /** Row of separate cells. */
    root: "relative box-border inline-flex items-center gap-refineui-size-small outline-none",
    slot: clsx(
        "box-border appearance-none outline-none",
        "inline-flex shrink-0 cursor-text items-center justify-center",
        "border-refineui-thin border-transparent",
        // Soft grey tile (not white) so cells read on light preview / page.
        "bg-refineui-alias-background-surface-selected",
        "text-center tabular-nums",
        "text-refineui-alias-foreground-primary",
        "transition-[background-color,border-color]",
        "duration-[var(--refineui-motion-duration-fast)]",
        "ease-[var(--refineui-motion-easing-emphasized)]",
        "disabled:cursor-not-allowed",
        "disabled:border-refineui-alias-border-disabled",
        "disabled:bg-refineui-alias-background-surface-disabled",
        "disabled:text-refineui-alias-foreground-disabled",
    ),
} as const;

export const inputOtpSlotSizeClass: Record<FormControlSize, string> = {
    sm: "size-refineui-control-height-sm rounded-refineui-large p-0",
    md: "size-refineui-control-height-md rounded-refineui-x-large p-0",
    lg: "size-refineui-control-height-lg rounded-refineui-xx-large p-0",
};
