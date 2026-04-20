import { clsx } from "clsx";
import type { CSSProperties, HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export interface AccordionItemProps {
    id: string;
    title: ReactNode;
    content: ReactNode;
    icon?: string;
    defaultOpen?: boolean;
}

export type AccordionSize = "small" | "medium" | "large";
export type AccordionType = "single" | "multiple";

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
    items?: AccordionItemProps[];
    type?: AccordionType;
    collapsible?: boolean;
    defaultValue?: string | string[];
    value?: string | string[];
    onValueChange?: (value: string | string[] | undefined) => void;
    /** Legacy `allowMultiple` alias. */
    allowMultiple?: boolean;
    /** Figma Web Kit: Small → Caption1, Medium → Body1, Large → SubTitle1 */
    size?: AccordionSize;
}

const triggerTypo: Record<AccordionSize, string> = {
    small: "refineui-typo-caption-1",
    medium: "refineui-typo-body-1",
    large: "refineui-typo-sub-title-1",
};

const PANEL_HEIGHT_MS = 0.38;
const PANEL_CONTENT_MS = 0.26;
const PANEL_HEIGHT_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const PANEL_CONTENT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

type OpenState = Set<string>;

interface AccordionContextValue {
    size: AccordionSize;
    isOpen: (value: string) => boolean;
    toggle: (value: string) => void;
    registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
    focusByDelta: (currentValue: string, delta: number) => void;
    focusFirst: () => void;
    focusLast: () => void;
    reduceMotion: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

interface ItemContextValue {
    value: string;
    triggerId: string;
    panelId: string;
    open: boolean;
    icon?: string;
}

const AccordionItemContext = createContext<ItemContextValue | null>(null);

function usePrefersReducedMotion(): boolean {
    const [reduce, setReduce] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReduce(mql.matches);
        sync();
        mql.addEventListener("change", sync);
        return () => mql.removeEventListener("change", sync);
    }, []);
    return reduce;
}

function toSet(value: string | string[] | undefined, type: AccordionType): OpenState {
    if (value == null) return new Set();
    if (Array.isArray(value)) return new Set(value);
    return type === "multiple" ? new Set([value]) : new Set([value]);
}

export function Accordion({
    items,
    type,
    collapsible = false,
    defaultValue,
    value,
    onValueChange,
    allowMultiple = false,
    size = "medium",
    className,
    children,
    ...props
}: AccordionProps) {
    const reduceMotion = usePrefersReducedMotion();
    const resolvedType: AccordionType = type ?? (allowMultiple ? "multiple" : "single");
    const legacyDefault = useMemo(() => {
        if (!items) return undefined;
        const opened = items.filter((i) => i.defaultOpen).map((i) => i.id);
        if (opened.length === 0) return undefined;
        return resolvedType === "multiple" ? opened : opened[0];
    }, [items, resolvedType]);

    const initial = toSet(defaultValue ?? legacyDefault, resolvedType);
    const [uncontrolledOpen, setUncontrolledOpen] = useState<OpenState>(initial);
    const open = value === undefined ? uncontrolledOpen : toSet(value, resolvedType);

    const triggerOrderRef = useRef<string[]>([]);
    const triggerMapRef = useRef<Map<string, HTMLButtonElement>>(new Map());

    const registerTrigger = useCallback((itemValue: string, el: HTMLButtonElement | null) => {
        if (!triggerOrderRef.current.includes(itemValue)) {
            triggerOrderRef.current.push(itemValue);
        }
        if (el) triggerMapRef.current.set(itemValue, el);
        else triggerMapRef.current.delete(itemValue);
    }, []);

    const emit = useCallback(
        (next: OpenState) => {
            if (value === undefined) setUncontrolledOpen(next);
            if (!onValueChange) return;
            if (resolvedType === "multiple") onValueChange(Array.from(next));
            else onValueChange(Array.from(next)[0]);
        },
        [onValueChange, resolvedType, value],
    );

    const toggle = useCallback(
        (itemValue: string) => {
            const next = new Set(open);
            const opened = next.has(itemValue);
            if (opened) {
                if (resolvedType === "multiple" || collapsible) next.delete(itemValue);
            } else {
                if (resolvedType === "single") next.clear();
                next.add(itemValue);
            }
            emit(next);
        },
        [collapsible, emit, open, resolvedType],
    );

    const focusTrigger = (index: number) => {
        const list = triggerOrderRef.current
            .map((v) => triggerMapRef.current.get(v))
            .filter(Boolean) as HTMLButtonElement[];
        const n = list.length;
        if (n === 0) return;
        list[((index % n) + n) % n]?.focus();
    };

    const focusByDelta = useCallback((currentValue: string, delta: number) => {
        const idx = triggerOrderRef.current.indexOf(currentValue);
        focusTrigger(idx < 0 ? 0 : idx + delta);
    }, []);

    const contextValue = useMemo<AccordionContextValue>(
        () => ({
            size,
            isOpen: (itemValue: string) => open.has(itemValue),
            toggle,
            registerTrigger,
            focusByDelta,
            focusFirst: () => focusTrigger(0),
            focusLast: () => focusTrigger(triggerOrderRef.current.length - 1),
            reduceMotion,
        }),
        [focusByDelta, open, reduceMotion, registerTrigger, size, toggle],
    );

    const legacyChildren =
        items?.map((item) => (
            <AccordionItem key={item.id} value={item.id} icon={item.icon}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
        )) ?? null;

    return (
        <AccordionContext.Provider value={contextValue}>
            <div data-refineui="accordion" className={className} {...props}>
                {children ?? legacyChildren}
            </div>
        </AccordionContext.Provider>
    );
}

