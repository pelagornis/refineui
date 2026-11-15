import { clsx } from "clsx";
import { inputBorderClass, inputSizeClass, inputStyles } from "../Input/style";
import type { TimeInputProps } from "./types";

export const timeInputStyles = {
    trigger: (size: NonNullable<TimeInputProps["size"]>, error: boolean, success: boolean, disabled: boolean) =>
        clsx(
            inputStyles.base,
            inputStyles.text,
            "flex w-full cursor-pointer items-center justify-between gap-refineui-size-small text-start",
            inputSizeClass[size],
            disabled ? inputBorderClass.disabled : error ? inputBorderClass.error : success ? inputBorderClass.success : inputBorderClass.default,
            disabled ? inputStyles.disabledBg : inputStyles.defaultBg,
            disabled && inputStyles.disabledText,
        ),
    value: "min-w-0 flex-1 truncate",
    placeholder: "text-refineui-alias-foreground-placeholder",
    icon: "shrink-0 text-refineui-alias-foreground-secondary",
    panel: "flex flex-col gap-refineui-size-medium",
    /** Columns sit side by side over one shared selection band (Apple wheel picker). */
    wheel: "relative flex items-stretch justify-center gap-refineui-size-xx-small",
    selectionBand:
        "pointer-events-none absolute inset-x-0 top-1/2 h-refineui-foundation-size-320 -translate-y-1/2 rounded-refineui-large bg-refineui-alias-background-surface-hover",
    separator: "relative flex items-center refineui-typo-body-1 text-refineui-alias-foreground-primary",
    column: "relative flex w-refineui-foundation-size-800 min-w-0 flex-col",
    scrollArea: "h-refineui-time-input-wheel-height min-h-refineui-time-input-wheel-height max-h-refineui-time-input-wheel-height",
    /** Snap rows to the centre and fade them out toward both edges, like a physical wheel. */
    viewport: clsx(
        "flex flex-col snap-y snap-mandatory outline-none",
        "[mask-image:linear-gradient(to_bottom,transparent,black_35%,black_65%,transparent)]",
        "focus-visible:[&_[data-selected]]:text-refineui-alias-foreground-brand",
    ),
    scrollbar: "invisible",
    option: "flex h-refineui-foundation-size-320 min-h-refineui-foundation-size-320 w-full shrink-0 snap-center items-center justify-center border-none bg-transparent px-refineui-size-small refineui-typo-body-1 tabular-nums text-refineui-alias-foreground-secondary outline-none transition-[color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)] hover:text-refineui-alias-foreground-primary",
    optionSelected: "font-semibold text-refineui-alias-foreground-primary",
} as const;
