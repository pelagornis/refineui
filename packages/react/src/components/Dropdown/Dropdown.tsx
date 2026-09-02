import { clsx } from "clsx";
import type {
    CSSProperties,
    Dispatch,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    ReactElement,
    ReactNode,
    Ref,
    RefObject,
    SetStateAction,
} from "react";
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
} from "react";
import { createPortal } from "react-dom";
import { iconSizes, spacings, strokeWidths, zIndex } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes } from "../../componentSizes";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import { dropdownStyles } from "./style";
import { acquireBodyScrollLock, composeRefs, getMergeableTriggerChild } from "@refineui/utilities/react";
import { ScrollAreaRegion } from "../ScrollArea/ScrollAreaRegion";
import { RadioInput } from "../Radio/RadioInput";
import type {
    DropdownContentProps,
    DropdownItemProps,
    DropdownSubContentProps,
    DropdownSubTriggerProps,
    DropdownTriggerProps,
    MenuAlign,
} from "./types";
import {
    computeAnchoredMenuPosition,
    computeSubmenuPanelPosition,
    parseCssPxLen,
    subscribeScrollAndScrollableAncestors,
    useIsomorphicLayoutEffect,
} from "./positioning";

type TriggerProps = {
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
    className?: string;
};
type TriggerElement = ReactElement<TriggerProps> & { ref?: Ref<HTMLElement | null> };


function DropdownCheckboxGlyph({ selected, disabled }: { selected: boolean; disabled?: boolean }) {
    return (
        <span
            aria-hidden
            className={clsx(
                "inline-flex size-refineui-control-checkbox shrink-0 items-center justify-center rounded-refineui-small",
                disabled && "border-refineui-alias-border-disabled bg-refineui-alias-background-surface-disabled",
            )}
        >
            {selected ? <WebIcon name="checkmark" size={iconSizes.xsmall} color="currentColor" /> : null}
        </span>
    );
}

type RootCtx = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    close: () => void;
    triggerRef: RefObject<HTMLElement | null>;
    menuRef: RefObject<HTMLDivElement | null>;
    menuId: string;
    subPanelRef: React.RefObject<HTMLDivElement | null>;
    registerSubPanel: (el: HTMLDivElement | null) => void;
};

const DropdownCtx = createContext<RootCtx | null>(null);

function useDropdownRoot(component: string): RootCtx {
    const v = useContext(DropdownCtx);
    if (!v) throw new Error(`${component} must be used within Dropdown.`);
    return v;
}

export function Dropdown({
    className,
    children,
    defaultOpen = false,
    open: openProp,
    onOpenChange,
    ...props
}: HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;
    const setOpen = useCallback<Dispatch<SetStateAction<boolean>>>(
        (value) => {
            const next = typeof value === "function" ? value(open) : value;
            if (openProp === undefined) setUncontrolledOpen(next);
            onOpenChange?.(next);
        },
        [open, openProp, onOpenChange],
    );
    const triggerRef = useRef<HTMLElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const subPanelRef = useRef<HTMLDivElement | null>(null);
    const menuId = useId();

    const registerSubPanel = useCallback((el: HTMLDivElement | null) => {
        subPanelRef.current = el;
    }, []);

    const close = useCallback(() => {
        setOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
    }, [setOpen]);

    const ctx = useMemo(
        () => ({
            open,
            setOpen,
            close,
            triggerRef,
            menuRef,
            menuId,
            subPanelRef,
            registerSubPanel,
        }),
        [open, menuId, registerSubPanel, close],
    );

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: globalThis.MouseEvent) => {
            const t = e.target as Node;
            if (
                containerRef.current?.contains(t) ||
                menuRef.current?.contains(t) ||
                subPanelRef.current?.contains(t)
            ) {
                return;
            }
            setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        return acquireBodyScrollLock();
    }, [open]);

    return (
        <DropdownCtx.Provider value={ctx}>
            <div
                ref={containerRef}
                data-refineui="dropdown-menu-root"
                className={clsx("relative inline-block", className)}
                {...props}
            >
                {children}
            </div>
        </DropdownCtx.Provider>
    );
}

