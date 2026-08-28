import type { ReactNode } from "react";
import {
    ScrollArea,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarLink,
    SidebarNav,
} from "@refineui/react";
import type { DocsNavEntry } from "./nav";

export function DocsSidebar({
    entries,
    footer,
}: {
    title?: string;
    titleHref?: string;
    entries: DocsNavEntry[];
    footer?: ReactNode;
}) {
    return (
        <Sidebar data-refineui-docs-sidebar>
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
                                        {...(entry.external
                                            ? { target: "_blank", rel: "noreferrer" }
                                            : {})}
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
                                                {...(link.external
                                                    ? { target: "_blank", rel: "noreferrer" }
                                                    : {})}
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
