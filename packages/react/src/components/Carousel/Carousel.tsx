import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent, TransitionEvent } from "react";
import {
    Children,
    cloneElement,
    createContext,
    forwardRef,
    isValidElement,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Button } from "../Button";
import { WebIcon } from "../../WebIcon";
import { carouselStyles } from "./style";
import type {
    CarouselContentProps,
    CarouselControlsProps,
    CarouselIndicatorsProps,
    CarouselItemProps,
    CarouselNextProps,
    CarouselPreviousProps,
    CarouselProps,
} from "./types";

const DRAG_COMMIT_RATIO = 0.18;

type CarouselContextValue = {
    index: number;
    count: number;
    setCount: (n: number) => void;
    trackIndex: number;
    setTrackIndex: (n: number | ((prev: number) => number)) => void;
    instant: boolean;
    setInstant: (v: boolean) => void;
    scrollPrev: () => void;
    scrollNext: () => void;
    scrollTo: (i: number) => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
    loop: boolean;
    onTrackSettled: () => void;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarouselContext(component: string): CarouselContextValue {
    const v = useContext(CarouselContext);
    if (!v) throw new Error(`${component} must be used within Carousel.`);
    return v;
}

function clampIndex(i: number, count: number): number {
    if (count <= 0) return 0;
    return Math.min(count - 1, Math.max(0, i));
}

export function Carousel({
    children,
    className,
    index: indexControlled,
    defaultIndex = 0,
    onIndexChange,
    loop = false,
    onKeyDown,
    ...props
}: CarouselProps) {
    const isControlled = indexControlled !== undefined;
    const [internalIndex, setInternalIndex] = useState(defaultIndex);
    const [count, setCount] = useState(0);
    const [trackIndex, setTrackIndex] = useState(defaultIndex);
    const [instant, setInstant] = useState(false);
    const index = isControlled ? indexControlled! : internalIndex;
    const loopActive = loop && count > 1;

    const commitLogical = useCallback(
        (next: number) => {
            const normalized = clampIndex(next, Math.max(count, 1));
            if (!isControlled) setInternalIndex(normalized);
            onIndexChange?.(normalized);
        },
        [count, isControlled, onIndexChange],
    );

    useLayoutEffect(() => {
        if (count <= 0) return;
        const logical = clampIndex(index, count);
        if (logical !== index) commitLogical(logical);
        setTrackIndex(loopActive ? logical + 1 : logical);
    }, [count, loopActive]); // eslint-disable-line react-hooks/exhaustive-deps -- init / count / loop only

    useEffect(() => {
        if (count <= 0) return;
        if (!loopActive) {
            setTrackIndex(clampIndex(index, count));
            return;
        }
        // While on a real slide, keep track aligned with controlled/external index.
        // Skip when parked on edge clones (0 / count+1) during infinite wrap.
        setTrackIndex((t) => {
            if (t < 1 || t > count) return t;
            const expected = clampIndex(index, count) + 1;
            return expected === t ? t : expected;
        });
    }, [index, count, loopActive]);

    const canScrollPrev = loopActive ? true : index > 0;
    const canScrollNext = loopActive ? true : index < count - 1;

    const scrollTo = useCallback(
        (i: number) => {
            if (count <= 0) return;
            const next = clampIndex(i, count);
            commitLogical(next);
            setTrackIndex(loopActive ? next + 1 : next);
        },
        [commitLogical, count, loopActive],
    );

    const scrollPrev = useCallback(() => {
        if (count <= 0) return;
        if (loopActive) {
            // Ignore while parked on edge clones during seamless wrap.
            if (trackIndex < 1 || trackIndex > count) return;
            setTrackIndex(trackIndex - 1);
            commitLogical((index - 1 + count) % count);
            return;
        }
        if (index > 0) {
            commitLogical(index - 1);
            setTrackIndex(index - 1);
        }
    }, [commitLogical, count, index, loopActive, trackIndex]);

    const scrollNext = useCallback(() => {
        if (count <= 0) return;
        if (loopActive) {
            if (trackIndex < 1 || trackIndex > count) return;
            setTrackIndex(trackIndex + 1);
            commitLogical((index + 1) % count);
            return;
        }
        if (index < count - 1) {
            commitLogical(index + 1);
            setTrackIndex(index + 1);
        }
    }, [commitLogical, count, index, loopActive, trackIndex]);

    const onTrackSettled = useCallback(() => {
        if (!loopActive) return;
        if (trackIndex === 0) {
            setInstant(true);
            setTrackIndex(count);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setInstant(false));
            });
        } else if (trackIndex === count + 1) {
            setInstant(true);
            setTrackIndex(1);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setInstant(false));
            });
        }
    }, [count, loopActive, trackIndex]);

    const ctx = useMemo(
        () => ({
            index,
            count,
            setCount,
            trackIndex,
            setTrackIndex,
            instant,
            setInstant,
            scrollPrev,
            scrollNext,
            scrollTo,
            canScrollPrev,
            canScrollNext,
            loop: loopActive,
            onTrackSettled,
        }),
        [
            index,
            count,
            trackIndex,
            instant,
            scrollPrev,
            scrollNext,
            scrollTo,
            canScrollPrev,
            canScrollNext,
            loopActive,
            onTrackSettled,
        ],
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        switch (e.key) {
            case "ArrowLeft":
                e.preventDefault();
                scrollPrev();
                break;
            case "ArrowRight":
                e.preventDefault();
                scrollNext();
                break;
            case "Home":
                e.preventDefault();
                scrollTo(0);
                break;
            case "End":
                e.preventDefault();
                scrollTo(Math.max(0, count - 1));
                break;
            default:
                break;
        }
    };

    return (
        <CarouselContext.Provider value={ctx}>
            <div
                data-refineui="carousel"
                aria-roledescription="carousel"
                tabIndex={0}
                className={clsx(carouselStyles.root, className)}
                onKeyDown={handleKeyDown}
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
}