export interface AccordionItemSlotProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    icon?: string;
}

export function AccordionItem({ value, icon, className, children, ...props }: AccordionItemSlotProps) {
    const accordion = useContext(AccordionContext);
    if (!accordion) throw new Error("AccordionItem must be used within Accordion.");
    const uid = useId().replace(/:/g, "");
    const triggerId = `accordion-trigger-${uid}-${value}`;
    const panelId = `accordion-panel-${uid}-${value}`;

    return (
        <AccordionItemContext.Provider
            value={{ value, open: accordion.isOpen(value), triggerId, panelId, icon }}
        >
            <div className={className} {...props}>
                {children}
            </div>
        </AccordionItemContext.Provider>
    );
}

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
    const accordion = useContext(AccordionContext);
    const item = useContext(AccordionItemContext);
    if (!accordion || !item) throw new Error("AccordionTrigger must be used within AccordionItem.");

    const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                accordion.focusByDelta(item.value, 1);
                break;
            case "ArrowUp":
                e.preventDefault();
                accordion.focusByDelta(item.value, -1);
                break;
            case "Home":
                e.preventDefault();
                accordion.focusFirst();
                break;
            case "End":
                e.preventDefault();
                accordion.focusLast();
                break;
            default:
                break;
        }
    };

    return (
        <button
            ref={(el) => accordion.registerTrigger(item.value, el)}
            type="button"
            data-refineui="accordion-trigger"
            aria-expanded={item.open}
            aria-controls={item.panelId}
            id={item.triggerId}
            onClick={() => accordion.toggle(item.value)}
            onKeyDown={onTriggerKeyDown}
            className={clsx(
                triggerTypo[accordion.size],
                "flex min-h-refineui-control-touch-min w-full cursor-pointer items-center justify-between gap-refineui-size-medium border-none bg-transparent px-refineui-size-medium py-refineui-size-small text-left text-refineui-alias-foreground-primary",
                className,
            )}
            {...props}
        >
            <span className="flex min-w-0 flex-1 items-center gap-refineui-size-medium">
                {item.icon ? <WebIcon name={item.icon} size={iconSizes.small} color="currentColor" /> : null}
                {children}
            </span>
            <WebIcon
                name={item.open ? "chevron-up" : "chevron-down"}
                size={iconSizes.small}
                color="currentColor"
                fallback="▼"
            />
        </button>
    );
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {}

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
    const accordion = useContext(AccordionContext);
    const item = useContext(AccordionItemContext);
    if (!accordion || !item) throw new Error("AccordionContent must be used within AccordionItem.");

    const gridStyle: CSSProperties = {
        display: "grid",
        gridTemplateRows: item.open ? "1fr" : "0fr",
        transition: accordion.reduceMotion
            ? undefined
            : `grid-template-rows ${PANEL_HEIGHT_MS}s ${PANEL_HEIGHT_EASE}`,
    };
    const innerMotionStyle: CSSProperties = {
        padding: "0 var(--refineui-spacing-size-medium) var(--refineui-spacing-size-medium)",
        opacity: item.open ? 1 : 0,
        transform: item.open
            ? "translate3d(0, 0, 0)"
            : "translate3d(0, calc(-1 * var(--refineui-spacing-size-small)), 0)",
        transition: accordion.reduceMotion
            ? undefined
            : `opacity ${PANEL_CONTENT_MS}s ${PANEL_CONTENT_EASE}, transform ${PANEL_CONTENT_MS}s ${PANEL_CONTENT_EASE}`,
        pointerEvents: item.open ? undefined : "none",
    };

    return (
        <div
            id={item.panelId}
            role="region"
            aria-labelledby={item.triggerId}
            aria-hidden={!item.open}
            data-refineui="accordion-panel"
            style={gridStyle}
        >
            <div className="min-h-0 overflow-hidden">
                <div style={innerMotionStyle}>
                    <div className={clsx(className)} {...props}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
