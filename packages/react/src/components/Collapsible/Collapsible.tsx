import {
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type ButtonHTMLAttributes,
    type CSSProperties,
    type HTMLAttributes,
    type MouseEvent,
    type ReactNode,
} from "react";
import { clsx } from "clsx";
import { semanticInteraction } from "@refineui/tokens";
import { Slot } from "@refineui/utilities/react";

interface CollapsibleContextValue {
    open: boolean;
    toggle: () => void;
    contentId: string;
    triggerId: string;
    reduceMotion: boolean;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible() {
    const value = useContext(CollapsibleContext);
    if (!value) throw new Error("Collapsible parts must be used within Collapsible");
    return value;
}

function usePrefersReducedMotion() {
    const [reduce, setReduce] = useState(false);
    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReduce(query.matches);
        sync();
        query.addEventListener("change", sync);
        return () => query.removeEventListener("change", sync);
    }, []);
    return reduce;
}

export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    asChild?: boolean;
    children?: ReactNode;
}

/** Root — same compound pattern as Accordion / Dialog (`Collapsible` + `CollapsibleTrigger`). */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
    { open: openProp, defaultOpen = false, onOpenChange, asChild = false, className, children, ...props },
    ref,
) {
    const [uncontrolled, setUncontrolled] = useState(defaultOpen);
    const open = openProp ?? uncontrolled;
    const openRef = useRef(open);
    openRef.current = open;
    const reactId = useId();
    const reduceMotion = usePrefersReducedMotion();

    const toggle = () => {
        const next = !openRef.current;
        if (openProp === undefined) setUncontrolled(next);
        onOpenChange?.(next);
    };

    const shared = {
        ...props,
        ref,
        "data-state": open ? "open" : "closed",
        "data-refineui": "collapsible",
        className,
    };

    return (
        <CollapsibleContext.Provider
            value={{
                open,
                toggle,
                contentId: `${reactId}-content`,
                triggerId: `${reactId}-trigger`,
                reduceMotion,
            }}
        >
            {asChild ? <Slot {...shared}>{children}</Slot> : <div {...shared}>{children}</div>}
        </CollapsibleContext.Provider>
    );
});

export interface CollapsibleTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
    function CollapsibleTrigger({ asChild = false, onClick, className, children, ...props }, ref) {
        const { open, toggle, contentId, triggerId } = useCollapsible();
        const shared = {
            ...props,
            ref,
            id: triggerId,
            "aria-expanded": open,
            "aria-controls": contentId,
            "data-state": open ? "open" : "closed",
            "data-refineui": "collapsible-trigger",
            className,
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (!event.defaultPrevented) toggle();
            },
        };

        if (asChild) return <Slot {...shared}>{children}</Slot>;
        return (
            <button {...shared} type="button">
                {children}
            </button>
        );
    },
);

export interface CollapsibleContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
    function CollapsibleContent({ className, children, style, ...props }, ref) {
        const { open, contentId, triggerId, reduceMotion } = useCollapsible();
        const innerRef = useRef<HTMLDivElement | null>(null);
        const [size, setSize] = useState({ height: 0, width: 0 });

        useLayoutEffect(() => {
            const node = innerRef.current;
            if (!node) return;
            const measure = () => {
                setSize({ height: node.scrollHeight, width: node.scrollWidth });
            };
            measure();
            const observer = new ResizeObserver(measure);
            observer.observe(node);
            return () => observer.disconnect();
        }, [children, open]);

        const clipStyle = {
            ["--refineui-collapsible-content-height" as string]: `${size.height}px`,
            ["--refineui-collapsible-content-width" as string]: `${size.width}px`,
            height: open ? size.height : 0,
            overflow: "hidden",
            transition: reduceMotion
                ? undefined
                : `height ${semanticInteraction.duration.panel} ${semanticInteraction.easing.panel}`,
        } as CSSProperties;

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
                style={clipStyle}
            >
                <div ref={innerRef} className={clsx(className)} style={style}>
                    {children}
                </div>
            </div>
        );
    },
);
