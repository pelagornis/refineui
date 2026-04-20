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
import { spacings } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes, foundationSizes } from "../../componentSizes";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { composeRef } from "../../utils/composeRef";
import { getMergeableTriggerChild } from "../../utils/mergeTriggerChild";
import { popoverFloatingClasses, popoverPlacementMargin, popoverStyles } from "./style";
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

function beakWrapperStyle(placement: PopoverPlacement, align: PopoverAlign): CSSProperties {
    const insetStart = componentSizes.popoverBeakInsetFromStartEdge;
    const insetEnd = componentSizes.popoverBeakInsetFromEndEdge;
    const edge = spacings.sizeMedium;

    switch (placement) {
        case "bottom":
            if (align === "center") return { top: `calc(-1 * ${BEAK_OFFSET})`, left: `calc(50% - ${BEAK_W} / 2)` };
            if (align === "start") return { top: `calc(-1 * ${BEAK_OFFSET})`, left: insetStart };
            return { top: `calc(-1 * ${BEAK_OFFSET})`, right: insetEnd };
        case "top":
            if (align === "center") return { bottom: `calc(-1 * ${BEAK_OFFSET})`, left: `calc(50% - ${BEAK_W} / 2)` };
            if (align === "start") return { bottom: `calc(-1 * ${BEAK_OFFSET})`, left: insetStart };
            return { bottom: `calc(-1 * ${BEAK_OFFSET})`, right: insetEnd };
        case "left":
            if (align === "center") return { right: `calc(-1 * ${BEAK_OFFSET})`, top: `calc(50% - ${BEAK_W} / 2)` };
            if (align === "start") return { right: `calc(-1 * ${BEAK_OFFSET})`, top: edge };
            return { right: `calc(-1 * ${BEAK_OFFSET})`, bottom: edge };
        case "right":
            if (align === "center") return { left: `calc(-1 * ${BEAK_OFFSET})`, top: `calc(50% - ${BEAK_W} / 2)` };
            if (align === "start") return { left: `calc(-1 * ${BEAK_OFFSET})`, top: edge };
            return { left: `calc(-1 * ${BEAK_OFFSET})`, bottom: edge };
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
    variant = "default",
    className,
    style: styleProp,
    ...props
}: PopoverContentProps) {
    const { open, contentRef, contentId } = usePopoverContext("PopoverContent");

    useFocusTrap(open, contentRef);

    const palette =
        variant === "inverted" ? componentColorTokens.popover.inverted : componentColorTokens.popover.default;

    const bg = resolveColorTokenValue(palette.background);
    const borderCol = resolveColorTokenValue(palette.border);

    const bw = beakWrapperStyle(placement, align);
    const rot = beakRotateDeg(placement);

    if (!open) return null;

    return (
        <div
            className={clsx(
                popoverStyles.floatingRoot,
                popoverFloatingClasses(placement, align),
                popoverPlacementMargin[placement],
            )}
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
                            <polygon
                                points="8,0 0,8 16,8"
                                fill={bg}
                                stroke={borderCol}
                                strokeWidth={1}
                                vectorEffect="nonScalingStroke"
                            />
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
                    data-variant={variant}
                    className={clsx(
                        popoverStyles.panel,
                        variant === "inverted" ? popoverStyles.panelShadowInverted : popoverStyles.panelShadowDefault,
                        className,
                    )}
                    style={{
                        ...(styleProp && typeof styleProp === "object" ? styleProp : {}),
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

export function PopOver({ trigger, content, placement, align, variant, className, ...props }: PopOverProps) {
    return (
        <Popover className={className} {...props}>
            <PopoverTrigger>{trigger}</PopoverTrigger>
            <PopoverContent placement={placement} align={align} variant={variant}>
                {content}
            </PopoverContent>
        </Popover>
    );
}
