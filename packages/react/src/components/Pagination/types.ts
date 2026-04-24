import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes } from "react";

export type PaginationRootProps = HTMLAttributes<HTMLElement>;
export type PaginationProps = PaginationRootProps;
export type PaginationContentProps = HTMLAttributes<HTMLUListElement>;
export type PaginationItemProps = HTMLAttributes<HTMLLIElement>;

export interface PaginationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    isActive?: boolean;
}

export type PaginationPreviousProps = ButtonHTMLAttributes<HTMLButtonElement>;
export type PaginationNextProps = ButtonHTMLAttributes<HTMLButtonElement>;
export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement>;

