import { clsx } from "clsx";
import {
    type HTMLAttributes,
    type ReactNode,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { iconSizes, spacings } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";

/** SSR에서 `useLayoutEffect` 경고 방지 */
const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

export type ToastVariant = "default" | "success" | "error" | "warning";

/** `Toaster` 고정 위치 — Web Kit 뷰포트 앵커 */
export type ToastPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

export type ToastAction =
    | ReactNode
    | {
          label: string;
          onClick?: () => void;
          variant?: "primary" | "secondary";
      };

/**
 * Web Kit **Toast** `548:655` 카드 스펙.
 * `Toaster`는 Sonner처럼 **접힌 스택** + **`ol` 호버 시 전체 세로 펼침**을 제공합니다.
 */
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: ToastVariant;
    title?: ReactNode;
    message?: ReactNode;
    iconName?: string;
    icon?: ReactNode;
    action?: ToastAction;
    /** `Toaster` 전용 — 입장·유지·퇴장 */
    stackState?: "entering" | "idle" | "leaving";
}

export interface ToastOptions {
    description?: ReactNode;
    variant?: ToastVariant;
    iconName?: string;
    /** `WebIcon` 대신 임의 ReactNode(Spinner, Avatar 등) — `toast()`에서도 사용 */
    icon?: ReactNode;
    action?: ToastAction;
    duration?: number;
}

interface ToastRecord {
    id: string;
    title?: ReactNode;
    message?: ReactNode;
    variant: ToastVariant;
    iconName?: string;
    icon?: ReactNode;
    action?: ToastAction;
    duration: number;
    phase: "entering" | "idle" | "leaving";
}

export interface ToasterProps {
    maxToasts?: number;
    /** 기본 `top-center` */
    position?: ToastPosition;
    className?: string;
}

const ENTER_MS = 20;
const LEAVE_MS = 260;
const DEFAULT_DURATION = 4200;
const DEFAULT_MAX_TOASTS = 5;
/** 스택 앞쪽이 더 높은 z-index */
const STACK_Z_BASE = 100;
const COLLAPSED_STEP_GAP = 0.85;
const COLLAPSED_STEP_FRONT = 0.035;

const TOAST_CARD_CLASS =
    "box-border flex w-refineui-toast-max-width min-w-refineui-toast-min-width max-w-refineui-toast-max-width items-center gap-refineui-size-medium rounded-refineui-xlarge border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-large shadow-refineui-4light transition-[border-color,border-width,opacity] duration-200 ease-out";

function gapPxFromSpacingToken(token: string): number {
    const n = Number.parseFloat(String(token).replace("px", ""));
    return Number.isFinite(n) && n > 0 ? n : 16;
}

/** 좁은 뷰포트·터치 환경에서 스택 세로 간격을 `sizeMedium`으로 줄임 */
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

/** 조상 `scale()` 때문에 `getBoundingClientRect().height`가 과소일 수 있어 `offsetHeight` 우선 */
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
        last >= 0
            ? (expandedOffsets[last] ?? 0) + (naturalHeights[last] ?? 0)
            : front;

    return { naturalHeights, front, collapsedOffsets, expandedOffsets, collapsedBottom, expandedBottom, slotHeight };
}

let toastState: ToastRecord[] = [];
const toastListeners = new Set<(records: ToastRecord[]) => void>();

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

export function dismissToast(id?: string) {
    if (!id) {
        setToastState(toastState.map((t) => ({ ...t, phase: "leaving" })));
        globalThis.setTimeout(() => {
            setToastState([]);
        }, LEAVE_MS);
        return;
    }
    updateToastById(id, (t) => ({ ...t, phase: "leaving" }));
    globalThis.setTimeout(() => {
        setToastState(toastState.filter((t) => t.id !== id));
    }, LEAVE_MS);
}

export function toast(title: ReactNode, options: ToastOptions = {}): string {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const record: ToastRecord = {
        id,
        title,
        message: options.description,
        variant: options.variant ?? "default",
        iconName: options.iconName,
        icon: options.icon,
        action: options.action,
        duration: options.duration ?? DEFAULT_DURATION,
        phase: "entering",
    };

    setToastState([record, ...toastState]);
    globalThis.setTimeout(() => {
        updateToastById(id, (t) => ({ ...t, phase: "idle" }));
    }, ENTER_MS);
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
    default: "var(--refineui-color-alias-foreground-primary)",
    success: "var(--refineui-color-alias-foreground-success)",
    error: "var(--refineui-color-alias-foreground-error)",
    warning: "var(--refineui-color-alias-foreground-warning)",
};

const variantIconNames: Record<ToastVariant, string> = {
    default: "info",
    success: "checkmark",
    error: "error-circle",
    warning: "warning",
};

export function Toast(props: ToastProps) {
    const { variant = "default", title, message, iconName, icon, action, className, stackState, style, ...rest } =
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
                className="shrink-0 whitespace-nowrap"
            >
                {action.label}
            </Button>
        ) : (
            action
        );

    return (
        <div
            data-refineui="toast"
            data-variant={variant}
            data-stack-state={stackState}
            role={liveRole}
            aria-live={ariaLive}
            {...domProps}
            style={style}
            className={clsx(TOAST_CARD_CLASS, className)}
        >
            {/* Web Kit `Toast / Icon` — Type은 `data-variant`·기본 글리프로 구분, 슬롯은 카드 세로 중앙 */}
            <div
                data-refineui="toast-icon"
                className="flex size-refineui-size-xxlarge shrink-0 items-center justify-center self-center"
            >
                {iconContent}
            </div>
            <div className="flex min-h-px min-w-0 flex-1 flex-col gap-refineui-size-xsmall">
                {title && <div className="refineui-typo-body-2 text-refineui-alias-foreground-primary">{title}</div>}
                {message && <div className="refineui-typo-body-3 text-refineui-alias-foreground-tertiary">{message}</div>}
            </div>
            {action != null && actionEl}
        </div>
    );
}

export function Toaster({ maxToasts = DEFAULT_MAX_TOASTS, position = "top-center", className }: ToasterProps) {
    const [records, setRecords] = useState<ToastRecord[]>([]);
    const timerMapRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const rootRef = useRef<HTMLOListElement | null>(null);
    const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
    const [layoutTick, setLayoutTick] = useState(0);
    const stackGapPx = useToastStackGapPx();

    useEffect(() => {
        return subscribeToasts((next) => {
            setRecords(next.slice(0, maxToasts));
        });
    }, [maxToasts]);

    useEffect(() => {
        for (const rec of records) {
            if (rec.phase === "leaving") continue;
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
    }, [records]);

    useEffect(() => {
        return () => {
            for (const handle of Object.values(timerMapRef.current)) {
                clearTimeout(handle);
            }
            timerMapRef.current = {};
        };
    }, []);

    useIsomorphicLayoutEffect(() => {
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
    }, [layoutTick, records, stackGapPx]);

    useEffect(() => {
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
    }, [records]);

    if (typeof document === "undefined") {
        return null;
    }
    return createPortal(
        <ol
            ref={rootRef}
            dir="ltr"
            tabIndex={-1}
            data-refineui="toaster"
            data-position={position}
            className={clsx("refineui-toaster group", className)}
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
                        <Toast
                            variant={rec.variant}
                            title={rec.title}
                            message={rec.message}
                            iconName={rec.iconName}
                            icon={rec.icon}
                            action={rec.action}
                            stackState={rec.phase}
                            style={{
                                ["--refineui-toast-z-index" as string]: STACK_Z_BASE - index,
                            }}
                        />
                    </div>
                </li>
            ))}
        </ol>,
        document.body,
    );
}
