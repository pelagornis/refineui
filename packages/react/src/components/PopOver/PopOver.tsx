import { clsx } from "clsx";
import {
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
    type ReactNode,
} from "react";
import { borderRadii, spacings } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes } from "../../componentSizes";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Slot, getMergeableTriggerChild } from "@refineui/utilities/react";
import { FloatingSurface } from "../shared/FloatingSurface";
import type { FloatingBeakSide } from "../shared/floatingOutline";
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

const BEAK_TIP_GAP = spacings.sizeXXSmall;
/** Beak protrusion plus clear space between its tip and the trigger. */
const POPOVER_GAP = `calc(${componentSizes.popoverBeakHeight} + ${BEAK_TIP_GAP})`;
const SIDE_BEAK_INSET = spacings.sizeMedium;

const beakSideByPlacement: Record<PopoverPlacement, FloatingBeakSide> = {
    bottom: "top",
    top: "bottom",
    left: "right",
    right: "left",
};

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
        const passthrough = props as TriggerProps & HTMLAttributes<HTMLElement>;
        return (
            <Slot
                ref={triggerRef}
                {...props}
                className={className}
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={contentId}
                onClick={(event) => {
                    passthrough.onClick?.(event);
                    toggle();
                }}
                onKeyDown={(event) => {
                    passthrough.onKeyDown?.(event);
                    onTriggerKeyDown(event);
                }}
            >
                {mergeEl}
            </Slot>
        );
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

    const gapStyle = floatingGapStyle(placement);
    const vertical = placement === "top" || placement === "bottom";

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
                <div
                    ref={contentRef as React.RefObject<HTMLDivElement>}
                    id={contentId}
                    role="dialog"
                    aria-modal="false"
                    tabIndex={-1}
                    data-refineui="popover"
                    data-placement={placement}
                    data-align={align}
                    className={clsx(popoverStyles.panel, className)}
                    style={{
                        ...(styleProp && typeof styleProp === "object" ? styleProp : {}),
                        minWidth: componentSizes.popoverPanelWidth,
                        padding: spacings.sizeLarge,
                        color: resolveColorTokenValue(palette.foreground),
                    }}
                    {...props}
                >
                    {children}
                </div>
                <FloatingSurface
                    panelRef={contentRef}
                    side={beakSideByPlacement[placement]}
                    align={align}
                    radius={borderRadii.roundedXXLarge}
                    beakWidth={componentSizes.popoverBeakWidth}
                    beakHeight={componentSizes.popoverBeakHeight}
                    tipRadius={componentSizes.popoverBeakTipRadius}
                    beakInsetStart={vertical ? componentSizes.popoverBeakInsetFromStartEdge : SIDE_BEAK_INSET}
                    beakInsetEnd={vertical ? componentSizes.popoverBeakInsetFromEndEdge : SIDE_BEAK_INSET}
                    backgroundColor={bg}
                    borderColor={borderCol}
                />
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
