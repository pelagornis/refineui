import { clsx } from "clsx";
import type {
    CSSProperties,
    MutableRefObject,
    PointerEvent as ReactPointerEvent,
    RefObject,
} from "react";
import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { spacings } from "@refineui/tokens";
import { useComposedRefs } from "@refineui/utilities/react";
import {
    SCROLL_AREA_THUMB_MIN_PX,
    SCROLL_EDGE_FALLOFF_RATIO,
    scrollAreaScrollbarOrientationClass,
    scrollAreaStyles,
} from "./style";
import type {
    ScrollAreaOrientation,
    ScrollAreaProps,
    ScrollAreaScrollbarProps,
    ScrollAreaThumbProps,
    ScrollAreaType,
    ScrollAreaViewportProps,
} from "./types";

const SCROLL_HIDE_DELAY_MS = 600;

type ScrollAxisMetrics = {
    scrollSize: number;
    clientSize: number;
    scrollOffset: number;
};

/** Which axes declared a scrollbar — drives viewport overflow per axis. */
type ScrollAreaAxes = Record<ScrollAreaOrientation, boolean>;

type ScrollAreaContextValue = {
    type: ScrollAreaType;
    viewportRef: MutableRefObject<HTMLDivElement | null>;
    setViewportNode: (node: HTMLDivElement | null) => void;
    axes: ScrollAreaAxes;
    setAxisEnabled: (orientation: ScrollAreaOrientation, enabled: boolean) => void;
    vertical: ScrollAxisMetrics;
    horizontal: ScrollAxisMetrics;
    scrolling: boolean;
    hovering: boolean;
    setHovering: (active: boolean) => void;
    focused: boolean;
    setFocused: (active: boolean) => void;
    interacting: boolean;
    setInteracting: (active: boolean) => void;
};

type ScrollbarContextValue = {
    orientation: ScrollAreaOrientation;
    metrics: ScrollAxisMetrics;
    trackRef: RefObject<HTMLDivElement | null>;
};

const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null);
const ScrollbarContext = createContext<ScrollbarContextValue | null>(null);

function useScrollAreaContext(component: string): ScrollAreaContextValue {
    const value = useContext(ScrollAreaContext);
    if (!value) throw new Error(`${component} must be used within ScrollArea.`);
    return value;
}

function useScrollbarContext(component: string): ScrollbarContextValue {
    const value = useContext(ScrollbarContext);
    if (!value) throw new Error(`${component} must be used within ScrollAreaScrollbar.`);
    return value;
}

const EMPTY_METRICS: ScrollAxisMetrics = {
    scrollSize: 0,
    clientSize: 0,
    scrollOffset: 0,
};

const NO_AXES: ScrollAreaAxes = { vertical: false, horizontal: false };

/** Ignore sub-layout overflow before showing an indicator or enabling keyboard scrolling. */
const SCROLL_AREA_OVERFLOW_THRESHOLD_PX = Number.parseFloat(spacings.sizeXXSmall);

function readMetrics(viewport: HTMLDivElement): {
    vertical: ScrollAxisMetrics;
    horizontal: ScrollAxisMetrics;
} {
    return {
        vertical: {
            scrollSize: viewport.scrollHeight,
            clientSize: viewport.clientHeight,
            scrollOffset: viewport.scrollTop,
        },
        horizontal: {
            scrollSize: viewport.scrollWidth,
            clientSize: viewport.clientWidth,
            scrollOffset: viewport.scrollLeft,
        },
    };
}

function isScrollable(metrics: ScrollAxisMetrics): boolean {
    return metrics.scrollSize > metrics.clientSize + SCROLL_AREA_OVERFLOW_THRESHOLD_PX;
}

/**
 * 0 when nothing is hidden past an edge, ramping to 1 over the falloff zone — so rows only
 * blur toward an edge that actually hides content, and the blur fades in as you scroll away.
 */
function resolveEdgeFactors(metrics: ScrollAxisMetrics): { top: number; bottom: number } {
    const zone = metrics.clientSize * SCROLL_EDGE_FALLOFF_RATIO;
    if (!isScrollable(metrics) || zone <= 0) return { top: 0, bottom: 0 };
    const hiddenBelow = metrics.scrollSize - metrics.clientSize - metrics.scrollOffset;
    return {
        top: Math.min(1, Math.max(0, metrics.scrollOffset / zone)),
        bottom: Math.min(1, Math.max(0, hiddenBelow / zone)),
    };
}

