import { clsx } from "clsx";
import { forwardRef } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { breadcrumbStyles } from "./style";
import type {
    BreadcrumbEllipsisProps,
    BreadcrumbEllipsisTriggerProps,
    BreadcrumbItemProps,
    BreadcrumbLinkProps,
    BreadcrumbListProps,
    BreadcrumbPageProps,
    BreadcrumbProps,
    BreadcrumbSeparatorProps,
} from "./types";

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
    return (
        <nav
            data-refineui="breadcrumb"
            aria-label="Breadcrumb"
            className={clsx(breadcrumbStyles.root, className)}
            {...props}
        />
    );
}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
    return (
        <ol
            className={clsx(
                breadcrumbStyles.list,
                className,
            )}
            {...props}
        />
    );
}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
    return (
        <li
            className={clsx(breadcrumbStyles.item, className)}
            {...props}
        />
    );
}

export const breadcrumbLinkClassName = clsx(
    breadcrumbStyles.textRow,
    breadcrumbStyles.link,
);

export function BreadcrumbLink({ className, children, ...props }: BreadcrumbLinkProps) {
    return (
        <a data-refineui="breadcrumb-link" className={clsx(breadcrumbLinkClassName, className)} {...props}>
            {children}
        </a>
    );
}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
    return (
        <span
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={clsx(
                breadcrumbStyles.textRow,
                breadcrumbStyles.page,
                className,
            )}
            {...props}
        />
    );
}

export function BreadcrumbSeparator({ children, className, ...props }: BreadcrumbSeparatorProps) {
    return (
        <li
            role="presentation"
            aria-hidden
            className={clsx(breadcrumbStyles.separator, className)}
            {...props}
        >
            {children ?? (
                <span className={clsx(breadcrumbStyles.textRow, breadcrumbStyles.separatorText)}>/</span>
            )}
        </li>
    );
}

export function BreadcrumbEllipsis({ className, ...props }: BreadcrumbEllipsisProps) {
    return (
        <span
            data-refineui="breadcrumb-ellipsis"
            className={clsx(
                breadcrumbStyles.ellipsis,
                className,
            )}
            {...props}
        >
            <WebIcon name="more-horizontal" size={iconSizes.small} color="currentColor" fallback="⋯" />
        </span>
    );
}

export const BreadcrumbEllipsisTrigger = forwardRef<HTMLButtonElement, BreadcrumbEllipsisTriggerProps>(
    function BreadcrumbEllipsisTrigger({ className, type = "button", children, ...props }, ref) {
        return (
            <button
                ref={ref}
                type={type}
                data-refineui="breadcrumb-ellipsis"
                className={clsx(
                    breadcrumbStyles.ellipsisTrigger,
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
