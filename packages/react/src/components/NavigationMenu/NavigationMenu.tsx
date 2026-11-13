import { clsx } from "clsx";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type FocusEvent,
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { iconSizes, semanticInteraction, spacings, zIndex } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
import { subscribeScrollAndScrollableAncestors } from "../Dropdown/positioning";
import { WebIcon } from "../../WebIcon";
import { navigationMenuStyles } from "./style";
import type {
    NavigationMenuContentProps,
    NavigationMenuIndicatorProps,
    NavigationMenuItemProps,
    NavigationMenuLinkProps,
    NavigationMenuListProps,
    NavigationMenuProps,
    NavigationMenuTriggerProps,
} from "./types";

const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

type NavigationMenuContextValue = {
    value: string;
    setValue: (next: string) => void;
    openItem: (itemValue: string, options?: { immediate?: boolean }) => void;
    close: (options?: { immediate?: boolean }) => void;
    delayDuration: number;
    skipDelayDuration: number;
    idPrefix: string;
    listRef: React.RefObject<HTMLUListElement | null>;
    registerTrigger: (itemValue: string, el: HTMLButtonElement | null) => void;
    registerContent: (itemValue: string, el: HTMLDivElement | null) => void;
    focusFirstContent: (itemValue: string) => void;
    isContentTarget: (itemValue: string, target: EventTarget | null) => boolean;
    isMenuTarget: (target: EventTarget | null) => boolean;
    isInsideContent: boolean;
    isSwitching: boolean;
    registerOverlayContent: (itemValue: string, content: OverlayContentRegistration) => void;
    unregisterOverlayContent: (itemValue: string) => void;
    getOverlayContent: (itemValue: string) => OverlayContentRegistration | undefined;
};

type OverlayContentRegistration = {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    portalContainer?: Element | null;
    onKeyDown?: NavigationMenuContentProps["onKeyDown"];
};

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenu(component: string): NavigationMenuContextValue {
    const ctx = useContext(NavigationMenuContext);
    if (!ctx) {
        throw new Error(`${component} must be used within NavigationMenu.`);
    }
    return ctx;
}

type NavigationMenuItemContextValue = {
    value: string;
    open: boolean;
    triggerId: string;
    contentId: string;
};

const NavigationMenuItemContext = createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenuItem(component: string): NavigationMenuItemContextValue {
    const ctx = useContext(NavigationMenuItemContext);
    if (!ctx) {
        throw new Error(`${component} must be used within NavigationMenuItem.`);
    }
    return ctx;
}

function useControllableOpen(
    controlled: string | undefined,
    defaultValue: string | undefined,
    onChange: ((next: string) => void) | undefined,
): [string, (next: string) => void] {
    const [internal, setInternal] = useState(defaultValue ?? "");
    const isControlled = controlled !== undefined;
    const value = isControlled ? controlled : internal;
    const setValue = useCallback(
        (next: string) => {
            if (!isControlled) setInternal(next);
            onChange?.(next);
        },
        [isControlled, onChange],
    );
    return [value, setValue];
}

