import { clsx } from "clsx";
import {
    forwardRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    useSyncExternalStore,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { iconSizes, spacings } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";
import { toastStyles } from "./style";
import type {
    ToastOptions,
    ToastPosition,
    ToastProps,
    ToastRecord,
    ToastSwipeDirection,
    ToastVariant,
    ToasterProps,
} from "./types";

const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

const ENTER_MS = 20;
/** Match `--refineui-motion-duration-medium` (200ms) + buffer for slide-out. */
const LEAVE_MS = 260;
const DEFAULT_DURATION = 4200;
/** Material-style: one toast at a time by default. */
const DEFAULT_MAX_TOASTS = 1;
const STACK_Z_BASE = 100;
const COLLAPSED_STEP_GAP = 0.85;
const COLLAPSED_STEP_FRONT = 0.035;
/** Distance before drag offset starts (avoids jitter on click). */
const SWIPE_DEADZONE_PX = 12;
/** Distance required to dismiss (Sonner uses ~45; we go higher for less twitchy dismiss). */
const SWIPE_THRESHOLD_PX = 96;
/** px/ms — Sonner uses 0.11; raised so light flicks don't dismiss. */
const SWIPE_VELOCITY = 0.32;
/** Minimum travel before velocity alone can dismiss. */
const SWIPE_VELOCITY_MIN_PX = 40;

function swipeDampening(delta: number): number {
    const factor = Math.abs(delta) / 20;
    return 1 / (1.5 + factor);
}

function gapPxFromSpacingToken(token: string): number {
    const n = Number.parseFloat(String(token).replace("px", ""));
    return Number.isFinite(n) && n > 0 ? n : 16;
}

const TOAST_NARROW_STACK_MQ = "(max-width: 480px), (hover: none)";

function readToastStackGapPx(): number {
    if (typeof globalThis.matchMedia === "undefined") {
        return gapPxFromSpacingToken(String(spacings.sizeLarge));
    }
    const mq = globalThis.matchMedia(TOAST_NARROW_STACK_MQ);
    return gapPxFromSpacingToken(mq.matches ? String(spacings.sizeMedium) : String(spacings.sizeLarge));
}

function subscribeToastStackGap(onChange: () => void): () => void {
    if (typeof globalThis.matchMedia === "undefined") return () => {};
    const mq = globalThis.matchMedia(TOAST_NARROW_STACK_MQ);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
}

function useToastStackGapPx(): number {
    return useSyncExternalStore(subscribeToastStackGap, readToastStackGapPx, () =>
        gapPxFromSpacingToken(String(spacings.sizeLarge)),
    );
}

function readToastNaturalHeight(li: HTMLLIElement | null): number {
    if (!li) return 0;
    const toastEl = li.querySelector<HTMLElement>('[data-refineui="toast"]');
    if (!toastEl) return 0;
    const layoutH = toastEl.offsetHeight;
    if (layoutH > 0) return layoutH;
    return Math.max(Math.round(toastEl.getBoundingClientRect().height), 1);
}

function computeStackLayout(records: ToastRecord[], items: Record<string, HTMLLIElement | null>, gapPx: number) {
    const naturalHeights = records.map((rec) => readToastNaturalHeight(items[rec.id] ?? null));
    const front = Math.max(naturalHeights[0] ?? 0, 1);
    const collapsedStep = gapPx * COLLAPSED_STEP_GAP + front * COLLAPSED_STEP_FRONT;
    const collapsedOffsets = records.map((_, idx) => idx * collapsedStep);

    let expandedY = 0;
    const expandedOffsets = records.map((_, idx) => {
        const y = expandedY;
        expandedY += (naturalHeights[idx] ?? 0) + gapPx;
        return y;
    });

    const slotHeight = (idx: number) => (idx === 0 ? Math.max(naturalHeights[idx] ?? 0, 1) : front);

    let collapsedBottom = 0;
    for (let i = 0; i < records.length; i++) {
        collapsedBottom = Math.max(collapsedBottom, (collapsedOffsets[i] ?? 0) + slotHeight(i));
    }

    const last = records.length - 1;
    const expandedBottom =
        last >= 0 ? (expandedOffsets[last] ?? 0) + (naturalHeights[last] ?? 0) : front;

    return { naturalHeights, front, collapsedOffsets, expandedOffsets, collapsedBottom, expandedBottom, slotHeight };
}

function defaultSwipeDirections(position: ToastPosition): ToastSwipeDirection[] {
    const vertical: ToastSwipeDirection = position.startsWith("top") ? "top" : "bottom";
    if (position.endsWith("left")) return [vertical, "left"];
    if (position.endsWith("right")) return [vertical, "right"];
    return [vertical];
}

let toastState: ToastRecord[] = [];
const toastListeners = new Set<(records: ToastRecord[]) => void>();
const leaveTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const enterTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/** Latest mounted Toaster owns the portal — prevents stacked duplicate toasters (HMR / remount). */
let activeToasterKey: symbol | null = null;
const toasterOwnerListeners = new Set<() => void>();

function notifyToasterOwners() {
    for (const listener of toasterOwnerListeners) {
        listener();
    }
}

function clearTrackedTimeout(map: Map<string, ReturnType<typeof setTimeout>>, id: string) {
    const handle = map.get(id);
    if (handle != null) {
        clearTimeout(handle);
        map.delete(id);
    }
}

function clearAllTrackedTimeouts(map: Map<string, ReturnType<typeof setTimeout>>) {
    for (const handle of map.values()) {
        clearTimeout(handle);
    }
    map.clear();
}

function notifyToastListeners() {
    for (const listener of toastListeners) {
        listener(toastState);
    }
}

function setToastState(next: ToastRecord[]) {
    toastState = next;
    notifyToastListeners();
}

function updateToastById(id: string, updater: (t: ToastRecord) => ToastRecord) {
    setToastState(toastState.map((t) => (t.id === id ? updater(t) : t)));
}

function scheduleRemoveToast(id: string) {
    clearTrackedTimeout(leaveTimeouts, id);
    leaveTimeouts.set(
        id,
        globalThis.setTimeout(() => {
            leaveTimeouts.delete(id);
            setToastState(toastState.filter((t) => t.id !== id));
        }, LEAVE_MS),
    );
}

export function dismissToast(id?: string) {
    if (!id) {
        clearAllTrackedTimeouts(enterTimeouts);
        clearAllTrackedTimeouts(leaveTimeouts);
        const ids = toastState.map((t) => t.id);
        setToastState(toastState.map((t) => ({ ...t, phase: "leaving" })));
        for (const toastId of ids) {
            scheduleRemoveToast(toastId);
        }
        return;
    }
    clearTrackedTimeout(enterTimeouts, id);
    if (!toastState.some((t) => t.id === id)) return;
    updateToastById(id, (t) => ({ ...t, phase: "leaving" }));
    scheduleRemoveToast(id);
}

/** Show a toast. Replaces any visible toast (Material snackbar-style). */
export function toast(message: ToastRecord["message"], options: ToastOptions = {}): string {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const record: ToastRecord = {
        id,
        message,
        variant: options.variant ?? "default",
        iconName: options.iconName,
        icon: options.icon,
        action: options.action,
        duration: options.duration ?? DEFAULT_DURATION,
        phase: "entering",
    };

    // Drop previous immediately — never keep a leaving toast under the new one.
    clearAllTrackedTimeouts(enterTimeouts);
    clearAllTrackedTimeouts(leaveTimeouts);
    setToastState([record]);
    // Two frames so the browser paints `entering` (off-edge) before transitioning to idle.
    enterTimeouts.set(
        id,
        globalThis.setTimeout(() => {
            enterTimeouts.delete(id);
            if (typeof requestAnimationFrame === "undefined") {
                updateToastById(id, (t) => ({ ...t, phase: "idle" }));
                return;
            }
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    updateToastById(id, (t) => ({ ...t, phase: "idle" }));
                });
            });
        }, ENTER_MS),
    );
    return id;
}

