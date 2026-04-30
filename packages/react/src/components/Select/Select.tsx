import { clsx } from "clsx";
import {
    Children,
    createContext,
    isValidElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type MutableRefObject,
    type ReactNode,
} from "react";
import { iconSizes } from "@refineui/tokens";
import { componentSizes, foundationSizes } from "../../componentSizes";
import { WebIcon } from "../../WebIcon";
import { selectSizeClass, selectStyles } from "./style";
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

function parsePx(px: string, fallback: number) {
    const n = Number.parseFloat(px);
    return Number.isFinite(n) ? n : fallback;
}

export function Select({
    value: ctrlValue,
    onValueChange,
    defaultValue = "",
    open: ctrlOpen,
    onOpenChange,
    children,
    placeholder,
    size = "md",
    fullWidth = false,
    disabled = false,
    className,
    ...props
}: SelectProps) {
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
        if (!open || activeIndex < 0) return;
        enabledItems[activeIndex]?.ref.current?.scrollIntoView({ block: "nearest" });
    }, [open, activeIndex, enabledItems]);

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
        (nextValue: string) => labelCacheRef.current[nextValue] ?? itemsRef.current.find((item) => item.value === nextValue)?.label,
        [],
    );

    return (
        <SelectCtx.Provider
            value={{
                value,
                setValue,
                open,
                setOpen,
                disabled,
                activeIndex,
                setActiveIndex,
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
            }}
        >
            <div className={clsx(selectStyles.root, fullWidth && "w-full", className)} {...props}>
                {children}
            </div>
        </SelectCtx.Provider>
    );
}

export function SelectTrigger({ children, className, ...props }: SelectTriggerProps) {
    const { open, setOpen, triggerRef, onKeyDown, size, fullWidth, disabled } = useSelectCtx();
    const { style, ...rest } = props;
    return (
        <button
            ref={triggerRef}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            data-state={open ? "open" : "closed"}
            disabled={disabled}
            onMouseDown={(event) => {
                event.preventDefault();
                setOpen(!open);
                triggerRef.current?.focus();
            }}
            onKeyDown={onKeyDown}
            className={clsx(
                selectStyles.trigger,
                selectSizeClass[size],
                disabled && selectStyles.triggerDisabled,
                fullWidth && "w-full",
                className,
            )}
            style={{ minWidth: componentSizes.dropdownMenuWidth, ...style }}
            {...rest}
        >
            <span className="min-w-0 flex-1 text-left">{children}</span>
            <WebIcon name="chevron-down" size={iconSizes.xsmall} />
        </button>
    );
}

