import { clsx } from "clsx";
import { spacings } from "@refineui/tokens";
import type { ScrollAreaOrientation } from "./types";

/** Minimum thumb length — spacing `sizeXLarge`. */
export const SCROLL_AREA_THUMB_MIN_PX = Number.parseFloat(spacings.sizeXLarge);

/**
 * ScrollArea — overlay scrollbar over the viewport (no layout shift).
 * Placement / visibility live in `refineui.css`.
 */
export const scrollAreaStyles = {
    root: "box-border min-h-0 min-w-0 overflow-hidden outline-none",

    /**
     * Overflow and scroll chaining are per axis: an axis only becomes scrollable
     * when its scrollbar is declared, so a horizontal-only area lets vertical
     * wheel gestures chain to the page instead of swallowing them.
     */
    viewport: clsx(
        "size-full min-h-0 min-w-0 rounded-[inherit]",
        "overflow-hidden",
        "outline-none",
        "data-[overflow-x=true]:overflow-x-auto data-[overflow-x=true]:overscroll-x-contain",
        "data-[overflow-y=true]:overflow-y-auto data-[overflow-y=true]:overscroll-y-contain",
    ),

    scrollbar: clsx(
        "z-refineui-content box-border touch-none select-none",
        "transition-opacity duration-[var(--refineui-motion-duration-fast)]",
        "ease-[var(--refineui-motion-easing-ease-out)]",
    ),

    scrollbarVertical: "",
    scrollbarHorizontal: "",

    /** Inner rail — thumb is absolutely positioned here (padding lives on the outer scrollbar). */
    track: "relative size-full min-h-0 min-w-0 overflow-hidden rounded-refineui-circle",

    thumb: clsx(
        "absolute rounded-refineui-circle",
        "bg-refineui-alias-border-strong",
        "transition-[background-color] duration-[var(--refineui-motion-duration-fast)]",
        "ease-[var(--refineui-motion-easing-ease-out)]",
        "hover:bg-refineui-alias-foreground-secondary",
        "data-[dragging=true]:bg-refineui-alias-foreground-secondary",
    ),
} as const;

export const scrollAreaScrollbarOrientationClass: Record<ScrollAreaOrientation, string> = {
    vertical: scrollAreaStyles.scrollbarVertical,
    horizontal: scrollAreaStyles.scrollbarHorizontal,
};