export function NavigationMenu({
    children,
    className,
    value: valueControlled,
    defaultValue,
    onValueChange,
    delayDuration: delayDurationProp,
    skipDelayDuration: skipDelayDurationProp,
    "aria-label": ariaLabel = "Main",
    ...props
}: NavigationMenuProps) {
    const [value, setValue] = useControllableOpen(valueControlled, defaultValue, onValueChange);
    const idPrefix = `refineui-nav-menu-${useId().replaceAll(":", "")}`;
    const listRef = useRef<HTMLUListElement | null>(null);
    const triggerMapRef = useRef(new Map<string, HTMLButtonElement>());
    const contentMapRef = useRef(new Map<string, HTMLDivElement>());
    const openTimerRef = useRef<number | null>(null);
    const closeTimerRef = useRef<number | null>(null);
    const switchTimerRef = useRef<number | null>(null);
    const rootRef = useRef<HTMLElement | null>(null);
    const [isSwitching, setIsSwitching] = useState(false);
    const overlayContentRef = useRef(new Map<string, OverlayContentRegistration>());
    const [overlayVersion, setOverlayVersion] = useState(0);

    const delayDuration =
        delayDurationProp ?? motionMsToNumber(semanticInteraction.duration.normal);
    const skipDelayDuration =
        skipDelayDurationProp ?? motionMsToNumber(semanticInteraction.duration.fast);

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

    const setValueSafe = useCallback(
        (next: string) => {
            clearTimers();
            if (switchTimerRef.current != null) {
                window.clearTimeout(switchTimerRef.current);
                switchTimerRef.current = null;
            }
            const switching = Boolean(value && next && value !== next);
            setIsSwitching(switching);
            if (switching) {
                switchTimerRef.current = window.setTimeout(() => {
                    setIsSwitching(false);
                    switchTimerRef.current = null;
                }, motionMsToNumber(semanticInteraction.duration.normal));
            }
            setValue(next);
        },
        [clearTimers, setValue, value],
    );

    const openItem = useCallback(
        (itemValue: string, options?: { immediate?: boolean }) => {
            clearTimers();
            const delay = options?.immediate || value !== "" ? skipDelayDuration : delayDuration;
            if (delay <= 0 || options?.immediate) {
                setValueSafe(itemValue);
                return;
            }
            openTimerRef.current = window.setTimeout(() => {
                setValueSafe(itemValue);
                openTimerRef.current = null;
            }, delay);
        },
        [clearTimers, delayDuration, setValueSafe, skipDelayDuration, value],
    );

    const close = useCallback(
        (options?: { immediate?: boolean }) => {
            clearTimers();
            if (options?.immediate) {
                setValue("");
                return;
            }
            closeTimerRef.current = window.setTimeout(() => {
                setValue("");
                closeTimerRef.current = null;
            }, skipDelayDuration);
        },
        [clearTimers, setValue, skipDelayDuration],
    );

    const registerTrigger = useCallback((itemValue: string, el: HTMLButtonElement | null) => {
        if (el) {
            triggerMapRef.current.set(itemValue, el);
        } else {
            triggerMapRef.current.delete(itemValue);
        }
    }, []);

    const registerContent = useCallback((itemValue: string, el: HTMLDivElement | null) => {
        if (el) {
            contentMapRef.current.set(itemValue, el);
        } else {
            contentMapRef.current.delete(itemValue);
        }
    }, []);

    const registerOverlayContent = useCallback((itemValue: string, content: OverlayContentRegistration) => {
        overlayContentRef.current.set(itemValue, content);
        setOverlayVersion((version) => version + 1);
    }, []);

    const unregisterOverlayContent = useCallback((itemValue: string) => {
        if (!overlayContentRef.current.delete(itemValue)) return;
        setOverlayVersion((version) => version + 1);
    }, []);

    const getOverlayContent = useCallback(
        (itemValue: string) => overlayContentRef.current.get(itemValue),
        [],
    );

    const focusFirstContent = useCallback((itemValue: string) => {
        const focus = () => {
            const content = contentMapRef.current.get(itemValue);
            const firstFocusable = content?.querySelector<HTMLElement>(
                'a[href]:not([aria-disabled="true"]), button:not(:disabled), [tabindex]:not([tabindex="-1"])',
            );
            if (firstFocusable) {
                firstFocusable.focus();
                return;
            }
            requestAnimationFrame(() => {
                contentMapRef.current
                    .get(itemValue)
                    ?.querySelector<HTMLElement>(
                        'a[href]:not([aria-disabled="true"]), button:not(:disabled), [tabindex]:not([tabindex="-1"])',
                    )
                    ?.focus();
            });
        };
        requestAnimationFrame(focus);
    }, []);

    const isContentTarget = useCallback((itemValue: string, target: EventTarget | null) => {
        return target instanceof Node && contentMapRef.current.get(itemValue)?.contains(target) === true;
    }, []);

    const isMenuTarget = useCallback((target: EventTarget | null) => {
        if (!(target instanceof Node)) return false;
        return (
            rootRef.current?.contains(target) === true ||
            Array.from(contentMapRef.current.values()).some((content) => content.contains(target))
        );
    }, []);

    useEffect(() => () => {
        clearTimers();
        if (switchTimerRef.current != null) window.clearTimeout(switchTimerRef.current);
    }, [clearTimers]);

    useEffect(() => {
        if (!value) return;

        const onPointerDown = (event: globalThis.PointerEvent) => {
            if (isMenuTarget(event.target)) return;
            setValueSafe("");
        };

        const onKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") {
                setValueSafe("");
                const trigger = triggerMapRef.current.get(value);
                trigger?.focus();
            }
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isMenuTarget, setValueSafe, value]);

    const ctx = useMemo<NavigationMenuContextValue>(
        () => ({
            value,
            setValue: setValueSafe,
            openItem,
            close,
            delayDuration,
            skipDelayDuration,
            idPrefix,
            listRef,
            registerTrigger,
            registerContent,
            focusFirstContent,
            isContentTarget,
            isMenuTarget,
            isInsideContent: false,
            isSwitching,
            registerOverlayContent,
            unregisterOverlayContent,
            getOverlayContent,
        }),
        [
            close,
            delayDuration,
            isContentTarget,
            isMenuTarget,
            isSwitching,
            registerOverlayContent,
            unregisterOverlayContent,
            getOverlayContent,
            idPrefix,
            openItem,
            focusFirstContent,
            registerContent,
            registerTrigger,
            setValueSafe,
            skipDelayDuration,
            value,
        ],
    );

    return (
        <NavigationMenuContext.Provider value={ctx}>
            <nav
                ref={rootRef}
                data-refineui="navigation-menu"
                aria-label={ariaLabel}
                className={clsx(navigationMenuStyles.root, className)}
                {...props}
            >
                {children}
                <NavigationMenuOverlayViewport version={overlayVersion} />
            </nav>
        </NavigationMenuContext.Provider>
    );
}

