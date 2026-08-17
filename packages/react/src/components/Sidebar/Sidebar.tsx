import { clsx } from "clsx";
import { sidebarStyles } from "./style";
import type {
    SidebarBrandProps,
    SidebarContentProps,
    SidebarFooterProps,
    SidebarGroupLabelProps,
    SidebarGroupProps,
    SidebarHeaderProps,
    SidebarLinkProps,
    SidebarNavProps,
    SidebarProps,
} from "./types";

/** App sidebar landmark — token composition (no Web Kit COMPONENT_SET). */
export function Sidebar({ className, ...props }: SidebarProps) {
    return (
        <aside
            data-refineui="sidebar"
            className={clsx(sidebarStyles.root, className)}
            {...props}
        />
    );
}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
    return (
        <div
            data-refineui="sidebar-header"
            className={clsx(sidebarStyles.header, className)}
            {...props}
        />
    );
}

export function SidebarBrand({ className, ...props }: SidebarBrandProps) {
    return (
        <div
            data-refineui="sidebar-brand"
            className={clsx(sidebarStyles.brand, className)}
            {...props}
        />
    );
}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
    return (
        <div
            data-refineui="sidebar-content"
            className={clsx(sidebarStyles.content, className)}
            {...props}
        />
    );
}

export function SidebarNav({ className, "aria-label": ariaLabel = "Sidebar", ...props }: SidebarNavProps) {
    return (
        <nav
            data-refineui="sidebar-nav"
            aria-label={ariaLabel}
            className={clsx(sidebarStyles.nav, className)}
            {...props}
        />
    );
}

export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
    return (
        <div
            data-refineui="sidebar-group"
            className={clsx(sidebarStyles.group, className)}
            {...props}
        />
    );
}

export function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
    return (
        <p
            data-refineui="sidebar-group-label"
            className={clsx(sidebarStyles.groupLabel, className)}
            {...props}
        />
    );
}

export function SidebarLink({
    className,
    active = false,
    "aria-disabled": ariaDisabled,
    ...props
}: SidebarLinkProps) {
    const disabled = ariaDisabled === true || ariaDisabled === "true";

    return (
        <a
            data-refineui="sidebar-link"
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : undefined}
            className={clsx(
                sidebarStyles.link,
                active && sidebarStyles.linkActive,
                disabled && sidebarStyles.linkDisabled,
                className,
            )}
            {...props}
        />
    );
}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
    return (
        <div
            data-refineui="sidebar-footer"
            className={clsx(sidebarStyles.footer, className)}
            {...props}
        />
    );
}