/** Like `PopoverTrigger` / `MenuTrigger`: merge ref/events onto one mergeable child, else wrap in `button`. */
export function DropdownTrigger({ children, className, ...props }: DropdownTriggerProps) {
    const { open, setOpen, triggerRef, menuId } = useDropdownRoot("DropdownTrigger");

    const toggle = () => setOpen((o) => !o);

    const onTriggerKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
        }
        if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
        }
    };

    const mergeEl = getMergeableTriggerChild(children);
    if (mergeEl) {
        const el = mergeEl as TriggerElement;
        const passthrough = props as TriggerProps & HTMLAttributes<HTMLElement>;
        const passthroughCn = (props as HTMLAttributes<HTMLElement>).className;
        return cloneElement(el, {
            ...props,
            ref: composeRefs(triggerRef, el.ref),
            className: clsx(className, passthroughCn, (el.props as HTMLAttributes<HTMLElement>).className),
            "aria-expanded": open,
            "aria-haspopup": "menu" as const,
            "aria-controls": menuId,
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
            aria-haspopup="menu"
            aria-controls={menuId}
            className={clsx(
                "cursor-pointer border-none bg-transparent p-0 font-inherit text-inherit",
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

export function DropdownContent({
    className,
    align = "start",
    side = "auto",
    sideOffset,
    style,
    children,
    ...props
}: DropdownContentProps) {
    const { open, setOpen, close, triggerRef, menuRef, menuId } = useDropdownRoot("DropdownContent");
    const [fixedStyle, setFixedStyle] = useState<CSSProperties | null>(null);
    const [menuSide, setMenuSide] = useState<"top" | "bottom">("bottom");

    const gapPx = sideOffset ?? parseCssPxLen(spacings.sizeXXSmall, 4);
    const defaultMenuW = parseCssPxLen(componentSizes.dropdownMenuWidth, 180);
    const z = Number.parseInt(String(zIndex.zIndexMessages), 10) || 10000;

    useIsomorphicLayoutEffect(() => {
        if (!open) {
            setFixedStyle(null);
            setMenuSide("bottom");
            return;
        }

        const apply = () => {
            const trigger = triggerRef.current;
            if (!trigger) return;
            const r = trigger.getBoundingClientRect();
            const menuW = menuRef.current?.offsetWidth && menuRef.current.offsetWidth > 0 ? menuRef.current.offsetWidth : defaultMenuW;
            const menuH =
                menuRef.current?.offsetHeight && menuRef.current.offsetHeight > 0
                    ? menuRef.current.offsetHeight
                    : Math.min(320, Math.max(120, 8 * 40));

            const pos = computeAnchoredMenuPosition({
                anchor: r,
                menuWidth: menuW,
                menuHeight: menuH,
                align,
                side,
                gap: gapPx,
            });

            setMenuSide(pos.side);
            setFixedStyle((prev) => {
                const next: CSSProperties = {
                    position: "fixed",
                    top: pos.top,
                    left: pos.left,
                    minWidth: componentSizes.dropdownMenuWidth,
                    zIndex: z,
                    maxHeight: "min(60vh, 20rem)",
                };
                if (
                    prev &&
                    prev.top === next.top &&
                    prev.left === next.left &&
                    prev.zIndex === next.zIndex &&
                    prev.minWidth === next.minWidth
                ) {
                    return prev;
                }
                return next;
            });
        };

        apply();
        const raf = requestAnimationFrame(() => apply());
        window.addEventListener("resize", apply);
        const unsubScroll = subscribeScrollAndScrollableAncestors(triggerRef.current, apply);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", apply);
            unsubScroll();
        };
    }, [open, align, side, gapPx, defaultMenuW, z, style]);

    useEffect(() => {
        if (!open || !fixedStyle) return;
        const onKey = (e: Event) => {
            const ke = e as globalThis.KeyboardEvent;
            if (ke.key === "Escape") {
                ke.preventDefault();
                close();
            }
        };
        document.addEventListener("keydown", onKey, true);
        return () => document.removeEventListener("keydown", onKey, true);
    }, [open, fixedStyle, close]);

    const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            e.preventDefault();
            close();
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const list = menuRef.current?.querySelectorAll<HTMLElement>('[data-refineui="dropdown-item"]:not(:disabled)');
            const first = list?.[0];
            first?.focus();
        }
    };

    if (!open || !fixedStyle || typeof document === "undefined") return null;

    const panel = (
        <div
            ref={menuRef as Ref<HTMLDivElement>}
            id={menuId}
            role="menu"
            tabIndex={-1}
            data-refineui="dropdown-menu"
            data-align={align}
            data-side={menuSide}
            onKeyDown={onMenuKeyDown}
            className={clsx(dropdownStyles.menuShell, className)}
            {...props}
            style={{
                ...fixedStyle,
                ...style,
                borderColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.border),
                backgroundColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.background),
            }}
        >
            <ScrollAreaRegion type="hover" className="min-h-0 max-h-full" viewportClassName={dropdownStyles.menuViewport}>
                {children}
            </ScrollAreaRegion>
        </div>
    );

    return createPortal(panel, document.body);
}

