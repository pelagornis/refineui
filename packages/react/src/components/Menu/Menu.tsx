import { clsx } from "clsx";
import type {
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    ReactElement,
    ReactNode,
} from "react";
import { cloneElement, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { iconSizes } from "@refineui/tokens";
import { componentSizes } from "../../componentSizes";
import { getMergeableTriggerChild } from "../../utils/mergeTriggerChild";
import { menuStyles } from "./style";
import type {
    MenuDividerProps,
    MenuItemData,
    MenuItemProps,
    MenuListProps,
    MenuPopoverProps,
    MenuPositioning,
    MenuProps,
    MenuSectionProps,
} from "./types";

type MenuContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
    positioning?: MenuPositioning;
};

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(componentName: string): MenuContextValue {
    const ctx = useContext(MenuContext);
    if (!ctx) {
        throw new Error(`${componentName} must be used within Menu.`);
    }
    return ctx;
}

function LegacyMenuPanel({ items, className, ...props }: { items: MenuItemData[] } & HTMLAttributes<HTMLDivElement>) {
    const menuRef = useRef<HTMLDivElement>(null);

    const itemButtons = useCallback((): HTMLButtonElement[] => {
        const nodelist = menuRef.current?.querySelectorAll<HTMLButtonElement>('[data-refineui="menu-item"]');
        return nodelist ? Array.from(nodelist) : [];
    }, []);

    const focusAdjacent = useCallback(
        (fromIndex: number, delta: number) => {
            const arr = itemButtons();
            const enabledIdx = arr.map((b, i) => (b.disabled ? -1 : i)).filter((i): i is number => i >= 0);
            if (enabledIdx.length === 0) return;
            const pos = enabledIdx.indexOf(fromIndex);
            if (pos < 0) return;
            const next = (pos + delta + enabledIdx.length) % enabledIdx.length;
            arr[enabledIdx[next]!]!.focus();
        },
        [itemButtons],
    );

    const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const arr = itemButtons();
        const active = document.activeElement;
        const idx = active instanceof HTMLButtonElement ? arr.indexOf(active) : -1;
        if (idx < 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                focusAdjacent(idx, 1);
                break;
            case "ArrowUp":
                e.preventDefault();
                focusAdjacent(idx, -1);
                break;
            case "Home":
                e.preventDefault();
                for (let i = 0; i < arr.length; i++) {
                    if (!arr[i]!.disabled) {
                        arr[i]!.focus();
                        break;
                    }
                }
                break;
            case "End":
                e.preventDefault();
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (!arr[i]!.disabled) {
                        arr[i]!.focus();
                        break;
                    }
                }
                break;
            default:
                break;
        }
    };

    return (
        <div
            ref={menuRef}
            data-refineui="menu"
            role="menu"
            onKeyDown={onMenuKeyDown}
            className={clsx(
                menuStyles.panel,
                className,
            )}
            {...props}
        >
            {items.map((item) => (
                <MenuItem
                    key={item.id}
                    disabled={item.disabled}
                    onClick={item.onClick}
                    description={item.description}
                    shortcut={item.shortcut}
                    startIcon={item.startIcon}
                    endIcon={item.endIcon}
                >
                    {item.label}
                </MenuItem>
            ))}
        </div>
    );
}

export function Menu({ items, children, className, positioning, ...props }: MenuProps) {
    if (items && items.length > 0) {
        return (
            <LegacyMenuPanel className={className} items={items} {...props}>
                {children}
            </LegacyMenuPanel>
        );
    }

    const [open, setOpen] = useState(false);
    const value = useMemo(() => ({ open, setOpen, positioning }), [open, positioning]);

    return (
        <MenuContext.Provider value={value}>
            <div data-refineui="menu-root" className={clsx(menuStyles.root, className)} {...props}>
                {children}
            </div>
        </MenuContext.Provider>
    );
}

type MenuTriggerProps = {
    children: ReactNode;
};

