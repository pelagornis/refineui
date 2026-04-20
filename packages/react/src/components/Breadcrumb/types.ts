import type {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    HTMLAttributes,
    LiHTMLAttributes,
    OlHTMLAttributes,
} from "react";

export type BreadcrumbProps = HTMLAttributes<HTMLElement>;
export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>;
export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;
export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}
export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;
export type BreadcrumbSeparatorProps = LiHTMLAttributes<HTMLLIElement>;
export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement>;
export type BreadcrumbEllipsisTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

