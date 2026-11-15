import { clsx } from "clsx";
import { useEffect, useState } from "react";

/**
 * Sliding hover highlight — the Command list's moving plate, generalised for item lists.
 *
 * One absolutely positioned plate per host glides between the hovered (or keyboard-focused,
 * or `activeSelector`-marked) items instead of each item painting its own hover fill.
 * - SSR / before mount: the plate is hidden and items keep their own `:hover` fill; the host
 *   only gets `data-sliding-highlight="true"` (set imperatively) after mount, which is what
 *   hosts key their per-item hover suppression on — so nothing shifts or flashes on hydration.
 * - Appearing snaps to the item and fades in; moving to another item glides (transform +
 *   size); re-measuring the same item (resize, late layout) snaps; leaving fades out in place.
 *   `prefers-reduced-motion` drops all transitions.
 * - Geometry and state are written straight to the plate (no React state), batched to one
 *   read + one write per animation frame, so hover never re-renders the host's item list.
 * - Geometry is in the host's content coordinates (scroll offset included, ancestor scale
 *   removed), so inside a scroll container the plate scrolls with the items natively; the
 *   item under a stationary pointer is re-hit-tested on scroll.
 * - The plate must be a direct child of the host, and the host must be `relative isolate`
 *   (the plate sits at `z-index: -1` above the host's own fill, below its items).
 */

function isDisabledItem(el: Element): boolean {
    return (
        el.matches(":disabled") ||
        el.getAttribute("aria-disabled") === "true" ||
        (el.hasAttribute("data-disabled") && el.getAttribute("data-disabled") !== "false")
    );
}

export type SlidingHighlightOptions = {
    /** Items the plate can rest on (closest match of the event target inside the host). */
    itemSelector: string;
    /**
     * Item the component already marks as highlighted (e.g. Select's `[data-highlighted]`).
     * Watched with a MutationObserver; hover still wins over it.
     */
    activeSelector?: string;
    /** Attributes to watch for `activeSelector` changes. */
    activeAttributes?: string[];
};

export type SlidingHighlight<T extends HTMLElement> = {
    /** Callback ref for the host (works for hosts that mount later, e.g. portalled panels). */
    hostRef: (node: T | null) => void;
    /** Spread on the plate element (render it as the host's first child). */
    indicatorProps: {
        ref: (node: HTMLElement | null) => void;
        "aria-hidden": true;
    };
};

/** Retargets within this long after a scroll event snap instead of gliding. */
const SCROLL_SNAP_MS = 120;

type Geometry = { x: number; y: number; w: number; h: number };