function subscribeToasts(listener: (records: ToastRecord[]) => void) {
    toastListeners.add(listener);
    listener(toastState);
    return () => {
        toastListeners.delete(listener);
    };
}

const variantAccents: Record<ToastVariant, string> = {
    default: resolveColorTokenValue(componentColorTokens.toast.accent.default),
    success: resolveColorTokenValue(componentColorTokens.toast.accent.success),
    error: resolveColorTokenValue(componentColorTokens.toast.accent.error),
    warning: resolveColorTokenValue(componentColorTokens.toast.accent.warning),
};

const variantIconNames: Record<ToastVariant, string> = {
    default: "info",
    success: "checkmark",
    error: "error-circle",
    warning: "warning",
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(props, ref) {
    const { variant = "default", message, iconName, icon, action, className, stackState, style, ...rest } =
        props;
    const domProps = { ...rest };
    delete (domProps as Record<string, unknown>).iconName;
    delete (domProps as Record<string, unknown>).icon;
    delete (domProps as Record<string, unknown>).action;

    const liveRole = variant === "error" ? "alert" : "status";
    const ariaLive =
        variant === "error" ? undefined : variant === "warning" ? ("assertive" as const) : ("polite" as const);

    const accent = variantAccents[variant];
    const resolvedIconName = iconName ?? variantIconNames[variant];
    const iconContent = icon ?? <WebIcon name={resolvedIconName} size={iconSizes.medium} color={accent} />;

    const isPrimaryAction =
        !action || typeof action !== "object" || !("variant" in action) || action.variant === "primary";
    const actionEl =
        typeof action === "object" && action !== null && "label" in action ? (
            <Button
                variant={isPrimaryAction ? "primary" : "outline"}
                size="sm"
                onClick={action.onClick}
                className={toastStyles.actionButton}
            >
                {action.label}
            </Button>
        ) : (
            action
        );

    return (
        <div
            ref={ref}
            data-refineui="toast"
            data-variant={variant}
            data-stack-state={stackState}
            role={liveRole}
            aria-live={ariaLive}
            {...domProps}
            style={style}
            className={clsx(toastStyles.card, className)}
        >
            <div data-refineui="toast-icon" className={toastStyles.iconWrap}>
                {iconContent}
            </div>
            <div className={toastStyles.contentWrap}>
                {message != null && message !== "" ? (
                    <div className={toastStyles.message}>{message}</div>
                ) : null}
            </div>
            {action != null && actionEl}
        </div>
    );
});

