import { clsx } from "clsx";
import type {
    ChangeEvent,
    CSSProperties,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    PointerEvent as ReactPointerEvent,
    ReactNode,
    Ref,
} from "react";
import {
    Children,
    createContext,
    isValidElement,
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
import { iconSizes, spacings, zIndex } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import { acquireBodyScrollLock } from "../../utils/bodyScrollLock";
import { parseCssPxLen, subscribeScrollAndScrollableAncestors } from "../Dropdown/positioning";
import { inputBorderClass, inputStyles } from "../Input/style";
import { selectSizeClass, selectStyles } from "./style";
import type {
    SelectContentProps,
    SelectGroupProps,
    SelectItemProps,
    SelectProps,
    SelectSectionProps,
    SelectSeparatorProps,
    SelectTriggerProps,
    SelectValueProps,
} from "./types";

/** Radix `@radix-ui/number` clamp — 로컬 구현 (외부 의존 없음). */
function clampNumber(value: number, [min, max]: [number, number]): number {
    return Math.min(max, Math.max(min, value));
}

/** Radix Select `CONTENT_MARGIN` — Foundation spacing 토큰과 동기화 */
const CONTENT_MARGIN = parseCssPxLen(spacings.sizeMedium, 10);

type OptionNode = { value: string; label: string; disabled: boolean };

type SelectRootCtx = {
    open: boolean;
    setOpen: (next: boolean) => void;
    close: () => void;
    value: string;
    setValue: (next: string) => void;
    selectedLabel: string;
    disabled: boolean;
    placeholder?: string;
    fullWidth: boolean;
    size: NonNullable<SelectProps["size"]>;
    triggerRef: React.RefObject<HTMLElement | null>;
    menuRef: React.MutableRefObject<HTMLDivElement | null>;
    listboxId: string;
    valueNode: HTMLElement | null;
    setValueNode: (node: HTMLElement | null) => void;
    triggerPointerDownPosRef: React.MutableRefObject<{ x: number; y: number } | null>;
};

const SelectContext = createContext<SelectRootCtx | null>(null);

function useSelectRoot(component: string): SelectRootCtx {
    const ctx = useContext(SelectContext);
    if (!ctx) throw new Error(`${component} must be used within Select.`);
    return ctx;
}

/** SelectContent 전용 — 아이템 등록 (Radix Collection item 슬롯과 동일한 역할). */
type SelectContentCtx = {
    itemRefCallback: (node: HTMLElement | null, value: string, disabled: boolean) => void;
};

const SelectContentContext = createContext<SelectContentCtx | null>(null);

function useSelectContent(component: string): SelectContentCtx {
    const ctx = useContext(SelectContentContext);
    if (!ctx) throw new Error(`${component} must be used within SelectContent.`);
    return ctx;
}

function extractLabel(children: ReactNode, textValue?: string): string {
    if (textValue) return textValue;
    if (typeof children === "string" || typeof children === "number") return String(children);
    return "";
}

function collectOptions(children: ReactNode): OptionNode[] {
    const result: OptionNode[] = [];
    const walk = (node: ReactNode): void => {
        Children.forEach(node, (child) => {
            if (!isValidElement(child)) return;
            if (child.type === SelectItem) {
                const props = child.props as SelectItemProps;
                result.push({
                    value: props.value,
                    label: extractLabel(props.children, props.textValue),
                    disabled: !!props.disabled,
                });
                return;
            }
            walk((child.props as { children?: ReactNode }).children);
        });
    };
    walk(children);
    return result;
}

const hiddenSelectStyle: CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    border: 0,
    padding: 0,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
};

