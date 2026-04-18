import { clsx } from "clsx";
import type {
    ButtonHTMLAttributes,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    ReactElement,
    ReactNode,
} from "react";
import { cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export interface MenuItemData {
    id: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    shortcut?: React.ReactNode;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

type MenuPositioning = {
    autoSize?: boolean;
};

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
    /** 레거시 단축 API (기존 호환) */
    items?: MenuItemData[];
    /** Fluent UI 유사 API */
    positioning?: MenuPositioning;
}

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
                "box-border flex w-refineui-menu-panel-width flex-col gap-refineui-size-minimal rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-surface p-refineui-size-xsmall shadow-refineui-2light",
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

/** Web Kit `Menu` `633:4268` — 레거시 `items` + Fluent UI 유사 컴파운드 API 동시 지원 */
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
            <div data-refineui="menu-root" className={clsx("relative inline-block", className)} {...props}>
                {children}
            </div>
        </MenuContext.Provider>
    );
}

type MenuTriggerProps = {
    children: ReactElement;
    disableButtonEnhancement?: boolean;
};

export function MenuTrigger({ children }: MenuTriggerProps) {
    const { open, setOpen } = useMenuContext("MenuTrigger");

    if (!isValidElement(children)) return null;

    const el = children as ReactElement<{
        onClick?: (e: MouseEvent<HTMLElement>) => void;
        "aria-expanded"?: boolean;
        "aria-haspopup"?: string;
    }>;

    return cloneElement(el, {
        "aria-expanded": open,
        "aria-haspopup": "menu",
        onClick: (e: MouseEvent<HTMLElement>) => {
            el.props.onClick?.(e);
            setOpen(!open);
        },
    });
}

export interface MenuPopoverProps extends HTMLAttributes<HTMLDivElement> {}

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
                "absolute top-full left-0 z-refineui-popup pt-refineui-size-xsmall",
                className,
            )}
            style={{
                width: "max-content",
                minWidth: "180px",
                maxWidth: "100%",
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
}

export interface MenuListProps extends HTMLAttributes<HTMLDivElement> {}

export function MenuList({ className, ...props }: MenuListProps) {
    return (
        <div
            data-refineui="menu"
            role="menu"
            className={clsx(
                "box-border flex w-full flex-col gap-refineui-size-minimal rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-surface p-refineui-size-xsmall shadow-refineui-2light",
                className,
            )}
            {...props}
        />
    );
}

export interface MenuSectionProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

/** Web Kit `Menu / Section` (`633:4258`) */
export function MenuSection({ className, children, ...props }: MenuSectionProps) {
    return (
        <div
            data-refineui="menu-section"
            className={clsx(
                "flex w-full items-center overflow-hidden px-refineui-size-small py-refineui-size-medium",
                className,
            )}
            {...props}
        >
            <span className="refineui-typo-body-1 text-refineui-alias-foreground-primary">{children}</span>
        </div>
    );
}

export interface MenuDividerProps extends HTMLAttributes<HTMLDivElement> {}

/** Web Kit `Menu / Section` Divider (`633:4263`) */
export function MenuDivider({ className, ...props }: MenuDividerProps) {
    return (
        <div
            data-refineui="menu-divider"
            role="separator"
            className={clsx("flex w-full items-center px-refineui-size-small py-refineui-size-xxsmall", className)}
            {...props}
        >
            <div className="w-full border-t border-refineui-hairline border-refineui-alias-border-default" />
        </div>
    );
}

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    children: ReactNode;
    description?: ReactNode;
    shortcut?: ReactNode;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    /** MCP `Menu / Item` 상태 프리뷰/강제 지정용 */
    state?: "default" | "hover" | "pressed" | "active" | "disabled";
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
                "block w-full rounded-refineui-large border-none bg-refineui-alias-background-surface p-refineui-size-small text-left",
                isDisabled ? "cursor-not-allowed text-refineui-alias-foreground-disabled" : "cursor-pointer text-refineui-alias-foreground-primary",
                className,
            )}
            {...props}
        >
            <span className="flex items-center gap-refineui-size-small">
                {startIcon ? <span className="flex shrink-0 items-center justify-center">{startIcon}</span> : null}
                <span className="flex min-w-0 flex-1 flex-col px-refineui-size-xxsmall">
                    <span className="refineui-typo-body-2 truncate">{children}</span>
                    {description ? (
                        <span
                            className={clsx(
                                "refineui-typo-body-4 truncate",
                                isDisabled
                                    ? "text-refineui-alias-foreground-disabled"
                                    : "text-refineui-alias-foreground-primary",
                            )}
                        >
                            {description}
                        </span>
                    ) : null}
                </span>
                {(shortcut || endIcon) && (
                    <span className="flex shrink-0 items-center gap-refineui-size-small">
                        {shortcut ? <span className="refineui-typo-body-4">{shortcut}</span> : null}
                        {endIcon ? <span className="flex items-center justify-center">{endIcon}</span> : null}
                    </span>
                )}
            </span>
        </button>
    );
}