/**
 * Thumb size + offset in px against a full-height (100%) rail.
 * offset maps scrollOffset ∈ [0, maxScroll] → [0, trackSize − thumbSize].
 */
function resolveThumbGeometry(
    metrics: ScrollAxisMetrics,
    trackSize: number,
    minThumb: number,
): { thumbSize: number; offset: number } {
    if (trackSize <= 0 || metrics.scrollSize <= 0) {
        return { thumbSize: 0, offset: 0 };
    }

    const maxScroll = Math.max(metrics.scrollSize - metrics.clientSize, 0);
    if (maxScroll <= 0) {
        return { thumbSize: trackSize, offset: 0 };
    }

    const ideal = (metrics.clientSize / metrics.scrollSize) * trackSize;
    const thumbSize = Math.min(trackSize, Math.max(ideal, minThumb));
    const maxOffset = Math.max(trackSize - thumbSize, 0);
    const offset = (metrics.scrollOffset / maxScroll) * maxOffset;

    return { thumbSize, offset };
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
    {
        type = "hover",
        className,
        children,
        ...props
    },
    ref,
) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const composedRootRef = useComposedRefs(rootRef, ref);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [viewportEpoch, setViewportEpoch] = useState(0);
    const [vertical, setVertical] = useState<ScrollAxisMetrics>(EMPTY_METRICS);
    const [horizontal, setHorizontal] = useState<ScrollAxisMetrics>(EMPTY_METRICS);
    const [scrolling, setScrolling] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [focused, setFocused] = useState(false);
    const [interacting, setInteracting] = useState(false);
    const [axes, setAxes] = useState<ScrollAreaAxes>(NO_AXES);
    const hideTimerRef = useRef<number | null>(null);

    const setViewportNode = useCallback((node: HTMLDivElement | null) => {
        if (viewportRef.current === node) return;
        viewportRef.current = node;
        setViewportEpoch((n) => n + 1);
    }, []);

    const setAxisEnabled = useCallback(
        (orientation: ScrollAreaOrientation, enabled: boolean) => {
            setAxes((prev) =>
                prev[orientation] === enabled ? prev : { ...prev, [orientation]: enabled },
            );
        },
        [],
    );

    const sync = useCallback(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const next = readMetrics(viewport);
        setVertical(next.vertical);
        setHorizontal(next.horizontal);
        // Written straight to the root (not state) so every scroll frame updates without a re-render.
        const root = rootRef.current;
        if (root) {
            const edges = resolveEdgeFactors(next.vertical);
            root.style.setProperty("--refineui-scroll-edge-top", String(edges.top));
            root.style.setProperty("--refineui-scroll-edge-bottom", String(edges.bottom));
        }
    }, []);

    const markScrolling = useCallback(() => {
        setScrolling(true);
        if (hideTimerRef.current != null) window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = window.setTimeout(() => {
            setScrolling(false);
            hideTimerRef.current = null;
        }, SCROLL_HIDE_DELAY_MS);
    }, []);

    useLayoutEffect(() => {
        sync();
    }, [sync, axes, viewportEpoch]);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const onScroll = () => {
            sync();
            markScrolling();
        };

        viewport.addEventListener("scroll", onScroll, { passive: true });

        const resizeObserver = new ResizeObserver(() => sync());
        resizeObserver.observe(viewport);
        for (const child of Array.from(viewport.children)) {
            resizeObserver.observe(child);
        }

        const mutationObserver = new MutationObserver(() => sync());
        mutationObserver.observe(viewport, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        sync();

        return () => {
            viewport.removeEventListener("scroll", onScroll);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            if (hideTimerRef.current != null) window.clearTimeout(hideTimerRef.current);
        };
    }, [sync, markScrolling, viewportEpoch]);

    /**
     * A parent scroll can move this region away from a stationary pointer without
     * dispatching `pointerleave` on the viewport. Clear its hover state in that
     * case so a nested ScrollArea never leaves its indicator visible in a docs
     * preview after the reading pane has scrolled.
     */
    useEffect(() => {
        if (!hovering) return;

        const clearHoverAfterAncestorScroll = (event: Event) => {
            if (event.target !== viewportRef.current) setHovering(false);
        };

        window.addEventListener("scroll", clearHoverAfterAncestorScroll, true);
        return () => window.removeEventListener("scroll", clearHoverAfterAncestorScroll, true);
    }, [hovering]);

    const ctx = useMemo<ScrollAreaContextValue>(
        () => ({
            type,
            viewportRef,
            setViewportNode,
            axes,
            setAxisEnabled,
            vertical,
            horizontal,
            scrolling,
            hovering,
            setHovering,
            focused,
            setFocused,
            interacting,
            setInteracting,
        }),
        [
            type,
            setViewportNode,
            axes,
            setAxisEnabled,
            vertical,
            horizontal,
            scrolling,
            hovering,
            focused,
            interacting,
        ],
    );

    return (
        <ScrollAreaContext.Provider value={ctx}>
            <div
                ref={composedRootRef}
                data-refineui="scroll-area"
                data-type={type}
                data-scrolling={scrolling || undefined}
                data-hovering={hovering || undefined}
                data-interacting={interacting || undefined}
                className={clsx(scrollAreaStyles.root, className)}
                {...props}
            >
                {children}
            </div>
        </ScrollAreaContext.Provider>
    );
});

