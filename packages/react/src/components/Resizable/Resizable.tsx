import { clsx } from "clsx";
import type {
    CSSProperties,
    KeyboardEvent as ReactKeyboardEvent,
    PointerEvent as ReactPointerEvent,
    RefObject,
} from "react";
import {
    createContext,
    useCallback,
    useContext,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { resizableStyles } from "./style";
import type {
    ResizableHandleProps,
    ResizableOrientation,
    ResizablePanelGroupProps,
    ResizablePanelProps,
} from "./types";

const KEYBOARD_STEP = 2;
const KEYBOARD_STEP_LARGE = 10;
const DEFAULT_SIZE = 50;
const DEFAULT_MIN_SIZE = 10;
const DEFAULT_MAX_SIZE = 100;

type PanelRecord = {
    id: string;
    defaultSize: number;
    minSize: number;
    maxSize: number;
    sizeControlled?: number;
    onResize?: (size: number) => void;
    order: number;
};

type ResizableContextValue = {
    orientation: ResizableOrientation;
    groupRef: RefObject<HTMLDivElement | null>;
    sizes: Record<string, number>;
    registerPanel: (panel: Omit<PanelRecord, "order">) => void;
    unregisterPanel: (id: string) => void;
    getPanel: (id: string) => PanelRecord | undefined;
    resizeBetween: (leftId: string, rightId: string, deltaPct: number) => void;
    setBetween: (leftId: string, rightId: string, leftSize: number) => void;
};

const ResizableContext = createContext<ResizableContextValue | null>(null);

function useResizableContext(component: string): ResizableContextValue {
    const v = useContext(ResizableContext);
    if (!v) throw new Error(`${component} must be used within ResizablePanelGroup.`);
    return v;
}

function clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
}

function normalizeDefaults(panels: PanelRecord[]): Record<string, number> {
    if (panels.length === 0) return {};
    const sum = panels.reduce((acc, p) => acc + p.defaultSize, 0);
    if (sum <= 0) {
        const equal = 100 / panels.length;
        return Object.fromEntries(panels.map((p) => [p.id, equal]));
    }
    return Object.fromEntries(
        panels.map((p) => [p.id, (p.defaultSize / sum) * 100]),
    );
}

function orderedPanelIds(panels: Map<string, PanelRecord>): string[] {
    return [...panels.values()]
        .sort((a, b) => a.order - b.order)
        .map((p) => p.id);
}

function findAdjacentPanelIds(handle: HTMLElement): {
    leftId: string | null;
    rightId: string | null;
} {
    let prev: Element | null = handle.previousElementSibling;
    while (prev && prev.getAttribute("data-refineui") !== "resizable-panel") {
        prev = prev.previousElementSibling;
    }
    let next: Element | null = handle.nextElementSibling;
    while (next && next.getAttribute("data-refineui") !== "resizable-panel") {
        next = next.nextElementSibling;
    }
    return {
        leftId: prev?.getAttribute("data-panel-id") ?? null,
        rightId: next?.getAttribute("data-panel-id") ?? null,
    };
}

function applyResize(
    sizes: Record<string, number>,
    panels: Map<string, PanelRecord>,
    leftId: string,
    rightId: string,
    deltaPct: number,
): Record<string, number> | null {
    const left = panels.get(leftId);
    const right = panels.get(rightId);
    if (!left || !right) return null;

    const leftSize = sizes[leftId] ?? left.defaultSize;
    const rightSize = sizes[rightId] ?? right.defaultSize;
    const pairSum = leftSize + rightSize;

    const minLeft = Math.max(left.minSize, pairSum - right.maxSize);
    const maxLeft = Math.min(left.maxSize, pairSum - right.minSize);
    const nextLeft = clamp(leftSize + deltaPct, minLeft, maxLeft);
    const nextRight = pairSum - nextLeft;

    if (
        Math.abs(nextLeft - leftSize) < 0.001 &&
        Math.abs(nextRight - rightSize) < 0.001
    ) {
        return null;
    }

    return { ...sizes, [leftId]: nextLeft, [rightId]: nextRight };
}

