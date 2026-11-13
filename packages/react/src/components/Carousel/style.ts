import { clsx } from "clsx";

/**
 * Carousel — stage + footer controls (no overlay).
 * Infinite loop uses cloned slides; indicator is a sliding pill in a track.
 */
export const carouselStyles = {
    root: "box-border flex w-full flex-col gap-refineui-size-large outline-none focus-visible:outline-[length:var(--refineui-stroke-width-thick)] focus-visible:[outline-color:var(--refineui-focus-color)] focus-visible:[outline-offset:var(--refineui-focus-offset)]",
    viewport: clsx(
        "relative w-full cursor-grab overflow-hidden rounded-refineui-xx-large",
        "border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary",
        "shadow-refineui-2 select-none",
        "touch-pan-y active:cursor-grabbing data-[dragging=true]:cursor-grabbing",
    ),
    track: "flex will-change-transform",
    trackAnimated:
        "transition-transform duration-[var(--refineui-motion-duration-panel)] ease-[var(--refineui-motion-easing-emphasized)] motion-reduce:transition-none",
    navFocus: "focus-visible:outline-[length:var(--refineui-stroke-width-thick)] focus-visible:[outline-color:var(--refineui-focus-color)] focus-visible:[outline-offset:var(--refineui-focus-offset)]",
    item: "box-border min-w-0 shrink-0 grow-0 basis-full",
    controls: "flex w-full items-center justify-center gap-refineui-size-medium",
    /** Sliding-pill meter (SegmentedControl-like), not a row of dots */
    indicators: clsx(
        "relative box-border flex h-refineui-size-medium min-w-0 flex-1 items-stretch overflow-hidden",
        "max-w-[12rem] rounded-refineui-circle bg-refineui-alias-background-brand-subtle",
        "p-refineui-size-xxx-small",
    ),
    indicatorThumb: clsx(
        "pointer-events-none absolute top-refineui-size-xxx-small bottom-refineui-size-xxx-small start-refineui-size-xxx-small z-0",
        "rounded-refineui-circle bg-refineui-alias-background-brand shadow-refineui-2 transition-none data-[animate=true]:transition-[transform,width] data-[animate=true]:duration-[var(--refineui-motion-duration-medium)] data-[animate=true]:ease-[var(--refineui-motion-easing-emphasized)] motion-reduce:transition-none",
    ),
    indicatorHitRow: "relative z-[1] flex h-full w-full",
    indicatorHit: "h-full min-w-0 flex-1 cursor-pointer border-none bg-transparent p-0 outline-none focus-visible:outline-[length:var(--refineui-stroke-width-thick)] focus-visible:[outline-color:var(--refineui-focus-color)] focus-visible:[outline-offset:var(--refineui-focus-offset)]",
} as const;