export const ScrollAreaViewport = forwardRef<HTMLDivElement, ScrollAreaViewportProps>(
    function ScrollAreaViewport(
        { className, children, onPointerEnter, onPointerLeave, onFocus, onBlur, ...props },
        forwardedRef,
    ) {
        const { setViewportNode, axes, vertical, horizontal, setHovering, setFocused } =
            useScrollAreaContext("ScrollAreaViewport");
        const composedRef = useComposedRefs(setViewportNode, forwardedRef);
        /** Keyboard scrolling needs a tab stop only while content actually overflows. */
        const scrollable = isScrollable(vertical) || isScrollable(horizontal);

        return (
            <div
                ref={composedRef}
                data-refineui="scroll-area-viewport"
                data-overflow-x={axes.horizontal ? "true" : undefined}
                data-overflow-y={axes.vertical ? "true" : undefined}
                tabIndex={scrollable ? 0 : undefined}
                className={clsx(scrollAreaStyles.viewport, className)}
                onPointerEnter={(event) => {
                    onPointerEnter?.(event);
                    setHovering(true);
                }}
                onPointerLeave={(event) => {
                    onPointerLeave?.(event);
                    setHovering(false);
                }}
                onFocus={(event) => {
                    onFocus?.(event);
                    setFocused(true);
                }}
                onBlur={(event) => {
                    onBlur?.(event);
                    const next = event.relatedTarget;
                    if (!next || !event.currentTarget.contains(next as Node)) setFocused(false);
                }}
                {...props}
            >
                {children}
            </div>
        );
    },
);

export function ScrollAreaScrollbar({
    orientation = "vertical",
    className,
    children,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    ...props
}: ScrollAreaScrollbarProps) {
    const {
        type,
        viewportRef,
        setAxisEnabled,
        vertical,
        horizontal,
        scrolling,
        hovering,
        focused,
        interacting,
        setHovering,
    } = useScrollAreaContext("ScrollAreaScrollbar");
    const trackRef = useRef<HTMLDivElement>(null);
    const metrics = orientation === "vertical" ? vertical : horizontal;
    const visible = isScrollable(metrics);
    const active =
        type === "hover"
            ? hovering || focused || scrolling || interacting
            : type === "scroll"
              ? focused || scrolling || interacting
              : false;

    useLayoutEffect(() => {
        setAxisEnabled(orientation, true);
        return () => setAxisEnabled(orientation, false);
    }, [orientation, setAxisEnabled]);

    const scrollbarCtx = useMemo<ScrollbarContextValue>(
        () => ({ orientation, metrics, trackRef }),
        [orientation, metrics],
    );

    const onTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || !visible) return;
        if ((event.target as HTMLElement).closest('[data-refineui="scroll-area-thumb"]')) {
            return;
        }

        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return;

        const trackSize =
            orientation === "vertical" ? track.clientHeight : track.clientWidth;
        const rect = track.getBoundingClientRect();
        const clickPos =
            orientation === "vertical" ? event.clientY - rect.top : event.clientX - rect.left;
        const { thumbSize } = resolveThumbGeometry(
            metrics,
            trackSize,
            SCROLL_AREA_THUMB_MIN_PX,
        );
        const maxThumbOffset = Math.max(trackSize - thumbSize, 0);
        const nextThumbOffset = Math.min(
            Math.max(clickPos - thumbSize / 2, 0),
            maxThumbOffset,
        );
        const maxScroll = metrics.scrollSize - metrics.clientSize;
        const nextScroll =
            maxThumbOffset === 0 ? 0 : (nextThumbOffset / maxThumbOffset) * maxScroll;

        if (orientation === "vertical") viewport.scrollTop = nextScroll;
        else viewport.scrollLeft = nextScroll;
    };

    return (
        <ScrollbarContext.Provider value={scrollbarCtx}>
            <div
                data-refineui="scroll-area-scrollbar"
                data-orientation={orientation}
                data-state={visible ? "visible" : "hidden"}
                data-visibility={type}
                data-active={active || undefined}
                className={clsx(
                    scrollAreaStyles.scrollbar,
                    scrollAreaScrollbarOrientationClass[orientation],
                    className,
                )}
                onPointerDown={onTrackPointerDown}
                onPointerEnter={(event) => {
                    onPointerEnter?.(event);
                    setHovering(true);
                }}
                onPointerLeave={(event) => {
                    onPointerLeave?.(event);
                    setHovering(false);
                }}
                {...props}
                hidden={!visible}
                aria-hidden={!visible || undefined}
            >
                <div
                    ref={trackRef as RefObject<HTMLDivElement>}
                    data-refineui="scroll-area-track"
                    className={scrollAreaStyles.track}
                >
                    {children}
                </div>
            </div>
        </ScrollbarContext.Provider>
    );
}