export function Select({
    children,
    className,
    placeholder,
    fullWidth = false,
    size = "md",
    disabled = false,
    value: valueProp,
    defaultValue = "",
    name,
    required,
    onValueChange,
    onChange,
    ...props
}: SelectProps) {
    const triggerRef = useRef<HTMLElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement | null>(null);
    const triggerPointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

    const listboxId = useId();
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = valueProp ?? internalValue;
    const [valueNode, setValueNode] = useState<HTMLElement | null>(null);

    const options = useMemo(() => collectOptions(children), [children]);
    const selectedLabel = useMemo(() => options.find((o) => o.value === value)?.label ?? "", [options, value]);

    const setValue = useCallback(
        (next: string) => {
            if (valueProp === undefined) setInternalValue(next);
            onValueChange?.(next);
            if (hiddenSelectRef.current) hiddenSelectRef.current.value = next;
        },
        [onValueChange, valueProp],
    );

    const close = useCallback(() => {
        setOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
    }, []);

    const handleNativeChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            const next = event.target.value;
            if (valueProp === undefined) setInternalValue(next);
            onValueChange?.(next);
            onChange?.(event);
        },
        [onChange, onValueChange, valueProp],
    );

    const ctx = useMemo<SelectRootCtx>(
        () => ({
            open,
            setOpen,
            close,
            value,
            setValue,
            selectedLabel,
            disabled,
            placeholder,
            fullWidth,
            size,
            triggerRef,
            menuRef,
            listboxId,
            valueNode,
            setValueNode,
            triggerPointerDownPosRef,
        }),
        [open, close, value, setValue, selectedLabel, disabled, placeholder, fullWidth, size, listboxId, valueNode],
    );

    return (
        <SelectContext.Provider value={ctx}>
            <div className={clsx(selectStyles.root, fullWidth && "w-full", className)} {...props}>
                {name ? (
                    <select
                        ref={hiddenSelectRef}
                        name={name}
                        required={required}
                        disabled={disabled}
                        value={value}
                        onChange={handleNativeChange}
                        aria-hidden
                        tabIndex={-1}
                        style={hiddenSelectStyle}
                    >
                        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
                        {options.map((option) => (
                            <option key={option.value} value={option.value} disabled={option.disabled}>
                                {option.label || option.value}
                            </option>
                        ))}
                    </select>
                ) : null}
                {children}
            </div>
        </SelectContext.Provider>
    );
}

const iconSizeBySelectSize: Record<NonNullable<SelectProps["size"]>, number> = {
    sm: iconSizes.xxsmall,
    md: iconSizes.xsmall,
    lg: iconSizes.small,
};

export function SelectTrigger({ children, className, ...props }: SelectTriggerProps) {
    const {
        open,
        setOpen,
        value,
        disabled,
        placeholder,
        fullWidth,
        size,
        triggerRef,
        listboxId,
        triggerPointerDownPosRef,
    } = useSelectRoot("SelectTrigger");

    const borderClass = disabled ? inputBorderClass.disabled : inputBorderClass.default;
    const pointerTypeRef = useRef<ReactPointerEvent["pointerType"]>("touch");

    const onTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(!open);
        } else if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
        } else if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
        }
    };

    const pass = props as HTMLAttributes<HTMLButtonElement>;
    const showPlaceholder = !value && placeholder !== undefined;

    return (
        <button
            type="button"
            ref={triggerRef as React.RefObject<HTMLButtonElement>}
            disabled={disabled}
            role="combobox"
            data-refineui="select"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="none"
            data-placeholder={showPlaceholder ? "" : undefined}
            data-state={open ? "open" : "closed"}
            className={clsx(
                selectStyles.trigger,
                borderClass,
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                disabled ? inputStyles.disabledBg : inputStyles.defaultBg,
                fullWidth && "w-full",
                selectSizeClass[size],
                className,
                pass.className,
            )}
            style={{ color: resolveColorTokenValue(componentColorTokens.select.text), ...pass.style }}
            {...props}
            onClick={(event) => {
                pass.onClick?.(event);
                if (!disabled) setOpen(!open);
            }}
            onPointerDown={(event) => {
                pass.onPointerDown?.(event);
                pointerTypeRef.current = event.pointerType;
                const target = event.target as HTMLElement;
                if (target.hasPointerCapture(event.pointerId)) {
                    target.releasePointerCapture(event.pointerId);
                }
                if (!disabled && event.button === 0 && event.pointerType === "mouse") {
                    triggerPointerDownPosRef.current = {
                        x: Math.round(event.pageX),
                        y: Math.round(event.pageY),
                    };
                }
            }}
            onKeyDown={(event) => {
                pass.onKeyDown?.(event);
                onTriggerKeyDown(event);
            }}
        >
            {children ?? <SelectValue />}
            <WebIcon name="chevron-down" size={iconSizeBySelectSize[size]} color="currentColor" aria-hidden />
        </button>
    );
}

