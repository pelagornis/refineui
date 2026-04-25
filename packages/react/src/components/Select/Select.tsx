import { clsx } from "clsx";
import type {
    ChangeEvent,
    CSSProperties,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
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
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { iconSizes, spacings, zIndex } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes } from "../../componentSizes";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import { acquireBodyScrollLock } from "../../utils/bodyScrollLock";
import {
    computeAnchoredMenuPosition,
    parseCssPxLen,
    subscribeScrollAndScrollableAncestors,
    useIsomorphicLayoutEffect,
} from "../Dropdown/positioning";
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

type OptionNode = { value: string; label: string; disabled: boolean };

type SelectCtx = {
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
    menuRef: React.RefObject<HTMLDivElement | null>;
    listboxId: string;
};

const SelectContext = createContext<SelectCtx | null>(null);

function useSelectCtx(component: string): SelectCtx {
    const ctx = useContext(SelectContext);
    if (!ctx) throw new Error(`${component} must be used within Select.`);
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

    const listboxId = useId();
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = valueProp ?? internalValue;

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

    const ctx = useMemo<SelectCtx>(
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
        }),
        [open, close, value, setValue, selectedLabel, disabled, placeholder, fullWidth, size, listboxId],
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
        selectedLabel,
        disabled,
        placeholder,
        fullWidth,
        size,
        triggerRef,
        listboxId,
    } = useSelectCtx("SelectTrigger");

    const borderClass = disabled ? inputBorderClass.disabled : inputBorderClass.default;

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
    return (
        <button
            type="button"
            ref={triggerRef as React.RefObject<HTMLButtonElement>}
            disabled={disabled}
            data-refineui="select"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
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
    const { value, selectedLabel, placeholder: rootPlaceholder } = useSelectCtx("SelectValue");
    const resolvedPlaceholder = placeholder ?? rootPlaceholder;
    const showPlaceholder = !value && resolvedPlaceholder !== undefined;
    const displayText = showPlaceholder ? resolvedPlaceholder : selectedLabel || value;

    return (
        <span
            className={clsx(selectStyles.valueText, showPlaceholder && "text-refineui-alias-foreground-placeholder", className)}
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
    align = "start",
    side = "auto",
    sideOffset,
    style,
    children,
    ...props
}: SelectContentProps) {
    const { open, setOpen, close, value, triggerRef, menuRef, listboxId } = useSelectCtx("SelectContent");
    const [fixedStyle, setFixedStyle] = useState<CSSProperties | null>(null);
    /** 스크롤만으로 부족할 때 선택 행을 트리거 Y에 맞추기 위해 `fixed top`을 추가 보정 (Radix Select와 유사) */
    const [alignTopShiftPx, setAlignTopShiftPx] = useState(0);
    const [menuSide, setMenuSide] = useState<"top" | "bottom">("bottom");
    const [alignReady, setAlignReady] = useState(false);
    const [showTopChevron, setShowTopChevron] = useState(false);
    const [showBottomChevron, setShowBottomChevron] = useState(false);

    const openRef = useRef(open);
    openRef.current = open;
    const valueRef = useRef(value);
    valueRef.current = value;

    const gapPx = sideOffset ?? -parseCssPxLen(spacings.sizeXSmall, 4);
    const defaultMenuWidth = parseCssPxLen(componentSizes.dropdownMenuWidth, 180);
    const layerIndex = Number.parseInt(String(zIndex.zIndexMessages), 10) || 10000;

    useIsomorphicLayoutEffect(() => {
        let positionRaf = 0;
        let alignRaf1 = 0;
        let alignRaf2 = 0;
        const cancelAlignRafs = () => {
            cancelAnimationFrame(alignRaf1);
            cancelAnimationFrame(alignRaf2);
        };

        if (!open) {
            setFixedStyle(null);
            setMenuSide("bottom");
            setAlignTopShiftPx(0);
            setAlignReady(false);
            cancelAlignRafs();
            return;
        }

        /** 스크롤 한도를 넘는 오차는 `top` 보정으로 처리 (콘텐츠가 짧아 overflow가 없을 때 포함) */
        const queueAlignSelectedToTrigger = () => {
            cancelAlignRafs();
            alignRaf1 = requestAnimationFrame(() => {
                alignRaf2 = requestAnimationFrame(() => {
                    if (!openRef.current) return;
                    const menu = menuRef.current;
                    const trigger = triggerRef.current;
                    const val = valueRef.current;
                    if (!menu || !trigger || !val) {
                        setAlignTopShiftPx(0);
                        setAlignReady(true);
                        return;
                    }
                    const selected = menu.querySelector<HTMLElement>(
                        '[data-refineui="select-item"][data-selected="true"]:not(:disabled)',
                    );
                    if (!selected) {
                        setAlignTopShiftPx(0);
                        setAlignReady(true);
                        return;
                    }
                    const tTop = trigger.getBoundingClientRect().top;
                    let iTop = selected.getBoundingClientRect().top;
                    const delta = iTop - tTop;
                    const maxScroll = Math.max(0, menu.scrollHeight - menu.clientHeight);
                    menu.scrollTop = Math.max(0, Math.min(maxScroll, menu.scrollTop + delta));
                    iTop = selected.getBoundingClientRect().top;
                    const remainder = iTop - tTop;
                    setAlignTopShiftPx(Math.abs(remainder) < 0.5 ? 0 : remainder);
                    setAlignReady(true);
                });
            });
        };

        const apply = () => {
            setAlignReady(!valueRef.current);
            const trigger = triggerRef.current;
            if (!trigger) return;
            const anchor = trigger.getBoundingClientRect();
            const menuWidth = menuRef.current?.offsetWidth || defaultMenuWidth;
            const menuHeight = menuRef.current?.offsetHeight || 272;
            const pos = computeAnchoredMenuPosition({
                anchor,
                menuWidth,
                menuHeight,
                align,
                side,
                gap: gapPx,
            });
            const overlapTop = pos.side === "bottom" ? pos.top - Math.max(0, anchor.height + gapPx) : pos.top;
            setMenuSide(pos.side);
            setFixedStyle({
                position: "fixed",
                top: overlapTop,
                left: pos.left,
                width: anchor.width,
                minWidth: componentSizes.dropdownMenuWidth,
                maxHeight: "min(60vh, 20rem)",
                zIndex: layerIndex,
            });
            queueAlignSelectedToTrigger();
        };

        apply();
        positionRaf = requestAnimationFrame(apply);
        window.addEventListener("resize", apply);
        const unsubScroll = subscribeScrollAndScrollableAncestors(triggerRef.current, apply);
        return () => {
            cancelAnimationFrame(positionRaf);
            cancelAlignRafs();
            window.removeEventListener("resize", apply);
            unsubScroll();
        };
    }, [open, align, side, gapPx, defaultMenuWidth, layerIndex, triggerRef, menuRef]);

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
        if (!open) return;
        return acquireBodyScrollLock();
    }, [open]);

    useEffect(() => {
        if (!open) {
            setShowTopChevron(false);
            setShowBottomChevron(false);
            return;
        }
        const el = menuRef.current;
        if (!el) return;
        const update = () => {
            setShowTopChevron(el.scrollTop > 0);
            setShowBottomChevron(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
        };
        update();
        el.addEventListener("scroll", update, { passive: true });
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
        ro?.observe(el);
        return () => {
            el.removeEventListener("scroll", update);
            ro?.disconnect();
        };
    }, [open, children, menuRef]);

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape" || event.key === "Tab") {
            event.preventDefault();
            close();
        }
    };

    if (!open || !fixedStyle || typeof document === "undefined") return null;

    return createPortal(
        <div
            ref={menuRef as Ref<HTMLDivElement>}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            data-refineui="select-menu"
            data-side={menuSide}
            className={clsx(selectStyles.content, className)}
            style={{
                ...fixedStyle,
                ...style,
                top:
                    typeof fixedStyle.top === "number"
                        ? fixedStyle.top - alignTopShiftPx
                        : fixedStyle.top,
                borderColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.border),
                backgroundColor: resolveColorTokenValue(componentColorTokens.dropdown.menu.background),
                visibility: alignReady ? "visible" : "hidden",
            }}
            onKeyDown={onKeyDown}
            {...props}
        >
            {showTopChevron ? (
                <div aria-hidden className={selectStyles.scrollHintWrap}>
                    <WebIcon name="chevron-up" size={iconSizes.xxsmall} className={selectStyles.scrollHintIcon} />
                </div>
            ) : null}
            {children}
            {showBottomChevron ? (
                <div aria-hidden className={selectStyles.scrollHintWrap}>
                    <WebIcon name="chevron-down" size={iconSizes.xxsmall} className={selectStyles.scrollHintIcon} />
                </div>
            ) : null}
        </div>,
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
    const { value: selectedValue, setValue, close } = useSelectCtx("SelectItem");
    const selected = selectedValue === value;
    const [pressed, setPressed] = useState(false);

    return (
        <button
            type="button"
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
            <span className={selectStyles.itemLabel}>{children}</span>
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
            className={clsx(selectStyles.separator, className)}
            {...props}
        />
    );
}

export function SelectGroup({ className, ...props }: SelectGroupProps) {
    return <div data-refineui="select-group" className={clsx("flex flex-col gap-px", className)} {...props} />;
}
