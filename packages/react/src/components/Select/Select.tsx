import { clsx } from "clsx";
import {
    Children,
    createContext,
    forwardRef,
    isValidElement,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type MutableRefObject,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { iconSizes } from "@refineui/tokens";
import { componentSizes, foundationSizes } from "../../componentSizes";
import { acquireBodyScrollLock, composeRefs } from "@refineui/utilities/react";
import { WebIcon } from "../../WebIcon";
import { ScrollAreaRegion } from "../ScrollArea/ScrollAreaRegion";
import { selectTriggerSizeClass, selectStyles } from "./style";
import { useOptionalFieldSize } from "../Field/context";
import type {
    SelectArrowProps,
    SelectContentProps,
    SelectGroupProps,
    SelectIconProps,
    SelectItemIndicatorProps,
    SelectItemProps,
    SelectItemTextProps,
    SelectLabelProps,
    SelectPortalProps,
    SelectProps,
    SelectScrollDownButtonProps,
    SelectScrollUpButtonProps,
    SelectSectionProps,
    SelectSeparatorProps,
    SelectTriggerProps,
    SelectValueProps,
    SelectViewportProps,
} from "./types";

type RegisteredItem = {
    value: string;
    label: string;
    disabled: boolean;
    ref: MutableRefObject<HTMLDivElement | null>;
};

type SelectCtxValue = {
    value: string;
    setValue: (v: string) => void;
    open: boolean;
    setOpen: (v: boolean) => void;
    disabled: boolean;
    activeIndex: number;
    setActiveIndex: (i: number) => void;
    itemsVersion: number;
    itemsRef: MutableRefObject<RegisteredItem[]>;
    registerItem: (item: RegisteredItem) => () => void;
    triggerRef: MutableRefObject<HTMLButtonElement | null>;
    contentRef: MutableRefObject<HTMLDivElement | null>;
    viewportRef: MutableRefObject<HTMLDivElement | null>;
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
    getLabelByValue: (v: string) => string | undefined;
    placeholder?: string;
    size: "sm" | "md" | "lg";
    fullWidth: boolean;
};

const SelectCtx = createContext<SelectCtxValue | null>(null);

function useSelectCtx() {
    const ctx = useContext(SelectCtx);
    if (!ctx) throw new Error("Select subcomponents must be used within Select");
    return ctx;
}

const PortalContainerContext = createContext<HTMLElement | undefined>(undefined);

/** `SelectContent` `position` — viewport vs panel style branch */
const SelectContentPositionContext = createContext<"popper" | "item-aligned">("item-aligned");

function parsePx(px: string, fallback: number) {
    const n = Number.parseFloat(px);
    return Number.isFinite(n) ? n : fallback;
}

/** Content–trigger gap (~Themes sideOffset 4px) */
const SIDE_OFFSET = parsePx(foundationSizes.foundationSize40, 4);
/** Viewport edge margin */
const CONTENT_MARGIN = parsePx(foundationSizes.foundationSize100, 10);

function clampNumber(value: number, [minB, maxB]: [number, number]) {
    return Math.min(Math.max(value, minB), maxB);
}

const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

function isScrollableElement(el: HTMLElement): boolean {
    const { overflow, overflowX, overflowY } = getComputedStyle(el);
    return (
        [overflow, overflowX, overflowY].some((o) => o === "auto" || o === "scroll" || o === "overlay") ||
        el.scrollHeight > el.clientHeight + 1
    );
}

function getScrollableAncestors(target: HTMLElement | null): HTMLElement[] {
    const list: HTMLElement[] = [];
    let el: HTMLElement | null = target?.parentElement ?? null;
    while (el) {
        if (isScrollableElement(el)) list.push(el);
        el = el.parentElement;
    }
    return list;
}

function subscribeScrollAndScrollableAncestors(target: HTMLElement | null, fn: (event: Event) => void): () => void {
    if (typeof window === "undefined") return () => {};
    const list: (Element | Window)[] = [window, ...getScrollableAncestors(target)];
    for (const t of list) t.addEventListener("scroll", fn, true);
    return () => {
        for (const t of list) t.removeEventListener("scroll", fn, true);
    };
}

function useSelectContentPosition() {
    return useContext(SelectContentPositionContext);
}

export function Select({
    value: ctrlValue,
    onValueChange,
    defaultValue = "",
    open: ctrlOpen,
    onOpenChange,
    children,
    placeholder,
    size: sizeProp,
    fullWidth = false,
    disabled = false,
    className,
    ...props
}: SelectProps) {
    const fieldSize = useOptionalFieldSize();
    const size = sizeProp ?? fieldSize ?? "md";
    const [innerValue, setInnerValue] = useState(defaultValue);
    const [innerOpen, setInnerOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [itemsVersion, setItemsVersion] = useState(0);

    const itemsRef = useRef<RegisteredItem[]>([]);
    const labelCacheRef = useRef<Record<string, string>>({});
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const value = ctrlValue !== undefined ? ctrlValue : innerValue;
    const open = ctrlOpen !== undefined ? ctrlOpen : innerOpen;

    const setOpen = useCallback(
        (nextOpen: boolean) => {
            if (disabled) return;
            if (ctrlOpen === undefined) setInnerOpen(nextOpen);
            onOpenChange?.(nextOpen);
        },
        [ctrlOpen, onOpenChange, disabled],
    );

    const setValue = useCallback(
        (nextValue: string) => {
            if (ctrlValue === undefined) setInnerValue(nextValue);
            onValueChange?.(nextValue);
        },
        [ctrlValue, onValueChange],
    );

    const registerItem = useCallback((item: RegisteredItem) => {
        itemsRef.current = [...itemsRef.current.filter((i) => i.value !== item.value), item];
        labelCacheRef.current[item.value] = item.label;
        setItemsVersion((v) => v + 1);
        return () => {
            itemsRef.current = itemsRef.current.filter((i) => i.value !== item.value);
            setItemsVersion((v) => v + 1);
        };
    }, []);

    const enabledItems = useMemo(() => itemsRef.current.filter((i) => !i.disabled), [itemsVersion]);

    useEffect(() => {
        if (!open) {
            setActiveIndex(-1);
            return;
        }
        const selected = enabledItems.findIndex((item) => item.value === value);
        setActiveIndex(selected >= 0 ? selected : enabledItems.length > 0 ? 0 : -1);
    }, [open, value, enabledItems]);

    useEffect(() => {
        if (!open) return;
        const onOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", onOutside);
        return () => document.removeEventListener("mousedown", onOutside);
    }, [open, setOpen]);

    /** Lock document + scrollable ancestors while open */
    useEffect(() => {
        if (!open) return;
        const releaseBodyLock = acquireBodyScrollLock();
        const ancestors = getScrollableAncestors(triggerRef.current).filter(
            (el) => el !== document.body && el !== document.documentElement,
        );
        const prevStyles = ancestors.map((el) => ({
            el,
            overflow: el.style.overflow,
            overflowX: el.style.overflowX,
            overflowY: el.style.overflowY,
        }));
        for (const { el } of prevStyles) {
            el.style.overflow = "hidden";
            el.style.overflowX = "hidden";
            el.style.overflowY = "hidden";
        }
        return () => {
            for (const { el, overflow, overflowX, overflowY } of prevStyles) {
                el.style.overflow = overflow;
                el.style.overflowX = overflowX;
                el.style.overflowY = overflowY;
            }
            releaseBodyLock();
        };
    }, [open]);

    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLElement>) => {
            if (disabled) return;

            if (!open) {
                if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
                    event.preventDefault();
                    setOpen(true);
                }
                return;
            }

            switch (event.key) {
                case "Escape":
                    event.preventDefault();
                    setOpen(false);
                    triggerRef.current?.focus();
                    return;
                case "ArrowDown":
                    event.preventDefault();
                    setActiveIndex((prev) => Math.min(prev + 1, enabledItems.length - 1));
                    return;
                case "ArrowUp":
                    event.preventDefault();
                    setActiveIndex((prev) => Math.max(prev - 1, 0));
                    return;
                case "Home":
                    event.preventDefault();
                    setActiveIndex(enabledItems.length > 0 ? 0 : -1);
                    return;
                case "End":
                    event.preventDefault();
                    setActiveIndex(enabledItems.length - 1);
                    return;
                case "Enter":
                case " ":
                    event.preventDefault();
                    if (activeIndex >= 0 && enabledItems[activeIndex]) {
                        setValue(enabledItems[activeIndex].value);
                        setOpen(false);
                        triggerRef.current?.focus();
                    }
                    return;
                default:
                    if (event.key.length !== 1) return;
                    const needle = event.key.toLowerCase();
                    const next = enabledItems.findIndex(
                        (item, index) => index > activeIndex && item.label.toLowerCase().startsWith(needle),
                    );
                    const found =
                        next >= 0 ? next : enabledItems.findIndex((item) => item.label.toLowerCase().startsWith(needle));
                    if (found >= 0) setActiveIndex(found);
            }
        },
        [disabled, open, activeIndex, enabledItems, setOpen, setValue],
    );

    const getLabelByValue = useCallback(
        (nextValue: string) =>
            labelCacheRef.current[nextValue] ?? itemsRef.current.find((item) => item.value === nextValue)?.label,
        [],
    );

    const ctxValue = useMemo(
        () => ({
            value,
            setValue,
            open,
            setOpen,
            disabled,
            activeIndex,
            setActiveIndex,
            itemsVersion,
            itemsRef,
            registerItem,
            triggerRef,
            contentRef,
            viewportRef,
            onKeyDown,
            getLabelByValue,
            placeholder,
            size,
            fullWidth,
        }),
        [
            value,
            setValue,
            open,
            setOpen,
            disabled,
            activeIndex,
            setActiveIndex,
            itemsVersion,
            registerItem,
            onKeyDown,
            getLabelByValue,
            placeholder,
            size,
            fullWidth,
        ],
    );

    return (
        <SelectCtx.Provider value={ctxValue}>
            <div className={clsx(selectStyles.root, fullWidth && "w-full", className)} {...props}>
                {children}
            </div>
        </SelectCtx.Provider>
    );
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger(props, forwardedRef) {
    const { className, children, style, ...triggerRest } = props;
    const { open, setOpen, triggerRef, onKeyDown, size, fullWidth, disabled, value, getLabelByValue } = useSelectCtx();
    const hasLabel = Boolean(getLabelByValue(value));
    const setRefs = useCallback(
        (node: HTMLButtonElement | null) => {
            (triggerRef as MutableRefObject<HTMLButtonElement | null>).current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) (forwardedRef as MutableRefObject<HTMLButtonElement | null>).current = node;
        },
        [forwardedRef, triggerRef],
    );
    return (
        <button
            ref={setRefs}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            data-refineui="select-trigger"
            data-size={size}
            data-state={open ? "open" : "closed"}
            data-placeholder={hasLabel ? undefined : ""}
            disabled={disabled}
            onMouseDown={(event) => {
                event.preventDefault();
                setOpen(!open);
                triggerRef.current?.focus();
            }}
            onKeyDown={onKeyDown}
            className={clsx(
                "data-[placeholder]:[&_[data-refineui-select-value]]:text-refineui-alias-foreground-placeholder",
                selectStyles.trigger,
                selectTriggerSizeClass[size],
                open && selectStyles.triggerOpen,
                disabled && selectStyles.triggerDisabled,
                fullWidth && "w-full",
                className,
            )}
            style={style}
            {...triggerRest}
        >
            <span data-refineui-select-trigger-value className={selectStyles.triggerInner}>
                {children}
            </span>
            <WebIcon
                name="chevron-down"
                size={iconSizes.xsmall}
                color="currentColor"
                className={clsx(selectStyles.chevron, open && selectStyles.chevronOpen)}
                aria-hidden
            />
        </button>
    );
});
SelectTrigger.displayName = "SelectTrigger";

