import { clsx } from "clsx";
import type { MarkerVariant } from "./types";

export const markerStyles = {
    root: clsx(
        "flex min-w-0 items-center gap-refineui-size-small text-refineui-alias-foreground-tertiary",
        // Status text uses the same paced, reduced-motion-safe pulse as empty Input OTP slots.
        "[&[role=status]_[data-refineui=marker-content]]:animate-pulse",
        "[&[role=status]_[data-refineui=marker-content]]:[animation-duration:var(--refineui-motion-duration-skeleton)]",
        "[&[role=status]_[data-refineui=marker-content]]:[animation-timing-function:var(--refineui-motion-easing-ease-in-out)]",
        "motion-reduce:[&[role=status]_[data-refineui=marker-content]]:animate-none",
    ),
    icon: "inline-flex shrink-0 items-center justify-center text-refineui-alias-foreground-secondary",
    content: clsx("refineui-typo-caption-1", "min-w-0"),
    dividerContent: clsx(
        "flex min-w-0 flex-1 items-center gap-refineui-size-medium whitespace-nowrap",
        "before:h-(--refineui-stroke-width-thin) before:min-w-0 before:flex-1 before:bg-refineui-alias-border-default",
        "after:h-(--refineui-stroke-width-thin) after:min-w-0 after:flex-1 after:bg-refineui-alias-border-default",
    ),
} as const;

export const markerContentVariantClass: Record<MarkerVariant, string> = {
    default: markerStyles.content,
    divider: markerStyles.dividerContent,
};