export function DropdownGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div role="group" data-refineui="dropdown-menu-group" className={clsx("flex flex-col gap-px", className)} {...props} />
    );
}

export function DropdownLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            role="presentation"
            data-refineui="dropdown-menu-label"
            className={clsx(dropdownStyles.label, className)}
            {...props}
        />
    );
}

export function DropdownItem({
    className,
    disabled,
    selected = false,
    children,
    onClick,
    style,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    ...props
}: DropdownItemProps) {
    const { close } = useDropdownRoot("DropdownItem");
    const [pressed, setPressed] = useState(false);

    return (
        <button
            type="button"
            role="menuitem"
            data-refineui="dropdown-item"
            data-selected={selected || undefined}
            data-state={pressed ? "pressed" : selected ? "selected" : undefined}
            disabled={disabled}
            tabIndex={-1}
            className={clsx(dropdownStyles.item, className)}
            style={style}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented) close();
            }}
            onPointerDown={(e) => {
                onPointerDown?.(e);
                if (!disabled) setPressed(true);
            }}
            onPointerUp={(e) => {
                onPointerUp?.(e);
                setPressed(false);
            }}
            onPointerLeave={(e) => {
                onPointerLeave?.(e);
                setPressed(false);
            }}
            onPointerCancel={(e) => {
                onPointerCancel?.(e);
                setPressed(false);
            }}
            onMouseDown={(e) => {
                onMouseDown?.(e);
                if (!disabled) setPressed(true);
            }}
            onMouseUp={(e) => {
                onMouseUp?.(e);
                setPressed(false);
            }}
            onMouseLeave={(e) => {
                onMouseLeave?.(e);
                setPressed(false);
            }}
            {...props}
        >
            {children}
        </button>
    );
}

export function DropdownSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            role="separator"
            aria-orientation="horizontal"
            data-refineui="dropdown-menu-separator"
            className={clsx(
                "flex w-full items-center px-refineui-size-x-small py-refineui-size-xxx-small",
                className,
            )}
            {...props}
        >
            <div
                role="presentation"
                className="h-px w-full shrink-0 bg-refineui-alias-border-default"
            />
        </div>
    );
}

export function DropdownShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            data-refineui="dropdown-menu-shortcut"
            className={clsx(dropdownStyles.shortcut, className)}
            {...props}
        />
    );
}