function focusListSibling(list: HTMLUListElement | null, current: HTMLElement, direction: 1 | -1) {
    if (!list) return;
    const items = Array.from(
        list.querySelectorAll<HTMLElement>(
            '[data-refineui="navigation-menu-trigger"]:not(:disabled), [data-refineui="navigation-menu-link"]:not([aria-disabled="true"])',
        ),
    ).filter((el) => list.contains(el) && el.closest('[data-refineui="navigation-menu-content"]') == null);

    const index = items.indexOf(current);
    if (index < 0 || items.length === 0) return;
    const next = items[(index + direction + items.length) % items.length];
    next?.focus();
}

export function NavigationMenuList({ className, onKeyDown, ...props }: NavigationMenuListProps) {
    const { listRef } = useNavigationMenu("NavigationMenuList");

    return (
        <ul
            ref={listRef as React.Ref<HTMLUListElement>}
            data-refineui="navigation-menu-list"
            className={clsx(navigationMenuStyles.list, className)}
            onKeyDown={(event: KeyboardEvent<HTMLUListElement>) => {
                onKeyDown?.(event);
                if (event.defaultPrevented) return;
                const target = event.target as HTMLElement;
                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    focusListSibling(listRef.current, target, 1);
                } else if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    focusListSibling(listRef.current, target, -1);
                }
            }}
            {...props}
        />
    );
}

