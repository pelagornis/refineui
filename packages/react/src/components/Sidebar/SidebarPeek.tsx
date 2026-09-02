import { clsx } from "clsx";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from "react";
import { semanticInteraction } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
import { sidebarPeekStyles } from "./peekStyle";
import type {
    SidebarPeekEdgeProps,
    SidebarPeekInsetProps,
    SidebarPeekPanelProps,
    SidebarPeekPinProps,
    SidebarPeekProps,
} from "./types";

const PEEK_OPEN_DELAY_MS = motionMsToNumber(semanticInteraction.duration.medium);
const PEEK_CLOSE_DELAY_MS = motionMsToNumber(semanticInteraction.duration.medium);
/** Grace when crossing from the edge strip into the panel. */
const PEEK_BRIDGE_DELAY_MS = motionMsToNumber(semanticInteraction.duration.slow);

type SidebarPeekContextValue = {
    enabled: boolean;
    mode: "contained" | "viewport";
    peekOpen: boolean;
    flyoutWidthPx: number | undefined;
    schedulePeekOpen: () => void;
    schedulePeekClose: (delay?: number) => void;
    closePeekImmediate: () => void;
    cancelPeekClose: () => void;
    cancelPeekOpen: () => void;
    onPin?: () => void;
};

const SidebarPeekContext = createContext<SidebarPeekContextValue | null>(null);

function useSidebarPeekContext(component: string): SidebarPeekContextValue {
    const ctx = useContext(SidebarPeekContext);
    if (!ctx) throw new Error(`${component} must be used within <SidebarPeek>.`);
    return ctx;
}

export function SidebarPeek({
    enabled = false,
    widthPercent,
    mode = "contained",
    onPin,
    className,
    style,
    children,
    ...props
}: SidebarPeekProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const widthPercentRef = useRef(widthPercent);
    widthPercentRef.current = widthPercent;
    const [peekOpen, setPeekOpen] = useState(false);
    const [flyoutWidthPx, setFlyoutWidthPx] = useState<number | undefined>();
    const peekOpenTimerRef = useRef<number | null>(null);
    const peekCloseTimerRef = useRef<number | null>(null);

    const clearPeekOpenTimer = useCallback(() => {
        if (peekOpenTimerRef.current != null) {
            window.clearTimeout(peekOpenTimerRef.current);
            peekOpenTimerRef.current = null;
        }
    }, []);

    const clearPeekCloseTimer = useCallback(() => {
        if (peekCloseTimerRef.current != null) {
            window.clearTimeout(peekCloseTimerRef.current);
            peekCloseTimerRef.current = null;
        }
    }, []);

    const closePeekImmediate = useCallback(() => {
        clearPeekOpenTimer();
        clearPeekCloseTimer();
        setPeekOpen(false);
    }, [clearPeekCloseTimer, clearPeekOpenTimer]);

    const closePeek = useCallback(() => {
        closePeekImmediate();
    }, [closePeekImmediate]);

    useEffect(() => {
        if (enabled) return;
        closePeek();
    }, [closePeek, enabled]);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        const syncFlyoutWidth = () => {
            setFlyoutWidthPx(Math.round((widthPercentRef.current / 100) * el.clientWidth));
        };

        syncFlyoutWidth();
        const observer = new ResizeObserver(syncFlyoutWidth);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const pointerRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!enabled) return;
        const onPointerMove = (event: PointerEvent) => {
            pointerRef.current = { x: event.clientX, y: event.clientY };
        };
        document.addEventListener("pointermove", onPointerMove, { passive: true });
        return () => document.removeEventListener("pointermove", onPointerMove);
    }, [enabled]);

    useEffect(() => {
        if (!peekOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closePeek();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [closePeek, peekOpen]);

    useEffect(
        () => () => {
            clearPeekOpenTimer();
            clearPeekCloseTimer();
        },
        [clearPeekCloseTimer, clearPeekOpenTimer],
    );

    const cancelPeekOpen = useCallback(() => {
        clearPeekOpenTimer();
    }, [clearPeekOpenTimer]);

    const schedulePeekOpen = useCallback(() => {
        if (!enabled || peekOpen) return;
        clearPeekCloseTimer();
        clearPeekOpenTimer();
        peekOpenTimerRef.current = window.setTimeout(() => {
            setPeekOpen(true);
            peekOpenTimerRef.current = null;
        }, PEEK_OPEN_DELAY_MS);
    }, [clearPeekCloseTimer, clearPeekOpenTimer, enabled, peekOpen]);

    const schedulePeekClose = useCallback(
        (delay = PEEK_CLOSE_DELAY_MS) => {
            clearPeekOpenTimer();
            if (!peekOpen) return;
            clearPeekCloseTimer();
            peekCloseTimerRef.current = window.setTimeout(() => {
                closePeekImmediate();
                peekCloseTimerRef.current = null;
            }, delay);
        },
        [clearPeekCloseTimer, clearPeekOpenTimer, closePeekImmediate, peekOpen],
    );

    const cancelPeekClose = useCallback(() => {
        clearPeekCloseTimer();
    }, [clearPeekCloseTimer]);

    useEffect(() => {
        if (!peekOpen || !enabled) return;
        const frame = requestAnimationFrame(() => {
            const root = rootRef.current;
            if (!root) return;
            const { x, y } = pointerRef.current;
            const zones = Array.from(
                root.querySelectorAll(
                    '[data-refineui="sidebar-peek-edge"], [data-refineui="sidebar-peek-surface"]',
                ),
            );
            for (const zone of zones) {
                if (!(zone instanceof HTMLElement)) continue;
                const rect = zone.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    cancelPeekClose();
                    return;
                }
            }
        });
        return () => cancelAnimationFrame(frame);
    }, [cancelPeekClose, enabled, peekOpen]);

    const contextValue = useMemo<SidebarPeekContextValue>(
        () => ({
            enabled,
            mode,
            peekOpen,
            flyoutWidthPx,
            schedulePeekOpen,
            schedulePeekClose,
            closePeekImmediate,
            cancelPeekClose,
            cancelPeekOpen,
            onPin,
        }),
        [
            cancelPeekClose,
            cancelPeekOpen,
            closePeekImmediate,
            enabled,
            flyoutWidthPx,
            mode,
            onPin,
            peekOpen,
            schedulePeekClose,
            schedulePeekOpen,
        ],
    );

    return (
        <SidebarPeekContext.Provider value={contextValue}>
            <div
                ref={rootRef}
                data-refineui="sidebar-peek"
                data-sidebar-peek={enabled ? undefined : "disabled"}
                data-sidebar-peek-open={peekOpen || undefined}
                className={clsx(sidebarPeekStyles.root, className)}
                style={style}
                {...props}
            >
                {children}
            </div>
        </SidebarPeekContext.Provider>
    );
}

