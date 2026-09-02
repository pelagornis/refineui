import type { AnchorHTMLAttributes, HTMLAttributes } from "react";

export type SidebarProps = HTMLAttributes<HTMLElement>;
export type SidebarHeaderProps = HTMLAttributes<HTMLDivElement>;
export type SidebarBrandProps = HTMLAttributes<HTMLDivElement>;
export type SidebarContentProps = HTMLAttributes<HTMLDivElement>;
export type SidebarNavProps = HTMLAttributes<HTMLElement>;
export type SidebarGroupProps = HTMLAttributes<HTMLDivElement>;
export type SidebarGroupLabelProps = HTMLAttributes<HTMLParagraphElement>;
export type SidebarFooterProps = HTMLAttributes<HTMLDivElement>;

export type SidebarPeekMode = "contained" | "viewport";

export interface SidebarPeekProps extends HTMLAttributes<HTMLDivElement> {
    /** When false, peek edge/panel/inset offset are inactive. */
    enabled?: boolean;
    /** Flyout width as a percentage of the peek root width. */
    widthPercent: number;
    mode?: SidebarPeekMode;
    /** Pin / expand the docked sidebar (flyout toolbar). */
    onPin?: () => void;
}

export type SidebarPeekEdgeProps = HTMLAttributes<HTMLDivElement>;
export type SidebarPeekPanelProps = HTMLAttributes<HTMLDivElement>;
export type SidebarPeekPinProps = HTMLAttributes<HTMLDivElement>;
export type SidebarPeekInsetProps = HTMLAttributes<HTMLDivElement>;

export interface SidebarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /** Marks the current page (`aria-current="page"`). */
    active?: boolean;
}
