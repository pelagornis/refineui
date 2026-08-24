import type { ReactNode } from "react";
import { iconSizes } from "@refineui/tokens";
import {
    Button,
    ScrollArea,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarLink,
    SidebarNav,
    WebIcon,
} from "@refineui/react";
import type { DocsNavEntry } from "./nav";

export function DocsSidebar({
    entries,
    footer,
    onCollapse,
}: {
    title?: string;
    titleHref?: string;
    entries: DocsNavEntry[];
    footer?: ReactNode;
    onCollapse?: () => void;
}) {
    return (
        <Sidebar data-refineui-docs-sidebar>
            {onCollapse ? (
                <SidebarHeader data-docs-sidebar-toolbar>
                    <Button
                        type="button"
                        variant="ghost"
                        layout="icon"
                        size="sm"
                        aria-label="Close sidebar"
                        onClick={onCollapse}
                    >
                        <WebIcon
                            name="chevron-left"
                            size={iconSizes.small}
                            color="currentColor"
                            fallback="‹"
                        />
                    </Button>
                </SidebarHeader>
            ) : null}
            <SidebarContent style={{ overflow: "hidden" }}>
                <ScrollArea type="hover" className="h-full w-full min-h-0">
                    <ScrollAreaViewport>
                        <SidebarNav aria-label="Documentation">
                            {entries.map((entry) =>
                                entry.type === "link" ? (
                                    <SidebarLink
                                        key={entry.href}
                                        href={entry.href}
                                        active={entry.isCurrent}
                                    >
                                        {entry.label}
                                    </SidebarLink>
                                ) : (
                                    <SidebarGroup key={entry.label}>
                                        <SidebarGroupLabel>{entry.label}</SidebarGroupLabel>
                                        {entry.entries.map((link) => (
                                            <SidebarLink
                                                key={link.href}
                                                href={link.href}
                                                active={link.isCurrent}
                                            >
                                                {link.label}
                                            </SidebarLink>
                                        ))}
                                    </SidebarGroup>
                                ),
                            )}
                        </SidebarNav>
                    </ScrollAreaViewport>
                    <ScrollAreaScrollbar orientation="vertical">
                        <ScrollAreaThumb />
                    </ScrollAreaScrollbar>
                </ScrollArea>
            </SidebarContent>
            {footer}
        </Sidebar>
    );
}
