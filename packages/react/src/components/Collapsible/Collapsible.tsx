import {
    forwardRef,
    useCallback,
    useId,
    useMemo,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type MouseEvent,
    type ReactNode,
} from "react";
import { clsx } from "clsx";
import { Slot } from "@refineui/utilities/react";
import { Button, type ButtonProps } from "../Button";
import {
    CollapsibleContext,
    PANEL_CONTENT_EASE,
    PANEL_CONTENT_MS,
    PANEL_HEIGHT_EASE,
    PANEL_HEIGHT_MS,
    useCollapsibleContext,
    usePrefersReducedMotion,
} from "./context";
import { collapsibleStyles } from "./style";

export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    asChild?: boolean;
    children?: ReactNode;
}

/** Root — compound pattern aligned with Accordion (`Collapsible` + Trigger + Content). */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
    { open: openProp, defaultOpen = false, onOpenChange, asChild = false, className, children, ...props },
    ref,
) {
    const [uncontrolled, setUncontrolled] = useState(defaultOpen);
    const open = openProp ?? uncontrolled;
    const reactId = useId();
    const reduceMotion = usePrefersReducedMotion();

    const toggle = useCallback(() => {
        const next = !(openProp ?? uncontrolled);
        if (openProp === undefined) setUncontrolled(next);
        onOpenChange?.(next);
    }, [onOpenChange, openProp, uncontrolled]);

    const contextValue = useMemo(
        () => ({
            open,
            toggle,
            contentId: `${reactId}-content`,
            triggerId: `${reactId}-trigger`,
            reduceMotion,
        }),
        [open, reactId, reduceMotion, toggle],
    );

    const shared = {
        ...props,
        ref,
        "data-state": open ? ("open" as const) : ("closed" as const),
        "data-refineui": "collapsible",
        className,
    };

    return (
        <CollapsibleContext.Provider value={contextValue}>
            {asChild ? <Slot {...shared}>{children}</Slot> : <div {...shared}>{children}</div>}
        </CollapsibleContext.Provider>
    );
});

export interface CollapsibleTriggerProps extends ButtonProps {
    asChild?: boolean;
}

/** Default surface is Button `ghost` — use `layout="icon"` for chevron-only triggers. */
export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
    function CollapsibleTrigger(
        {
            asChild = false,
            onClick,
            className,
            children,
            variant = "ghost",
            size,
            layout,
            fullWidth,
            type = "button",
            ...props
        },
        ref,
    ) {
        const { open, toggle, contentId, triggerId } = useCollapsibleContext("CollapsibleTrigger");
        const shared = {
            ...props,
            ref,
            id: triggerId,
            "aria-expanded": open,
            "aria-controls": contentId,
            "data-state": open ? ("open" as const) : ("closed" as const),
            className,
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (!event.defaultPrevented) toggle();
            },
        };

        if (asChild) return <Slot {...shared}>{children}</Slot>;
        return (
            <Button
                {...shared}
                type={type}
                variant={variant}
                size={size}
                layout={layout}
                fullWidth={fullWidth}
            >
                {children}
            </Button>
        );
    },
);

export interface CollapsibleContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
}

/**
 * Height clip via `grid-template-rows` (same technique as AccordionContent) —
 * no scrollHeight / ResizeObserver.
 */
export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
    function CollapsibleContent({ className, children, style, ...props }, ref) {
        const { open, contentId, triggerId, reduceMotion } = useCollapsibleContext("CollapsibleContent");

        const gridStyle: CSSProperties = {
            display: "grid",
            gridTemplateRows: open ? "1fr" : "0fr",
            transition: reduceMotion
                ? undefined
                : `grid-template-rows ${PANEL_HEIGHT_MS}s ${PANEL_HEIGHT_EASE}`,
        };
        const innerMotionStyle: CSSProperties = {
            opacity: open ? 1 : 0,
            transform: open
                ? "translate3d(0, 0, 0)"
                : "translate3d(0, calc(-1 * var(--refineui-spacing-size-x-small)), 0)",
            transition: reduceMotion
                ? undefined
                : `opacity ${PANEL_CONTENT_MS}s ${PANEL_CONTENT_EASE}, transform ${PANEL_CONTENT_MS}s ${PANEL_CONTENT_EASE}`,
            pointerEvents: open ? undefined : "none",
            ...style,
        };

        return (
            <div
                {...props}
                ref={ref}
                id={contentId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!open}
                data-state={open ? "open" : "closed"}
                data-refineui="collapsible-content"
                style={gridStyle}
            >
                <div className={collapsibleStyles.panelOuter}>
                    <div className={clsx(className)} style={innerMotionStyle}>
                        {children}
                    </div>
                </div>
            </div>
        );
    },
);
