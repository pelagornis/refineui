import { clsx } from "clsx";
import type {
    KeyboardEvent,
    MouseEvent,
    ReactElement,
    ReactNode,
} from "react";
import { cloneElement, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { iconSizes, semanticInteraction } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
import { componentSizes } from "../../componentSizes";
import { getMergeableTriggerChild } from "@refineui/utilities/react";
import { menuStyles } from "./style";
import type {
    MenuDividerProps,
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
export function Menu({ children, className, positioning, ...props }: MenuProps) {
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
        }, motionMsToNumber(semanticInteraction.duration.normal));

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
