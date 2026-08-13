import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type MenuPositioning = {
    autoSize?: boolean;
};

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
    positioning?: MenuPositioning;
}

export interface MenuPopoverProps extends HTMLAttributes<HTMLDivElement> {}
export interface MenuListProps extends HTMLAttributes<HTMLDivElement> {}

export interface MenuSectionProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export interface MenuDividerProps extends HTMLAttributes<HTMLDivElement> {}

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    children: ReactNode;
    description?: ReactNode;
    shortcut?: ReactNode;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    state?: "default" | "hover" | "pressed" | "active" | "disabled";
}

/** Submenu trigger — chevron is built-in (Web Kit endIcon). */
export interface MenuSubTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    children: ReactNode;
    description?: ReactNode;
    startIcon?: ReactNode;
    state?: "default" | "hover" | "pressed" | "active" | "disabled";
}

export type MenuSubContentProps = HTMLAttributes<HTMLDivElement>;