/** Legacy: sub-panel already portals to `document.body` internally — renders children only. */
export function DropdownPortal({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

/** Hover open/close — short open, longer close so the pointer can cross the gap */
const SUBMENU_OPEN_DELAY_MS = 75;
const SUBMENU_CLOSE_DELAY_MS = 220;

function isFinePointerHover(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

type SubCtx = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    triggerRef: RefObject<HTMLButtonElement | null>;
    openIntent: () => void;
    closeIntent: () => void;
    cancelClose: () => void;
};

const SubCtxBox = createContext<SubCtx | null>(null);

export function DropdownSub({ children }: { children: ReactNode }) {
    const [subOpen, setSubOpen] = useState(false);
    const subOpenRef = useRef(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const openTimerRef = useRef<number | null>(null);
    const closeTimerRef = useRef<number | null>(null);
    const root = useContext(DropdownCtx);

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
        if (!root?.open) {
            clearTimers();
            setSubOpen(false);
        }
    }, [root?.open, clearTimers]);

    useEffect(() => () => clearTimers(), [clearTimers]);

    return <SubCtxBox.Provider value={ctx}>{children}</SubCtxBox.Provider>;
}

function useSub(component: string): SubCtx {
    const v = useContext(SubCtxBox);
    if (!v) throw new Error(`${component} must be used within DropdownSub.`);
    return v;
}

export function DropdownSubTrigger({
    className,
    children,
    onClick,
    onPointerEnter,
    onPointerLeave,
    disabled,
    ...props
}: DropdownSubTriggerProps) {
    const { open, setOpen, triggerRef, openIntent, closeIntent, cancelClose } = useSub("DropdownSubTrigger");
    const isDisabled = Boolean(disabled);

    return (
        <button
            type="button"
            ref={triggerRef as Ref<HTMLButtonElement>}
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={open}
            disabled={isDisabled}
            data-refineui="dropdown-item"
            data-slot="dropdown-menu-sub-trigger"
            tabIndex={-1}
            className={clsx(
                dropdownStyles.item,
                open && !isDisabled && "bg-refineui-alias-background-primary-hover",
                isDisabled && "cursor-not-allowed text-refineui-alias-foreground-disabled",
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
            onClick={(e) => {
                onClick?.(e);
                if (e.defaultPrevented || isDisabled) return;
                cancelClose();
                if (isFinePointerHover()) {
                    setOpen(true);
                } else {
                    setOpen((value) => !value);
                }
            }}
            {...props}
        >
            {children}
            <WebIcon
                name="chevron-right"
                size={iconSizes.small}
                color="currentColor"
                aria-hidden
                className="ml-auto shrink-0"
            />
        </button>
    );
}

export function DropdownSubContent({ className, children, style, ...props }: DropdownSubContentProps) {
    const root = useDropdownRoot("DropdownSubContent");
    const sub = useSub("DropdownSubContent");
    const panelRef = useRef<HTMLDivElement | null>(null);
    const [fixedStyle, setFixedStyle] = useState<CSSProperties | null>(null);
    const [side, setSide] = useState<"left" | "right">("right");
    const defaultMenuW = parseCssPxLen(componentSizes.dropdownMenuWidth, 180);
    /** Tighter gap — easier to move pointer onto the panel without closing */
    const gapPx = parseCssPxLen(spacings.sizeXXXSmall, 2);

    const setPanelEl = useCallback(
        (el: HTMLDivElement | null) => {
            panelRef.current = el;
            if (sub.open) root.registerSubPanel(el);
        },
        [sub.open, root],
    );

    useIsomorphicLayoutEffect(() => {
        if (!sub.open || !root.open) {
            setFixedStyle(null);
            root.registerSubPanel(null);
            return;
        }

        const apply = () => {
            const triggerEl = sub.triggerRef.current;
            const tr = triggerEl?.getBoundingClientRect();
            if (!tr || !triggerEl) return;

            const vh = window.innerHeight;
            const vw = window.innerWidth;
            if (tr.bottom < 0 || tr.top > vh || tr.right < 0 || tr.left > vw) {
                sub.setOpen(false);
                return;
            }

            const pw = panelRef.current?.offsetWidth && panelRef.current.offsetWidth > 0 ? panelRef.current.offsetWidth : defaultMenuW;
            const ph =
                panelRef.current?.offsetHeight && panelRef.current.offsetHeight > 0
                    ? panelRef.current.offsetHeight
                    : 160;
            const pos = computeSubmenuPanelPosition({
                trigger: tr,
                panelWidth: pw,
                panelHeight: ph,
                gap: gapPx,
            });

            setSide(pos.left >= tr.right - 1 ? "right" : "left");
            setFixedStyle({
                position: "fixed",
                top: pos.top,
                left: pos.left,
                minWidth: componentSizes.dropdownMenuWidth,
                zIndex: (Number.parseInt(String(zIndex.zIndexMessages), 10) || 10000) + 100,
                maxHeight: "min(60vh, 20rem)",
            });
        };

        apply();
        const raf = requestAnimationFrame(() => apply());
        window.addEventListener("resize", apply);
        const unsubScroll = subscribeScrollAndScrollableAncestors(sub.triggerRef.current, apply);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", apply);
            unsubScroll();
        };
    }, [sub.open, sub.triggerRef, sub, root.open, defaultMenuW, gapPx, root]);

    if (!sub.open || !root.open || !fixedStyle || typeof document === "undefined") return null;

    const panel = (
        <div
            ref={setPanelEl}
            role="menu"
            data-refineui="dropdown-menu"
            data-submenu="true"
            data-state="open"
            data-side={side}
            tabIndex={-1}
            className={clsx(dropdownStyles.submenuShell, className)}
            style={{
                ...fixedStyle,
                ...style,
                borderColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.border),
                backgroundColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.background),
            }}
            onPointerEnter={() => sub.cancelClose()}
            onPointerLeave={() => {
                if (isFinePointerHover()) {
                    sub.closeIntent();
                }
            }}
            {...props}
        >
            <ScrollAreaRegion type="hover" className="min-h-0 max-h-full" viewportClassName={dropdownStyles.menuViewport}>
                {children}
            </ScrollAreaRegion>
        </div>
    );

    return createPortal(panel, document.body);
}
