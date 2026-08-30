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
} from "react";
import { iconSizes, semanticInteraction } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
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
    listRef: React.RefObject<HTMLUListElement | null>;
    registerTrigger: (itemValue: string, el: HTMLButtonElement | null) => void;
    isInsideContent: boolean;
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
    const listRef = useRef<HTMLUListElement | null>(null);
    const triggerMapRef = useRef(new Map<string, HTMLButtonElement>());
    const openTimerRef = useRef<number | null>(null);
    const closeTimerRef = useRef<number | null>(null);
    const rootRef = useRef<HTMLElement | null>(null);

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
            setValue(next);
        },
        [clearTimers, setValue],
    );

    const openItem = useCallback(
        (itemValue: string, options?: { immediate?: boolean }) => {
            clearTimers();
            const delay = options?.immediate || value !== "" ? skipDelayDuration : delayDuration;
            if (delay <= 0 || options?.immediate) {
                setValue(itemValue);
                return;
            }
            openTimerRef.current = window.setTimeout(() => {
                setValue(itemValue);
                openTimerRef.current = null;
            }, delay);
        },
        [clearTimers, delayDuration, setValue, skipDelayDuration, value],
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

    useEffect(() => () => clearTimers(), [clearTimers]);

    useEffect(() => {
        if (!value) return;

        const onPointerDown = (event: globalThis.PointerEvent) => {
            const target = event.target as Node;
            if (rootRef.current?.contains(target)) return;
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
    }, [setValueSafe, value]);

    const ctx = useMemo<NavigationMenuContextValue>(
        () => ({
            value,
            setValue: setValueSafe,
            openItem,
            close,
            delayDuration,
            skipDelayDuration,
            listRef,
            registerTrigger,
            isInsideContent: false,
        }),
        [close, delayDuration, openItem, registerTrigger, setValueSafe, skipDelayDuration, value],
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
    const triggerId = `refineui-nav-menu-trigger-${value}`;
    const contentId = `refineui-nav-menu-content-${value}`;

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
                    const hasTrigger = Boolean(
                        event.currentTarget.querySelector('[data-refineui="navigation-menu-trigger"]'),
                    );
                    if (hasTrigger) {
                        menu.openItem(value);
                    }
                }}
                onPointerLeave={(event: PointerEvent<HTMLLIElement>) => {
                    onPointerLeave?.(event);
                    if (event.defaultPrevented) return;
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
                } else if (event.key === "ArrowDown" && !item.open) {
                    event.preventDefault();
                    menu.openItem(item.value, { immediate: true });
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

export function NavigationMenuContent({
    children,
    className,
    onKeyDown,
    ...props
}: NavigationMenuContentProps) {
    const menu = useNavigationMenu("NavigationMenuContent");
    const item = useNavigationMenuItem("NavigationMenuContent");
    const [shouldRender, setShouldRender] = useState(item.open);
    const [isClosing, setIsClosing] = useState(false);

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
        }, motionMsToNumber(semanticInteraction.duration.fast));
        return () => window.clearTimeout(timeout);
    }, [item.open, shouldRender]);

    const contentCtx = useMemo<NavigationMenuContextValue>(
        () => ({ ...menu, isInsideContent: true }),
        [menu],
    );

    if (!shouldRender) return null;

    return (
        <NavigationMenuContext.Provider value={contentCtx}>
            <div
                id={item.contentId}
                role="region"
                aria-labelledby={item.triggerId}
                data-refineui="navigation-menu-content"
                data-state={isClosing || !item.open ? "closed" : "open"}
                className={clsx(navigationMenuStyles.content, className)}
                onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                    onKeyDown?.(event);
                    if (event.defaultPrevented) return;
                    if (event.key === "Escape") {
                        event.preventDefault();
                        menu.setValue("");
                    }
                }}
                {...props}
            >
                <div data-refineui="navigation-menu-content-panel" className={navigationMenuStyles.contentPanel}>
                    {children}
                </div>
            </div>
        </NavigationMenuContext.Provider>
    );
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
                if (event.defaultPrevented || disabled) return;
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
            {!inContent ? <span aria-hidden className={navigationMenuStyles.linkChevronSpacer} /> : null}
        </a>
    );
}

type IndicatorBox = { left: number; width: number };

export function NavigationMenuIndicator({ className, style, ...props }: NavigationMenuIndicatorProps) {
    const { value, listRef } = useNavigationMenu("NavigationMenuIndicator");
    const [box, setBox] = useState<IndicatorBox | null>(null);

    const measure = useCallback(() => {
        const list = listRef.current;
        if (!list || !value) {
            setBox(null);
            return;
        }
        const trigger = list.querySelector<HTMLElement>(
            `[data-refineui="navigation-menu-trigger"][id="refineui-nav-menu-trigger-${CSS.escape(value)}"]`,
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
