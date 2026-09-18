import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type HTMLAttributes,
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
    type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { componentSizes, iconSizes, semanticInteraction } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
import { WebIcon } from "../../WebIcon";
import { menuStyles } from "../Menu/style";
import { Slot } from "@refineui/utilities/react";

const MENU_ATTR = "data-refineui-context-menu";
const CLOSE_MS = motionMsToNumber(semanticInteraction.duration.normal);

export type ContextMenuSelectEvent = {
    preventDefault: () => void;
    defaultPrevented: boolean;
};

interface Point {
    x: number;
    y: number;
}

interface MenuContextValue {
    open: boolean;
    point: Point;
    openAt: (x: number, y: number) => void;
    close: () => void;
}

interface SubContextValue {
    open: boolean;
    triggerRef: RefObject<HTMLElement | null>;
    show: () => void;
    hideSoon: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);
const SubContext = createContext<SubContextValue | null>(null);

function useMenu() {
    const value = useContext(MenuContext);
    if (!value) throw new Error("Context menu parts must be used inside ContextMenu.Root");
    return value;
}

function placeInView(element: HTMLElement, x: number, y: number) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const pad = 4;
    let left = x;
    let top = y;
    if (left + width > window.innerWidth - pad) left = Math.max(pad, window.innerWidth - width - pad);
    if (top + height > window.innerHeight - pad) top = Math.max(pad, window.innerHeight - height - pad);
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
}

export interface ContextMenuRootProps {
    modal?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
    className?: string;
}

export function ContextMenuRoot({ modal = true, onOpenChange, children }: ContextMenuRootProps) {
    void modal;
    const [open, setOpen] = useState(false);
    const [point, setPoint] = useState<Point>({ x: 0, y: 0 });
    const openRef = useRef(false);
    const onOpenChangeRef = useRef(onOpenChange);
    openRef.current = open;
    onOpenChangeRef.current = onOpenChange;

    const close = useCallback(() => {
        if (!openRef.current) return;
        openRef.current = false;
        setOpen(false);
        onOpenChangeRef.current?.(false);
    }, []);

    const openAt = useCallback((x: number, y: number) => {
        setPoint({ x, y });
        const wasOpen = openRef.current;
        openRef.current = true;
        setOpen(true);
        if (!wasOpen) onOpenChangeRef.current?.(true);
    }, []);

    const value = useMemo(() => ({ open, point, openAt, close }), [open, point, openAt, close]);
    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export interface ContextMenuTriggerProps extends HTMLAttributes<HTMLElement> {
    asChild?: boolean;
}

export const ContextMenuTrigger = forwardRef<HTMLElement, ContextMenuTriggerProps>(function ContextMenuTrigger(
    { asChild = false, onContextMenu, children, ...props },
    ref,
) {
    const { openAt } = useMenu();
    const shared = {
        ...props,
        ref,
        [MENU_ATTR]: "",
        onContextMenu: (event: ReactMouseEvent<HTMLElement>) => {
            onContextMenu?.(event);
            if (event.defaultPrevented) return;
            event.preventDefault();
            openAt(event.clientX, event.clientY);
        },
    };
    if (asChild) return <Slot {...shared}>{children}</Slot>;
    return (
        <span {...shared} className={clsx(menuStyles.triggerFallback, props.className)}>
            {children}
        </span>
    );
});

export function ContextMenuPortal({ children }: { children?: ReactNode }) {
    return <>{children}</>;
}

export interface ContextMenuContentProps extends HTMLAttributes<HTMLDivElement> {}

export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(function ContextMenuContent(
    { className, style, onPointerDown, children, ...props },
    ref,
) {
    const { open, point, close } = useMenu();
    const localRef = useRef<HTMLDivElement | null>(null);
    const [shouldRender, setShouldRender] = useState(open);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            setIsClosing(false);
            return;
        }
        if (!shouldRender) return;
        setIsClosing(true);
        const timeout = window.setTimeout(() => {
            setShouldRender(false);
            setIsClosing(false);
        }, CLOSE_MS);
        return () => window.clearTimeout(timeout);
    }, [open, shouldRender]);

    useLayoutEffect(() => {
        if (!shouldRender || !localRef.current) return;
        placeInView(localRef.current, point.x, point.y);
    }, [shouldRender, point.x, point.y]);

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };
        const onPointer = (event: PointerEvent) => {
            const target = event.target;
            if (target instanceof Element && target.closest(`[${MENU_ATTR}]`)) return;
            close();
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointer);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onPointer);
        };
    }, [open, close]);

    if (!shouldRender || typeof document === "undefined") return null;

    return createPortal(
        <div
            {...props}
            ref={(node) => {
                localRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
            }}
            data-refineui="menu-popover"
            data-state={isClosing ? "closed" : "open"}
            {...{ [MENU_ATTR]: "" }}
            className={menuStyles.popover}
            style={{
                position: "fixed",
                top: point.y,
                left: point.x,
                width: componentSizes.menuPanelWidth,
                minWidth: componentSizes.menuPanelWidth,
                zIndex: 9999,
                ...style,
            }}
            onPointerDown={(event) => {
                event.preventDefault();
                onPointerDown?.(event);
            }}
            onContextMenu={(event) => event.preventDefault()}
        >
            <div role="menu" data-refineui="menu" className={clsx(menuStyles.list, className)}>
                {children}
            </div>
        </div>,
        document.body,
    );
});

