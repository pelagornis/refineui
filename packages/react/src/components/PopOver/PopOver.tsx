import { clsx } from "clsx";
import {
    cloneElement,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type KeyboardEvent,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
    type Ref,
} from "react";
import { spacings, strokeWidths } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes, foundationSizes } from "../../componentSizes";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { composeRef } from "../../utils/composeRef";
import { getMergeableTriggerChild } from "../../utils/mergeTriggerChild";
import { popoverFloatingClasses, popoverStyles } from "./style";
import type {
    PopOverProps,
    PopoverAlign,
    PopoverContentProps,
    PopoverPlacement,
    PopoverProps,
    PopoverTriggerProps,
} from "./types";

type TriggerProps = {
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
};

type TriggerElement = ReactElement<TriggerProps> & { ref?: Ref<HTMLElement | null> };

type PopoverContextValue = {
    open: boolean;
    setOpen: (next: boolean) => void;
    toggle: () => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    triggerRef: React.RefObject<HTMLElement | null>;
    contentId: string;
    onTriggerKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string): PopoverContextValue {
    const ctx = useContext(PopoverContext);
    if (!ctx) throw new Error(`${component} must be used within <Popover>`);
    return ctx;
}

const BEAK_W = foundationSizes.foundationSize160;
const BEAK_H = foundationSizes.foundationSize80;
const BEAK_OFFSET = foundationSizes.foundationSize80;
const BEAK_BORDER_OVERLAP = strokeWidths.strokeWidthThin;
const POPOVER_GAP = spacings.sizeMedium;

function beakWrapperStyle(placement: PopoverPlacement, align: PopoverAlign): CSSProperties {
    const insetStart = componentSizes.popoverBeakInsetFromStartEdge;
    const insetEnd = componentSizes.popoverBeakInsetFromEndEdge;
    const edge = spacings.sizeMedium;

    const overlapOffset = `calc(-1 * ${BEAK_OFFSET} + ${BEAK_BORDER_OVERLAP})`;

    switch (placement) {
        case "bottom":
            if (align === "center") return { top: overlapOffset, left: `calc(50% - ${BEAK_W} / 2)` };
            if (align === "start") return { top: overlapOffset, left: insetStart };
            return { top: overlapOffset, right: insetEnd };
        case "top":
            if (align === "center") return { bottom: overlapOffset, left: `calc(50% - ${BEAK_W} / 2)` };
            if (align === "start") return { bottom: overlapOffset, left: insetStart };
            return { bottom: overlapOffset, right: insetEnd };
        case "left":
            if (align === "center") return { right: overlapOffset, top: `calc(50% - ${BEAK_W} / 2)` };
            if (align === "start") return { right: overlapOffset, top: edge };
            return { right: overlapOffset, bottom: edge };
        case "right":
            if (align === "center") return { left: overlapOffset, top: `calc(50% - ${BEAK_W} / 2)` };
            if (align === "start") return { left: overlapOffset, top: edge };
            return { left: overlapOffset, bottom: edge };
        default:
            return {};
    }
}

function beakRotateDeg(placement: PopoverPlacement): number {
    switch (placement) {
        case "bottom":
            return 0;
        case "top":
            return 180;
        case "left":
            return -90;
        case "right":
            return 90;
        default:
            return 0;
    }
}

function floatingGapStyle(placement: PopoverPlacement): CSSProperties {
    if (placement === "top") return { marginBottom: POPOVER_GAP };
    if (placement === "bottom") return { marginTop: POPOVER_GAP };
    if (placement === "left") return { marginRight: POPOVER_GAP };
    return { marginLeft: POPOVER_GAP };
}

export function Popover({ children, className, open: openProp, defaultOpen = false, onOpenChange, ...props }: PopoverProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = openProp ?? internalOpen;
    const setOpen = useCallback(
        (next: boolean) => {
            if (openProp === undefined) setInternalOpen(next);
            onOpenChange?.(next);
        },
        [openProp, onOpenChange],
    );
    const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const contentId = useId();

    useEffect(() => {
        const handler = (e: globalThis.MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, setOpen]);

    useEffect(() => {
        const onKey = (e: Event) => {
            if (e instanceof KeyboardEvent && e.key === "Escape") setOpen(false);
        };
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, setOpen]);

    const onTriggerKeyDown = useCallback(
        (e: KeyboardEvent<HTMLElement>) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
            }
        },
        [toggle],
    );

    const value = useMemo<PopoverContextValue>(
        () => ({
            open,
            setOpen,
            toggle,
            containerRef,
            contentRef,
            triggerRef,
            contentId,
            onTriggerKeyDown,
        }),
        [open, setOpen, toggle, contentId, onTriggerKeyDown],
    );

    return (
        <PopoverContext.Provider value={value}>
            <div
                ref={containerRef}
                data-refineui="popover-root"
                className={clsx(popoverStyles.root, className)}
                {...props}
            >
                {children}
            </div>
        </PopoverContext.Provider>
    );
}

