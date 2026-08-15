import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export interface NavigationMenuProps extends Omit<HTMLAttributes<HTMLElement>, "defaultValue"> {
    /** Controlled open item value (`""` = closed). */
    value?: string;
    /** Uncontrolled initial open item value. */
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /**
     * Delay (ms) before opening a panel on pointer enter.
     * Defaults to semantic `duration.normal`.
     */
    delayDuration?: number;
    /**
     * When moving between items while a panel is open, wait this long (ms)
     * before switching — usually shorter than `delayDuration`.
     * Defaults to semantic `duration.fast`.
     */
    skipDelayDuration?: number;
    /** Accessible name for the landmark. @default "Main" */
    "aria-label"?: string;
}

export interface NavigationMenuListProps extends HTMLAttributes<HTMLUListElement> {}

export interface NavigationMenuItemProps extends HTMLAttributes<HTMLLIElement> {
    /** Stable id for open state. Auto-generated when omitted. */
    value?: string;
}

export interface NavigationMenuTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    children: ReactNode;
}

export interface NavigationMenuContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface NavigationMenuLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /** Marks the current page (`aria-current="page"`). */
    active?: boolean;
}

export interface NavigationMenuIndicatorProps extends HTMLAttributes<HTMLDivElement> {}
