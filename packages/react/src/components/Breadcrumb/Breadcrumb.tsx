import { clsx } from "clsx";
import type {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    HTMLAttributes,
    LiHTMLAttributes,
    OlHTMLAttributes,
} from "react";
import { forwardRef } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

const textRow = "refineui-typo-caption-1 whitespace-nowrap";

export type BreadcrumbProps = HTMLAttributes<HTMLElement>;

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
    return (
        <nav
            data-refineui="breadcrumb"
            aria-label="Breadcrumb"
            className={clsx("py-refineui-size-small", className)}
            {...props}
        />
    );
}

export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>;

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
    return (
        <ol
            className={clsx(
                "m-0 flex flex-wrap list-none items-start gap-refineui-size-medium p-0",
                className,
            )}
            {...props}
        />
    );
}

export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
    return (
        <li
            className={clsx("inline-flex items-center justify-center overflow-clip", className)}
            {...props}
        />
    );
}

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const breadcrumbLinkClassName = clsx(
    textRow,
    "inline-flex items-center justify-center px-refineui-size-medium py-refineui-size-xsmall text-refineui-alias-foreground-tertiary no-underline",
);

export function BreadcrumbLink({ className, children, ...props }: BreadcrumbLinkProps) {
    return (
        <a data-refineui="breadcrumb-link" className={clsx(breadcrumbLinkClassName, className)} {...props}>
            {children}
        </a>
    );
}

export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
    return (
        <span
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={clsx(
                textRow,
                "inline-flex items-center justify-center px-refineui-size-medium py-refineui-size-xsmall text-refineui-alias-foreground-primary",
                className,
            )}
            {...props}
        />
    );
}

export type BreadcrumbSeparatorProps = LiHTMLAttributes<HTMLLIElement>;

export function BreadcrumbSeparator({ children, className, ...props }: BreadcrumbSeparatorProps) {
    return (
        <li
            role="presentation"
            aria-hidden
            className={clsx("inline-flex shrink-0 items-center py-refineui-size-xsmall", className)}
            {...props}
        >
            {children ?? (
                <span className={clsx(textRow, "inline-flex items-center text-refineui-alias-foreground-tertiary")}>/</span>
            )}
        </li>
    );
}

export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement>;

export function BreadcrumbEllipsis({ className, ...props }: BreadcrumbEllipsisProps) {
    return (
        <span
            data-refineui="breadcrumb-ellipsis"
            className={clsx(
                "inline-flex size-refineui-size-xlarge shrink-0 items-center justify-center text-refineui-alias-foreground-tertiary",
                className,
            )}
            {...props}
        >
            <WebIcon name="more-horizontal" size={iconSizes.small} color="currentColor" fallback="⋯" />
        </span>
    );
}

export type BreadcrumbEllipsisTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const BreadcrumbEllipsisTrigger = forwardRef<HTMLButtonElement, BreadcrumbEllipsisTriggerProps>(
    function BreadcrumbEllipsisTrigger({ className, type = "button", children, ...props }, ref) {
        return (
            <button
                ref={ref}
                type={type}
                data-refineui="breadcrumb-ellipsis"
                className={clsx(
                    "box-border inline-flex size-refineui-size-xlarge shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-refineui-alias-foreground-tertiary",
                    className,
                )}
                {...props}
            >
                {children ?? (
                    <WebIcon name="more-horizontal" size={iconSizes.small} color="currentColor" fallback="⋯" />
                )}
            </button>
        );
    },
);
