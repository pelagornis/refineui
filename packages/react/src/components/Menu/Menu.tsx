import { clsx } from "clsx";
import type {
    CSSProperties,
    Dispatch,
    KeyboardEvent as ReactKeyboardEvent,
    MouseEvent,
    ReactElement,
    ReactNode,
    RefObject,
    SetStateAction,
} from "react";
import {
    cloneElement,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { iconSizes, semanticInteraction, spacings, zIndex } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
import { getMergeableTriggerChild } from "@refineui/utilities/react";
import { componentSizes } from "../../componentSizes";
import { WebIcon } from "../../WebIcon";
import { computeSubmenuPanelPosition, subscribeScrollAndScrollableAncestors } from "../Dropdown/positioning";
import { menuStyles } from "./style";
import type {
    MenuDividerProps,
    MenuItemProps,
    MenuListProps,
    MenuPopoverProps,
    MenuPositioning,
    MenuProps,
    MenuSectionProps,
    MenuSubContentProps,
    MenuSubTriggerProps,
} from "./types";

const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

function parseCssPx(value: string, fallback: number): number {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
}

type MenuContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
    positioning?: MenuPositioning;
    rootRef: RefObject<HTMLDivElement>;
    popoverRef: RefObject<HTMLDivElement>;
    registerSubPanel: (el: HTMLDivElement | null) => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(componentName: string): MenuContextValue {
    const ctx = useContext(MenuContext);
    if (!ctx) {
        throw new Error(`${componentName} must be used within Menu.`);
    }
    return ctx;
}

export function Menu({ children, className, positioning, ...props }: MenuProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const subPanelRef = useRef<HTMLDivElement | null>(null);

    const registerSubPanel = useCallback((el: HTMLDivElement | null) => {
        subPanelRef.current = el;
    }, []);

    const value = useMemo(
        () => ({ open, setOpen, positioning, rootRef, popoverRef, registerSubPanel }),
        [open, positioning, registerSubPanel],
    );

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (
                rootRef.current?.contains(target) ||
                popoverRef.current?.contains(target) ||
                subPanelRef.current?.contains(target)
            ) {
                return;
            }
            setOpen(false);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <MenuContext.Provider value={value}>
            <div
                ref={rootRef}
                data-refineui="menu-root"
                className={clsx(menuStyles.root, className)}
                {...props}
            >
                {children}
            </div>
        </MenuContext.Provider>
    );
}

type MenuTriggerProps = {
    children: ReactNode;
};

export function MenuTrigger({ children }: MenuTriggerProps) {
    const { open, setOpen } = useMenuContext("MenuTrigger");

    const mergeEl = getMergeableTriggerChild(children);
    if (mergeEl) {
        const el = mergeEl as ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>;
        return cloneElement(el, {
            "aria-expanded": open,
            "aria-haspopup": "menu" as const,
            onClick: (e: MouseEvent<HTMLElement>) => {
                el.props.onClick?.(e);
                setOpen(!open);
            },
        } as never);
    }

    return (
        <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            className={menuStyles.triggerFallback}
            onClick={() => setOpen(!open)}
        >
            {children}
        </button>
    );
}

export function MenuPopover({ className, children, style, ...props }: MenuPopoverProps) {
    const { open, positioning, rootRef, popoverRef } = useMenuContext("MenuPopover");
    const [shouldRender, setShouldRender] = useState(open);
    const [isClosing, setIsClosing] = useState(false);
    const [fixedStyle, setFixedStyle] = useState<CSSProperties | null>(null);

    const gapPx = parseCssPx(spacings.sizeXXSmall, 4);
    const z = Number.parseInt(String(zIndex.zIndexMessages), 10) || 10000;

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            setIsClosing(false);
            return;
        }

        if (!shouldRender) {
            return;
        }

        setIsClosing(true);
        const timeout = window.setTimeout(() => {
            setShouldRender(false);
            setIsClosing(false);
            setFixedStyle(null);
        }, motionMsToNumber(semanticInteraction.duration.normal));

        return () => window.clearTimeout(timeout);
    }, [open, shouldRender]);

    useIsomorphicLayoutEffect(() => {
        if (!open) {
            return;
        }

        const apply = () => {
            const anchor = rootRef.current;
            if (!anchor) return;
            const rect = anchor.getBoundingClientRect();
            setFixedStyle({
                position: "fixed",
                top: rect.bottom + gapPx,
                left: rect.left,
                minWidth: componentSizes.menuPanelWidth,
                width: positioning?.autoSize ? "max-content" : undefined,
                maxWidth: "min(100vw - 16px, 24rem)",
                zIndex: z,
            });
        };

        apply();
        const raf = requestAnimationFrame(apply);
        window.addEventListener("resize", apply);
        const unsubScroll = subscribeScrollAndScrollableAncestors(rootRef.current, apply);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", apply);
            unsubScroll();
        };
    }, [open, gapPx, positioning?.autoSize, rootRef, z]);

    if (!shouldRender || !fixedStyle || typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div
            ref={popoverRef}
            data-refineui="menu-popover"
            data-state={isClosing ? "closed" : "open"}
            className={clsx(menuStyles.popover, className)}
            style={{ ...fixedStyle, ...style }}
            {...props}
        >
            {children}
        </div>,
        document.body,
    );
}

