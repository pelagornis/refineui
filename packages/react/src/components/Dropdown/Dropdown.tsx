import { clsx } from "clsx";
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactElement, ReactNode, Ref } from "react";
import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { composeRef } from "../../utils/composeRef";

export interface DropdownItem {
    id: string;
    label: ReactNode;
    /** Figma `Dropdown / Menu / Item` 우측 보조 텍스트(단축키 등) */
    shortcut?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    trigger: ReactNode;
    items: DropdownItem[];
    align?: "start" | "end";
    showTriggerChevron?: boolean;
    /** Figma `Dropdown / Menu / Title Item` — 열린 메뉴 상단 구획 제목 */
    menuTitle?: ReactNode;
}

type TriggerProps = {
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
    className?: string;
};

type TriggerElement = ReactElement<TriggerProps> & { ref?: Ref<HTMLElement | null> };

/** Web Kit COMPONENT_SET `Dropdown` `503:2985` — `docs/design-specs-web-kit.md` Dropdown 절. */
export function Dropdown({
    trigger,
    items,
    align = "end",
    showTriggerChevron = false,
    menuTitle,
    className,
    ...props
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const menuId = useId();

    const enabledIndices = items.map((it, i) => (it.disabled ? -1 : i)).filter((i): i is number => i >= 0);

    const focusItemIndex = useCallback((itemIndex: number) => {
        const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[data-refineui="dropdown-item"]');
        buttons?.[itemIndex]?.focus();
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
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const first = enabledIndices[0] ?? 0;
        setHighlighted(first);
        setHoveredIndex(null);
        const raf = requestAnimationFrame(() => focusItemIndex(first));
        return () => cancelAnimationFrame(raf);
    }, [open, enabledIndices, focusItemIndex]);

    const close = useCallback(() => {
        setOpen(false);
        setHoveredIndex(null);
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
        if (isValidElement(trigger)) {
            const el = trigger as TriggerElement;
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

    const rowActive = (itemIndex: number) =>
        !items[itemIndex]?.disabled && (highlighted === itemIndex || hoveredIndex === itemIndex);

    const chevronControl = showTriggerChevron ? (
        <span
            role="presentation"
            className="inline-flex shrink-0 cursor-pointer items-center justify-center bg-refineui-neutral-white px-refineui-size-small"
            onClick={toggle}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle();
                }
            }}
            tabIndex={-1}
        >
            <WebIcon name={open ? "chevron-up" : "chevron-down"} size={iconSizes.large} color="var(--refineui-color-primary-black)" />
        </span>
    ) : null;

    return (
        <div ref={containerRef} data-refineui="dropdown" className={clsx("relative inline-block", className)} {...props}>
            {showTriggerChevron ? (
                <div
                    data-refineui="dropdown-trigger"
                    className="box-border inline-flex items-stretch overflow-hidden rounded-refineui-small border-refineui-thin border-refineui-neutral-300 bg-refineui-neutral-white"
                >
                    {renderTrigger()}
                    {chevronControl}
                </div>
            ) : (
                renderTrigger()
            )}
            {open && (
                <div
                    id={menuId}
                    role="menu"
                    tabIndex={-1}
                    onKeyDown={onMenuKeyDown}
                    className={clsx(
                        "absolute z-refineui-popup mt-refineui-size-xsmall box-border flex min-w-refineui-dropdown-menu-width w-refineui-dropdown-menu-width flex-col gap-refineui-size-minimal rounded-refineui-large border-refineui-hairline border-refineui-neutral-300 bg-refineui-neutral-white p-refineui-size-xsmall shadow-refineui-2light outline-none",
                        align === "start" ? "left-0" : "right-0",
                        "top-full",
                    )}
                >
                    {menuTitle != null && (
                        <div
                            role="presentation"
                            className="refineui-typo-body-2 shrink-0 px-refineui-size-medium py-refineui-size-small text-refineui-primary-black"
                        >
                            {menuTitle}
                        </div>
                    )}
                    {items.map((item, itemIndex) => (
                        <button
                            key={item.id}
                            data-refineui="dropdown-item"
                            role="menuitem"
                            disabled={item.disabled}
                            tabIndex={-1}
                            onFocus={() => setHighlighted(itemIndex)}
                            onMouseEnter={() => !item.disabled && setHoveredIndex(itemIndex)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => {
                                item.onClick?.();
                                close();
                            }}
                            className={clsx(
                                "refineui-typo-body-4 flex w-full items-center justify-between gap-refineui-size-medium rounded-refineui-large border-none px-refineui-size-medium py-refineui-size-small text-left",
                                rowActive(itemIndex) ? "bg-refineui-neutral-150" : "bg-transparent",
                                item.disabled
                                    ? "cursor-not-allowed text-refineui-neutral-500 opacity-60"
                                    : "cursor-pointer text-refineui-neutral-850 opacity-100",
                            )}
                        >
                            <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</span>
                            {item.shortcut != null && (
                                <span className="refineui-typo-body-4 shrink-0 text-refineui-neutral-850">{item.shortcut}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
