import type { CSSProperties, TransitionEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { iconSizes, semanticInteraction } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
import {
    Box,
    Button,
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
    SidebarPeek,
    SidebarPeekEdge,
    SidebarPeekInset,
    SidebarPeekPanel,
    SidebarPeekPin,
    Text,
    WebIcon,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

const DEFAULT_SIDEBAR = 32;
const MAX_SIDEBAR = 48;
const COLLAPSE_AT = 1;
const PANEL_MS = motionMsToNumber(semanticInteraction.duration.panel);
const PANEL_EASING = semanticInteraction.easing.panel;

function clampSidebarSize(size: number): number {
    return Math.min(MAX_SIDEBAR, Math.max(18, size));
}

function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function NavGlyph({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.small} color="currentColor" aria-hidden />;
}

function SidebarRail() {
    return (
        <Sidebar className="h-full min-h-0">
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
    );
}

export default function SidebarPreview() {
    const restoredSize = useRef(DEFAULT_SIDEBAR);
    const [sidebarSize, setSidebarSize] = useState(DEFAULT_SIDEBAR);
    const [collapsed, setCollapsed] = useState(false);
    const [animating, setAnimating] = useState(false);
    const motionTimerRef = useRef<number | null>(null);

    const clearMotionTimer = () => {
        if (motionTimerRef.current != null) {
            window.clearTimeout(motionTimerRef.current);
            motionTimerRef.current = null;
        }
    };

    useEffect(() => () => clearMotionTimer(), []);

    const finishCollapse = () => {
        clearMotionTimer();
        setSidebarSize(0);
        setAnimating(false);
        setCollapsed(true);
    };

    const finishExpand = () => {
        clearMotionTimer();
        setSidebarSize(restoredSize.current);
        setAnimating(false);
        setCollapsed(false);
    };

    const runPanelMotion = (toSize: number, onDone: () => void) => {
        clearMotionTimer();
        if (prefersReducedMotion()) {
            setSidebarSize(toSize);
            onDone();
            return;
        }
        setAnimating(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setSidebarSize(toSize);
                motionTimerRef.current = window.setTimeout(onDone, PANEL_MS + 32);
            });
        });
    };

    const collapseInstant = () => {
        clearMotionTimer();
        setAnimating(false);
        setSidebarSize(0);
        setCollapsed(true);
    };

    const collapseAnimated = () => {
        if (collapsed || animating) return;
        if (sidebarSize > COLLAPSE_AT) {
            restoredSize.current = clampSidebarSize(sidebarSize);
        }
        runPanelMotion(0, finishCollapse);
    };

    const expandAnimated = () => {
        if (!collapsed || animating) return;
        setCollapsed(false);
        setSidebarSize(0);
        runPanelMotion(restoredSize.current, finishExpand);
    };

    const toggleSidebar = () => {
        if (animating) return;
        if (collapsed) expandAnimated();
        else collapseAnimated();
    };

    const handleSidebarTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
        if (!animating) return;
        if (event.propertyName !== "flex-grow") return;
        if (event.target !== event.currentTarget) return;
        if (sidebarSize <= COLLAPSE_AT) {
            finishCollapse();
            return;
        }
        finishExpand();
    };

    const panelMotionStyle: CSSProperties | undefined = animating
        ? {
              transitionProperty: "flex-grow",
              transitionDuration: `${PANEL_MS}ms`,
              transitionTimingFunction: PANEL_EASING,
          }
        : undefined;

    const railOpen = !collapsed || animating;
    const peekEligible = collapsed && !animating;

    return (
        <Looks>
            <Look align="fill">
                <SidebarPeek
                    enabled={peekEligible}
                    widthPercent={restoredSize.current}
                    mode="contained"
                    onPin={expandAnimated}
                    className="h-refineui-foundation-size-4500 w-full"
                >
                    <ResizablePanelGroup
                        orientation="horizontal"
                        data-sidebar-preview=""
                        data-sidebar-preview-collapsed={collapsed && !animating ? "" : undefined}
                        data-sidebar-preview-animating={animating ? "" : undefined}
                        className="h-full w-full"
                        onLayout={(sizes) => {
                            if (animating || collapsed) return;
                            const next = sizes[0];
                            if (next == null) return;
                            if (next <= COLLAPSE_AT) {
                                collapseInstant();
                                return;
                            }
                            setSidebarSize(next);
                        }}
                    >
                        <ResizablePanel
                            size={sidebarSize}
                            minSize={0}
                            maxSize={collapsed && !animating ? 0 : MAX_SIDEBAR}
                            className="flex min-h-0 min-w-0 overflow-hidden"
                            style={panelMotionStyle}
                            onTransitionEnd={handleSidebarTransitionEnd}
                            aria-hidden={collapsed && !animating}
                        >
                            {railOpen ? (
                                <div className="flex h-full min-h-0 w-full min-w-0">
                                    <SidebarRail />
                                </div>
                            ) : null}
                        </ResizablePanel>
                        {railOpen ? <ResizableHandle withHandle disabled={animating} /> : null}
                        <ResizablePanel
                            size={100 - sidebarSize}
                            minSize={collapsed && !animating ? 100 : 30}
                            className="relative flex min-h-0 min-w-0"
                            style={panelMotionStyle}
                        >
                            <SidebarPeekInset>
                                {!animating ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        layout="icon"
                                        size="sm"
                                        data-sidebar-preview-toggle
                                        aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
                                        aria-expanded={!collapsed}
                                        onClick={toggleSidebar}
                                    >
                                        <WebIcon
                                            name={collapsed ? "chevron-right" : "chevron-left"}
                                            size={iconSizes.small}
                                            color="currentColor"
                                            fallback={collapsed ? "›" : "‹"}
                                        />
                                    </Button>
                                ) : null}
                                <Box
                                    background="surfaceSunken"
                                    padding="sizeLarge"
                                    className="flex min-h-0 min-w-0 flex-1 items-center justify-center"
                                >
                                    <Text variant="bodySm" className="text-refineui-alias-foreground-secondary">
                                        Main
                                    </Text>
                                </Box>
                            </SidebarPeekInset>
                            <SidebarPeekEdge />
                            <SidebarPeekPanel>
                                <SidebarPeekPin>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        layout="icon"
                                        size="sm"
                                        aria-label="Pin sidebar open"
                                        onClick={expandAnimated}
                                    >
                                        <WebIcon
                                            name="chevron-right"
                                            size={iconSizes.small}
                                            color="currentColor"
                                            fallback="›"
                                        />
                                    </Button>
                                </SidebarPeekPin>
                                <div className="flex min-h-0 w-full flex-1">
                                    <SidebarRail />
                                </div>
                            </SidebarPeekPanel>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </SidebarPeek>
            </Look>
        </Looks>
    );
}
