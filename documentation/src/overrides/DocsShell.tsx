import type { CSSProperties, ReactNode, TransitionEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { iconSizes, semanticInteraction } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
import {
    Button,
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    ScrollArea,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
    SidebarFooter,
    SidebarLink,
    WebIcon,
} from "@refineui/react";
import { DocsSidebar } from "./DocsSidebar";
import type { DocsNavEntry } from "./nav";

const STORAGE_KEY = "refineui-docs-sidebar-size";
const COLLAPSED_KEY = "refineui-docs-sidebar-collapsed";
const DESKTOP_MQ = "(min-width: 50rem)";
const DEFAULT_SIDEBAR = 22;
const MIN_SIDEBAR = 14;
const MAX_SIDEBAR = 36;
/** Drag / Home to ~0% collapses the rail (float noise). */
const COLLAPSE_AT = 1;

const PANEL_MS = motionMsToNumber(semanticInteraction.duration.panel);
const PANEL_EASING = semanticInteraction.easing.panel;

function readStoredSize(): number {
    if (typeof window === "undefined") return DEFAULT_SIDEBAR;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw == null ? Number.NaN : Number(raw);
    if (!Number.isFinite(parsed)) return DEFAULT_SIDEBAR;
    return Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, parsed));
}

function readStoredCollapsed(): boolean {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSED_KEY) === "1";
}

function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clampSidebarSize(size: number): number {
    return Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, size));
}

type ShellProps = {
    title: string;
    titleHref: string;
    entries: DocsNavEntry[];
    githubHref?: string;
    children?: ReactNode;
};

function DocsMainScroll({ children }: { children?: ReactNode }) {
    return (
        <ScrollArea type="hover" data-docs-shell-main className="h-full w-full min-h-0">
            <ScrollAreaViewport>{children}</ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical">
                <ScrollAreaThumb />
            </ScrollAreaScrollbar>
        </ScrollArea>
    );
}

/**
 * Desktop shell only — mounts after media match so stored size / collapsed
 * are read once. Button collapse animates flex-grow with panel motion tokens.
 */
function DocsDesktopShell({ title, titleHref, entries, githubHref, children }: ShellProps) {
    const restoredSize = useRef(readStoredSize());
    const [sidebarSize, setSidebarSize] = useState(() =>
        readStoredCollapsed() ? 0 : restoredSize.current,
    );
    const [collapsed, setCollapsed] = useState(readStoredCollapsed);
    const [animating, setAnimating] = useState(false);
    const motionTimerRef = useRef<number | null>(null);

    const clearMotionTimer = () => {
        if (motionTimerRef.current != null) {
            window.clearTimeout(motionTimerRef.current);
            motionTimerRef.current = null;
        }
    };

    useEffect(() => () => clearMotionTimer(), []);

    const persistCollapsed = (next: boolean) => {
        window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
    };

    const persistSize = (next: number) => {
        const clamped = clampSidebarSize(next);
        restoredSize.current = clamped;
        window.localStorage.setItem(STORAGE_KEY, String(clamped));
    };

    const finishCollapse = () => {
        clearMotionTimer();
        setSidebarSize(0);
        setAnimating(false);
        setCollapsed(true);
        persistCollapsed(true);
    };

    const finishExpand = () => {
        clearMotionTimer();
        setSidebarSize(restoredSize.current);
        setAnimating(false);
        setCollapsed(false);
        persistCollapsed(false);
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
        persistCollapsed(true);
    };

    const collapseAnimated = () => {
        if (collapsed || animating) return;
        if (sidebarSize > COLLAPSE_AT) {
            persistSize(sidebarSize);
        }
        runPanelMotion(0, finishCollapse);
    };

    const expandAnimated = () => {
        if (!collapsed || animating) return;
        setCollapsed(false);
        setSidebarSize(0);
        runPanelMotion(restoredSize.current, finishExpand);
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

    return (
        <ResizablePanelGroup
            orientation="horizontal"
            data-docs-shell="desktop"
            data-docs-sidebar-collapsed={collapsed && !animating ? "" : undefined}
            data-docs-shell-animating={animating ? "" : undefined}
            className="relative w-full min-h-0"
            onLayout={(sizes) => {
                if (animating || collapsed) return;
                const next = sizes[0];
                if (next == null) return;
                if (next <= COLLAPSE_AT) {
                    collapseInstant();
                    return;
                }
                setSidebarSize(next);
                persistSize(next);
            }}
        >
            <ResizablePanel
                size={sidebarSize}
                minSize={0}
                maxSize={collapsed && !animating ? 0 : MAX_SIDEBAR}
                className="flex min-h-0 overflow-hidden"
                style={panelMotionStyle}
                onTransitionEnd={handleSidebarTransitionEnd}
                aria-hidden={collapsed && !animating}
            >
                {railOpen ? (
                    <div data-docs-shell-sidebar className="flex h-full min-h-0 w-full">
                        <DocsSidebar
                            title={title}
                            titleHref={titleHref}
                            entries={entries}
                            onCollapse={collapseAnimated}
                            footer={
                                githubHref ? (
                                    <SidebarFooter>
                                        <SidebarLink
                                            href={githubHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            GitHub
                                        </SidebarLink>
                                    </SidebarFooter>
                                ) : null
                            }
                        />
                    </div>
                ) : null}
            </ResizablePanel>
            {railOpen ? <ResizableHandle withHandle disabled={animating} /> : null}
            <ResizablePanel
                size={100 - sidebarSize}
                minSize={collapsed && !animating ? 100 : 50}
                className="relative flex min-h-0 min-w-0"
                style={panelMotionStyle}
            >
                {collapsed && !animating ? (
                    <Button
                        type="button"
                        variant="ghost"
                        layout="icon"
                        size="sm"
                        data-docs-sidebar-expand
                        aria-label="Open sidebar"
                        aria-expanded={false}
                        onClick={expandAnimated}
                    >
                        <WebIcon
                            name="chevron-right"
                            size={iconSizes.small}
                            color="currentColor"
                            fallback="›"
                        />
                    </Button>
                ) : null}
                <DocsMainScroll>{children}</DocsMainScroll>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}

/**
 * Docs page shell — RefineUI Sidebar + Resizable + ScrollArea.
 */
export function DocsShell(props: ShellProps) {
    const [desktop, setDesktop] = useState<boolean | null>(null);

    useEffect(() => {
        const media = window.matchMedia(DESKTOP_MQ);
        const sync = () => setDesktop(media.matches);
        sync();
        media.addEventListener("change", sync);
        return () => media.removeEventListener("change", sync);
    }, []);

    if (desktop !== true) {
        return (
            <div
                data-docs-shell={desktop === false ? "mobile" : "pending"}
                className="w-full min-w-0"
            >
                {props.children}
            </div>
        );
    }

    return <DocsDesktopShell {...props} />;
}
