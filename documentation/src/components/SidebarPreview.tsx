import { iconSizes } from "@refineui/tokens";
import {
    Box,
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    Sidebar,
    SidebarBrand,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarLink,
    SidebarNav,
    Text,
    WebIcon,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

function NavGlyph({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.small} color="currentColor" aria-hidden />;
}

export default function SidebarPreview() {
    return (
        <Looks>
            <Look align="fill">
                <ResizablePanelGroup
                    orientation="horizontal"
                    className="h-refineui-foundation-size-5750 w-full"
                >
                    <ResizablePanel defaultSize={32} minSize={18} className="flex">
                        <Sidebar>
                            <SidebarHeader>
                                <SidebarBrand>RefineUI</SidebarBrand>
                            </SidebarHeader>
                            <SidebarContent>
                                <SidebarNav>
                                    <SidebarGroup>
                                        <SidebarGroupLabel>Product</SidebarGroupLabel>
                                        <SidebarLink href="#overview" active>
                                            <NavGlyph name="search" />
                                            Overview
                                        </SidebarLink>
                                        <SidebarLink href="#components">
                                            <NavGlyph name="folder-open" />
                                            Components
                                        </SidebarLink>
                                        <SidebarLink href="#tokens">
                                            <NavGlyph name="calendar" />
                                            Tokens
                                        </SidebarLink>
                                    </SidebarGroup>
                                    <SidebarGroup>
                                        <SidebarGroupLabel>Account</SidebarGroupLabel>
                                        <SidebarLink href="#settings">
                                            <NavGlyph name="settings" />
                                            Settings
                                        </SidebarLink>
                                    </SidebarGroup>
                                </SidebarNav>
                            </SidebarContent>
                            <SidebarFooter>
                                <SidebarLink href="#account">
                                    <NavGlyph name="person" />
                                    Pelagornis
                                </SidebarLink>
                            </SidebarFooter>
                        </Sidebar>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={68} minSize={30} className="flex">
                        <Box
                            background="surfaceSunken"
                            padding="sizeLarge"
                            className="flex min-h-0 min-w-0 flex-1 items-center justify-center"
                        >
                            <Text variant="bodySm" className="text-refineui-alias-foreground-secondary">
                                Main
                            </Text>
                        </Box>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </Look>
        </Looks>
    );
}