export interface ContextMenuItemProps extends HTMLAttributes<HTMLButtonElement> {
    disabled?: boolean;
    description?: ReactNode;
    shortcut?: ReactNode;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    state?: "default" | "hover" | "pressed" | "active" | "disabled";
    onSelect?: (event: ContextMenuSelectEvent) => void;
}

function runSelect(onSelect: ContextMenuItemProps["onSelect"], close: () => void, disabled?: boolean) {
    if (disabled) return;
    const selectEvent: ContextMenuSelectEvent = {
        defaultPrevented: false,
        preventDefault() {
            selectEvent.defaultPrevented = true;
        },
    };
    onSelect?.(selectEvent);
    if (!selectEvent.defaultPrevented) close();
}

export const ContextMenuItem = forwardRef<HTMLButtonElement, ContextMenuItemProps>(function ContextMenuItem(
    { disabled = false, description, shortcut, startIcon, endIcon, state = "default", onSelect, className, onClick, onKeyDown, children, ...props },
    ref,
) {
    const { close } = useMenu();
    const isDisabled = disabled || state === "disabled";
    const slotted = startIcon != null || description != null || shortcut != null || endIcon != null;
    return (
        <button
            ref={ref}
            type="button"
            role="menuitem"
            disabled={isDisabled}
            aria-disabled={isDisabled || undefined}
            data-refineui="menu-item"
            data-state={isDisabled ? "disabled" : state}
            {...{ [MENU_ATTR]: "" }}
            className={clsx(menuStyles.itemBase, isDisabled ? menuStyles.itemDisabled : menuStyles.itemEnabled, className)}
            {...props}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                runSelect(onSelect, close, isDisabled);
            }}
            onKeyDown={(event) => {
                onKeyDown?.(event);
                if (event.defaultPrevented) return;
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    runSelect(onSelect, close, isDisabled);
                }
            }}
        >
            {slotted ? (
                <span className={menuStyles.row}>
                    {startIcon ? (
                        <span
                            className={menuStyles.iconWrap}
                            style={{ width: iconSizes.small, minWidth: iconSizes.small, height: iconSizes.small }}
                        >
                            {startIcon}
                        </span>
                    ) : null}
                    <span className={menuStyles.textCol}>
                        <span className={menuStyles.title}>{children}</span>
                        {description ? (
                            <span className={clsx(menuStyles.description, isDisabled ? menuStyles.descriptionDisabled : menuStyles.descriptionEnabled)}>
                                {description}
                            </span>
                        ) : null}
                    </span>
                    {(shortcut || endIcon) && (
                        <span className={menuStyles.rightWrap}>
                            {shortcut ? <span className={menuStyles.shortcut}>{shortcut}</span> : null}
                            {endIcon ? (
                                <span
                                    className={menuStyles.iconWrap}
                                    style={{ width: iconSizes.small, minWidth: iconSizes.small, height: iconSizes.small }}
                                >
                                    {endIcon}
                                </span>
                            ) : null}
                        </span>
                    )}
                </span>
            ) : (
                <span className={menuStyles.row}>{children}</span>
            )}
        </button>
    );
});

export const ContextMenuSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    function ContextMenuSeparator({ className, ...props }, ref) {
        return (
            <div
                ref={ref}
                role="separator"
                aria-orientation="horizontal"
                data-refineui="menu-divider"
                {...{ [MENU_ATTR]: "" }}
                className={clsx(menuStyles.dividerWrap, className)}
                {...props}
            >
                <div className={menuStyles.dividerLine} />
            </div>
        );
    },
);

export function ContextMenuSection({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div data-refineui="menu-section" className={clsx(menuStyles.section, className)} {...props}>
            <span className={menuStyles.sectionText}>{children}</span>
        </div>
    );
}

export function ContextMenuSub({ children }: { children?: ReactNode }) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLElement | null>(null);
    const timer = useRef<number | null>(null);
    const clear = () => {
        if (timer.current != null) window.clearTimeout(timer.current);
        timer.current = null;
    };
    useEffect(() => clear, []);
    const value = useMemo<SubContextValue>(
        () => ({
            open,
            triggerRef,
            show: () => {
                clear();
                setOpen(true);
            },
            hideSoon: () => {
                clear();
                timer.current = window.setTimeout(() => setOpen(false), 150);
            },
        }),
        [open],
    );
    return <SubContext.Provider value={value}>{children}</SubContext.Provider>;
}

function useSub() {
    const value = useContext(SubContext);
    if (!value) throw new Error("ContextMenu.SubTrigger must be used inside ContextMenu.Sub");
    return value;
}

