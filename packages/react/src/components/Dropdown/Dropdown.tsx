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
import { iconSizes, spacings, strokeWidths, typographys, zIndex } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes } from "../../componentSizes";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import { composeRef } from "../../utils/composeRef";
import { getMergeableTriggerChild } from "../../utils/mergeTriggerChild";
import { acquireBodyScrollLock } from "../../utils/bodyScrollLock";
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

export function Dropdown({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    const [open, setOpen] = useState(false);
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
    }, []);

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

/** `PopoverTrigger` · `MenuTrigger` 와 같이 단일 병합 가능 자식이면 ref·이벤트를 합성하고, 아니면 래퍼 `button`을 둡니다. */
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
            ref: composeRef(triggerRef, el.ref),
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

    const gapPx = sideOffset ?? parseCssPxLen(spacings.sizeXSmall, 4);
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
            className={clsx(
                "box-border flex max-w-[min(100vw-16px,calc(100vw-2rem))] flex-col gap-px overflow-x-hidden overflow-y-auto overscroll-contain rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-xsmall shadow-refineui-2light outline-none",
                className,
            )}
            {...props}
            style={{
                ...fixedStyle,
                ...style,
                borderColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.border),
                backgroundColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.background),
            }}
        >
            {children}
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
            className={clsx(
                "refineui-typo-caption-1 shrink-0 px-refineui-size-medium py-refineui-size-small font-medium text-refineui-alias-foreground-primary",
                className,
            )}
            style={typographys.caption1}
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
            className={clsx(
                "refineui-typo-body-2 flex w-full cursor-pointer items-center justify-between gap-refineui-size-medium rounded-refineui-xlarge border-none bg-transparent px-refineui-size-medium py-refineui-size-small text-left font-medium text-refineui-alias-foreground-primary outline-none disabled:cursor-not-allowed disabled:text-refineui-alias-foreground-disabled",
                className,
            )}
            style={{ ...typographys.body2, ...style }}
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
            className={clsx("-mx-refineui-size-xsmall my-refineui-size-xxsmall h-px shrink-0 bg-refineui-alias-border-default", className)}
            {...props}
        />
    );
}

export function DropdownShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            data-refineui="dropdown-menu-shortcut"
            className={clsx(
                "refineui-typo-body-4 ml-auto shrink-0 tracking-wide text-refineui-alias-foreground-primary",
                className,
            )}
            style={typographys.body4}
            {...props}
        />
    );
}

/** 호환용 — 서브 패널은 내부에서 이미 `document.body`로 포털합니다. 자식만 렌더합니다. */
export function DropdownPortal({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

type SubCtx = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    triggerRef: RefObject<HTMLButtonElement | null>;
};

const SubCtxBox = createContext<SubCtx | null>(null);

export function DropdownSub({ children }: { children: ReactNode }) {
    const [subOpen, setSubOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const ctx = useMemo(() => ({ open: subOpen, setOpen: setSubOpen, triggerRef }), [subOpen]);

    const root = useContext(DropdownCtx);
    useEffect(() => {
        if (!root?.open) setSubOpen(false);
    }, [root?.open]);

    return <SubCtxBox.Provider value={ctx}>{children}</SubCtxBox.Provider>;
}

function useSub(component: string): SubCtx {
    const v = useContext(SubCtxBox);
    if (!v) throw new Error(`${component} must be used within DropdownSub.`);
    return v;
}

export function DropdownSubTrigger({ className, children, onClick, ...props }: DropdownSubTriggerProps) {
    const { open, setOpen, triggerRef } = useSub("DropdownSubTrigger");

    return (
        <button
            type="button"
            ref={triggerRef as Ref<HTMLButtonElement>}
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={open}
            data-refineui="dropdown-item"
            data-slot="dropdown-menu-sub-trigger"
            tabIndex={-1}
            className={clsx(
                "refineui-typo-body-2 flex w-full cursor-pointer items-center gap-refineui-size-medium rounded-refineui-xlarge border-none bg-transparent px-refineui-size-medium py-refineui-size-small text-left font-medium text-refineui-alias-foreground-primary outline-none",
                open && "bg-refineui-alias-background-surface-hover",
                className,
            )}
            style={typographys.body2}
            onClick={(e) => {
                onClick?.(e);
                setOpen((o) => !o);
            }}
            {...props}
        >
            <span
                className="refineui-typo-body-2 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium"
                style={typographys.body2}
            >
                {children}
            </span>
            <WebIcon name="chevron-right" size={iconSizes.small} color="currentColor" aria-hidden className="ml-auto shrink-0" />
        </button>
    );
}

export function DropdownSubContent({ className, children, ...props }: DropdownSubContentProps) {
    const root = useDropdownRoot("DropdownSubContent");
    const sub = useSub("DropdownSubContent");
    const panelRef = useRef<HTMLDivElement | null>(null);
    const [fixedStyle, setFixedStyle] = useState<CSSProperties | null>(null);
    const defaultMenuW = parseCssPxLen(componentSizes.dropdownMenuWidth, 180);

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
            const tr = sub.triggerRef.current?.getBoundingClientRect();
            if (!tr) return;
            const pw = panelRef.current?.offsetWidth && panelRef.current.offsetWidth > 0 ? panelRef.current.offsetWidth : defaultMenuW;
            const ph =
                panelRef.current?.offsetHeight && panelRef.current.offsetHeight > 0
                    ? panelRef.current.offsetHeight
                    : 160;
            const gapPx = parseCssPxLen(spacings.sizeXSmall, 4);
            const pos = computeSubmenuPanelPosition({
                trigger: tr,
                panelWidth: pw,
                panelHeight: ph,
                gap: gapPx,
            });

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
    }, [sub.open, sub.triggerRef, root.open, defaultMenuW, root]);

    if (!sub.open || !fixedStyle || typeof document === "undefined") return null;

    const panel = (
        <div
            ref={setPanelEl}
            role="menu"
            data-refineui="dropdown-menu"
            data-submenu="true"
            tabIndex={-1}
            className={clsx(
                "box-border flex flex-col gap-px overflow-x-hidden overflow-y-auto overscroll-contain rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-xsmall shadow-refineui-2light outline-none",
                className,
            )}
            style={{
                ...fixedStyle,
                borderColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.border),
                backgroundColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.background),
            }}
            {...props}
        >
            {children}
        </div>
    );

    return createPortal(panel, document.body);
}
