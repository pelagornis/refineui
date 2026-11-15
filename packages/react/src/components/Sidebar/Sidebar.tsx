import { clsx } from "clsx";
import { createContext, useContext } from "react";
import { ScrollAreaRegion } from "../ScrollArea/ScrollAreaRegion";
import { useSlidingHighlight } from "../shared/SlidingHighlight";
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

/** Rows inside `SidebarContent` sit in its ScrollArea and take the edge blur; footer rows do not. */
const SidebarScrollContext = createContext(false);

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

export function SidebarContent({ className, children, ...props }: SidebarContentProps) {
    return (
        <div
            data-refineui="sidebar-content"
            className={clsx(sidebarStyles.content, className)}
            {...props}
        >
            <ScrollAreaRegion type="hover" viewportClassName={sidebarStyles.contentViewport}>
                <SidebarScrollContext.Provider value>{children}</SidebarScrollContext.Provider>
            </ScrollAreaRegion>
        </div>
    );
}

const SIDEBAR_LINK_SELECTOR = '[data-refineui="sidebar-link"]';

export function SidebarNav({
    className,
    children,
    "aria-label": ariaLabel = "Sidebar",
    ...props
}: SidebarNavProps) {
    const inScroll = useContext(SidebarScrollContext);
    const highlight = useSlidingHighlight<HTMLElement>({ itemSelector: SIDEBAR_LINK_SELECTOR });

    return (
        <nav
            ref={highlight.hostRef}
            data-refineui="sidebar-nav"
            aria-label={ariaLabel}
            className={clsx(sidebarStyles.nav, className)}
            {...props}
        >
            <span
                data-refineui="sidebar-highlight"
                data-scroll-edge-item={inScroll || undefined}
                className={sidebarStyles.highlight}
                {...highlight.indicatorProps}
            />
            {children}
        </nav>
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
    const inScroll = useContext(SidebarScrollContext);

    return (
        <p
            data-refineui="sidebar-group-label"
            data-scroll-edge-item={inScroll || undefined}
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
    const inScroll = useContext(SidebarScrollContext);

    return (
        <a
            data-refineui="sidebar-link"
            data-scroll-edge-item={inScroll || undefined}
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
