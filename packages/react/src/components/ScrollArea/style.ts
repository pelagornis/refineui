import { clsx } from "clsx";
import { spacings } from "@refineui/tokens";
import type { ScrollAreaOrientation } from "./types";

/** Minimum thumb length — spacing `sizeXLarge`. */
export const SCROLL_AREA_THUMB_MIN_PX = Number.parseFloat(spacings.sizeXLarge);

/**
 * Share of the viewport over which edge rows blur — keep in sync with the 25% / 75% `cover`
 * stops of `refineui-scroll-edge-falloff` in refineui.css. Also the scroll distance over which
 * an edge's factor ramps from 0 (nothing hidden past it) to 1.
 */
export const SCROLL_EDGE_FALLOFF_RATIO = 0.25;

/**
 * ScrollArea — overlay scrollbar over the viewport (no layout shift).
 * Placement / visibility live in `refineui.css`.
 */
export const scrollAreaStyles = {
    root: "relative box-border min-h-0 min-w-0 overflow-hidden outline-none",

    /**
     * Overflow and scroll chaining are per axis: an axis only becomes scrollable
     * when its scrollbar is declared, so a horizontal-only area lets vertical
     * wheel gestures chain to the page instead of swallowing them.
     */
    viewport: clsx(
        "size-full min-h-0 min-w-0 rounded-[inherit]",
        "overflow-hidden",
        "outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "data-[overflow-x=true]:overflow-x-auto data-[overflow-x=true]:overscroll-x-contain",
        "data-[overflow-y=true]:overflow-y-auto data-[overflow-y=true]:overscroll-y-contain",
    ),

    scrollbar: clsx(
        "z-refineui-content box-border touch-none select-none",
        "transition-opacity duration-[var(--refineui-motion-duration-normal)]",
        "ease-[var(--refineui-motion-easing-ease-out)]",
        "data-[state=hidden]:pointer-events-none data-[state=hidden]:opacity-0",
        "data-[visibility=always]:data-[state=visible]:opacity-100",
        "data-[visibility=hover]:data-[state=visible]:pointer-events-none data-[visibility=hover]:data-[state=visible]:opacity-0",
        "data-[visibility=scroll]:data-[state=visible]:pointer-events-none data-[visibility=scroll]:data-[state=visible]:opacity-0",
        "data-[active=true]:!pointer-events-auto data-[active=true]:!opacity-100",
    ),

    scrollbarVertical: "absolute inset-y-refineui-size-xxx-small end-refineui-size-xxx-small w-refineui-size-medium overflow-hidden",
    scrollbarHorizontal: "absolute inset-x-refineui-size-xxx-small bottom-refineui-size-xxx-small h-refineui-size-medium overflow-hidden",

    /** Inner rail — thumb is absolutely positioned here (padding lives on the outer scrollbar). */
    track: "relative size-full min-h-0 min-w-0 overflow-hidden rounded-refineui-circle bg-refineui-alias-background-surface-selected",

    thumb: clsx(
        "absolute rounded-refineui-circle",
        "bg-refineui-alias-border-strong",
        "transition-[background-color] duration-[var(--refineui-motion-duration-fast)]",
        "ease-[var(--refineui-motion-easing-ease-out)]",
        "hover:bg-refineui-alias-foreground-secondary",
        "data-[dragging=true]:bg-refineui-alias-foreground-secondary data-[orientation=vertical]:start-0 data-[orientation=vertical]:w-full data-[orientation=horizontal]:top-0 data-[orientation=horizontal]:h-full",
    ),
} as const;

export const scrollAreaScrollbarOrientationClass: Record<ScrollAreaOrientation, string> = {
    vertical: scrollAreaStyles.scrollbarVertical,
    horizontal: scrollAreaStyles.scrollbarHorizontal,
};