type SwipeableToastProps = {
    record: ToastRecord;
    index: number;
    swipeDirections: ToastSwipeDirection[];
    onSwipeStart: () => void;
    onSwipeEnd: () => void;
};

function SwipeableToast({ record, index, swipeDirections, onSwipeStart, onSwipeEnd }: SwipeableToastProps) {
    const toastRef = useRef<HTMLDivElement | null>(null);
    const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const axisRef = useRef<"x" | "y" | null>(null);
    const offsetRef = useRef({ x: 0, y: 0 });
    const [swiping, setSwiping] = useState(false);

    const clearSwipeOffset = useCallback(() => {
        const el = toastRef.current;
        offsetRef.current = { x: 0, y: 0 };
        if (!el) return;
        el.style.setProperty("--refineui-toast-swipe-x", "0px");
        el.style.setProperty("--refineui-toast-swipe-y", "0px");
        delete el.dataset.swipeOut;
    }, []);

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (record.phase === "leaving") return;
        if (event.button !== 0) return;
        if ((event.target as HTMLElement).closest("button, a, input, textarea, select")) return;

        dragStartRef.current = { x: event.clientX, y: event.clientY, time: Date.now() };
        axisRef.current = null;
        offsetRef.current = { x: 0, y: 0 };
        event.currentTarget.setPointerCapture(event.pointerId);
        setSwiping(true);
        onSwipeStart();
    };

    const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        const start = dragStartRef.current;
        const el = toastRef.current;
        if (!start || !el) return;

        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;

        if (!axisRef.current) {
            if (Math.abs(dx) < SWIPE_DEADZONE_PX && Math.abs(dy) < SWIPE_DEADZONE_PX) return;
            axisRef.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        }

        let offsetX = 0;
        let offsetY = 0;

        if (axisRef.current === "x") {
            const dir: ToastSwipeDirection = dx > 0 ? "right" : "left";
            const allowed = swipeDirections.includes(dir);
            offsetX = allowed ? dx : dx * swipeDampening(dx);
        } else {
            const dir: ToastSwipeDirection = dy > 0 ? "bottom" : "top";
            const allowed = swipeDirections.includes(dir);
            offsetY = allowed ? dy : dy * swipeDampening(dy);
        }

        offsetRef.current = { x: offsetX, y: offsetY };
        el.style.setProperty("--refineui-toast-swipe-x", `${offsetX}px`);
        el.style.setProperty("--refineui-toast-swipe-y", `${offsetY}px`);
    };

    const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        const start = dragStartRef.current;
        const el = toastRef.current;
        dragStartRef.current = null;
        setSwiping(false);

        if (el?.hasPointerCapture(event.pointerId)) {
            el.releasePointerCapture(event.pointerId);
        }

        if (!start || !el) {
            clearSwipeOffset();
            onSwipeEnd();
            return;
        }

        const { x: offsetX, y: offsetY } = offsetRef.current;
        const axis = axisRef.current;
        axisRef.current = null;

        const amount = axis === "x" ? offsetX : axis === "y" ? offsetY : 0;
        const dir: ToastSwipeDirection =
            axis === "x" ? (amount > 0 ? "right" : "left") : amount > 0 ? "bottom" : "top";
        const allowed = axis != null && swipeDirections.includes(dir);
        const elapsed = Math.max(Date.now() - start.time, 1);
        const velocity = Math.abs(amount) / elapsed;
        const farEnough = Math.abs(amount) >= SWIPE_THRESHOLD_PX;
        const fastEnough =
            Math.abs(amount) >= SWIPE_VELOCITY_MIN_PX && velocity > SWIPE_VELOCITY;

        if (allowed && (farEnough || fastEnough)) {
            el.dataset.swipeOut = dir;
            dismissToast(record.id);
            return;
        }

        clearSwipeOffset();
        onSwipeEnd();
    };

    return (
        <Toast
            ref={toastRef}
            variant={record.variant}
            message={record.message}
            iconName={record.iconName}
            icon={record.icon}
            action={record.action}
            stackState={record.phase}
            data-swiping={swiping ? "true" : undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
                ["--refineui-toast-z-index" as string]: STACK_Z_BASE - index,
            }}
        />
    );
}

