import { clsx } from "clsx";
import type {
    ButtonHTMLAttributes,
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
    useLayoutEffect,
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
import { composeRef } from "../../utils/composeRef";
import { getMergeableTriggerChild } from "../../utils/mergeTriggerChild";
import { acquireBodyScrollLock } from "../../utils/bodyScrollLock";
import { RadioInput } from "../Radio/RadioInput";

const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

function parseCssPxLen(value: string, fallback: number): number {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
}

/** 스크롤 가능한 조상 + window — `getBoundingClientRect` 기준 갱신용 */
function subscribeScrollAndScrollableAncestors(target: HTMLElement | null, fn: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const list: (Element | Window)[] = [window];
    let el: HTMLElement | null = target?.parentElement ?? null;
    while (el) {
        const { overflow, overflowX, overflowY } = getComputedStyle(el);
        if (
            [overflow, overflowX, overflowY].some((o) => o === "auto" || o === "scroll" || o === "overlay") ||
            el.scrollHeight > el.clientHeight + 1
        ) {
            list.push(el);
        }
        el = el.parentElement;
    }
    for (const t of list) {
        t.addEventListener("scroll", fn, true);
    }
    return () => {
        for (const t of list) {
            t.removeEventListener("scroll", fn, true);
        }
    };
}

/** shadcn `align` + RefineUI `side` 와 동일한 고정 메뉴 배치 (뷰포트 클램프). */

export type MenuAlign = "start" | "end" | "center";

function computeAnchoredMenuPosition(params: {
    anchor: DOMRect;
    menuWidth: number;
    menuHeight: number;
    align: MenuAlign;
    side: "auto" | "top" | "bottom";
    gap: number;
    edge?: number;
}): { top: number; left: number; side: "top" | "bottom" } {
    const edge = params.edge ?? 8;
    const { anchor, menuWidth: menuW, menuHeight: menuH, align, side, gap } = params;
    const vw = typeof window !== "undefined" ? window.innerWidth : 800;
    const vh = typeof window !== "undefined" ? window.innerHeight : 600;

    let left =
        align === "start"
            ? anchor.left
            : align === "end"
              ? anchor.right - menuW
              : anchor.left + anchor.width / 2 - menuW / 2;
    left = Math.max(edge, Math.min(left, vw - menuW - edge));

    const spaceBelow = vh - edge - (anchor.bottom + gap);
    const spaceAbove = anchor.top - gap - edge;
    const fitsBelow = menuH <= spaceBelow;
    const fitsAbove = menuH <= spaceAbove;

    let top: number;
    let resolvedSide: "top" | "bottom" = "bottom";

    if (side === "bottom") {
        resolvedSide = "bottom";
        top = anchor.bottom + gap;
        if (!fitsBelow && fitsAbove) {
            top = anchor.top - gap - menuH;
            resolvedSide = "top";
        } else if (!fitsBelow && !fitsAbove) {
            top = Math.max(edge, Math.min(anchor.bottom + gap, vh - edge - menuH));
        }
    } else if (side === "top") {
        resolvedSide = "top";
        top = anchor.top - gap - menuH;
        if (!fitsAbove && fitsBelow) {
            top = anchor.bottom + gap;
            resolvedSide = "bottom";
        } else if (!fitsBelow && !fitsAbove) {
            top = Math.max(edge, Math.min(anchor.top - gap - menuH, vh - edge - menuH));
        }
    } else {
        if (!fitsBelow && fitsAbove) {
            top = anchor.top - gap - menuH;
            resolvedSide = "top";
        } else {
            top = anchor.bottom + gap;
            resolvedSide = "bottom";
        }
        if (!fitsBelow && !fitsAbove) {
            top = Math.max(edge, Math.min(anchor.bottom + gap, vh - edge - menuH));
            resolvedSide = "bottom";
        }
    }

    return { top, left, side: resolvedSide };
}

function computeSubmenuPanelPosition(params: {
    trigger: DOMRect;
    panelWidth: number;
    panelHeight: number;
    gap: number;
    edge?: number;
    /** 기본 트리거 오른쪽; 공간 부족 시 왼쪽 */
    preferredSide?: "right" | "left";
}): { top: number; left: number } {
    const edge = params.edge ?? 8;
    const { trigger: tr, panelWidth: pw, panelHeight: ph, gap } = params;
    const vw = typeof window !== "undefined" ? window.innerWidth : 800;
    const vh = typeof window !== "undefined" ? window.innerHeight : 600;

    let left = tr.right + gap;
    if (left + pw > vw - edge) {
        left = tr.left - gap - pw;
    }
    left = Math.max(edge, Math.min(left, vw - pw - edge));

    let top = tr.top;
    top = Math.max(edge, Math.min(top, vh - ph - edge));

    return { top, left };
}

type TriggerProps = {
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
    className?: string;
};
type TriggerElement = ReactElement<TriggerProps> & { ref?: Ref<HTMLElement | null> };


/** Row selection UI + ARIA. `none` = 일반 행(`menuitem`). */
export type DropdownSelectionVariant = "none" | "checkbox" | "radio";

export interface DropdownListItem {
    id: string;
    label: ReactNode;
    startIcon?: ReactNode;
    shortcut?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    /** 고정 선택 표시(배경 `surfaceSelected`). `selection`이 none일 때만 시각만 쓰면 됩니다. */
    selected?: boolean;
    /** 체크·라디오 행 — 좌측 컨트롤 + `menuitemcheckbox` / `menuitemradio`. */
    selection?: DropdownSelectionVariant;
}

export interface DropdownListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    trigger: ReactNode;
    items: DropdownListItem[];
    align?: "start" | "end";
    /** 메뉴를 트리거 위·아래 어디에 붙일지. `auto`는 공간에 따라 뒤집습니다. */
    side?: "auto" | "top" | "bottom";
    showTriggerChevron?: boolean;
    menuTitle?: ReactNode;
}


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