export function SelectValue({ className, placeholder, ...props }: SelectValueProps) {
    const { value, selectedLabel, placeholder: rootPlaceholder, setValueNode } = useSelectRoot("SelectValue");
    const resolvedPlaceholder = placeholder ?? rootPlaceholder;
    const showPlaceholder = !value && resolvedPlaceholder !== undefined;
    const displayText = showPlaceholder ? resolvedPlaceholder : selectedLabel || value;

    const setRef = useCallback(
        (node: HTMLSpanElement | null) => {
            setValueNode(node);
        },
        [setValueNode],
    );

    return (
        <span
            ref={setRef}
            className={clsx(
                selectStyles.valueText,
                showPlaceholder && "text-refineui-alias-foreground-placeholder",
                className,
            )}
            style={
                showPlaceholder
                    ? { color: resolveColorTokenValue(componentColorTokens.select.placeholder) }
                    : undefined
            }
            {...props}
        >
            {displayText}
        </span>
    );
}

export function SelectContent({
    className,
    align: _align,
    side: _side,
    sideOffset,
    style,
    children,
    ...props
}: SelectContentProps) {
    void _align;
    void _side;
    void sideOffset;

    const root = useSelectRoot("SelectContent");
    const {
        open,
        setOpen,
        close,
        triggerRef,
        menuRef,
        listboxId,
        valueNode,
        triggerPointerDownPosRef,
    } = root;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const setContentAndMenuRef = useCallback(
        (node: HTMLDivElement | null) => {
            contentRef.current = node;
            menuRef.current = node;
        },
        [menuRef],
    );

    const [selectedItem, setSelectedItem] = useState<HTMLElement | null>(null);
    const [isPositioned, setIsPositioned] = useState(false);
    const [showTopChevron, setShowTopChevron] = useState(false);
    const [showBottomChevron, setShowBottomChevron] = useState(false);

    const firstValidItemFoundRef = useRef(false);
    const shouldExpandOnScrollRef = useRef(false);
    const prevViewportScrollTopRef = useRef(0);
    const layerIndex = Number.parseInt(String(zIndex.zIndexMessages), 10) || 10000;

    const itemRefCallback = useCallback(
        (node: HTMLElement | null, itemValue: string, disabled: boolean) => {
            if (!node) return;
            const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
            const isSelectedItem =
                root.value !== undefined && root.value !== "" && root.value === itemValue;
            if (isSelectedItem || isFirstValidItem) {
                setSelectedItem(node);
                if (isFirstValidItem) firstValidItemFoundRef.current = true;
            }
        },
        [root.value],
    );

    const contentCtx = useMemo<SelectContentCtx>(
        () => ({
            itemRefCallback,
        }),
        [itemRefCallback],
    );

    /** Radix SelectItemAlignedPosition.position — 트리거·값 노드·선택 라벨 정렬 기준 동일 */
    const position = useCallback(() => {
        const trigger = triggerRef.current;
        const wrapper = wrapperRef.current;
        const content = contentRef.current;
        const viewport = viewportRef.current;
        const selected = selectedItem;

        if (!trigger || !wrapper || !content || !viewport || !selected) return;

        const triggerRect = trigger.getBoundingClientRect();
        const valueNodeRect = valueNode?.getBoundingClientRect() ?? triggerRect;

        const contentRect = content.getBoundingClientRect();
        const selectedTextEl =
            selected.querySelector<HTMLElement>("[data-refineui-select-item-text]") ?? selected;
        const itemTextRect = selectedTextEl.getBoundingClientRect();

        const isRtl =
            typeof window !== "undefined" &&
            (getComputedStyle(trigger).direction === "rtl" || document.documentElement.dir === "rtl");

        if (!isRtl) {
            const itemTextOffset = itemTextRect.left - contentRect.left;
            const left = valueNodeRect.left - itemTextOffset;
            const leftDelta = triggerRect.left - left;
            const minContentWidth = triggerRect.width + leftDelta;
            const contentWidth = Math.max(minContentWidth, contentRect.width);
            const rightEdge = window.innerWidth - CONTENT_MARGIN;
            const clampedLeft = clampNumber(left, [
                CONTENT_MARGIN,
                Math.max(CONTENT_MARGIN, rightEdge - contentWidth),
            ]);
            wrapper.style.minWidth = `${minContentWidth}px`;
            wrapper.style.left = `${clampedLeft}px`;
            wrapper.style.right = "";
        } else {
            const itemTextOffset = contentRect.right - itemTextRect.right;
            const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
            const rightDelta = window.innerWidth - triggerRect.right - right;
            const minContentWidth = triggerRect.width + rightDelta;
            const contentWidth = Math.max(minContentWidth, contentRect.width);
            const leftEdge = window.innerWidth - CONTENT_MARGIN;
            const clampedRight = clampNumber(right, [
                CONTENT_MARGIN,
                Math.max(CONTENT_MARGIN, leftEdge - contentWidth),
            ]);
            wrapper.style.minWidth = `${minContentWidth}px`;
            wrapper.style.right = `${clampedRight}px`;
            wrapper.style.left = "";
        }

        const items = Array.from(
            viewport.querySelectorAll<HTMLElement>('[data-refineui="select-item"]:not(:disabled)'),
        );
        const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
        const itemsHeight = viewport.scrollHeight;

        const contentStyles = window.getComputedStyle(content);
        const contentBorderTopWidth = Number.parseInt(contentStyles.borderTopWidth, 10) || 0;
        const contentPaddingTop = Number.parseInt(contentStyles.paddingTop, 10) || 0;
        const contentBorderBottomWidth = Number.parseInt(contentStyles.borderBottomWidth, 10) || 0;
        const contentPaddingBottom = Number.parseInt(contentStyles.paddingBottom, 10) || 0;
        const fullContentHeight =
            contentBorderTopWidth +
            contentPaddingTop +
            itemsHeight +
            contentPaddingBottom +
            contentBorderBottomWidth;
        const minContentHeight = Math.min(selected.offsetHeight * 5, fullContentHeight);

        const viewportStyles = window.getComputedStyle(viewport);
        const viewportPaddingTop = Number.parseInt(viewportStyles.paddingTop, 10) || 0;
        const viewportPaddingBottom = Number.parseInt(viewportStyles.paddingBottom, 10) || 0;

        const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
        const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;

        const selectedItemHalfHeight = selected.offsetHeight / 2;
        const itemOffsetMiddle = selected.offsetTop + selectedItemHalfHeight;
        const contentTopToItemMiddle =
            contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
        const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;

        const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;

        if (willAlignWithoutTopOverflow) {
            const isLastItem = items.length > 0 && selected === items[items.length - 1];
            wrapper.style.bottom = "0px";
            wrapper.style.top = "";
            const viewportOffsetBottom =
                content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
            const clampedTriggerMiddleToBottomEdge = Math.max(
                triggerMiddleToBottomEdge,
                selectedItemHalfHeight +
                    (isLastItem ? viewportPaddingBottom : 0) +
                    viewportOffsetBottom +
                    contentBorderBottomWidth,
            );
            const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
            wrapper.style.height = `${height}px`;
        } else {
            const isFirstItem = items.length > 0 && selected === items[0];
            wrapper.style.top = "0px";
            wrapper.style.bottom = "";
            const clampedTopEdgeToTriggerMiddle = Math.max(
                topEdgeToTriggerMiddle,
                contentBorderTopWidth +
                    viewport.offsetTop +
                    (isFirstItem ? viewportPaddingTop : 0) +
                    selectedItemHalfHeight,
            );
            const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
            wrapper.style.height = `${height}px`;
            viewport.scrollTop =
                contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
        }

        wrapper.style.margin = `${CONTENT_MARGIN}px 0`;
        wrapper.style.minHeight = `${minContentHeight}px`;
        wrapper.style.maxHeight = `${availableHeight}px`;

        setIsPositioned(true);
        requestAnimationFrame(() => {
            shouldExpandOnScrollRef.current = true;
        });
    }, [triggerRef, valueNode, selectedItem]);

    useLayoutEffect(() => {
        if (!open) {
            firstValidItemFoundRef.current = false;
            setSelectedItem(null);
            setIsPositioned(false);
            shouldExpandOnScrollRef.current = false;
            prevViewportScrollTopRef.current = 0;
            return;
        }
        firstValidItemFoundRef.current = false;
    }, [open, root.value]);

    useLayoutEffect(() => {
        if (!open) return;
        position();
        const id = requestAnimationFrame(() => position());
        return () => cancelAnimationFrame(id);
    }, [open, position, selectedItem]);

    useLayoutEffect(() => {
        if (!open) return;
        window.addEventListener("resize", position);
        const unsubScroll = subscribeScrollAndScrollableAncestors(triggerRef.current, position);
        return () => {
            window.removeEventListener("resize", position);
            unsubScroll();
        };
    }, [open, position, triggerRef]);

    useEffect(() => {
        if (!isPositioned || !selectedItem) return;
        selectedItem.focus({ preventScroll: true });
    }, [isPositioned, selectedItem]);

    useEffect(() => {
        const menu = contentRef.current;
        if (!open || !menu) return;

        let pointerMoveDelta = { x: 0, y: 0 };
        const handlePointerMove = (event: PointerEvent) => {
            pointerMoveDelta = {
                x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.current?.x ?? 0)),
                y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.current?.y ?? 0)),
            };
        };
        const handlePointerUp = (event: PointerEvent) => {
            if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
                event.preventDefault();
            } else if (!menu.contains(event.target as Node)) {
                setOpen(false);
            }
            document.removeEventListener("pointermove", handlePointerMove);
            triggerPointerDownPosRef.current = null;
        };

        if (triggerPointerDownPosRef.current !== null) {
            document.addEventListener("pointermove", handlePointerMove);
            document.addEventListener("pointerup", handlePointerUp, { capture: true, once: true });
        }

        return () => {
            document.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerup", handlePointerUp, { capture: true });
        };
    }, [open, setOpen, triggerPointerDownPosRef]);

    useEffect(() => {
        if (!open) return;
        return acquireBodyScrollLock();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onOutsideMouseDown = (event: globalThis.MouseEvent) => {
            const target = event.target as Node;
            if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", onOutsideMouseDown);
        return () => document.removeEventListener("mousedown", onOutsideMouseDown);
    }, [open, setOpen, triggerRef, menuRef]);

    useEffect(() => {
        if (!open) {
            setShowTopChevron(false);
            setShowBottomChevron(false);
            return;
        }
        const el = viewportRef.current;
        if (!el) return;
        const update = () => {
            const scrollable = el.scrollHeight > el.clientHeight + 1;
            if (!scrollable) {
                setShowTopChevron(false);
                setShowBottomChevron(false);
                return;
            }
            const top = el.scrollTop;
            const max = Math.max(0, el.scrollHeight - el.clientHeight);
            setShowTopChevron(top > 0);
            setShowBottomChevron(top < max - 1);
        };
        update();
        el.addEventListener("scroll", update, { passive: true });
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
        ro?.observe(el);
        return () => {
            el.removeEventListener("scroll", update);
            ro?.disconnect();
        };
    }, [open, children]);

    const onViewportScroll = useCallback(
        (event: React.UIEvent<HTMLDivElement>) => {
            const viewport = event.currentTarget;
            const wrapper = wrapperRef.current;
            if (!shouldExpandOnScrollRef.current || !wrapper) return;

            const scrolledBy = Math.abs(prevViewportScrollTopRef.current - viewport.scrollTop);
            prevViewportScrollTopRef.current = viewport.scrollTop;
            if (scrolledBy <= 0) return;

            const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
            const cssMinHeight = Number.parseFloat(wrapper.style.minHeight);
            const cssHeight = Number.parseFloat(wrapper.style.height);
            const prevHeight = Math.max(Number.isFinite(cssMinHeight) ? cssMinHeight : 0, Number.isFinite(cssHeight) ? cssHeight : 0);

            if (prevHeight < availableHeight) {
                const nextHeight = prevHeight + scrolledBy;
                const clampedNextHeight = Math.min(availableHeight, nextHeight);
                const heightDiff = nextHeight - clampedNextHeight;

                wrapper.style.height = `${clampedNextHeight}px`;
                if (wrapper.style.bottom === "0px") {
                    viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
                    wrapper.style.justifyContent = "flex-end";
                }
            }
        },
        [],
    );

    const onContentKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape" || event.key === "Tab") {
            event.preventDefault();
            close();
            return;
        }

        const viewport = viewportRef.current;
        if (!viewport) return;

        const items = Array.from(
            viewport.querySelectorAll<HTMLElement>('[data-refineui="select-item"]:not(:disabled)'),
        );
        if (items.length === 0) return;

        const active = document.activeElement as HTMLElement | null;
        let index = active ? items.indexOf(active) : -1;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            const next = index < 0 ? 0 : Math.min(items.length - 1, index + 1);
            items[next]?.focus({ preventScroll: true });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            const next = index < 0 ? items.length - 1 : Math.max(0, index - 1);
            items[next]?.focus({ preventScroll: true });
        } else if (event.key === "Home") {
            event.preventDefault();
            items[0]?.focus({ preventScroll: true });
        } else if (event.key === "End") {
            event.preventDefault();
            items[items.length - 1]?.focus({ preventScroll: true });
        }
    };

    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <SelectContentContext.Provider value={contentCtx}>
            <div
                ref={wrapperRef}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    zIndex: layerIndex,
                }}
            >
                <div
                    ref={setContentAndMenuRef}
                    id={listboxId}
                    role="listbox"
                    tabIndex={-1}
                    data-refineui="select-menu"
                    className={clsx(selectStyles.content, className)}
                    style={{
                        boxSizing: "border-box",
                        maxHeight: "100%",
                        borderColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.border),
                        backgroundColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.background),
                        ...style,
                    }}
                    onKeyDown={onContentKeyDown}
                    {...props}
                >
                    {showTopChevron ? (
                        <div aria-hidden className={selectStyles.scrollHintWrap}>
                            <WebIcon
                                name="chevron-up"
                                size={iconSizes.xxsmall}
                                className={selectStyles.scrollHintIcon}
                            />
                        </div>
                    ) : null}
                    <div
                        ref={viewportRef}
                        className={selectStyles.viewport}
                        style={{ position: "relative" }}
                        onScroll={onViewportScroll}
                    >
                        {children}
                    </div>
                    {showBottomChevron ? (
                        <div aria-hidden className={selectStyles.scrollHintWrap}>
                            <WebIcon
                                name="chevron-down"
                                size={iconSizes.xxsmall}
                                className={selectStyles.scrollHintIcon}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </SelectContentContext.Provider>,
        document.body,
    );
}