export function NavigationMenuItem({
    children,
    className,
    value: valueProp,
    onPointerEnter,
    onPointerLeave,
    ...props
}: NavigationMenuItemProps) {
    const menu = useNavigationMenu("NavigationMenuItem");
    const reactId = useId();
    const value = valueProp ?? reactId;
    const open = menu.value === value;
    const triggerId = `${menu.idPrefix}-trigger-${value}`;
    const contentId = `${menu.idPrefix}-content-${value}`;

    const itemCtx = useMemo<NavigationMenuItemContextValue>(
        () => ({ value, open, triggerId, contentId }),
        [contentId, open, triggerId, value],
    );

    return (
        <NavigationMenuItemContext.Provider value={itemCtx}>
            <li
                data-refineui="navigation-menu-item"
                data-state={open ? "open" : "closed"}
                className={clsx(navigationMenuStyles.item, className)}
                onPointerEnter={(event: PointerEvent<HTMLLIElement>) => {
                    onPointerEnter?.(event);
                    if (event.defaultPrevented) return;
                    const hasEnabledTrigger = Boolean(
                        event.currentTarget.querySelector(
                            '[data-refineui="navigation-menu-trigger"]:not(:disabled)',
                        ),
                    );
                    if (hasEnabledTrigger) {
                        menu.openItem(value);
                    }
                }}
                onPointerLeave={(event: PointerEvent<HTMLLIElement>) => {
                    onPointerLeave?.(event);
                    if (event.defaultPrevented) return;
                    if (menu.isContentTarget(value, event.relatedTarget)) return;
                    menu.close();
                }}
                {...props}
            >
                {children}
            </li>
        </NavigationMenuItemContext.Provider>
    );
}

export function NavigationMenuTrigger({
    children,
    className,
    disabled,
    onClick,
    onKeyDown,
    ...props
}: NavigationMenuTriggerProps) {
    const menu = useNavigationMenu("NavigationMenuTrigger");
    const item = useNavigationMenuItem("NavigationMenuTrigger");

    const setTriggerRef = useCallback(
        (el: HTMLButtonElement | null) => {
            menu.registerTrigger(item.value, el);
        },
        [item.value, menu],
    );

    return (
        <button
            ref={setTriggerRef}
            type="button"
            id={item.triggerId}
            data-refineui="navigation-menu-trigger"
            data-state={item.open ? "open" : "closed"}
            aria-expanded={item.open}
            aria-controls={item.contentId}
            aria-haspopup="true"
            disabled={disabled}
            className={clsx(
                navigationMenuStyles.trigger,
                item.open && navigationMenuStyles.triggerOpen,
                disabled && navigationMenuStyles.triggerDisabled,
                className,
            )}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented || disabled) return;
                if (item.open) {
                    menu.setValue("");
                } else {
                    menu.openItem(item.value, { immediate: true });
                }
            }}
            onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
                onKeyDown?.(event);
                if (event.defaultPrevented || disabled) return;
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (item.open) {
                        menu.setValue("");
                    } else {
                        menu.openItem(item.value, { immediate: true });
                    }
                } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    menu.openItem(item.value, { immediate: true });
                    menu.focusFirstContent(item.value);
                }
            }}
            {...props}
        >
            {children}
            <WebIcon
                name="chevron-down"
                size={iconSizes.xsmall}
                color="currentColor"
                className={clsx(
                    navigationMenuStyles.chevron,
                    item.open && navigationMenuStyles.chevronOpen,
                )}
            />
        </button>
    );
}

export function NavigationMenuContent(props: NavigationMenuContentProps) {
    return props.layout === "overlay"
        ? <NavigationMenuOverlayContent {...props} />
        : <NavigationMenuContentPanel {...props} />;
}

function NavigationMenuOverlayContent({
    children,
    className,
    portalContainer,
    onKeyDown,
    style,
}: NavigationMenuContentProps) {
    const menu = useNavigationMenu("NavigationMenuContent");
    const item = useNavigationMenuItem("NavigationMenuContent");
    const { registerOverlayContent, unregisterOverlayContent } = menu;
    const registrationRef = useRef<OverlayContentRegistration>({
        children,
        className,
        portalContainer,
        onKeyDown,
        style,
    });

    registrationRef.current = {
        children,
        className,
        portalContainer,
        onKeyDown,
        style,
    };

    useEffect(() => {
        registerOverlayContent(item.value, registrationRef.current);
        return () => unregisterOverlayContent(item.value);
    }, [item.value, registerOverlayContent, unregisterOverlayContent]);

    return null;
}