export function SidebarPeekEdge({ className, ...props }: SidebarPeekEdgeProps) {
    const { enabled, mode, peekOpen, schedulePeekOpen, schedulePeekClose, cancelPeekOpen } =
        useSidebarPeekContext("SidebarPeekEdge");

    if (!enabled) return null;

    const handleEdgeLeave = () => {
        if (peekOpen) {
            schedulePeekClose(PEEK_BRIDGE_DELAY_MS);
            return;
        }
        cancelPeekOpen();
    };

    return (
        <div
            data-refineui="sidebar-peek-edge"
            data-sidebar-peek-edge-suspended={peekOpen || undefined}
            aria-hidden
            className={clsx(
                mode === "viewport" ? sidebarPeekStyles.edgeViewport : sidebarPeekStyles.edgeContained,
                className,
            )}
            onMouseEnter={schedulePeekOpen}
            onMouseLeave={handleEdgeLeave}
            {...props}
        />
    );
}

export function SidebarPeekPanel({ className, children, ...props }: SidebarPeekPanelProps) {
    const { enabled, mode, peekOpen, flyoutWidthPx, cancelPeekClose, schedulePeekClose } =
        useSidebarPeekContext("SidebarPeekPanel");

    if (!enabled) return null;

    const surfaceStyle: CSSProperties | undefined =
        flyoutWidthPx == null
            ? undefined
            : ({
                  "--refineui-sidebar-peek-panel-width": `${flyoutWidthPx}px`,
              } as CSSProperties);

    return (
        <div
            data-refineui="sidebar-peek-surface"
            data-sidebar-peek-panel-open={peekOpen || undefined}
            data-sidebar-peek-mode={mode}
            aria-hidden={!peekOpen}
            className={clsx(
                mode === "viewport" ? sidebarPeekStyles.surfaceViewport : sidebarPeekStyles.surfaceContained,
            )}
            style={surfaceStyle}
            onMouseEnter={cancelPeekClose}
            onMouseLeave={() => {
                if (peekOpen) schedulePeekClose();
            }}
        >
            <div
                data-refineui="sidebar-peek-panel"
                className={clsx(sidebarPeekStyles.panel, className)}
                {...props}
            >
                {children}
            </div>
        </div>
    );
}

export function SidebarPeekPin({ className, children, ...props }: SidebarPeekPinProps) {
    return (
        <div data-refineui="sidebar-peek-pin" className={clsx(sidebarPeekStyles.toolbar, className)} {...props}>
            {children}
        </div>
    );
}

export function SidebarPeekInset({ className, style, children, ...props }: SidebarPeekInsetProps) {
    return (
        <div
            data-refineui="sidebar-peek-inset"
            className={clsx(sidebarPeekStyles.inset, className)}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
}

export function useSidebarPeek(): SidebarPeekContextValue {
    return useSidebarPeekContext("useSidebarPeek");
}