export function MenuList({ className, ...props }: MenuListProps) {
    return (
        <div
            data-refineui="menu"
            role="menu"
            className={clsx(menuStyles.list, className)}
            {...props}
        />
    );
}

/** Web Kit `Menu / Section` (`633:4258`) */
export function MenuSection({ className, children, ...props }: MenuSectionProps) {
    return (
        <div
            data-refineui="menu-section"
            className={clsx(menuStyles.section, className)}
            {...props}
        >
            <span className={menuStyles.sectionText}>{children}</span>
        </div>
    );
}

/** Web Kit `Menu / Section` Divider (`633:4263`) */
export function MenuDivider({ className, ...props }: MenuDividerProps) {
    return (
        <div
            data-refineui="menu-divider"
            role="separator"
            aria-orientation="horizontal"
            className={clsx(menuStyles.dividerWrap, className)}
            {...props}
        >
            <div className={menuStyles.dividerLine} />
        </div>
    );
}

export function MenuItem({
    children,
    description,
    shortcut,
    startIcon,
    endIcon,
    className,
    disabled,
    state = "default",
    onClick,
    onKeyDown,
    ...props
}: MenuItemProps) {
    const menu = useContext(MenuContext);
    const isDisabled = disabled || state === "disabled";
    const resolvedState = isDisabled ? "disabled" : state;

    const closeIfInMenu = () => {
        if (!isDisabled) {
            menu?.setOpen(false);
        }
    };

    return (
        <button
            data-refineui="menu-item"
            data-state={resolvedState}
            role="menuitem"
            type="button"
            disabled={isDisabled}
            className={clsx(
                menuStyles.itemBase,
                isDisabled ? menuStyles.itemDisabled : menuStyles.itemEnabled,
                className,
            )}
            onClick={(event) => {
                onClick?.(event);
                if (!event.defaultPrevented) {
                    closeIfInMenu();
                }
            }}
            onKeyDown={(event: ReactKeyboardEvent<HTMLButtonElement>) => {
                onKeyDown?.(event);
                if (event.key === "Enter" || event.key === " ") {
                    if (!event.defaultPrevented) {
                        closeIfInMenu();
                    }
                }
            }}
            {...props}
        >
            <span className={menuStyles.row}>
                {startIcon ? (
                    <span
                        className={menuStyles.iconWrap}
                        style={{
                            width: iconSizes.small,
                            minWidth: iconSizes.small,
                            height: iconSizes.small,
                        }}
                    >
                        {startIcon}
                    </span>
                ) : null}
                <span className={menuStyles.textCol}>
                    <span className={menuStyles.title}>{children}</span>
                    {description ? (
                        <span
                            className={clsx(
                                menuStyles.description,
                                isDisabled
                                    ? menuStyles.descriptionDisabled
                                    : menuStyles.descriptionEnabled,
                            )}
                        >
                            {description}
                        </span>
                    ) : null}
                </span>
                {(shortcut || endIcon) && (
                    <span className={menuStyles.rightWrap}>
                        {shortcut ? (
                            <span className={menuStyles.shortcut}>{shortcut}</span>
                        ) : null}
                        {endIcon ? (
                            <span
                                className={menuStyles.iconWrap}
                                style={{
                                    width: iconSizes.small,
                                    minWidth: iconSizes.small,
                                    height: iconSizes.small,
                                }}
                            >
                                {endIcon}
                            </span>
                        ) : null}
                    </span>
                )}
            </span>
        </button>
    );
}