function NavigationMenuContentPanel({
    children,
    className,
    layout = "dropdown",
    portalContainer,
    onKeyDown,
    style,
    ...props
}: NavigationMenuContentProps) {
    const menu = useNavigationMenu("NavigationMenuContent");
    const item = useNavigationMenuItem("NavigationMenuContent");
    const [shouldRender, setShouldRender] = useState(item.open);
    const [isClosing, setIsClosing] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [positionStyle, setPositionStyle] = useState<CSSProperties | null>(null);

    const setContentRef = useCallback(
        (el: HTMLDivElement | null) => {
            contentRef.current = el;
            menu.registerContent(item.value, el);
        },
        [item.value, menu],
    );

    useEffect(() => {
        if (item.open) {
            setShouldRender(true);
            setIsClosing(false);
            return;
        }
        if (!shouldRender) return;
        setIsClosing(true);
        const timeout = window.setTimeout(() => {
            setShouldRender(false);
            setIsClosing(false);
        }, motionMsToNumber(
            layout === "overlay"
                ? semanticInteraction.duration.normal
                : semanticInteraction.duration.fast,
        ));
        return () => window.clearTimeout(timeout);
    }, [item.open, layout, menu.isSwitching]);

    useIsomorphicLayoutEffect(() => {
        if (!shouldRender || !item.open || typeof document === "undefined") return;
        const trigger = document.getElementById(item.triggerId);
        if (!trigger) return;

        const updatePosition = () => {
            const content = contentRef.current;
            if (!content) return;

            const triggerRect = trigger.getBoundingClientRect();
            const contentWidth = content.offsetWidth;
            const portalRect = portalContainer?.getBoundingClientRect();
            const boundaryWidth = portalRect?.width ?? window.innerWidth;
            const edge = Number.parseFloat(spacings.sizeMedium) || 8;
            const floatingOffset = Number.parseFloat(spacings.sizeXXSmall) || 4;
            const left = layout === "floating"
                ? Math.max(edge, Math.min((boundaryWidth - contentWidth) / 2, boundaryWidth - contentWidth - edge))
                : Math.max(edge, Math.min(triggerRect.left - (portalRect?.left ?? 0), boundaryWidth - contentWidth - edge));

            if (layout === "overlay") {
                setPositionStyle({
                    top: portalRect ? triggerRect.bottom - portalRect.top : triggerRect.bottom,
                    zIndex: Number.parseInt(String(zIndex.zIndexMessages), 10) || 10000,
                });
                return;
            }

            setPositionStyle({
                position: portalRect ? "absolute" : "fixed",
                top: triggerRect.bottom + (layout === "floating" ? floatingOffset : 0) - (portalRect?.top ?? 0),
                left,
                zIndex: Number.parseInt(String(zIndex.zIndexMessages), 10) || 10000,
            });
        };

        updatePosition();
        const frame = requestAnimationFrame(updatePosition);
        window.addEventListener("resize", updatePosition);
        const unsubscribe = subscribeScrollAndScrollableAncestors(trigger, updatePosition);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", updatePosition);
            unsubscribe();
        };
    }, [item.open, item.triggerId, layout, portalContainer, shouldRender]);

    const contentCtx = useMemo<NavigationMenuContextValue>(
        () => ({ ...menu, isInsideContent: true }),
        [menu],
    );

    if (!shouldRender) return null;

    const content = (
        <NavigationMenuContext.Provider value={contentCtx}>
            <div
                ref={setContentRef}
                id={item.contentId}
                role="region"
                aria-labelledby={item.triggerId}
                data-refineui="navigation-menu-content"
                data-layout={layout}
                data-state={isClosing || !item.open ? "closed" : "open"}
                className={clsx(
                    navigationMenuStyles.content,
                    layout === "overlay"
                        ? portalContainer
                            ? navigationMenuStyles.contentOverlayContained
                            : navigationMenuStyles.contentOverlay
                        : layout === "floating"
                            ? navigationMenuStyles.contentFloating
                            : navigationMenuStyles.contentDropdown,
                    layout !== "overlay" && portalContainer && navigationMenuStyles.contentContained,
                    isClosing || !item.open
                        ? layout === "overlay"
                            ? "pointer-events-none"
                            : layout === "floating"
                            ? "pointer-events-none translate-y-refineui-size-x-small opacity-0"
                            : "pointer-events-none opacity-0"
                        : layout === "floating" ? "translate-y-0 opacity-100" : "opacity-100",
                    className,
                )}
                style={{ ...positionStyle, ...style }}
                onPointerEnter={() => menu.openItem(item.value, { immediate: true })}
                onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
                    if (menu.isMenuTarget(event.relatedTarget)) return;
                    menu.close();
                }}
                onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                    onKeyDown?.(event);
                    if (event.defaultPrevented) return;
                    if (event.key === "Escape") {
                        event.preventDefault();
                        menu.setValue("");
                        document.getElementById(item.triggerId)?.focus();
                    }
                }}
                {...props}
            >
                {layout === "overlay" ? (
                    <div
                        aria-hidden
                        data-state={isClosing || !item.open ? "closed" : "open"}
                        className={clsx(
                            navigationMenuStyles.overlayBackdrop,
                            isClosing || !item.open
                                ? "backdrop-blur-none opacity-0"
                                : "backdrop-blur-[var(--refineui-blur-overlay-scrim)] opacity-100",
                            !menu.isSwitching && item.open
                                ? navigationMenuStyles.overlayBackdropEnter
                                : undefined,
                            isClosing && !menu.isSwitching
                                ? navigationMenuStyles.overlayBackdropExit
                                : undefined,
                        )}
                        onPointerDown={(event) => {
                            event.preventDefault();
                            menu.setValue("");
                        }}
                        onPointerEnter={() => menu.close()}
                    />
                ) : null}
                <div
                    data-refineui="navigation-menu-content-panel"
                    data-layout={layout}
                    data-state={isClosing || !item.open ? "closed" : "open"}
                    className={clsx(
                        layout === "overlay"
                            ? navigationMenuStyles.contentPanelOverlay
                            : navigationMenuStyles.contentPanel,
                        layout === "overlay"
                            ? undefined
                            : layout === "floating"
                                ? navigationMenuStyles.contentPanelFloating
                                : navigationMenuStyles.contentPanelDropdown,
                        layout === "overlay" && (isClosing || !item.open)
                            ? "translate-y-refineui-size-xxx-small opacity-0"
                            : undefined,
                        layout === "overlay" && isClosing && !menu.isSwitching
                            ? navigationMenuStyles.contentPanelOverlayExit
                            : undefined,
                    )}
                >
                    {children}
                </div>
            </div>
        </NavigationMenuContext.Provider>
    );

    return typeof document === "undefined" ? content : createPortal(content, portalContainer ?? document.body);
}