export function SelectValue({ placeholder, className, ...props }: SelectValueProps) {
    const { value, getLabelByValue, placeholder: rootPlaceholder } = useSelectCtx();
    const label = getLabelByValue(value);
    return (
        <span data-refineui-select-value="" className={clsx(selectStyles.value, !label && "text-refineui-alias-foreground-placeholder", className)} {...props}>
            {label || placeholder || rootPlaceholder || "Select..."}
        </span>
    );
}

export function SelectIcon({ children, className, ...props }: SelectIconProps) {
    return (
        <span className={clsx(selectStyles.iconWrap, className)} {...props}>
            {children ?? <WebIcon name="chevron-down" size={iconSizes.xsmall} />}
        </span>
    );
}

export function SelectPortal({ children, container }: SelectPortalProps) {
    return <PortalContainerContext.Provider value={container ?? undefined}>{children}</PortalContainerContext.Provider>;
}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(props, forwardedRef) {
    const {
        className,
        children,
        position = "item-aligned",
        container: containerProp,
        style: styleProp,
        ...rest
    } = props;
    const { open, contentRef, onKeyDown, triggerRef, viewportRef, itemsRef, itemsVersion, value } = useSelectCtx();
    const portalFromCtx = useContext(PortalContainerContext);
    const [side, setSide] = useState<"top" | "bottom">("bottom");
    const [contentStyle, setContentStyle] = useState<CSSProperties>({});
    const rafRef = useRef<number | null>(null);
    const positionerRef = useRef<HTMLDivElement | null>(null);
    const shouldExpandOnScrollRef = useRef(false);
    const shouldRepositionRef = useRef(true);
    const prevScrollTopRef = useRef(0);
    const contentStyleRef = useRef<CSSProperties>({});
    const isPopper = position === "popper";

    const commitContentStyle = useCallback((next: CSSProperties) => {
        const prev = contentStyleRef.current;
        const fields: (keyof CSSProperties)[] = [
            "left",
            "top",
            "bottom",
            "height",
            "maxHeight",
            "minHeight",
            "minWidth",
            "margin",
            "justifyContent",
        ];
        const unchanged = fields.every((key) => prev[key] === next[key]);
        if (unchanged) return;
        contentStyleRef.current = next;
        setContentStyle(next);
    }, []);

    const updatePositionItemAligned = useCallback(() => {
        if (!open || !triggerRef.current || !contentRef.current || !viewportRef.current) return;
        const trigger = triggerRef.current;
        const content = contentRef.current;
        const viewport = viewportRef.current;
        const triggerRect = trigger.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const valueNode = trigger.querySelector<HTMLElement>("[data-refineui-select-trigger-value]");
        const itemsOrdered = itemsRef.current;
        const selectedRegistration =
            itemsOrdered.find((item) => item.value === value && item.ref.current) ??
            itemsOrdered.find((item) => !item.disabled && item.ref.current);
        const selectedItem = selectedRegistration?.ref.current ?? null;
        const selectedItemText = selectedItem?.querySelector<HTMLElement>("[data-refineui-select-item-text]");
        if (!valueNode || !selectedItem || !selectedItemText) return;

        const itemTextRect = selectedItemText.getBoundingClientRect();
        const itemTextOffset = itemTextRect.left - contentRect.left;
        const left = valueNode.getBoundingClientRect().left - itemTextOffset;
        const leftDelta = triggerRect.left - left;
        const minContentWidth = triggerRect.width + leftDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const rightEdge = vw - CONTENT_MARGIN;
        const clampedLeft = clampNumber(left, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, rightEdge - contentWidth)]);

        const itemsHeight = viewport.scrollHeight;
        const contentStyles = window.getComputedStyle(content);
        const contentBorderTopWidth = Number.parseInt(contentStyles.borderTopWidth, 10) || 0;
        const contentPaddingTop = Number.parseInt(contentStyles.paddingTop, 10) || 0;
        const contentBorderBottomWidth = Number.parseInt(contentStyles.borderBottomWidth, 10) || 0;
        const contentPaddingBottom = Number.parseInt(contentStyles.paddingBottom, 10) || 0;
        const fullContentHeight =
            contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
        const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
        const viewportStyles = window.getComputedStyle(viewport);
        const viewportPaddingTop = Number.parseInt(viewportStyles.paddingTop, 10) || 0;
        const viewportPaddingBottom = Number.parseInt(viewportStyles.paddingBottom, 10) || 0;
        const availableHeight = vh - CONTENT_MARGIN * 2;
        const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
        const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
        const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
        // Same as Radix: trigger-middle alignment from selectedItem.offsetTop
        const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
        const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
        const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
        const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
        let wrapperHeightPx = 0;

        if (willAlignWithoutTopOverflow) {
            const isLastItem = itemsOrdered.length > 0 && selectedItem === itemsOrdered[itemsOrdered.length - 1]?.ref.current;
            const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
            const clampedTriggerMiddleToBottomEdge = Math.max(
                triggerMiddleToBottomEdge,
                selectedItemHalfHeight +
                    (isLastItem ? viewportPaddingBottom : 0) +
                    viewportOffsetBottom +
                    contentBorderBottomWidth,
            );
            wrapperHeightPx = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
        } else {
            const isFirstItem = itemsOrdered.length > 0 && selectedItem === itemsOrdered[0]?.ref.current;
            const clampedTopEdgeToTriggerMiddle = Math.max(
                topEdgeToTriggerMiddle,
                contentBorderTopWidth + viewport.offsetTop + (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight,
            );
            wrapperHeightPx = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
            viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
        }

        const next: CSSProperties = {
            position: "fixed",
            left: `${clampedLeft}px`,
            minWidth: `${minContentWidth}px`,
            margin: `${CONTENT_MARGIN}px 0`,
            minHeight: `${minContentHeight}px`,
            maxHeight: `${availableHeight}px`,
            height: `${wrapperHeightPx}px`,
            ...(willAlignWithoutTopOverflow ? { bottom: 0, top: "auto" } : { top: 0, bottom: "auto" }),
            ...styleProp,
        };
        (next as Record<string, string>)["--refineui-select-content-available-height"] = `${availableHeight}px`;
        (next as Record<string, string>)["--refineui-select-trigger-width"] = `${minContentWidth}px`;
        commitContentStyle(next);
        setSide(willAlignWithoutTopOverflow ? "bottom" : "top");
    }, [open, triggerRef, contentRef, styleProp, itemsRef, value, viewportRef, commitContentStyle]);

    const updatePositionPopper = useCallback(() => {
        if (!open || !triggerRef.current || !contentRef.current) return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const minW = parsePx(componentSizes.dropdownMenuWidth, 180);
        const width = Math.min(Math.max(triggerRect.width, minW), vw - 2 * CONTENT_MARGIN);
        const left = clampNumber(triggerRect.left, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, vw - width - CONTENT_MARGIN)]);
        const gap = SIDE_OFFSET;
        const spaceBelow = vh - triggerRect.bottom - gap - CONTENT_MARGIN;
        const spaceAbove = triggerRect.top - gap - CONTENT_MARGIN;
        const scrollH = contentRef.current.scrollHeight;
        const preferBelow = spaceBelow >= spaceAbove || (spaceBelow >= scrollH && spaceBelow >= 120);
        const maxH = Math.max(120, preferBelow ? spaceBelow : spaceAbove);
        const next: CSSProperties = {
            position: "fixed",
            left: `${left}px`,
            width: `${width}px`,
            maxHeight: `${maxH}px`,
            ...styleProp,
        };
        if (preferBelow) {
            next.top = `${triggerRect.bottom + gap}px`;
            next.bottom = "auto";
        } else {
            next.top = "auto";
            next.bottom = `${vh - triggerRect.top + gap}px`;
        }
        (next as Record<string, string>)["--refineui-select-content-available-height"] = `${maxH}px`;
        (next as Record<string, string>)["--refineui-select-trigger-width"] = `${width}px`;
        commitContentStyle(next);
        setSide(preferBelow ? "bottom" : "top");
    }, [open, triggerRef, contentRef, styleProp, commitContentStyle]);

    const updatePosition = isPopper ? updatePositionPopper : updatePositionItemAligned;

    /** Radix Viewport onScroll: when panel is bottom-anchored, grow height via scroll; fix scrollTop/justifyContent */
    const onViewportScroll = useCallback(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const { scrollTop } = viewport;
        if (shouldExpandOnScrollRef.current) {
            const scrolledBy = Math.abs(prevScrollTopRef.current - scrollTop);
            if (scrolledBy > 0) {
                const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
                const wrapper = positionerRef.current;
                if (wrapper) {
                    const cssMinHeight = Number.parseFloat(wrapper.style.minHeight || "0") || 0;
                    const cssHeight = Number.parseFloat(wrapper.style.height || "0") || 0;
                    const prevHeight = Math.max(cssMinHeight, cssHeight);
                    if (prevHeight < availableHeight) {
                        const nextHeight = prevHeight + scrolledBy;
                        const clampedNextHeight = Math.min(availableHeight, nextHeight);
                        const heightDiff = nextHeight - clampedNextHeight;
                        wrapper.style.height = `${clampedNextHeight}px`;
                        if (side === "bottom") {
                            viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
                            wrapper.style.justifyContent = "flex-end";
                        }
                        const next = {
                            ...contentStyleRef.current,
                            height: `${clampedNextHeight}px`,
                            ...(side === "bottom" ? { justifyContent: "flex-end" } : {}),
                        } as CSSProperties;
                        commitContentStyle(next);
                    }
                }
            }
        }
        prevScrollTopRef.current = scrollTop;
    }, [viewportRef, commitContentStyle, side]);

    /** Radix `focusFirst`: first option scrollTop 0, last snaps to bottom so list start matches regardless of anchor */
    const focusSelectedItem = useCallback(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const enabledItems = itemsRef.current.filter((item) => !item.disabled);
        const firstEl = enabledItems[0]?.ref.current ?? null;
        const lastEl = enabledItems.length > 0 ? enabledItems[enabledItems.length - 1]?.ref.current ?? null : null;
        const selectedItem =
            itemsRef.current.find((item) => item.value === value && item.ref.current)?.ref.current ??
            itemsRef.current.find((item) => !item.disabled && item.ref.current)?.ref.current;
        if (!selectedItem) return;
        selectedItem.scrollIntoView({ block: "nearest" });
        if (firstEl && selectedItem === firstEl) viewport.scrollTop = 0;
        if (lastEl && selectedItem === lastEl) viewport.scrollTop = viewport.scrollHeight;
    }, [viewportRef, itemsRef, value]);

    useIsomorphicLayoutEffect(() => {
        if (!open) return;
        shouldExpandOnScrollRef.current = false;
        shouldRepositionRef.current = true;
        prevScrollTopRef.current = 0;
        /** Radix `SelectItemAlignedPosition`: sync measure after layout like `useLayoutEffect(() => position(), [position])` */
        updatePosition();
        const schedule = () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                updatePosition();
            });
        };
        schedule();
        const settleId = requestAnimationFrame(() => {
            if (positionerRef.current) positionerRef.current.style.justifyContent = "";
            updatePosition();
            onViewportScroll();
            shouldExpandOnScrollRef.current = true;
            if (viewportRef.current) {
                prevScrollTopRef.current = viewportRef.current.scrollTop;
            }
            if (shouldRepositionRef.current) {
                updatePosition();
                focusSelectedItem();
                /** Radix `handleScrollButtonChange`: if metrics change after scroll/focus, run `position()` again */
                if (!isPopper) {
                    updatePosition();
                    onViewportScroll();
                }
                shouldRepositionRef.current = false;
            }
        });
        const viewport = viewportRef.current;
        viewport?.addEventListener("scroll", onViewportScroll);
        const timeoutId = window.setTimeout(schedule, 0);
        const timeoutScrollbarId = window.setTimeout(onViewportScroll, 0);
        window.addEventListener("resize", schedule);
        const onAncestorScroll = (event: Event) => {
            const target = event.target as Node | null;
            if (target && contentRef.current?.contains(target)) return;
            schedule();
        };
        const unsubscribeAncestorScroll = subscribeScrollAndScrollableAncestors(triggerRef.current, onAncestorScroll);
        const ro =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(() => {
                      schedule();
                      onViewportScroll();
                  })
                : null;
        if (ro && triggerRef.current) ro.observe(triggerRef.current);
        return () => {
            cancelAnimationFrame(settleId);
            window.clearTimeout(timeoutId);
            window.clearTimeout(timeoutScrollbarId);
            window.removeEventListener("resize", schedule);
            unsubscribeAncestorScroll();
            viewport?.removeEventListener("scroll", onViewportScroll);
            ro?.disconnect();
            shouldExpandOnScrollRef.current = false;
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [open, itemsVersion, updatePosition, isPopper, triggerRef, contentRef, viewportRef, onViewportScroll, focusSelectedItem]);

    const setContentRefs = useCallback(
        (node: HTMLDivElement | null) => {
            (contentRef as MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) (forwardedRef as MutableRefObject<HTMLDivElement | null>).current = node;
        },
        [forwardedRef, contentRef],
    );

    if (!open) return null;

    const normalizedChildren = (() => {
        const flat = Children.toArray(children);
        if (flat.length === 1 && isValidElement(flat[0]) && flat[0].type === SelectViewport) {
            return children as ReactNode;
        }
        return <SelectViewport>{children}</SelectViewport>;
    })();

    const portalTarget: HTMLElement | undefined =
        (containerProp === null ? undefined : containerProp) ??
        portalFromCtx ??
        (typeof document !== "undefined" ? document.body : undefined);

    const panel = (
        <SelectContentPositionContext.Provider value={position}>
            <div ref={positionerRef} className={selectStyles.positioner} style={contentStyle}>
                <div
                    ref={setContentRefs}
                    role="listbox"
                    tabIndex={-1}
                    onKeyDown={onKeyDown}
                    data-refineui="select-menu"
                    data-state="open"
                    data-side={side}
                    className={clsx(
                        selectStyles.contentShell,
                        isPopper ? selectStyles.contentPopper : selectStyles.contentItemAligned,
                        "outline-none",
                        className,
                    )}
                    {...rest}
                >
                    {normalizedChildren}
                </div>
            </div>
        </SelectContentPositionContext.Provider>
    );

    if (typeof document === "undefined" || !portalTarget) return panel;
    return createPortal(panel, portalTarget);
});
SelectContent.displayName = "SelectContent";

