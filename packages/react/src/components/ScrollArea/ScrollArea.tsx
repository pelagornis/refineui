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
import { useComposedRefs } from "@refineui/utilities/react";
import {
    SCROLL_AREA_THUMB_MIN_PX,
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

type ScrollAreaContextValue = {
    type: ScrollAreaType;
    viewportRef: MutableRefObject<HTMLDivElement | null>;
    setViewportNode: (node: HTMLDivElement | null) => void;
    overflowX: boolean;
    setOverflowX: (enabled: boolean) => void;
    vertical: ScrollAxisMetrics;
    horizontal: ScrollAxisMetrics;
    scrolling: boolean;
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
    return metrics.scrollSize > metrics.clientSize + 1;
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
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [viewportEpoch, setViewportEpoch] = useState(0);
    const [vertical, setVertical] = useState<ScrollAxisMetrics>(EMPTY_METRICS);
    const [horizontal, setHorizontal] = useState<ScrollAxisMetrics>(EMPTY_METRICS);
    const [scrolling, setScrolling] = useState(false);
    const [interacting, setInteracting] = useState(false);
    const [overflowX, setOverflowX] = useState(false);
    const hideTimerRef = useRef<number | null>(null);

    const setViewportNode = useCallback((node: HTMLDivElement | null) => {
        if (viewportRef.current === node) return;
        viewportRef.current = node;
        setViewportEpoch((n) => n + 1);
    }, []);

    const sync = useCallback(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const next = readMetrics(viewport);
        setVertical(next.vertical);
        setHorizontal(next.horizontal);
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
    }, [sync, overflowX, viewportEpoch]);

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

    const ctx = useMemo<ScrollAreaContextValue>(
        () => ({
            type,
            viewportRef,
            setViewportNode,
            overflowX,
            setOverflowX,
            vertical,
            horizontal,
            scrolling,
            interacting,
            setInteracting,
        }),
        [
            type,
            setViewportNode,
            overflowX,
            vertical,
            horizontal,
            scrolling,
            interacting,
        ],
    );

    return (
        <ScrollAreaContext.Provider value={ctx}>
            <div
                ref={ref}
                data-refineui="scroll-area"
                data-type={type}
                data-scrolling={scrolling || undefined}
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
    function ScrollAreaViewport({ className, children, ...props }, forwardedRef) {
        const { setViewportNode, overflowX } = useScrollAreaContext("ScrollAreaViewport");
        const composedRef = useComposedRefs(setViewportNode, forwardedRef);

        return (
            <div
                ref={composedRef}
                data-refineui="scroll-area-viewport"
                data-overflow-x={overflowX ? "true" : undefined}
                tabIndex={0}
                className={clsx(scrollAreaStyles.viewport, className)}
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
    ...props
}: ScrollAreaScrollbarProps) {
    const {
        type,
        viewportRef,
        setOverflowX,
        vertical,
        horizontal,
        scrolling,
        interacting,
    } = useScrollAreaContext("ScrollAreaScrollbar");
    const trackRef = useRef<HTMLDivElement>(null);
    const metrics = orientation === "vertical" ? vertical : horizontal;
    const visible = isScrollable(metrics);
    const active = scrolling || interacting;

    useLayoutEffect(() => {
        if (orientation !== "horizontal") return;
        setOverflowX(true);
        return () => setOverflowX(false);
    }, [orientation, setOverflowX]);

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
                {...props}
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
