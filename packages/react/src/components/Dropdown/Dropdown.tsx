import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactElement, ReactNode, Ref } from "react";
import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from "react";
import { colors, spacings, borderRadii, typographys, shadows, toBoxShadow, zIndex, strokeWidths, sizes, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { composeRef } from "../../utils/composeRef";

export interface DropdownItem {
    id: string;
    label: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    trigger: ReactNode;
    items: DropdownItem[];
    align?: "start" | "end";
    showTriggerChevron?: boolean;
}

type TriggerProps = {
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
};

type TriggerElement = ReactElement<TriggerProps> & { ref?: Ref<HTMLElement | null> };

export function Dropdown({
    trigger,
    items,
    align = "end",
    showTriggerChevron = false,
    style,
    ...props
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
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
        [enabledIndices, highlighted, focusItemIndex]
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
        const raf = requestAnimationFrame(() => focusItemIndex(first));
        return () => cancelAnimationFrame(raf);
    }, [open, enabledIndices, focusItemIndex]);

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
        if (isValidElement(trigger)) {
            const el = trigger as TriggerElement;
            return cloneElement(el, {
                ref: composeRef(triggerRef, el.ref),
                "aria-expanded": open,
                "aria-haspopup": "menu" as const,
                "aria-controls": menuId,
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
                onClick={toggle}
                onKeyDown={(e) => onTriggerKeyDown(e)}
                style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                    color: "inherit",
                }}
            >
                {trigger}
            </button>
        );
    };

    return (
        <div ref={containerRef} data-refineui="dropdown" style={{ position: "relative", display: "inline-block", ...style }} {...props}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: showTriggerChevron ? spacings.sizeXSmall : undefined }}>
                {renderTrigger()}
                {showTriggerChevron && (
                    <span
                        role="presentation"
                        style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                        onClick={toggle}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggle();
                            }
                        }}
                        tabIndex={-1}
                    >
                        <WebIcon name={open ? "chevron-up" : "chevron-down"} size={iconSizes.md} color={colors.primaryBlack} />
                    </span>
                )}
            </div>
            {open && (
                <div
                    id={menuId}
                    role="menu"
                    tabIndex={-1}
                    onKeyDown={onMenuKeyDown}
                    style={{
                        position: "absolute",
                        top: "100%",
                        [align]: 0,
                        marginTop: spacings.sizeXSmall,
                        minWidth: sizes.menuMinWidth,
                        backgroundColor: colors.neutralWhite,
                        borderRadius: borderRadii.roundedMedium,
                        boxShadow: toBoxShadow(shadows.shadow4Light),
                        border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
                        padding: spacings.sizeXSmall,
                        zIndex: zIndex.zIndexPopup,
                        outline: "none",
                    }}
                >
                    {items.map((item, itemIndex) => (
                        <button
                            key={item.id}
                            data-refineui="dropdown-item"
                            role="menuitem"
                            disabled={item.disabled}
                            tabIndex={-1}
                            onFocus={() => setHighlighted(itemIndex)}
                            onClick={() => {
                                item.onClick?.();
                                close();
                            }}
                            style={{
                                width: "100%",
                                display: "block",
                                padding: `${spacings.sizeSmall} ${spacings.sizeMedium}`,
                                textAlign: "left",
                                border: "none",
                                background: "none",
                                cursor: item.disabled ? "not-allowed" : "pointer",
                                ...typographys.body3,
                                color: item.disabled ? colors.neutral500 : colors.primaryBlack,
                                borderRadius: borderRadii.roundedSmall,
                                opacity: item.disabled ? 0.6 : 1,
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