export const SelectViewport = forwardRef<HTMLDivElement, SelectViewportProps>(function SelectViewport(
    { className, children, ...props },
    forwardedRef,
) {
    const { viewportRef } = useSelectCtx();
    const position = useSelectContentPosition();
    const viewportClass = position === "popper" ? selectStyles.viewportPopper : selectStyles.viewportItemAligned;
    const rootClass = position === "popper" ? selectStyles.scrollAreaRootPopper : selectStyles.scrollAreaRootItemAligned;
    return (
        <ScrollAreaRegion
            type="hover"
            className={rootClass}
            viewportClassName={clsx(viewportClass, className)}
            viewportRef={composeRefs(viewportRef, forwardedRef)}
            {...props}
        >
            {children}
        </ScrollAreaRegion>
    );
});
SelectViewport.displayName = "SelectViewport";

export function SelectGroup({ children, className, ...props }: SelectGroupProps) {
    return (
        <div role="group" className={clsx(selectStyles.group, className)} {...props}>
            {children}
        </div>
    );
}

export function SelectLabel({ children, className, ...props }: SelectLabelProps) {
    return (
        <div className={clsx(selectStyles.label, className)} {...props}>
            {children}
        </div>
    );
}

export function SelectSection({ children, className, ...props }: SelectSectionProps) {
    return (
        <div className={clsx(selectStyles.label, className)} {...props}>
            {children}
        </div>
    );
}

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
    return <div role="separator" className={clsx(selectStyles.separator, className)} {...props} />;
}

