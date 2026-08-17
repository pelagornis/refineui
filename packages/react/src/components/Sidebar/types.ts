import type { AnchorHTMLAttributes, HTMLAttributes } from "react";

export type SidebarProps = HTMLAttributes<HTMLElement>;
export type SidebarHeaderProps = HTMLAttributes<HTMLDivElement>;
export type SidebarBrandProps = HTMLAttributes<HTMLDivElement>;
export type SidebarContentProps = HTMLAttributes<HTMLDivElement>;
export type SidebarNavProps = HTMLAttributes<HTMLElement>;
export type SidebarGroupProps = HTMLAttributes<HTMLDivElement>;
export type SidebarGroupLabelProps = HTMLAttributes<HTMLParagraphElement>;
export type SidebarFooterProps = HTMLAttributes<HTMLDivElement>;

export interface SidebarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /** Marks the current page (`aria-current="page"`). */
    active?: boolean;
}