export function MenuTrigger({ children }: MenuTriggerProps) {
    const { open, setOpen } = useMenuContext("MenuTrigger");

    const mergeEl = getMergeableTriggerChild(children);
    if (mergeEl) {
        const el = mergeEl as ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>;
        return cloneElement(el, {
            "aria-expanded": open,
            "aria-haspopup": "menu" as const,
            onClick: (e: MouseEvent<HTMLElement>) => {
                el.props.onClick?.(e);
                setOpen(!open);
            },
        } as never);
    }

    return (
        <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            className={menuStyles.triggerFallback}
            onClick={() => setOpen(!open)}
        >
            {children}
        </button>
    );
}

export function MenuPopover({ className, children, style, ...props }: MenuPopoverProps) {
    const { open, positioning } = useMenuContext("MenuPopover");
    const [shouldRender, setShouldRender] = useState(open);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            setIsClosing(false);
            return;
        }

        if (!shouldRender) {
            return;
        }

        setIsClosing(true);
        const timeout = window.setTimeout(() => {
            setShouldRender(false);
            setIsClosing(false);
        }, 180);

        return () => window.clearTimeout(timeout);
    }, [open, shouldRender]);

    if (!shouldRender) return null;

    return (
        <div
            data-refineui="menu-popover"
            data-state={isClosing ? "closed" : "open"}
            className={clsx(
                menuStyles.popover,
                className,
            )}
            style={{
                width: "max-content",
                minWidth: componentSizes.menuPanelWidth,
                maxWidth: "100%",
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
}

export function MenuList({ className, ...props }: MenuListProps) {
    return (
        <div
            data-refineui="menu"
            role="menu"
            className={clsx(
                menuStyles.list,
                className,
            )}
            {...props}
        />
    );
}

/** Web Kit `Menu / Section` (`633:4258`) */
export function MenuSection({ className, children, ...props }: MenuSectionProps) {
    return (
        <div
            data-refineui="menu-section"
            className={clsx(
                menuStyles.section,
                className,
            )}
            {...props}
        >
            <span className={menuStyles.sectionText}>{children}</span>
        </div>
    );
}

/** Web Kit `Menu / Section` Divider (`633:4263`) */
export function MenuDivider({ className, ...props }: MenuDividerProps) {
    return (
        <div
            data-refineui="menu-divider"
            role="separator"
            className={clsx(menuStyles.dividerWrap, className)}
            {...props}
        >
            <div className={menuStyles.dividerLine} />
        </div>
    );
}

export function MenuItem({
    children,
    description,
    shortcut,
    startIcon,
    endIcon,
    className,
    disabled,
    state = "default",
    ...props
}: MenuItemProps) {
    const isDisabled = disabled || state === "disabled";
    const resolvedState = isDisabled ? "disabled" : state;

    return (
        <button
            data-refineui="menu-item"
            data-state={resolvedState}
            role="menuitem"
            type="button"
            disabled={isDisabled}
            className={clsx(
                menuStyles.itemBase,
                isDisabled ? menuStyles.itemDisabled : menuStyles.itemEnabled,
                className,
            )}
            {...props}
        >
            <span className={menuStyles.row}>
                {startIcon ? (
                    <span
                        className={menuStyles.iconWrap}
                        style={{
                            width: iconSizes.small,
                            minWidth: iconSizes.small,
                            height: iconSizes.small,
                        }}
                    >
                        {startIcon}
                    </span>
                ) : null}
                <span className={menuStyles.textCol}>
                    <span className={menuStyles.title}>{children}</span>
                    {description ? (
                        <span
                            className={clsx(
                                menuStyles.description,
                                isDisabled
                                    ? menuStyles.descriptionDisabled
                                    : menuStyles.descriptionEnabled,
                            )}
                        >
                            {description}
                        </span>
                    ) : null}
                </span>
                {(shortcut || endIcon) && (
                    <span className={menuStyles.rightWrap}>
                        {shortcut ? (
                            <span className={menuStyles.shortcut}>{shortcut}</span>
                        ) : null}
                        {endIcon ? (
                            <span
                                className={menuStyles.iconWrap}
                                style={{
                                    width: iconSizes.small,
                                    minWidth: iconSizes.small,
                                    height: iconSizes.small,
                                }}
                            >
                                {endIcon}
                            </span>
                        ) : null}
                    </span>
                )}
            </span>
        </button>
    );
}