type MenuSubCtx = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    triggerRef: RefObject<HTMLButtonElement>;
    openIntent: () => void;
    closeIntent: () => void;
    cancelClose: () => void;
};

const MenuSubContext = createContext<MenuSubCtx | null>(null);

/** Hover open/close — short open, longer close so the pointer can cross the gap */
const SUBMENU_OPEN_DELAY_MS = 75;
const SUBMENU_CLOSE_DELAY_MS = 220;

function isFinePointerHover(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function useMenuSub(componentName: string): MenuSubCtx {
    const ctx = useContext(MenuSubContext);
    if (!ctx) {
        throw new Error(`${componentName} must be used within MenuSub.`);
    }
    return ctx;
}

/** Nested menu branch — chevron item opens a sibling panel (Web Kit endIcon / submenu). */
export function MenuSub({ children }: { children: ReactNode }) {
    const [subOpen, setSubOpen] = useState(false);
    const subOpenRef = useRef(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const openTimerRef = useRef<number | null>(null);
    const closeTimerRef = useRef<number | null>(null);
    const menu = useContext(MenuContext);

    subOpenRef.current = subOpen;

    const clearTimers = useCallback(() => {
        if (openTimerRef.current != null) {
            window.clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }
        if (closeTimerRef.current != null) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    const cancelClose = useCallback(() => {
        if (closeTimerRef.current != null) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    const openIntent = useCallback(() => {
        cancelClose();
        if (subOpenRef.current) return;
        if (openTimerRef.current != null) return;
        openTimerRef.current = window.setTimeout(() => {
            openTimerRef.current = null;
            setSubOpen(true);
        }, SUBMENU_OPEN_DELAY_MS);
    }, [cancelClose]);

    const closeIntent = useCallback(() => {
        if (openTimerRef.current != null) {
            window.clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }
        if (closeTimerRef.current != null) return;
        closeTimerRef.current = window.setTimeout(() => {
            closeTimerRef.current = null;
            setSubOpen(false);
        }, SUBMENU_CLOSE_DELAY_MS);
    }, []);

    const setOpen = useCallback<Dispatch<SetStateAction<boolean>>>(
        (value) => {
            clearTimers();
            setSubOpen(value);
        },
        [clearTimers],
    );

    const ctx = useMemo(
        () => ({ open: subOpen, setOpen, triggerRef, openIntent, closeIntent, cancelClose }),
        [subOpen, setOpen, openIntent, closeIntent, cancelClose],
    );

    useEffect(() => {
        if (menu && !menu.open) {
            clearTimers();
            setSubOpen(false);
        }
    }, [menu, menu?.open, clearTimers]);

    useEffect(() => () => clearTimers(), [clearTimers]);

    return <MenuSubContext.Provider value={ctx}>{children}</MenuSubContext.Provider>;
}

export function MenuSubTrigger({
    children,
    description,
    startIcon,
    className,
    disabled,
    state = "default",
    onClick,
    onPointerEnter,
    onPointerLeave,
    ...props
}: MenuSubTriggerProps) {
    const { open, setOpen, triggerRef, openIntent, closeIntent, cancelClose } = useMenuSub("MenuSubTrigger");
    const isDisabled = disabled || state === "disabled";
    const resolvedState = isDisabled ? "disabled" : open ? "active" : state;

    return (
        <button
            ref={triggerRef}
            data-refineui="menu-item"
            data-slot="menu-sub-trigger"
            data-state={resolvedState}
            role="menuitem"
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            disabled={isDisabled}
            className={clsx(
                menuStyles.itemBase,
                isDisabled ? menuStyles.itemDisabled : menuStyles.itemEnabled,
                open && !isDisabled && "bg-refineui-alias-background-primary-hover",
                className,
            )}
            onPointerEnter={(event) => {
                onPointerEnter?.(event);
                if (!isDisabled && isFinePointerHover()) {
                    openIntent();
                }
            }}
            onPointerLeave={(event) => {
                onPointerLeave?.(event);
                if (!isDisabled && isFinePointerHover()) {
                    closeIntent();
                }
            }}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented || isDisabled) return;
                cancelClose();
                if (isFinePointerHover()) {
                    setOpen(true);
                } else {
                    setOpen((value) => !value);
                }
            }}
            {...props}
        >
            <span className={menuStyles.row}>
                {startIcon ? (
                    <span
                        className={menuStyles.iconWrap}
                        style={{
                            width: iconSizes.small,
                            minWidth: iconSizes.small,
                            height: iconSizes.small,
                        }}
                    >
                        {startIcon}
                    </span>
                ) : null}
                <span className={menuStyles.textCol}>
                    <span className={menuStyles.title}>{children}</span>
                    {description ? (
                        <span
                            className={clsx(
                                menuStyles.description,
                                isDisabled
                                    ? menuStyles.descriptionDisabled
                                    : menuStyles.descriptionEnabled,
                            )}
                        >
                            {description}
                        </span>
                    ) : null}
                </span>
                <span className={menuStyles.rightWrap}>
                    <span
                        className={menuStyles.iconWrap}
                        style={{
                            width: iconSizes.small,
                            minWidth: iconSizes.small,
                            height: iconSizes.small,
                        }}
                    >
                        <WebIcon name="chevron-right" size={iconSizes.small} color="currentColor" aria-hidden />
                    </span>
                </span>
            </span>
        </button>
    );
}

export function MenuSubContent({ className, children, style, ...props }: MenuSubContentProps) {
    const menu = useContext(MenuContext);
    const sub = useMenuSub("MenuSubContent");
    const panelRef = useRef<HTMLDivElement | null>(null);
    const [fixedStyle, setFixedStyle] = useState<CSSProperties | null>(null);
    const [side, setSide] = useState<"left" | "right">("right");
    /** Tighter gap — easier to move pointer onto the panel without closing */
    const gapPx = parseCssPx(spacings.sizeXXXSmall, 2);
    const z = (Number.parseInt(String(zIndex.zIndexMessages), 10) || 10000) + 100;
    const defaultW = parseCssPx(componentSizes.menuPanelWidth, 244);

    const setPanelEl = useCallback(
        (el: HTMLDivElement | null) => {
            panelRef.current = el;
            if (sub.open) {
                menu?.registerSubPanel(el);
            }
        },
        [menu, sub.open],
    );

    useIsomorphicLayoutEffect(() => {
        if (!sub.open || (menu && !menu.open)) {
            setFixedStyle(null);
            menu?.registerSubPanel(null);
            return;
        }

        const apply = () => {
            const triggerEl = sub.triggerRef.current;
            const trigger = triggerEl?.getBoundingClientRect();
            if (!trigger || !triggerEl) return;

            const vh = window.innerHeight;
            const vw = window.innerWidth;
            if (trigger.bottom < 0 || trigger.top > vh || trigger.right < 0 || trigger.left > vw) {
                sub.setOpen(false);
                return;
            }

            const pw =
                panelRef.current?.offsetWidth && panelRef.current.offsetWidth > 0
                    ? panelRef.current.offsetWidth
                    : defaultW;
            const ph =
                panelRef.current?.offsetHeight && panelRef.current.offsetHeight > 0
                    ? panelRef.current.offsetHeight
                    : 160;
            const pos = computeSubmenuPanelPosition({
                trigger,
                panelWidth: pw,
                panelHeight: ph,
                gap: gapPx,
            });
            setSide(pos.left >= trigger.right - 1 ? "right" : "left");
            setFixedStyle({
                position: "fixed",
                top: pos.top,
                left: pos.left,
                minWidth: componentSizes.menuPanelWidth,
                zIndex: z,
                maxHeight: "min(60vh, 20rem)",
            });
        };

        apply();
        const raf = requestAnimationFrame(apply);
        window.addEventListener("resize", apply);
        const unsubScroll = subscribeScrollAndScrollableAncestors(sub.triggerRef.current, apply);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", apply);
            unsubScroll();
        };
    }, [sub.open, sub.triggerRef, sub, menu, menu?.open, defaultW, gapPx, z, menu?.registerSubPanel]);

    useEffect(() => {
        if (!sub.open || menu) return;

        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (sub.triggerRef.current?.contains(target) || panelRef.current?.contains(target)) {
                return;
            }
            sub.setOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [sub, menu]);

    if (!sub.open || (menu && !menu.open) || !fixedStyle || typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div
            ref={setPanelEl}
            data-refineui="menu"
            data-submenu="true"
            data-state="open"
            data-side={side}
            role="menu"
            className={clsx(menuStyles.subPanel, className)}
            style={{ ...fixedStyle, ...style }}
            onPointerEnter={() => sub.cancelClose()}
            onPointerLeave={() => {
                if (isFinePointerHover()) {
                    sub.closeIntent();
                }
            }}
            {...props}
        >
            {children}
        </div>,
        document.body,
    );
}