export function SelectItem({
    value: itemValue,
    children,
    disabled = false,
    textValue,
    className,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    ...props
}: SelectItemProps) {
    const { value, setValue, setOpen, activeIndex, setActiveIndex, itemsRef, registerItem, triggerRef } = useSelectCtx();
    const ref = useRef<HTMLDivElement | null>(null);
    const pointerTypeRef = useRef<"mouse" | "touch" | "pen">("touch");
    const [pressed, setPressed] = useState(false);
    const isSelected = value === itemValue;
    const label = (textValue || (typeof children === "string" ? children : String(itemValue))).trim();

    useEffect(() => {
        return registerItem({ value: itemValue, label, disabled, ref });
    }, [registerItem, itemValue, label, disabled]);

    const enabledItems = itemsRef.current.filter((item) => !item.disabled);
    const myIndex = enabledItems.findIndex((item) => item.value === itemValue);
    /** Keyboard `activeIndex` + hover only — no `focus()` on options to avoid focus ring on pointer click */
    const isHighlighted = myIndex >= 0 && activeIndex === myIndex && !disabled;
    const handleSelect = () => {
        if (disabled) return;
        setValue(itemValue);
        setOpen(false);
        triggerRef.current?.focus();
    };

    return (
        <div
            ref={ref}
            role="option"
            tabIndex={disabled ? undefined : -1}
            aria-selected={isSelected}
            aria-disabled={disabled}
            data-refineui="select-item"
            data-selected={isSelected ? true : undefined}
            data-state={pressed ? "pressed" : isSelected ? "selected" : undefined}
            data-highlighted={isHighlighted ? "" : undefined}
            data-disabled={disabled ? "" : undefined}
            onFocus={() => {
                if (myIndex >= 0) setActiveIndex(myIndex);
            }}
            onPointerDown={(event) => {
                onPointerDown?.(event);
                pointerTypeRef.current = event.pointerType as "mouse" | "touch" | "pen";
                if (!disabled) setPressed(true);
            }}
            onPointerMove={(event) => {
                pointerTypeRef.current = event.pointerType as "mouse" | "touch" | "pen";
                if (pointerTypeRef.current === "mouse") {
                    if (disabled) {
                        setActiveIndex(-1);
                    } else if (myIndex >= 0) {
                        setActiveIndex(myIndex);
                    }
                }
            }}
            onPointerLeave={(event) => {
                onPointerLeave?.(event);
                setPressed(false);
                if (event.currentTarget === document.activeElement) {
                    setActiveIndex(-1);
                }
            }}
            onPointerCancel={(event) => {
                onPointerCancel?.(event);
                setPressed(false);
            }}
            onPointerUp={(event) => {
                onPointerUp?.(event);
                setPressed(false);
                if (pointerTypeRef.current === "mouse") handleSelect();
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
            onClick={() => {
                if (pointerTypeRef.current !== "mouse") handleSelect();
            }}
            onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                    event.preventDefault();
                    handleSelect();
                }
            }}
            className={clsx(selectStyles.item, disabled && selectStyles.itemDisabled, className)}
            {...props}
        >
            <span
                className={clsx(selectStyles.itemIndicator, disabled && "text-refineui-alias-foreground-disabled")}
                aria-hidden
            >
                {isSelected ? <WebIcon name="checkmark" size={iconSizes.xsmall} /> : null}
            </span>
            <span data-refineui-select-item-text className={selectStyles.itemText}>
                {children}
            </span>
        </div>
    );
}

export function SelectItemText({ children, className, ...props }: SelectItemTextProps) {
    return (
        <span className={clsx(selectStyles.itemText, className)} {...props}>
            {children}
        </span>
    );
}

export function SelectItemIndicator({ children, className, ...props }: SelectItemIndicatorProps) {
    return (
        <span className={clsx(selectStyles.itemIndicator, className)} {...props}>
            {children}
        </span>
    );
}

export function SelectScrollUpButton({ children, ...props }: SelectScrollUpButtonProps) {
    return <div {...props}>{children}</div>;
}

export function SelectScrollDownButton({ children, ...props }: SelectScrollDownButtonProps) {
    return <div {...props}>{children}</div>;
}

export function SelectArrow({ children, ...props }: SelectArrowProps) {
    return <span {...props}>{children}</span>;
}

