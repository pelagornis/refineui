import { clsx } from "clsx";

/**
 * Resizable — accessible panel group + separator handle.
 * Hit target stays generous; withHandle draws a short center bar only.
 * Focus matches hover (no separate focus color / ring).
 */
export const resizableStyles = {
    group: "box-border flex h-full w-full min-h-0 min-w-0 overflow-hidden outline-none",
    groupHorizontal: "flex-row",
    groupVertical: "flex-col",

    panel: "box-border min-h-0 min-w-0 overflow-hidden outline-none",

    handle: clsx(
        "relative z-[1] box-border shrink-0",
        "bg-transparent outline-none",
        "transition-colors duration-[var(--refineui-motion-duration-fast)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    ),
    /** Hit area only — no full-length rule when showing the center bar. */
    handleHorizontal: "h-full w-[var(--refineui-size-foundation-size-120)] cursor-col-resize",
    handleVertical: "h-[var(--refineui-size-foundation-size-120)] w-full cursor-row-resize",

    /**
     * Center bar affordance (`withHandle`).
     * Horizontal group → vertical bar; vertical group → horizontal bar.
     */
    grip: clsx(
        "pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2",
        "rounded-refineui-circle bg-refineui-alias-border-default",
        "transition-colors duration-[var(--refineui-motion-duration-fast)]",
        "group-hover/handle:bg-refineui-alias-border-strong",
        "group-focus/handle:bg-refineui-alias-border-strong",
        "group-data-[active]/handle:bg-refineui-alias-border-strong",
    ),
    gripHorizontal:
        "h-[var(--refineui-size-foundation-size-320)] w-[var(--refineui-size-foundation-size-40)]",
    gripVertical:
        "h-[var(--refineui-size-foundation-size-40)] w-[var(--refineui-size-foundation-size-320)]",
} as const;