export function SelectValue({ placeholder, className, ...props }: SelectValueProps) {
    const { value, getLabelByValue, placeholder: rootPlaceholder } = useSelectCtx();
    const label = getLabelByValue(value);
    return (
        <span className={clsx(selectStyles.value, !label && "text-refineui-alias-foreground-placeholder", className)} {...props}>
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

export function SelectContent({ children, className, ...props }: SelectContentProps) {
    const { open, contentRef, onKeyDown, triggerRef, viewportRef, itemsRef, value } = useSelectCtx();
    const [side, setSide] = useState<"top" | "bottom">("bottom");
    const [contentStyle, setContentStyle] = useState<CSSProperties>({});
    const [thumbStyle, setThumbStyle] = useState<CSSProperties>({});
    const [showScrollbar, setShowScrollbar] = useState(false);
    const rafRef = useRef<number | null>(null);
    const alignedOnceRef = useRef(false);
    const { style, ...rest } = props;

    const updatePosition = useCallback(() => {
        if (!open || !triggerRef.current || !contentRef.current) return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewportPadding = parsePx(foundationSizes.foundationSize200, 20);
        const gap = parsePx(foundationSizes.foundationSize40, 4);
        const minHeight = 120;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const width = Math.min(triggerRect.width, vw - viewportPadding * 2);
        const left = Math.min(
            Math.max(viewportPadding, triggerRect.left),
            Math.max(viewportPadding, vw - width - viewportPadding),
        );

        const viewport = viewportRef.current;
        const estimatedHeight = Math.max(minHeight, contentRef.current.scrollHeight || minHeight);
        const selectedItem = itemsRef.current.find((item) => item.value === value)?.ref.current;
        const selectedOffsetTop = selectedItem?.offsetTop ?? 0;
        const selectedVisibleTop = selectedOffsetTop - (viewport?.scrollTop ?? 0);

        // Radix 기본(item-aligned)처럼 선택된 항목 라인을 트리거 라인에 맞춰 겹치게 배치
        const rawTop = triggerRect.top - selectedVisibleTop - gap;
        const maxTop = Math.max(viewportPadding, vh - estimatedHeight - viewportPadding);
        const top = Math.min(Math.max(viewportPadding, rawTop), maxTop);
        const availableHeight = Math.max(minHeight, vh - top - viewportPadding);
        const placeTop = rawTop < viewportPadding;

        const next: CSSProperties = {
            position: "fixed",
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            maxHeight: `${availableHeight}px`,
            zIndex: 50,
            ...style,
        };
        const cssVars = next as Record<string, string>;
        cssVars["--refineui-select-content-available-height"] = `${availableHeight}px`;
        cssVars["--refineui-select-trigger-width"] = `${width}px`;
        setContentStyle(next);
        setSide(placeTop ? "top" : "bottom");
    }, [open, triggerRef, contentRef, style, itemsRef, value, viewportRef]);

    const updateScrollbar = useCallback(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const { scrollTop, scrollHeight, clientHeight } = viewport;
        if (scrollHeight <= clientHeight + 1) {
            setShowScrollbar(false);
            setThumbStyle({});
            return;
        }
        setShowScrollbar(true);
        const ratio = clientHeight / scrollHeight;
        const thumbHeight = Math.max(24, ratio * clientHeight);
        const maxTop = clientHeight - thumbHeight;
        const top = maxTop <= 0 ? 0 : (scrollTop / (scrollHeight - clientHeight)) * maxTop;
        setThumbStyle({
            height: `${thumbHeight}px`,
            transform: `translateY(${top}px)`,
        });
    }, [viewportRef]);

    useEffect(() => {
        if (!open) return;
        alignedOnceRef.current = false;
        const schedule = () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                const viewport = viewportRef.current;
                const selectedItem = itemsRef.current.find((item) => item.value === value)?.ref.current;
                if (viewport && selectedItem && !alignedOnceRef.current) {
                    const initialTop = Math.max(0, selectedItem.offsetTop - parsePx(foundationSizes.foundationSize40, 4));
                    viewport.scrollTop = initialTop;
                    alignedOnceRef.current = true;
                }
                updatePosition();
            });
        };
        schedule();
        const viewport = viewportRef.current;
        viewport?.addEventListener("scroll", updateScrollbar);
        const timeoutId = window.setTimeout(schedule, 0);
        const timeoutScrollbarId = window.setTimeout(updateScrollbar, 0);
        window.addEventListener("resize", schedule);
        window.addEventListener("scroll", schedule, true);
        const ro =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(() => {
                      schedule();
                      updateScrollbar();
                  })
                : null;
        if (ro && triggerRef.current) ro.observe(triggerRef.current);
        if (ro && contentRef.current) ro.observe(contentRef.current);
        if (ro && viewport) ro.observe(viewport);
        return () => {
            window.clearTimeout(timeoutId);
            window.clearTimeout(timeoutScrollbarId);
            window.removeEventListener("resize", schedule);
            window.removeEventListener("scroll", schedule, true);
            viewport?.removeEventListener("scroll", updateScrollbar);
            ro?.disconnect();
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [open, updatePosition, triggerRef, contentRef, viewportRef, updateScrollbar, itemsRef, value]);

    if (!open) return null;

    const normalizedChildren = (() => {
        const flat = Children.toArray(children);
        if (flat.length === 1 && isValidElement(flat[0]) && flat[0].type === SelectViewport) {
            return flat[0];
        }
        return <SelectViewport>{children}</SelectViewport>;
    })();

    return (
        <div
            ref={contentRef}
            role="listbox"
            tabIndex={-1}
            onKeyDown={onKeyDown}
            data-state="open"
            data-side={side}
            className={clsx(selectStyles.content, "outline-none", className)}
            style={contentStyle}
            {...rest}
        >
            <div className="relative">
                {normalizedChildren}
                {showScrollbar ? (
                    <div className="absolute bottom-0 right-0 top-0 w-[6px]" aria-hidden>
                        <div
                            className="w-full rounded-refineui-large bg-refineui-alias-background-surface-hover transition-transform"
                            style={thumbStyle}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export function SelectViewport({ children, className, ...props }: SelectViewportProps) {
    const { viewportRef } = useSelectCtx();
    return (
        <div ref={viewportRef} className={clsx(selectStyles.viewport, className)} {...props}>
            {children}
        </div>
    );
}

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

export function SelectItem({ value: itemValue, children, disabled = false, textValue, className, ...props }: SelectItemProps) {
    const { value, setValue, setOpen, activeIndex, setActiveIndex, itemsRef, registerItem, triggerRef } = useSelectCtx();
    const ref = useRef<HTMLDivElement | null>(null);
    const isSelected = value === itemValue;
    const label = (textValue || (typeof children === "string" ? children : String(itemValue))).trim();

    useEffect(() => {
        return registerItem({ value: itemValue, label, disabled, ref });
    }, [registerItem, itemValue, label, disabled]);

    const enabledItems = itemsRef.current.filter((item) => !item.disabled);
    const myIndex = enabledItems.findIndex((item) => item.value === itemValue);
    const isActive = myIndex >= 0 && myIndex === activeIndex && !disabled;

    return (
        <div
            ref={ref}
            role="option"
            aria-selected={isSelected}
            aria-disabled={disabled}
            data-state={isSelected ? "checked" : "unchecked"}
            data-highlighted={isActive ? "" : undefined}
            data-disabled={disabled ? "" : undefined}
            onMouseEnter={() => {
                if (disabled || myIndex < 0) return;
                setActiveIndex(myIndex);
            }}
            onMouseDown={(event) => {
                event.preventDefault();
                if (disabled) return;
                setValue(itemValue);
                setOpen(false);
                triggerRef.current?.focus();
            }}
            className={clsx(selectStyles.item, (isActive || isSelected) && selectStyles.itemActive, disabled && selectStyles.itemDisabled, className)}
            {...props}
        >
            <span className={selectStyles.itemIndicator} aria-hidden>
                {isSelected ? <WebIcon name="checkmark" size={iconSizes.xsmall} /> : null}
            </span>
            <span className={selectStyles.itemText}>{children}</span>
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

export function SelectPortal({ children }: SelectPortalProps) {
    return <>{children}</>;
}

export function SelectArrow({ children, ...props }: SelectArrowProps) {
    return <span {...props}>{children}</span>;
}

export {
    Select as Root,
    SelectTrigger as Trigger,
    SelectValue as Value,
    SelectIcon as Icon,
    SelectPortal as Portal,
    SelectContent as Content,
    SelectViewport as Viewport,
    SelectGroup as Group,
    SelectLabel as Label,
    SelectItem as Item,
    SelectItemText as ItemText,
    SelectItemIndicator as ItemIndicator,
    SelectScrollUpButton as ScrollUpButton,
    SelectScrollDownButton as ScrollDownButton,
    SelectSeparator as Separator,
    SelectArrow as Arrow,
};