export function ScrollAreaThumb({ className, style, ...props }: ScrollAreaThumbProps) {
    const { viewportRef, setInteracting } = useScrollAreaContext("ScrollAreaThumb");
    const { orientation, metrics, trackRef } = useScrollbarContext("ScrollAreaThumb");
    const [dragging, setDragging] = useState(false);
    const [trackSize, setTrackSize] = useState(0);
    const dragRef = useRef<{
        pointerId: number;
        startPos: number;
        startScroll: number;
        trackSize: number;
        thumbSize: number;
    } | null>(null);

    useLayoutEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const measure = () => {
            setTrackSize(
                orientation === "vertical" ? track.clientHeight : track.clientWidth,
            );
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(track);
        return () => observer.disconnect();
    }, [orientation, trackRef, metrics.scrollSize, metrics.clientSize]);

    const { thumbSize, offset } = resolveThumbGeometry(
        metrics,
        trackSize,
        SCROLL_AREA_THUMB_MIN_PX,
    );

    const thumbStyle: CSSProperties =
        orientation === "vertical"
            ? {
                  top: offset,
                  height: thumbSize > 0 ? thumbSize : undefined,
                  ...style,
              }
            : {
                  left: offset,
                  width: thumbSize > 0 ? thumbSize : undefined,
                  ...style,
              };

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track || event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);

        const size = orientation === "vertical" ? track.clientHeight : track.clientWidth;
        const live: ScrollAxisMetrics =
            orientation === "vertical"
                ? {
                      scrollSize: viewport.scrollHeight,
                      clientSize: viewport.clientHeight,
                      scrollOffset: viewport.scrollTop,
                  }
                : {
                      scrollSize: viewport.scrollWidth,
                      clientSize: viewport.clientWidth,
                      scrollOffset: viewport.scrollLeft,
                  };
        const { thumbSize: sizeAtDrag } = resolveThumbGeometry(
            live,
            size,
            SCROLL_AREA_THUMB_MIN_PX,
        );

        dragRef.current = {
            pointerId: event.pointerId,
            startPos: orientation === "vertical" ? event.clientY : event.clientX,
            startScroll: live.scrollOffset,
            trackSize: size,
            thumbSize: sizeAtDrag,
        };
        setDragging(true);
        setInteracting(true);
    };

    const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        const viewport = viewportRef.current;
        if (!drag || !viewport || drag.pointerId !== event.pointerId) return;

        const maxThumbOffset = Math.max(drag.trackSize - drag.thumbSize, 0);
        const maxScroll =
            orientation === "vertical"
                ? Math.max(viewport.scrollHeight - viewport.clientHeight, 0)
                : Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
        if (maxThumbOffset <= 0 || maxScroll <= 0) return;

        const pos = orientation === "vertical" ? event.clientY : event.clientX;
        const delta = pos - drag.startPos;
        const nextScroll = drag.startScroll + (delta / maxThumbOffset) * maxScroll;
        if (orientation === "vertical") viewport.scrollTop = nextScroll;
        else viewport.scrollLeft = nextScroll;
    };

    const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.pointerId !== event.pointerId) return;
        dragRef.current = null;
        setDragging(false);
        setInteracting(false);
        try {
            event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
            /* already released */
        }
    };

    return (
        <div
            data-refineui="scroll-area-thumb"
            data-orientation={orientation}
            data-dragging={dragging || undefined}
            className={clsx(scrollAreaStyles.thumb, className)}
            style={thumbStyle}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            {...props}
        />
    );
}