function NavigationMenuOverlayViewport({ version: _version }: { version: number }) {
    const menu = useNavigationMenu("NavigationMenuContent");
    const [presentValue, setPresentValue] = useState(menu.value);
    const [isClosing, setIsClosing] = useState(false);
    const [positionStyle, setPositionStyle] = useState<CSSProperties | null>(null);
    const [panelHeight, setPanelHeight] = useState<number | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const heightRef = useRef<number | null>(null);
    const heightTimerRef = useRef<number | null>(null);
    const isClosingRef = useRef(false);

    const registration = presentValue ? menu.getOverlayContent(presentValue) : undefined;

    useIsomorphicLayoutEffect(() => {
        if (menu.value) {
            isClosingRef.current = false;
            setPresentValue(menu.value);
            setIsClosing(false);
            return;
        }
        if (!presentValue) return;
        isClosingRef.current = true;
        setIsClosing(true);
        if (heightTimerRef.current != null) {
            window.clearTimeout(heightTimerRef.current);
            heightTimerRef.current = null;
        }
        const currentHeight = innerRef.current?.scrollHeight ?? heightRef.current;
        let frame: number | undefined;
        let settleFrame: number | undefined;
        if (currentHeight != null) {
            setPanelHeight(currentHeight);
            frame = requestAnimationFrame(() => {
                settleFrame = requestAnimationFrame(() => setPanelHeight(0));
            });
        }
        const timeout = window.setTimeout(() => {
            setPresentValue("");
            setIsClosing(false);
            setPanelHeight(null);
            heightRef.current = null;
            isClosingRef.current = false;
        }, motionMsToNumber(semanticInteraction.duration.panel));
        return () => {
            if (frame != null) cancelAnimationFrame(frame);
            if (settleFrame != null) cancelAnimationFrame(settleFrame);
            window.clearTimeout(timeout);
        };
    }, [menu.value, presentValue]);

    useIsomorphicLayoutEffect(() => {
        if (!presentValue || !registration || typeof document === "undefined") return;
        const trigger = document.getElementById(`${menu.idPrefix}-trigger-${CSS.escape(presentValue)}`);
        if (!trigger) return;

        const updatePosition = () => {
            const triggerRect = trigger.getBoundingClientRect();
            const portalRect = registration.portalContainer?.getBoundingClientRect();
            const headerBottom = trigger.closest<HTMLElement>("header")?.getBoundingClientRect().bottom;
            const overlayTop = headerBottom ?? triggerRect.bottom;
            setPositionStyle({
                top: portalRect ? overlayTop - portalRect.top : overlayTop,
                zIndex: Number.parseInt(String(zIndex.zIndexMessages), 10) || 10000,
            });
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        const unsubscribe = subscribeScrollAndScrollableAncestors(trigger, updatePosition);
        return () => {
            window.removeEventListener("resize", updatePosition);
            unsubscribe();
        };
    }, [presentValue, registration]);

    useIsomorphicLayoutEffect(() => {
        if (!presentValue || !innerRef.current) return;
        const nextHeight = innerRef.current.scrollHeight;
        const previousHeight = heightRef.current;
        heightRef.current = nextHeight;
        if (previousHeight === nextHeight) {
            setPanelHeight(null);
            return;
        }
        if (heightTimerRef.current != null) window.clearTimeout(heightTimerRef.current);
        setPanelHeight(previousHeight ?? 0);
        let settleFrame: number | undefined;
        const frame = requestAnimationFrame(() => {
            settleFrame = requestAnimationFrame(() => setPanelHeight(nextHeight));
        });
        heightTimerRef.current = window.setTimeout(
            () => {
                if (!isClosingRef.current) setPanelHeight(null);
            },
            motionMsToNumber(semanticInteraction.duration.panel),
        );
        return () => {
            cancelAnimationFrame(frame);
            if (settleFrame != null) cancelAnimationFrame(settleFrame);
            if (heightTimerRef.current != null) window.clearTimeout(heightTimerRef.current);
        };
    }, [presentValue, registration?.children]);

    useEffect(() => {
        menu.registerContent(presentValue, rootRef.current);
        return () => menu.registerContent(presentValue, null);
    }, [menu, presentValue]);

    useEffect(() => {
        if (!presentValue || typeof document === "undefined") return;
        const trigger = document.getElementById(`${menu.idPrefix}-trigger-${CSS.escape(presentValue)}`);
        const header = trigger?.closest<HTMLElement>("header");
        if (!header) return;
        header.setAttribute("data-refineui-navigation-menu-overlay-open", "");
        return () => header.removeAttribute("data-refineui-navigation-menu-overlay-open");
    }, [presentValue]);

    if (!presentValue || !registration) return null;

    const state = isClosing ? "closed" : "open";
    const contentCtx: NavigationMenuContextValue = { ...menu, isInsideContent: true };
    const root = (
        <NavigationMenuContext.Provider value={contentCtx}>
            <div
                ref={rootRef}
                id={`${menu.idPrefix}-content-${presentValue}`}
                role="region"
                aria-labelledby={`${menu.idPrefix}-trigger-${presentValue}`}
                data-refineui="navigation-menu-content"
                data-layout="overlay"
                data-state={state}
                className={clsx(
                    registration.portalContainer
                        ? navigationMenuStyles.contentOverlayContained
                        : navigationMenuStyles.contentOverlay,
                    isClosing && "pointer-events-none",
                    registration.className,
                )}
                style={{ ...positionStyle, ...registration.style }}
                onPointerEnter={() => menu.openItem(presentValue, { immediate: true })}
                onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
                    if (menu.isMenuTarget(event.relatedTarget)) return;
                    menu.close();
                }}
                onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                    registration.onKeyDown?.(event);
                    if (event.defaultPrevented || event.key !== "Escape") return;
                    event.preventDefault();
                    menu.setValue("");
                    document.getElementById(`${menu.idPrefix}-trigger-${presentValue}`)?.focus();
                }}
            >
                <div
                    aria-hidden
                    data-state={state}
                    className={clsx(
                        navigationMenuStyles.overlayBackdrop,
                        isClosing ? "backdrop-blur-none opacity-0" : "backdrop-blur-[var(--refineui-blur-overlay-scrim)] opacity-100",
                        !isClosing && navigationMenuStyles.overlayBackdropEnter,
                        isClosing && navigationMenuStyles.overlayBackdropExit,
                    )}
                    onPointerDown={(event) => {
                        event.preventDefault();
                        menu.setValue("");
                    }}
                    onPointerEnter={() => menu.close()}
                />
                <div
                    data-refineui="navigation-menu-content-panel"
                    data-layout="overlay"
                    data-state={state}
                    className={clsx(
                        navigationMenuStyles.contentPanelOverlay,
                        isClosing && navigationMenuStyles.contentPanelOverlayExit,
                    )}
                    style={panelHeight == null ? undefined : { height: panelHeight }}
                >
                    <div ref={innerRef} className="w-full">
                        {registration.children}
                    </div>
                </div>
            </div>
        </NavigationMenuContext.Provider>
    );

    return typeof document === "undefined"
        ? root
        : createPortal(root, registration.portalContainer ?? document.body);
}