export function Toaster({
    maxToasts = DEFAULT_MAX_TOASTS,
    position = "top-center",
    swipeDirections,
    className,
}: ToasterProps) {
    const toasterKeyRef = useRef(Symbol("refineui-toaster"));
    const [isPortalOwner, setIsPortalOwner] = useState(false);
    const [records, setRecords] = useState<ToastRecord[]>([]);
    const timerMapRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const pausedRef = useRef<Set<string>>(new Set());
    const rootRef = useRef<HTMLOListElement | null>(null);
    const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
    const [layoutTick, setLayoutTick] = useState(0);
    const stackGapPx = useToastStackGapPx();
    const resolvedSwipe = swipeDirections ?? defaultSwipeDirections(position);

    useIsomorphicLayoutEffect(() => {
        const key = toasterKeyRef.current;
        // Latest mount wins — avoids duplicate portals (docs HMR / remount) that look like a stuck toast behind.
        activeToasterKey = key;
        setIsPortalOwner(true);
        notifyToasterOwners();

        const onOwnerChange = () => {
            setIsPortalOwner(activeToasterKey === key);
        };
        toasterOwnerListeners.add(onOwnerChange);

        return () => {
            toasterOwnerListeners.delete(onOwnerChange);
            if (activeToasterKey === key) {
                activeToasterKey = null;
                notifyToasterOwners();
            }
        };
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (!isPortalOwner) return;
        const root = rootRef.current;
        if (!root) return;
        // Drop orphaned toaster portals left by HMR / remounts.
        for (const el of Array.from(document.querySelectorAll('[data-refineui="toaster"]'))) {
            if (el !== root) {
                el.remove();
            }
        }
    }, [isPortalOwner]);

    useEffect(() => {
        if (!isPortalOwner) return;
        return subscribeToasts((next) => {
            setRecords(next.slice(0, Math.max(1, maxToasts)));
        });
    }, [isPortalOwner, maxToasts]);

    useEffect(() => {
        if (!isPortalOwner) return;

        for (const rec of records) {
            if (rec.phase === "leaving") continue;
            if (pausedRef.current.has(rec.id)) continue;
            if (timerMapRef.current[rec.id]) continue;
            timerMapRef.current[rec.id] = globalThis.setTimeout(() => {
                dismissToast(rec.id);
                const handle = timerMapRef.current[rec.id];
                if (handle) {
                    clearTimeout(handle);
                    delete timerMapRef.current[rec.id];
                }
            }, rec.duration);
        }

        for (const id of Object.keys(timerMapRef.current)) {
            if (!records.some((r) => r.id === id)) {
                clearTimeout(timerMapRef.current[id]);
                delete timerMapRef.current[id];
            }
        }
    }, [isPortalOwner, records]);

    useEffect(() => {
        return () => {
            for (const handle of Object.values(timerMapRef.current)) {
                clearTimeout(handle);
            }
            timerMapRef.current = {};
        };
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (!isPortalOwner) return;
        const root = rootRef.current;
        if (!root) return;

        const { front, naturalHeights, collapsedOffsets, expandedOffsets, collapsedBottom, expandedBottom, slotHeight } =
            computeStackLayout(records, itemRefs.current, stackGapPx);

        root.style.setProperty("--refineui-toast-front-height", `${front}px`);
        root.style.setProperty("--refineui-toast-gap", `${stackGapPx}px`);
        root.style.setProperty("--refineui-toast-collapsed-stack-height", `${collapsedBottom}px`);
        root.style.setProperty("--refineui-toast-expanded-stack-height", `${expandedBottom}px`);

        for (const [idx, rec] of records.entries()) {
            const li = itemRefs.current[rec.id];
            if (!li) continue;
            li.style.setProperty("--refineui-toast-offset-collapsed", `${collapsedOffsets[idx] ?? 0}px`);
            li.style.setProperty("--refineui-toast-offset-expanded", `${expandedOffsets[idx] ?? 0}px`);
            li.style.setProperty("--refineui-toast-initial-height", `${naturalHeights[idx] ?? 0}px`);
            li.style.height = `${slotHeight(idx)}px`;
        }
    }, [isPortalOwner, layoutTick, records, stackGapPx]);

    useEffect(() => {
        if (!isPortalOwner) return;
        const root = rootRef.current;
        if (!root) return;
        if (typeof ResizeObserver === "undefined") {
            setLayoutTick((t) => t + 1);
            return;
        }
        const ro = new ResizeObserver(() => {
            setLayoutTick((t) => t + 1);
        });
        ro.observe(root);
        for (const rec of records) {
            const li = itemRefs.current[rec.id];
            if (li) ro.observe(li);
        }
        return () => ro.disconnect();
    }, [isPortalOwner, records]);

    const pauseTimer = (id: string) => {
        pausedRef.current.add(id);
        const handle = timerMapRef.current[id];
        if (handle) {
            clearTimeout(handle);
            delete timerMapRef.current[id];
        }
    };

    const resumeTimer = (id: string) => {
        pausedRef.current.delete(id);
        setRecords((prev) => [...prev]);
    };

    if (typeof document === "undefined" || !isPortalOwner) {
        return null;
    }
    return createPortal(
        <ol
            ref={rootRef}
            dir="ltr"
            tabIndex={-1}
            data-refineui="toaster"
            data-position={position}
            className={clsx(toastStyles.toasterRoot, className)}
            style={{
                ["--refineui-toast-gap" as string]: `${stackGapPx}px`,
            }}
        >
            {records.map((rec, index) => (
                <li
                    key={rec.id}
                    ref={(node) => {
                        itemRefs.current[rec.id] = node;
                    }}
                    data-refineui="toast-item"
                    data-toast-id={rec.id}
                    data-index={index}
                    data-front={index === 0 ? "true" : "false"}
                    style={{
                        ["--refineui-toast-z-index" as string]: String(STACK_Z_BASE - index),
                        ["--refineui-toast-stack-index" as string]: String(index),
                    }}
                >
                    <div data-refineui="toast-scale-layer">
                        <SwipeableToast
                            record={rec}
                            index={index}
                            swipeDirections={resolvedSwipe}
                            onSwipeStart={() => pauseTimer(rec.id)}
                            onSwipeEnd={() => resumeTimer(rec.id)}
                        />
                    </div>
                </li>
            ))}
        </ol>,
        document.body,
    );
}