export function SelectItem({
    className,
    value,
    children,
    disabled,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    ...props
}: SelectItemProps) {
    const { value: selectedValue, setValue, close } = useSelectRoot("SelectItem");
    const { itemRefCallback } = useSelectContent("SelectItem");
    const selected = selectedValue === value;
    const [pressed, setPressed] = useState(false);

    const setItemRef = useCallback(
        (node: HTMLButtonElement | null) => {
            itemRefCallback(node, value, !!disabled);
        },
        [itemRefCallback, value, disabled],
    );

    return (
        <button
            type="button"
            ref={setItemRef}
            role="option"
            aria-selected={selected}
            data-refineui="select-item"
            data-selected={selected || undefined}
            data-state={pressed ? "pressed" : undefined}
            disabled={disabled}
            tabIndex={-1}
            className={clsx(
                selectStyles.item,
                disabled ? "cursor-not-allowed text-refineui-alias-foreground-disabled" : "cursor-pointer",
                className,
            )}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented || disabled) return;
                setValue(value);
                close();
            }}
            onPointerDown={(event) => {
                onPointerDown?.(event);
                if (!disabled) setPressed(true);
            }}
            onPointerUp={(event) => {
                onPointerUp?.(event);
                setPressed(false);
            }}
            onPointerLeave={(event) => {
                onPointerLeave?.(event);
                setPressed(false);
            }}
            onPointerCancel={(event) => {
                onPointerCancel?.(event);
                setPressed(false);
            }}
            onMouseDown={(event) => {
                onMouseDown?.(event);
                if (!disabled) setPressed(true);
            }}
            onMouseUp={(event) => {
                onMouseUp?.(event);
                setPressed(false);
            }}
            onMouseLeave={(event) => {
                onMouseLeave?.(event);
                setPressed(false);
            }}
            {...props}
        >
            <span className={selectStyles.itemIcon} style={{ width: iconSizes.xsmall, height: iconSizes.xsmall }}>
                {selected ? <WebIcon name="checkmark" size={iconSizes.xsmall} color="currentColor" aria-hidden /> : null}
            </span>
            <span data-refineui-select-item-text className={selectStyles.itemLabel}>
                {children}
            </span>
        </button>
    );
}

export function SelectSection({ className, disabled, ...props }: SelectSectionProps) {
    return (
        <div
            role="presentation"
            data-refineui="select-section"
            data-disabled={disabled || undefined}
            className={clsx(selectStyles.section, disabled && "text-refineui-alias-foreground-disabled", className)}
            {...props}
        />
    );
}

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
    return (
        <div
            role="separator"
            aria-orientation="horizontal"
            data-refineui="select-separator"
            className={clsx(selectStyles.separatorWrap, className)}
            {...props}
        >
            <div className={selectStyles.separatorLine} />
        </div>
    );
}

export function SelectGroup({ className, ...props }: SelectGroupProps) {
    return <div data-refineui="select-group" className={clsx("flex flex-col gap-px", className)} {...props} />;
}