export function CarouselContent({ className, children, ...props }: CarouselContentProps) {
    const {
        trackIndex,
        setCount,
        scrollPrev,
        scrollNext,
        count,
        loop,
        instant,
        onTrackSettled,
    } = useCarouselContext("CarouselContent");
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const dragStartX = useRef<number | null>(null);
    const [dragPx, setDragPx] = useState(0);
    const [dragging, setDragging] = useState(false);

    const slides = Children.toArray(children).filter(isValidElement);
    const slideCount = slides.length;

    useEffect(() => {
        setCount(slideCount);
    }, [setCount, slideCount]);

    const trackSlides =
        loop && slides.length > 1
            ? [
                  cloneElement(slides[slides.length - 1]!, { key: "__carousel-clone-last" }),
                  ...slides,
                  cloneElement(slides[0]!, { key: "__carousel-clone-first" }),
              ]
            : slides;

    const endDrag = useCallback(
        (clientX: number) => {
            if (dragStartX.current == null) return;
            const width = viewportRef.current?.offsetWidth ?? 1;
            const dx = clientX - dragStartX.current;
            dragStartX.current = null;
            setDragging(false);
            setDragPx(0);

            const threshold = width * DRAG_COMMIT_RATIO;
            if (dx <= -threshold) scrollNext();
            else if (dx >= threshold) scrollPrev();
        },
        [scrollNext, scrollPrev],
    );

    const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (e.button !== 0 || count <= 1) return;
        dragStartX.current = e.clientX;
        setDragging(true);
        setDragPx(0);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (dragStartX.current == null) return;
        setDragPx(e.clientX - dragStartX.current);
    };

    const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (dragStartX.current == null) return;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            /* already released */
        }
        endDrag(e.clientX);
    };

    const onPointerCancel = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (dragStartX.current == null) return;
        dragStartX.current = null;
        setDragging(false);
        setDragPx(0);
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
    };

    const onTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
        if (e.propertyName !== "transform") return;
        onTrackSettled();
    };

    const animated = !dragging && !instant;
    const transform =
        dragPx !== 0
            ? `translate3d(calc(-${trackIndex * 100}% + ${dragPx}px), 0, 0)`
            : `translate3d(-${trackIndex * 100}%, 0, 0)`;

    return (
        <div
            ref={viewportRef}
            data-refineui="carousel-viewport"
            data-dragging={dragging ? "true" : undefined}
            className={carouselStyles.viewport}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
        >
            <div
                data-refineui="carousel-track"
                data-animated={animated ? "true" : "false"}
                className={clsx(carouselStyles.track, animated && carouselStyles.trackAnimated, className)}
                style={{ transform }}
                onTransitionEnd={onTransitionEnd}
                {...props}
            >
                {trackSlides}
            </div>
        </div>
    );
}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(function CarouselItem(
    { className, children, ...props },
    ref,
) {
    useCarouselContext("CarouselItem");
    return (
        <div
            ref={ref}
            data-refineui="carousel-item"
            role="group"
            aria-roledescription="slide"
            className={clsx(carouselStyles.item, className)}
            {...props}
        >
            {children}
        </div>
    );
});