export function useSlidingHighlight<T extends HTMLElement = HTMLElement>({
    itemSelector,
    activeSelector,
    activeAttributes,
}: SlidingHighlightOptions): SlidingHighlight<T> {
    const [host, setHost] = useState<T | null>(null);
    const [plate, setPlate] = useState<HTMLElement | null>(null);
    const attrsKey = activeAttributes?.join(",") ?? "";

    useEffect(() => {
        if (!host || !plate) return;
        // Set imperatively (not via props) so it also works when the host is an inner element,
        // e.g. a ScrollArea viewport, and is never part of the server HTML.
        host.setAttribute("data-sliding-highlight", "true");

        let hovered: HTMLElement | null = null;
        let focused: HTMLElement | null = null;
        let shown: HTMLElement | null = null;
        let geometry: Geometry | null = null;
        let pointer: { x: number; y: number } | null = null;
        let frame = 0;
        // While the list scrolls, retargets (a new item under the still pointer) snap: gliding
        // there would trail behind the scrolling content.
        let lastScroll = -Infinity;
        // Focus moving item → item fires focusout then focusin; defer the "lost focus" update
        // so keyboard steps glide instead of hiding and snapping.
        let focusOutFrame = 0;

        const itemFrom = (target: EventTarget | null): HTMLElement | null => {
            if (!(target instanceof Element)) return null;
            const item = target.closest<HTMLElement>(itemSelector);
            if (!item || !host.contains(item) || isDisabledItem(item)) return null;
            return item;
        };

        const currentTarget = (): HTMLElement | null => {
            if (hovered?.isConnected) return hovered;
            if (activeSelector) {
                const active = host.querySelector<HTMLElement>(activeSelector);
                if (active) return active;
            }
            if (focused?.isConnected) return focused;
            return null;
        };

        const hide = () => {
            if (!shown) return;
            shown = null;
            // Fade out in place: keep the last geometry, drop the glide.
            plate.removeAttribute("data-glide");
            plate.removeAttribute("data-ready");
        };

        const update = () => {
            frame = 0;
            const target = currentTarget();
            if (!target || target.getClientRects().length === 0) {
                hide();
                return;
            }
            const hostRect = host.getBoundingClientRect();
            const rect = target.getBoundingClientRect();
            // Undo ancestor scale (e.g. a dialog's enter animation) so geometry is in CSS px.
            const scaleX = host.offsetWidth ? hostRect.width / host.offsetWidth : 1;
            const scaleY = host.offsetHeight ? hostRect.height / host.offsetHeight : 1;
            const next: Geometry = {
                x: (rect.left - hostRect.left) / (scaleX || 1) - host.clientLeft + host.scrollLeft,
                y: (rect.top - hostRect.top) / (scaleY || 1) - host.clientTop + host.scrollTop,
                w: rect.width / (scaleX || 1),
                h: rect.height / (scaleY || 1),
            };
            const moved =
                !geometry ||
                Math.abs(next.x - geometry.x) > 0.25 ||
                Math.abs(next.y - geometry.y) > 0.25 ||
                Math.abs(next.w - geometry.w) > 0.25 ||
                Math.abs(next.h - geometry.h) > 0.25;
            const wasShown = shown !== null;
            const retarget = shown !== target;
            shown = target;
            // Same item, same box: leave any running glide alone.
            if (!retarget && !moved) return;
            // Glide only between two different visible items; appearing or a same-item
            // re-measure (resize, late layout) snaps.
            const scrolling = performance.now() - lastScroll < SCROLL_SNAP_MS;
            const glide = wasShown && retarget && !scrolling;
            if (glide) plate.setAttribute("data-glide", "true");
            else plate.removeAttribute("data-glide");
            if (moved) {
                geometry = next;
                plate.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
                plate.style.width = `${next.w}px`;
                plate.style.height = `${next.h}px`;
            }
            if (!wasShown) plate.setAttribute("data-ready", "true");
        };

        /** Observer-driven updates: one layout read + write per frame, however many arrive. */
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        /** Pointer / focus retargets start the glide in the same frame (no extra frame of lag). */
        const updateNow = () => {
            cancelAnimationFrame(frame);
            update();
        };

        const onPointerOver = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            const item = itemFrom(event.target);
            // Gaps between items keep the last item so the plate doesn't flicker out.
            if (item && item !== hovered) {
                hovered = item;
                updateNow();
            }
        };
        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            pointer = { x: event.clientX, y: event.clientY };
        };
        const onPointerLeave = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            hovered = null;
            pointer = null;
            schedule();
        };
        const onFocusIn = (event: FocusEvent) => {
            cancelAnimationFrame(focusOutFrame);
            const item = itemFrom(event.target);
            const visible = event.target instanceof Element && event.target.matches(":focus-visible");
            focused = item && visible ? item : null;
            if (focused) hovered = null;
            updateNow();
        };
        const onFocusOut = () => {
            focused = null;
            cancelAnimationFrame(focusOutFrame);
            focusOutFrame = requestAnimationFrame(schedule);
        };
        /** Content scrolling under a still pointer changes the hovered item. */
        const onScroll = (event: Event) => {
            if (!pointer) return;
            const scroller = event.target;
            if (scroller instanceof Node && scroller !== host && !scroller.contains(host)) return;
            lastScroll = performance.now();
            const item = itemFrom(document.elementFromPoint(pointer.x, pointer.y));
            if (item && item !== hovered) {
                hovered = item;
                schedule();
            }
        };

        // A wheel gesture precedes its scroll events (and the browser's post-scroll pointerover).
        const onWheel = () => {
            lastScroll = performance.now();
        };

        host.addEventListener("pointerover", onPointerOver);
        host.addEventListener("wheel", onWheel, { passive: true });
        host.addEventListener("pointermove", onPointerMove, { passive: true });
        host.addEventListener("pointerleave", onPointerLeave);
        host.addEventListener("focusin", onFocusIn);
        host.addEventListener("focusout", onFocusOut);
        document.addEventListener("scroll", onScroll, { capture: true, passive: true });

        const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
        resizeObserver?.observe(host);

        const mutationObserver =
            activeSelector && typeof MutationObserver !== "undefined" ? new MutationObserver(schedule) : null;
        mutationObserver?.observe(host, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: attrsKey ? attrsKey.split(",") : undefined,
        });
        if (activeSelector) schedule();

        return () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(focusOutFrame);
            host.removeEventListener("pointerover", onPointerOver);
            host.removeEventListener("wheel", onWheel);
            host.removeEventListener("pointermove", onPointerMove);
            host.removeEventListener("pointerleave", onPointerLeave);
            host.removeEventListener("focusin", onFocusIn);
            host.removeEventListener("focusout", onFocusOut);
            document.removeEventListener("scroll", onScroll, { capture: true });
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
            host.removeAttribute("data-sliding-highlight");
            plate.removeAttribute("data-ready");
            plate.removeAttribute("data-glide");
        };
    }, [host, plate, itemSelector, activeSelector, attrsKey]);

    return {
        hostRef: setHost,
        indicatorProps: { ref: setPlate, "aria-hidden": true },
    };
}

/**
 * Plate base — same motion tokens as the Command indicator (`duration-medium` 200ms,
 * `easing-emphasized` expo-out: fast start, no overshoot). Position is a compositor-only
 * `transform`; size eases alongside it. Pair with a fill + radius per host.
 */
export const slidingHighlightClass = clsx(
    "pointer-events-none absolute top-0 left-0 z-[-1] opacity-0",
    "transition-[opacity] duration-[var(--refineui-motion-duration-medium)] ease-[var(--refineui-motion-easing-emphasized)]",
    "data-[ready=true]:opacity-100 data-[ready=true]:will-change-[transform,opacity]",
    "data-[glide=true]:transition-[transform,width,height,opacity]",
    "motion-reduce:!transition-none",
);