export function PopoverTrigger({ children, className, ...props }: PopoverTriggerProps) {
    const { open, toggle, triggerRef, contentId, onTriggerKeyDown } = usePopoverContext("PopoverTrigger");

    const mergeEl = getMergeableTriggerChild(children);
    if (mergeEl) {
        const el = mergeEl as unknown as TriggerElement;
        const passthrough = props as TriggerProps & HTMLAttributes<HTMLElement>;
        const passthroughCn = (props as HTMLAttributes<HTMLElement>).className;
        return cloneElement(el, {
            ...props,
            ref: composeRef(triggerRef, el.ref),
            className: clsx(className, passthroughCn, (el.props as HTMLAttributes<HTMLElement>).className),
            "aria-expanded": open,
            "aria-haspopup": "dialog" as const,
            "aria-controls": contentId,
            onClick: (e: MouseEvent<HTMLElement>) => {
                passthrough.onClick?.(e as unknown as MouseEvent<HTMLElement>);
                el.props.onClick?.(e);
                toggle();
            },
            onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
                passthrough.onKeyDown?.(e as unknown as KeyboardEvent<HTMLElement>);
                el.props.onKeyDown?.(e);
                onTriggerKeyDown(e);
            },
        } as Partial<TriggerProps>);
    }

    const passthroughBtn = props as HTMLAttributes<HTMLButtonElement>;

    return (
        <button
            type="button"
            ref={triggerRef as React.RefObject<HTMLButtonElement>}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls={contentId}
            className={clsx(
                popoverStyles.fallbackTrigger,
                className,
                passthroughBtn.className,
            )}
            {...props}
            onClick={(e) => {
                passthroughBtn.onClick?.(e);
                toggle();
            }}
            onKeyDown={(e) => {
                passthroughBtn.onKeyDown?.(e);
                onTriggerKeyDown(e);
            }}
        >
            {children}
        </button>
    );
}

export function PopoverContent({
    children,
    placement = "bottom",
    align = "center",
    className,
    style: styleProp,
    ...props
}: PopoverContentProps) {
    const { open, contentRef, contentId } = usePopoverContext("PopoverContent");

    useFocusTrap(open, contentRef);

    const palette = componentColorTokens.popover.default;

    const bg = resolveColorTokenValue(palette.background);
    const borderCol = resolveColorTokenValue(palette.border);

    const bw = beakWrapperStyle(placement, align);
    const rot = beakRotateDeg(placement);
    const gapStyle = floatingGapStyle(placement);

    if (!open) return null;

    return (
        <div
            className={clsx(
                popoverStyles.floatingRoot,
                popoverFloatingClasses(placement, align),
            )}
            style={gapStyle}
        >
            <div className={popoverStyles.panelWrap}>
                <div className={popoverStyles.beakWrap} style={{ ...bw, width: BEAK_W, height: BEAK_H }} aria-hidden>
                    <div
                        style={{
                            width: BEAK_W,
                            height: BEAK_H,
                            transform: `rotate(${rot}deg)`,
                            transformOrigin: "center center",
                        }}
                    >
                        <svg
                            width={BEAK_W}
                            height={BEAK_H}
                            viewBox="0 0 16 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ display: "block" }}
                        >
                            <polygon points="8,0 0,8 16,8" fill={borderCol} />
                            <polygon points="8,2 2,8 14,8" fill={bg} />
                        </svg>
                    </div>
                </div>
                <div
                    ref={contentRef as React.RefObject<HTMLDivElement>}
                    id={contentId}
                    role="dialog"
                    aria-modal="false"
                    tabIndex={-1}
                    data-refineui="popover"
                    data-placement={placement}
                    data-align={align}
                    className={clsx(
                        popoverStyles.panel,
                        popoverStyles.panelShadowDefault,
                        className,
                    )}
                    style={{
                        ...(styleProp && typeof styleProp === "object" ? styleProp : {}),
                        minWidth: componentSizes.popoverPanelWidth,
                        padding: spacings.sizeLarge,
                        backgroundColor: bg,
                        color: resolveColorTokenValue(palette.foreground),
                        borderColor: borderCol,
                    }}
                    {...props}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

export function PopOver({
    trigger,
    content,
    placement,
    align,
    className,
    ...props
}: PopOverProps) {
    return (
        <Popover className={className} {...props}>
            <PopoverTrigger>{trigger}</PopoverTrigger>
            <PopoverContent placement={placement} align={align}>
                {content}
            </PopoverContent>
        </Popover>
    );
}