export function CarouselControls({ className, children, ...props }: CarouselControlsProps) {
    useCarouselContext("CarouselControls");
    return (
        <div data-refineui="carousel-controls" className={clsx(carouselStyles.controls, className)} {...props}>
            {children}
        </div>
    );
}

export function CarouselPrevious({ className, disabled, onClick, ...props }: CarouselPreviousProps) {
    const { scrollPrev, canScrollPrev } = useCarouselContext("CarouselPrevious");
    const isDisabled = disabled || !canScrollPrev;

    return (
        <Button
            variant="outline"
            size="md"
            layout="icon"
            data-refineui="carousel-nav"
            data-dir="prev"
            aria-label="Previous slide"
            disabled={isDisabled}
            className={className}
            {...props}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented && !isDisabled) scrollPrev();
            }}
        >
            <WebIcon
                name="chevron-left"
                size={iconSizes.small}
                color="currentColor"
                iconStyle="filled"
                fallback="‹"
            />
        </Button>
    );
}

export function CarouselNext({ className, disabled, onClick, ...props }: CarouselNextProps) {
    const { scrollNext, canScrollNext } = useCarouselContext("CarouselNext");
    const isDisabled = disabled || !canScrollNext;

    return (
        <Button
            variant="outline"
            size="md"
            layout="icon"
            data-refineui="carousel-nav"
            data-dir="next"
            aria-label="Next slide"
            disabled={isDisabled}
            className={className}
            {...props}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented && !isDisabled) scrollNext();
            }}
        >
            <WebIcon
                name="chevron-right"
                size={iconSizes.small}
                color="currentColor"
                iconStyle="filled"
                fallback="›"
            />
        </Button>
    );
}

export function CarouselIndicators({ className, ...props }: CarouselIndicatorsProps) {
    const { count, index, scrollTo } = useCarouselContext("CarouselIndicators");
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [thumb, setThumb] = useState({ width: 0, x: 0, ready: false });

    const updateThumb = useCallback(() => {
        const el = trackRef.current;
        if (!el || count <= 0) {
            setThumb({ width: 0, x: 0, ready: false });
            return;
        }
        const hits = el.querySelector<HTMLElement>("[data-refineui='carousel-indicator-hits']");
        const inner = hits?.clientWidth ?? el.clientWidth;
        const width = inner / count;
        setThumb({
            width,
            x: width * index,
            ready: true,
        });
    }, [count, index]);

    useLayoutEffect(() => {
        updateThumb();
    }, [updateThumb]);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => updateThumb());
        ro.observe(el);
        return () => ro.disconnect();
    }, [updateThumb]);

    if (count <= 0) return null;

    const thumbStyle: CSSProperties = {
        width: thumb.width,
        transform: `translate3d(${thumb.x}px, 0, 0)`,
    };

    return (
        <div
            ref={trackRef}
            data-refineui="carousel-indicators"
            role="tablist"
            aria-label="Slides"
            className={clsx(carouselStyles.indicators, className)}
            {...props}
        >
            <span
                data-refineui="carousel-indicator-thumb"
                data-ready={thumb.ready ? "true" : undefined}
                aria-hidden
                className={carouselStyles.indicatorThumb}
                style={thumbStyle}
            />
            <div data-refineui="carousel-indicator-hits" className={carouselStyles.indicatorHitRow}>
                {Array.from({ length: count }, (_, i) => (
                    <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-label={`Go to slide ${i + 1}`}
                        aria-selected={i === index}
                        data-refineui="carousel-indicator"
                        data-selected={i === index ? "true" : "false"}
                        className={carouselStyles.indicatorHit}
                        onClick={() => scrollTo(i)}
                    />
                ))}
            </div>
        </div>
    );
}