export function NavigationMenuLink({
    children,
    className,
    active = false,
    onClick,
    onFocus,
    "aria-disabled": ariaDisabled,
    ...props
}: NavigationMenuLinkProps) {
    const menu = useContext(NavigationMenuContext);
    const inContent = menu?.isInsideContent ?? false;
    const disabled = ariaDisabled === true || ariaDisabled === "true";

    return (
        <a
            data-refineui="navigation-menu-link"
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : undefined}
            className={clsx(
                inContent ? navigationMenuStyles.linkInContent : navigationMenuStyles.link,
                !inContent && active && navigationMenuStyles.linkActive,
                disabled && navigationMenuStyles.linkDisabled,
                className,
            )}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                if (disabled) {
                    event.preventDefault();
                    return;
                }
                menu?.setValue("");
            }}
            onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
                onFocus?.(event);
                if (!inContent) {
                    menu?.setValue("");
                }
            }}
            {...props}
        >
            {children}
        </a>
    );
}

type IndicatorBox = { left: number; width: number };

export function NavigationMenuIndicator({ className, style, ...props }: NavigationMenuIndicatorProps) {
    const { value, listRef, idPrefix } = useNavigationMenu("NavigationMenuIndicator");
    const [box, setBox] = useState<IndicatorBox | null>(null);

    const measure = useCallback(() => {
        const list = listRef.current;
        if (!list || !value) {
            setBox(null);
            return;
        }
        const trigger = list.querySelector<HTMLElement>(
            `[data-refineui="navigation-menu-trigger"][id="${CSS.escape(idPrefix)}-trigger-${CSS.escape(value)}"]`,
        );
        if (!trigger) {
            setBox(null);
            return;
        }
        const listRect = list.getBoundingClientRect();
        const triggerRect = trigger.getBoundingClientRect();
        setBox({
            left: triggerRect.left - listRect.left,
            width: triggerRect.width,
        });
    }, [listRef, value]);

    useIsomorphicLayoutEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [measure]);

    if (!box) return null;

    const indicatorStyle: CSSProperties = {
        width: box.width,
        transform: `translateX(${box.left}px)`,
        ...style,
    };

    return (
        <div
            data-refineui="navigation-menu-indicator"
            aria-hidden
            className={clsx(navigationMenuStyles.indicator, className)}
            style={indicatorStyle}
            {...props}
        />
    );
}