export function ResizablePanelGroup({
    children,
    className,
    style,
    orientation = "horizontal",
    onLayout,
    ...props
}: ResizablePanelGroupProps) {
    const groupRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef(new Map<string, PanelRecord>());
    const orderCounterRef = useRef(0);
    const [sizes, setSizes] = useState<Record<string, number>>({});
    const onLayoutRef = useRef(onLayout);
    onLayoutRef.current = onLayout;

    const syncInitialSizes = useCallback(() => {
        const panels = [...panelsRef.current.values()].sort((a, b) => a.order - b.order);
        if (panels.length === 0) return;

        setSizes((prev) => {
            const ids = panels.map((p) => p.id);
            const missing = ids.some((id) => prev[id] === undefined);
            const extras = Object.keys(prev).some((id) => !panelsRef.current.has(id));

            if (!missing && !extras) {
                let changed = false;
                const next = { ...prev };
                for (const p of panels) {
                    if (
                        p.sizeControlled !== undefined &&
                        next[p.id] !== p.sizeControlled
                    ) {
                        next[p.id] = p.sizeControlled;
                        changed = true;
                    }
                }
                return changed ? next : prev;
            }

            const base = normalizeDefaults(panels);
            for (const p of panels) {
                if (p.sizeControlled !== undefined) {
                    base[p.id] = p.sizeControlled;
                } else if (prev[p.id] !== undefined) {
                    base[p.id] = prev[p.id]!;
                }
            }
            const sum = ids.reduce((acc, id) => acc + (base[id] ?? 0), 0);
            if (sum > 0 && Math.abs(sum - 100) > 0.01) {
                for (const id of ids) {
                    base[id] = ((base[id] ?? 0) / sum) * 100;
                }
            }
            return base;
        });
    }, []);

    const registerPanel = useCallback(
        (panel: Omit<PanelRecord, "order">) => {
            const existing = panelsRef.current.get(panel.id);
            const order = existing?.order ?? orderCounterRef.current++;
            panelsRef.current.set(panel.id, { ...panel, order });
            queueMicrotask(syncInitialSizes);
        },
        [syncInitialSizes],
    );

    const unregisterPanel = useCallback((id: string) => {
        panelsRef.current.delete(id);
        setSizes((prev) => {
            if (!(id in prev)) return prev;
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const getPanel = useCallback((id: string) => panelsRef.current.get(id), []);

    const emitPanelResize = useCallback((next: Record<string, number>) => {
        for (const [id, size] of Object.entries(next)) {
            panelsRef.current.get(id)?.onResize?.(size);
        }
    }, []);

    const resizeBetween = useCallback(
        (leftId: string, rightId: string, deltaPct: number) => {
            setSizes((prev) => {
                const next = applyResize(
                    prev,
                    panelsRef.current,
                    leftId,
                    rightId,
                    deltaPct,
                );
                if (!next) return prev;
                queueMicrotask(() => emitPanelResize(next));
                return next;
            });
        },
        [emitPanelResize],
    );

    const setBetween = useCallback(
        (leftId: string, rightId: string, leftSize: number) => {
            setSizes((prev) => {
                const left = panelsRef.current.get(leftId);
                const right = panelsRef.current.get(rightId);
                if (!left || !right) return prev;
                const pairSum =
                    (prev[leftId] ?? left.defaultSize) +
                    (prev[rightId] ?? right.defaultSize);
                const minLeft = Math.max(left.minSize, pairSum - right.maxSize);
                const maxLeft = Math.min(left.maxSize, pairSum - right.minSize);
                const clampedLeft = clamp(leftSize, minLeft, maxLeft);
                const nextRight = pairSum - clampedLeft;
                if (
                    Math.abs(clampedLeft - (prev[leftId] ?? 0)) < 0.001 &&
                    Math.abs(nextRight - (prev[rightId] ?? 0)) < 0.001
                ) {
                    return prev;
                }
                const next = {
                    ...prev,
                    [leftId]: clampedLeft,
                    [rightId]: nextRight,
                };
                queueMicrotask(() => emitPanelResize(next));
                return next;
            });
        },
        [emitPanelResize],
    );

    useLayoutEffect(() => {
        const ids = orderedPanelIds(panelsRef.current);
        if (ids.length === 0) return;
        if (ids.some((id) => sizes[id] === undefined)) return;
        onLayoutRef.current?.(ids.map((id) => sizes[id]!));
    }, [sizes]);

    const ctx = useMemo<ResizableContextValue>(
        () => ({
            orientation,
            groupRef,
            sizes,
            registerPanel,
            unregisterPanel,
            getPanel,
            resizeBetween,
            setBetween,
        }),
        [
            orientation,
            sizes,
            registerPanel,
            unregisterPanel,
            getPanel,
            resizeBetween,
            setBetween,
        ],
    );

    return (
        <ResizableContext.Provider value={ctx}>
            <div
                ref={groupRef}
                data-refineui="resizable-panel-group"
                data-orientation={orientation}
                className={clsx(
                    resizableStyles.group,
                    orientation === "horizontal"
                        ? resizableStyles.groupHorizontal
                        : resizableStyles.groupVertical,
                    className,
                )}
                style={style}
                {...props}
            >
                {children}
            </div>
        </ResizableContext.Provider>
    );
}

export function ResizablePanel({
    children,
    className,
    style,
    defaultSize = DEFAULT_SIZE,
    minSize = DEFAULT_MIN_SIZE,
    maxSize = DEFAULT_MAX_SIZE,
    size: sizeControlled,
    onResize,
    ...props
}: ResizablePanelProps) {
    const id = useId();
    const { orientation, sizes, registerPanel, unregisterPanel } =
        useResizableContext("ResizablePanel");
    const onResizeRef = useRef(onResize);
    onResizeRef.current = onResize;

    useLayoutEffect(() => {
        registerPanel({
            id,
            defaultSize,
            minSize,
            maxSize,
            sizeControlled,
            onResize: (size) => onResizeRef.current?.(size),
        });
        return () => unregisterPanel(id);
    }, [
        id,
        defaultSize,
        minSize,
        maxSize,
        sizeControlled,
        registerPanel,
        unregisterPanel,
    ]);

    const size = sizeControlled ?? sizes[id] ?? defaultSize;

    const panelStyle: CSSProperties = {
        ...style,
        flexGrow: size,
        flexShrink: 1,
        flexBasis: 0,
        ...(orientation === "horizontal"
            ? { minWidth: `${minSize}%` }
            : { minHeight: `${minSize}%` }),
    };

    return (
        <div
            data-refineui="resizable-panel"
            data-panel-id={id}
            className={clsx(resizableStyles.panel, className)}
            style={panelStyle}
            {...props}
        >
            {children}
        </div>
    );
}

export function ResizableHandle({
    className,
    style,
    withHandle = false,
    disabled = false,
    onKeyDown,
    onPointerDown,
    "aria-label": ariaLabel,
    "aria-keyshortcuts": ariaKeyshortcuts,
    ...props
}: ResizableHandleProps) {
    const {
        orientation,
        groupRef,
        sizes,
        getPanel,
        resizeBetween,
        setBetween,
    } = useResizableContext("ResizableHandle");
    const handleRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);
    /** Bumps once after mount so aria can read adjacent panel ids from the DOM. */
    const [, setAdjacentReady] = useState(false);

    const dragRef = useRef<{
        leftId: string;
        rightId: string;
        startPos: number;
        startLeft: number;
    } | null>(null);

    useLayoutEffect(() => {
        setAdjacentReady(true);
    }, []);

    const adjacent = handleRef.current
        ? findAdjacentPanelIds(handleRef.current)
        : { leftId: null, rightId: null };
    const leftPanel = adjacent.leftId ? getPanel(adjacent.leftId) : undefined;
    const ariaNow = Math.round(
        (adjacent.leftId ? sizes[adjacent.leftId] : undefined) ??
            leftPanel?.defaultSize ??
            DEFAULT_SIZE,
    );
    const ariaMin = leftPanel?.minSize ?? 0;
    const ariaMax = leftPanel?.maxSize ?? DEFAULT_MAX_SIZE;

    const defaultKeyshortcuts =
        orientation === "horizontal"
            ? "ArrowLeft ArrowRight Home End"
            : "ArrowUp ArrowDown Home End";

    const keepFocus = useCallback(() => {
        const el = handleRef.current;
        if (el && document.activeElement !== el) {
            el.focus({ preventScroll: true });
        }
    }, []);

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || disabled || event.button !== 0) return;
        const el = handleRef.current;
        if (!el) return;
        const { leftId, rightId } = findAdjacentPanelIds(el);
        if (!leftId || !rightId) return;

        // Focus before preventDefault — otherwise the click never focuses the handle.
        el.focus({ preventScroll: true });
        event.preventDefault();
        el.setPointerCapture(event.pointerId);
        dragRef.current = {
            leftId,
            rightId,
            startPos: orientation === "horizontal" ? event.clientX : event.clientY,
            startLeft: sizes[leftId] ?? getPanel(leftId)?.defaultSize ?? DEFAULT_SIZE,
        };
        setActive(true);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        const group = groupRef.current;
        if (!drag || !group) return;
        const rect = group.getBoundingClientRect();
        const extent = orientation === "horizontal" ? rect.width : rect.height;
        if (extent <= 0) return;
        const pos = orientation === "horizontal" ? event.clientX : event.clientY;
        const deltaPct = ((pos - drag.startPos) / extent) * 100;
        setBetween(drag.leftId, drag.rightId, drag.startLeft + deltaPct);
    };

    const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragRef.current) return;
        dragRef.current = null;
        setActive(false);
        if (handleRef.current?.hasPointerCapture(event.pointerId)) {
            handleRef.current.releasePointerCapture(event.pointerId);
        }
        keepFocus();
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || disabled) return;
        const el = handleRef.current;
        if (!el) return;
        const { leftId, rightId } = findAdjacentPanelIds(el);
        if (!leftId || !rightId) return;

        const step = event.shiftKey ? KEYBOARD_STEP_LARGE : KEYBOARD_STEP;
        const horizontal = orientation === "horizontal";
        let delta = 0;

        switch (event.key) {
            case "ArrowLeft":
                if (horizontal) delta = -step;
                break;
            case "ArrowRight":
                if (horizontal) delta = step;
                break;
            case "ArrowUp":
                if (!horizontal) delta = -step;
                break;
            case "ArrowDown":
                if (!horizontal) delta = step;
                break;
            case "Home": {
                event.preventDefault();
                event.stopPropagation();
                const left = getPanel(leftId);
                if (left) setBetween(leftId, rightId, left.minSize);
                queueMicrotask(keepFocus);
                return;
            }
            case "End": {
                event.preventDefault();
                event.stopPropagation();
                const left = getPanel(leftId);
                const right = getPanel(rightId);
                if (!left || !right) return;
                const pairSum =
                    (sizes[leftId] ?? left.defaultSize) +
                    (sizes[rightId] ?? right.defaultSize);
                setBetween(
                    leftId,
                    rightId,
                    Math.min(left.maxSize, pairSum - right.minSize),
                );
                queueMicrotask(keepFocus);
                return;
            }
            default:
                return;
        }

        if (delta === 0) return;
        event.preventDefault();
        event.stopPropagation();
        resizeBetween(leftId, rightId, delta);
        queueMicrotask(keepFocus);
    };

    return (
        <div
            ref={handleRef}
            role="separator"
            tabIndex={disabled ? -1 : 0}
            aria-orientation={orientation}
            aria-valuenow={ariaNow}
            aria-valuemin={ariaMin}
            aria-valuemax={ariaMax}
            aria-disabled={disabled || undefined}
            aria-label={ariaLabel ?? "Resize"}
            aria-keyshortcuts={ariaKeyshortcuts ?? defaultKeyshortcuts}
            data-refineui="resizable-handle"
            data-orientation={orientation}
            data-disabled={disabled ? "" : undefined}
            data-active={active ? "" : undefined}
            className={clsx(
                "group/handle",
                resizableStyles.handle,
                orientation === "horizontal"
                    ? resizableStyles.handleHorizontal
                    : resizableStyles.handleVertical,
                className,
            )}
            style={style}
            {...props}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
        >
            {withHandle ? (
                <span
                    aria-hidden
                    className={clsx(
                        resizableStyles.grip,
                        orientation === "horizontal"
                            ? resizableStyles.gripHorizontal
                            : resizableStyles.gripVertical,
                    )}
                />
            ) : null}
        </div>
    );
}