export interface ContextMenuSubTriggerProps extends HTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    description?: ReactNode;
    startIcon?: ReactNode;
}

export const ContextMenuSubTrigger = forwardRef<HTMLButtonElement, ContextMenuSubTriggerProps>(
    function ContextMenuSubTrigger({ asChild = false, description, startIcon, onMouseEnter, onMouseLeave, onClick, className, children, ...props }, ref) {
        const sub = useSub();
        const shared = {
            ...props,
            type: "button" as const,
            role: "menuitem",
            "aria-haspopup": "menu" as const,
            "aria-expanded": sub.open,
            "data-state": sub.open ? "active" : "default",
            "data-refineui": "menu-item",
            [MENU_ATTR]: "",
            className: clsx(
                menuStyles.itemBase,
                menuStyles.itemEnabled,
                sub.open && "bg-refineui-alias-background-primary-hover",
                className,
            ),
            ref: (node: HTMLButtonElement | null) => {
                (sub.triggerRef as { current: HTMLElement | null }).current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
            },
            onMouseEnter: (event: ReactMouseEvent<HTMLButtonElement>) => {
                onMouseEnter?.(event);
                sub.show();
            },
            onMouseLeave: (event: ReactMouseEvent<HTMLButtonElement>) => {
                onMouseLeave?.(event);
                sub.hideSoon();
            },
            onClick: (event: ReactMouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (!event.defaultPrevented) sub.show();
            },
        };
        if (asChild) return <Slot {...shared}>{children}</Slot>;
        return (
            <button {...shared}>
                <span className={menuStyles.row}>
                    {startIcon ? (
                        <span
                            className={menuStyles.iconWrap}
                            style={{ width: iconSizes.small, minWidth: iconSizes.small, height: iconSizes.small }}
                        >
                            {startIcon}
                        </span>
                    ) : null}
                    <span className={menuStyles.textCol}>
                        <span className={menuStyles.title}>{children}</span>
                        {description ? (
                            <span className={clsx(menuStyles.description, menuStyles.descriptionEnabled)}>
                                {description}
                            </span>
                        ) : null}
                    </span>
                    <span className={menuStyles.rightWrap}>
                        <span
                            className={menuStyles.iconWrap}
                            style={{ width: iconSizes.small, minWidth: iconSizes.small, height: iconSizes.small }}
                        >
                            <WebIcon name="chevron-right" size={iconSizes.small} color="currentColor" aria-hidden />
                        </span>
                    </span>
                </span>
            </button>
        );
    },
);

export interface ContextMenuSubContentProps extends HTMLAttributes<HTMLDivElement> {}

export const ContextMenuSubContent = forwardRef<HTMLDivElement, ContextMenuSubContentProps>(
    function ContextMenuSubContent({ className, style, onPointerDown, onMouseEnter, onMouseLeave, ...props }, ref) {
        const sub = useSub();
        const localRef = useRef<HTMLDivElement | null>(null);
        const [side, setSide] = useState<"left" | "right">("right");

        useLayoutEffect(() => {
            const trigger = sub.triggerRef.current;
            const element = localRef.current;
            if (!sub.open || !trigger || !element) return;
            const rect = trigger.getBoundingClientRect();
            const width = element.offsetWidth;
            const pad = 4;
            let left = rect.right;
            let nextSide: "left" | "right" = "right";
            if (left + width > window.innerWidth - pad) {
                left = Math.max(pad, rect.left - width);
                nextSide = "left";
            }
            setSide(nextSide);
            placeInView(element, left, rect.top);
        }, [sub.open, sub.triggerRef]);

        if (!sub.open || typeof document === "undefined") return null;

        return createPortal(
            <div
                {...props}
                ref={(node) => {
                    localRef.current = node;
                    if (typeof ref === "function") ref(node);
                    else if (ref) ref.current = node;
                }}
                role="menu"
                data-refineui="menu"
                data-submenu="true"
                data-state="open"
                data-side={side}
                {...{ [MENU_ATTR]: "" }}
                className={clsx(menuStyles.subPanel, className)}
                style={{ position: "fixed", zIndex: 10000, ...style }}
                onPointerDown={(event) => {
                    event.preventDefault();
                    onPointerDown?.(event);
                }}
                onMouseEnter={(event) => {
                    onMouseEnter?.(event);
                    sub.show();
                }}
                onMouseLeave={(event) => {
                    onMouseLeave?.(event);
                    sub.hideSoon();
                }}
                onContextMenu={(event) => event.preventDefault()}
            />,
            document.body,
        );
    },
);

export const ContextMenu = Object.assign(ContextMenuRoot, {
    Root: ContextMenuRoot,
    Trigger: ContextMenuTrigger,
    Portal: ContextMenuPortal,
    Content: ContextMenuContent,
    Item: ContextMenuItem,
    Section: ContextMenuSection,
    Separator: ContextMenuSeparator,
    Sub: ContextMenuSub,
    SubTrigger: ContextMenuSubTrigger,
    SubContent: ContextMenuSubContent,
});