export function DropdownList({
    trigger,
    items,
    align = "end",
    side = "auto",
    showTriggerChevron = false,
    menuTitle,
    className,
    ...props
}: DropdownListProps) {
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const menuId = useId();
    const [menuFixedStyle, setMenuFixedStyle] = useState<CSSProperties | null>(null);
    const [menuSide, setMenuSide] = useState<"top" | "bottom">("bottom");

    const enabledIndices = items.map((it, i) => (it.disabled ? -1 : i)).filter((i): i is number => i >= 0);

    const focusItemIndex = useCallback((itemIndex: number) => {
        const el = menuRef.current?.querySelector<HTMLButtonElement>(
            `[data-refineui="dropdown-item"][data-item-index="${itemIndex}"]`,
        );
        el?.focus();
        setHighlighted(itemIndex);
    }, []);

    const moveHighlight = useCallback(
        (delta: number) => {
            if (enabledIndices.length === 0) return;
            let pos = enabledIndices.indexOf(highlighted);
            if (pos < 0) pos = 0;
            pos = (pos + delta + enabledIndices.length) % enabledIndices.length;
            focusItemIndex(enabledIndices[pos]);
        },
        [enabledIndices, highlighted, focusItemIndex],
    );

    useEffect(() => {
        const handler = (e: globalThis.MouseEvent) => {
            const t = e.target as Node;
            if (containerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
            setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        return acquireBodyScrollLock();
    }, [open]);

    useIsomorphicLayoutEffect(() => {
        if (!open) {
            setMenuFixedStyle(null);
            setMenuSide("bottom");
            return;
        }
        const menuW = parseCssPxLen(componentSizes.dropdownMenuWidth, 180);
        const gap = parseCssPxLen(spacings.sizeXSmall, 4);
        const edge = 8;
        const z = Number.parseInt(String(zIndex.zIndexMessages), 10) || 10000;
        const estimatedMenuHeight =
            (menuTitle != null ? 40 : 0) + items.length * 40 + gap * 4;

        const apply = () => {
            const root = containerRef.current;
            if (!root) return;
            const r = root.getBoundingClientRect();
            let left = align === "start" ? r.left : r.right - menuW;
            left = Math.max(edge, Math.min(left, window.innerWidth - menuW - edge));

            const mhRaw = menuRef.current?.offsetHeight ?? 0;
            const menuH = mhRaw > 0 ? mhRaw : estimatedMenuHeight;

            const spaceBelow = window.innerHeight - edge - (r.bottom + gap);
            const spaceAbove = r.top - gap - edge;
            const fitsBelow = menuH <= spaceBelow;
            const fitsAbove = menuH <= spaceAbove;

            let top: number;
            let resolvedSide: "top" | "bottom" = "bottom";

            if (side === "bottom") {
                resolvedSide = "bottom";
                top = r.bottom + gap;
                if (!fitsBelow && fitsAbove) {
                    top = r.top - gap - menuH;
                    resolvedSide = "top";
                } else if (!fitsBelow && !fitsAbove) {
                    top = Math.max(edge, Math.min(r.bottom + gap, window.innerHeight - edge - menuH));
                }
            } else if (side === "top") {
                resolvedSide = "top";
                top = r.top - gap - menuH;
                if (!fitsAbove && fitsBelow) {
                    top = r.bottom + gap;
                    resolvedSide = "bottom";
                } else if (!fitsBelow && !fitsAbove) {
                    top = Math.max(edge, Math.min(r.top - gap - menuH, window.innerHeight - edge - menuH));
                }
            } else {
                if (!fitsBelow && fitsAbove) {
                    top = r.top - gap - menuH;
                    resolvedSide = "top";
                } else {
                    top = r.bottom + gap;
                    resolvedSide = "bottom";
                }
                if (!fitsBelow && !fitsAbove) {
                    top = Math.max(edge, Math.min(r.bottom + gap, window.innerHeight - edge - menuH));
                    resolvedSide = "bottom";
                }
            }

            setMenuSide(resolvedSide);

            setMenuFixedStyle((prev) => {
                const next: CSSProperties = {
                    position: "fixed",
                    top,
                    left,
                    width: componentSizes.dropdownMenuWidth,
                    minWidth: componentSizes.dropdownMenuWidth,
                    zIndex: z,
                    maxHeight: "min(60vh, 20rem)",
                };
                if (
                    prev &&
                    prev.top === next.top &&
                    prev.left === next.left &&
                    prev.zIndex === next.zIndex &&
                    prev.width === next.width &&
                    prev.maxHeight === next.maxHeight
                ) {
                    return prev;
                }
                return next;
            });
        };

        apply();
        const raf = requestAnimationFrame(() => apply());

        window.addEventListener("resize", apply);
        const unsubScroll = subscribeScrollAndScrollableAncestors(containerRef.current, apply);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", apply);
            unsubScroll();
        };
    }, [open, align, items.length, menuTitle, side]);

    useEffect(() => {
        if (!open || !menuFixedStyle) return;
        const first = enabledIndices[0] ?? 0;
        setHighlighted(first);
        const raf = requestAnimationFrame(() => focusItemIndex(first));
        return () => cancelAnimationFrame(raf);
    }, [open, menuFixedStyle, enabledIndices, focusItemIndex]);

    const close = useCallback(() => {
        setOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
    }, []);

    const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
            case "Escape":
                e.preventDefault();
                close();
                break;
            case "ArrowDown":
                e.preventDefault();
                moveHighlight(1);
                break;
            case "ArrowUp":
                e.preventDefault();
                moveHighlight(-1);
                break;
            case "Home":
                e.preventDefault();
                if (enabledIndices[0] !== undefined) focusItemIndex(enabledIndices[0]);
                break;
            case "End":
                e.preventDefault();
                if (enabledIndices.length > 0) focusItemIndex(enabledIndices[enabledIndices.length - 1]);
                break;
            default:
                break;
        }
    };

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

    const toggle = () => setOpen((o) => !o);

    const renderTrigger = () => {
        const mergeEl = getMergeableTriggerChild(trigger);
        if (mergeEl) {
            const el = mergeEl as TriggerElement;
            const prevClass = el.props.className;
            const unifyClass = showTriggerChevron ? "rounded-none border-none shadow-none outline-none" : "";
            return cloneElement(el, {
                ref: composeRef(triggerRef, el.ref),
                "aria-expanded": open,
                "aria-haspopup": "menu" as const,
                "aria-controls": menuId,
                className: clsx(prevClass, unifyClass),
                onClick: (e: MouseEvent<HTMLElement>) => {
                    el.props.onClick?.(e);
                    toggle();
                },
                onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
                    el.props.onKeyDown?.(e);
                    onTriggerKeyDown(e);
                },
            } as Partial<TriggerProps>);
        }
        return (
            <button
                type="button"
                ref={triggerRef as React.RefObject<HTMLButtonElement>}
                aria-expanded={open}
                aria-haspopup="menu"
                aria-controls={menuId}
                className="cursor-pointer border-none bg-transparent p-0 font-inherit text-inherit"
                onClick={toggle}
                onKeyDown={(e) => onTriggerKeyDown(e)}
            >
                {trigger}
            </button>
        );
    };

    const chevronControl = showTriggerChevron ? (
        <span
            role="presentation"
            aria-hidden
            className="box-border inline-flex shrink-0 cursor-pointer items-center justify-center bg-refineui-alias-background-primary px-refineui-size-xsmall"
            style={{
                borderLeftWidth: strokeWidths.strokeWidthHairline,
                borderLeftStyle: "solid",
                borderLeftColor: resolveColorTokenValue(componentColorTokens.dropdown.trigger.border),
                backgroundColor: resolveColorTokenValue(componentColorTokens.dropdown.trigger.background),
            }}
            onClick={toggle}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle();
                }
            }}
            tabIndex={-1}
        >
            <WebIcon
                name={open ? "chevron-up" : "chevron-down"}
                size={iconSizes.small}
                color={resolveColorTokenValue(componentColorTokens.dropdown.trigger.icon)}
            />
        </span>
    ) : null;

    return (
        <div ref={containerRef} data-refineui="dropdown" className={clsx("relative inline-block", className)} {...props}>
            {showTriggerChevron ? (
                <div
                    data-refineui="dropdown-trigger"
                    className="box-border inline-flex items-stretch overflow-hidden rounded-refineui-small border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary"
                    style={{
                        borderColor: resolveColorTokenValue(componentColorTokens.dropdown.trigger.border),
                        backgroundColor: resolveColorTokenValue(componentColorTokens.dropdown.trigger.background),
                    }}
                >
                    {renderTrigger()}
                    {chevronControl}
                </div>
            ) : (
                renderTrigger()
            )}
            {open &&
                menuFixedStyle &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        ref={menuRef}
                        id={menuId}
                        role="menu"
                        tabIndex={-1}
                        data-refineui="dropdown-menu"
                        data-side={menuSide}
                        onKeyDown={onMenuKeyDown}
                        className="box-border flex flex-col gap-px overflow-x-hidden overflow-y-auto overscroll-contain rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-xsmall shadow-refineui-2light outline-none"
                        style={{
                            ...menuFixedStyle,
                            borderColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.border),
                            backgroundColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.background),
                        }}
                    >
                        {menuTitle != null && (
                            <div
                                role="presentation"
                                className="refineui-typo-body-2 flex shrink-0 items-center gap-refineui-size-medium px-refineui-size-medium py-refineui-size-small font-medium text-refineui-alias-foreground-primary"
                            >
                                {menuTitle}
                            </div>
                        )}
                        {items.map((item, itemIndex) => {
                            const sel = item.selection ?? "none";
                            const rowRole =
                                sel === "checkbox"
                                    ? "menuitemcheckbox"
                                    : sel === "radio"
                                      ? "menuitemradio"
                                      : "menuitem";
                            const ariaChecked =
                                sel === "checkbox" || sel === "radio"
                                    ? Boolean(item.selected)
                                    : undefined;
                            const ariaSelected =
                                sel === "none" && item.selected ? true : undefined;

                            const rowClass = clsx(
                                "refineui-typo-body-4 flex w-full items-center justify-between gap-refineui-size-medium rounded-refineui-large border-none bg-transparent px-refineui-size-medium py-refineui-size-small text-left font-normal outline-none",
                                item.disabled
                                    ? "cursor-not-allowed text-refineui-alias-foreground-disabled"
                                    : "cursor-pointer text-refineui-alias-foreground-primary",
                            );

                            const onRowClick = () => {
                                if (item.disabled) return;
                                item.onClick?.();
                                close();
                            };

                            const onRowKeyDown = (e: KeyboardEvent<HTMLDivElement | HTMLButtonElement>) => {
                                if (item.disabled) return;
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    onRowClick();
                                }
                            };

                            const startIconRow = (
                                <span className="flex min-w-0 flex-1 items-center gap-refineui-size-medium">
                                    {sel === "checkbox" ? (
                                        <DropdownCheckboxGlyph selected={Boolean(item.selected)} disabled={item.disabled} />
                                    ) : null}
                                    {sel === "radio" ? (
                                        <RadioInput
                                            checked={Boolean(item.selected)}
                                            readOnly
                                            disabled={item.disabled}
                                            tabIndex={-1}
                                            aria-hidden="true"
                                            className="pointer-events-none shrink-0 cursor-default select-none"
                                        />
                                    ) : null}
                                    {item.startIcon != null ? (
                                        <span
                                            className="inline-flex shrink-0 items-center justify-center [&>span]:leading-none"
                                            style={{
                                                width: iconSizes.xsmall,
                                                minWidth: iconSizes.xsmall,
                                                height: iconSizes.xsmall,
                                            }}
                                        >
                                            {item.startIcon}
                                        </span>
                                    ) : null}
                                    <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</span>
                                </span>
                            );

                            const shortcutRow =
                                item.shortcut != null ? (
                                    <span className="refineui-typo-body-4 shrink-0 text-refineui-alias-foreground-secondary">
                                        {item.shortcut}
                                    </span>
                                ) : null;

                            if (sel === "radio") {
                                return (
                                    <div
                                        key={item.id}
                                        data-refineui="dropdown-item"
                                        data-item-index={itemIndex}
                                        role={rowRole}
                                        aria-checked={ariaChecked}
                                        aria-selected={ariaSelected}
                                        aria-disabled={item.disabled ? true : undefined}
                                        data-selected={item.selected ? "" : undefined}
                                        tabIndex={-1}
                                        onFocus={() => setHighlighted(itemIndex)}
                                        onMouseEnter={() => {
                                            if (!item.disabled) focusItemIndex(itemIndex);
                                        }}
                                        onClick={onRowClick}
                                        onKeyDown={onRowKeyDown}
                                        className={rowClass}
                                    >
                                        {startIconRow}
                                        {shortcutRow}
                                    </div>
                                );
                            }

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    data-refineui="dropdown-item"
                                    data-item-index={itemIndex}
                                    role={rowRole}
                                    aria-checked={ariaChecked}
                                    aria-selected={ariaSelected}
                                    data-selected={item.selected ? "" : undefined}
                                    disabled={item.disabled}
                                    tabIndex={-1}
                                    onFocus={() => setHighlighted(itemIndex)}
                                    onMouseEnter={() => {
                                        if (!item.disabled) focusItemIndex(itemIndex);
                                    }}
                                    onClick={onRowClick}
                                    className={rowClass}
                                >
                                    {startIconRow}
                                    {shortcutRow}
                                </button>
                            );
                        })}
                    </div>,
                    document.body,
                )}
        </div>
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

export interface DropdownTriggerProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    children: ReactNode;
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

export interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
    align?: MenuAlign;
    side?: "auto" | "top" | "bottom";
    /** 트리거와 패널 사이 간격 — 기본 `sizeXSmall`(4px). */
    sideOffset?: number;
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
                "refineui-typo-body-2 shrink-0 px-refineui-size-medium py-refineui-size-small font-medium text-refineui-alias-foreground-primary",
                className,
            )}
            {...props}
        />
    );
}

export interface DropdownItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    children: ReactNode;
}

export function DropdownItem({
    className,
    disabled,
    children,
    onClick,
    ...props
}: DropdownItemProps) {
    const { close } = useDropdownRoot("DropdownItem");
    return (
        <button
            type="button"
            role="menuitem"
            data-refineui="dropdown-item"
            disabled={disabled}
            tabIndex={-1}
            className={clsx(
                "refineui-typo-body-4 flex w-full cursor-pointer items-center justify-between gap-refineui-size-medium rounded-refineui-large border-none bg-transparent px-refineui-size-medium py-refineui-size-small text-left font-normal text-refineui-alias-foreground-primary outline-none disabled:cursor-not-allowed disabled:text-refineui-alias-foreground-disabled",
                className,
            )}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented) close();
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
                "refineui-typo-body-4 ml-auto shrink-0 tracking-wide text-refineui-alias-foreground-secondary",
                className,
            )}
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

export interface DropdownSubTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
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
                "refineui-typo-body-4 flex w-full cursor-pointer items-center gap-refineui-size-medium rounded-refineui-large border-none bg-transparent px-refineui-size-medium py-refineui-size-small text-left font-normal text-refineui-alias-foreground-primary outline-none",
                open && "bg-refineui-alias-background-surface-hover",
                className,
            )}
            onClick={(e) => {
                onClick?.(e);
                setOpen((o) => !o);
            }}
            {...props}
        >
            <span className="min-w-0 flex-1">{children}</span>
            <WebIcon name="chevron-right" size={iconSizes.small} color="currentColor" aria-hidden className="ml-auto shrink-0" />
        </button>
    );
}

export interface DropdownSubContentProps extends HTMLAttributes<HTMLDivElement> {}

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
