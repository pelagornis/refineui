import type { CSSProperties, ReactNode, TransitionEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { iconSizes, semanticInteraction } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
import {
    Button,
    SidebarProvider,
    SidebarTrigger,
    ResizablePanel,
    ResizablePanelGroup,
    ScrollArea,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
    SidebarFooter,
    SidebarLink,
    SidebarPeek,
    SidebarPeekEdge,
    SidebarPeekInset,
    SidebarPeekPanel,
    SidebarPeekPin,
    WebIcon,
} from "@refineui/react";
import { SidebarResizeHandle } from "../components/SidebarSeam";
import { DocsSidebar } from "./DocsSidebar";
import type { DocsNavEntry } from "./nav";

const STORAGE_KEY = "refineui-docs-sidebar-size";
const COLLAPSED_KEY = "refineui-docs-sidebar-collapsed";
const DOCS_SIDEBAR_ID = "refineui-docs-sidebar";
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

/** Layout effects on the client (before paint), plain effects during SSR. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Set by the inline boot script in PageFrame.astro; holds the stored rail size until hydration. */
const BOOT_ATTR = "data-docs-sidebar-boot";
const SCROLL_KEY = "refineui-docs-sidebar-scroll";

/**
 * Runs inline while the server HTML is parsed, right after the docked rail: restores
 * the rail's scroll offset from the previous page (or brings the active link into
 * view) before first paint, and saves it again when the page is left.
 */
const RESTORE_SCROLL_SCRIPT = `(function(){try{var v=document.querySelector('#${DOCS_SIDEBAR_ID} [data-refineui="scroll-area-viewport"]');if(!v)return;var k='${SCROLL_KEY}';var raw=sessionStorage.getItem(k);if(raw!==null){v.scrollTop=Number(raw)||0;}else{var a=v.querySelector('[aria-current="page"]');if(a){var r=a.getBoundingClientRect(),b=v.getBoundingClientRect();if(r.bottom>b.bottom||r.top<b.top)v.scrollTop+=r.top-b.top-b.height/3;}}window.addEventListener('pagehide',function(){var c=document.querySelector('#${DOCS_SIDEBAR_ID} [data-refineui="scroll-area-viewport"]');if(c)sessionStorage.setItem(k,String(Math.round(c.scrollTop)));});}catch(e){}})();`;

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
        <ScrollArea type="scroll" data-docs-shell-main className="h-full w-full min-h-0">
            <ScrollAreaViewport>{children}</ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical">
                <ScrollAreaThumb />
            </ScrollAreaScrollbar>
        </ScrollArea>
    );
}

function DocsShellSidebar({
    id,
    title,
    titleHref,
    entries,
    githubHref,
}: Pick<ShellProps, "title" | "titleHref" | "entries" | "githubHref"> & {
    id?: string;
}) {
    const sidebar = (
        <DocsSidebar
            id={id}
            title={title}
            titleHref={titleHref}
            entries={entries}
            footer={
                githubHref ? (
                    <SidebarFooter>
                        <SidebarLink href={githubHref} target="_blank" rel="noreferrer">
                            GitHub
                        </SidebarLink>
                    </SidebarFooter>
                ) : null
            }
        />
    );
    if (id !== DOCS_SIDEBAR_ID) return sidebar;
    return (
        <>
            {sidebar}
            <script
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: RESTORE_SCROLL_SCRIPT }}
            />
        </>
    );
}

function DocsShellMain({ collapsed, children }: { collapsed: boolean; children?: ReactNode }) {
    return (
        <SidebarPeekInset>
            <SidebarTrigger
                layout="icon"
                size="sm"
                data-docs-sidebar-toggle
                aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
            >
                <WebIcon name="panel-left" size={iconSizes.small} color="currentColor" fallback="☰" />
            </SidebarTrigger>
            <DocsMainScroll>{children}</DocsMainScroll>
        </SidebarPeekInset>
    );
}

/**
 * Desktop shell only — mounts after media match so stored size / collapsed
 * are read once. Button collapse animates flex-grow with panel motion tokens.
 */
function DocsDesktopShell({ title, titleHref, entries, githubHref, children }: ShellProps) {
    /*
     * First render uses the defaults on server and client alike so hydration matches;
     * the stored size/collapsed state is applied in a layout effect (before paint).
     * Until then the boot attribute's CSS shows the stored layout on the server HTML.
     */
    const restoredSize = useRef(DEFAULT_SIDEBAR);
    const [sidebarSize, setSidebarSize] = useState(DEFAULT_SIDEBAR);
    const [collapsed, setCollapsed] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [frozenRailWidth, setFrozenRailWidth] = useState<number | null>(null);
    const [resizeHandleOpen, setResizeHandleOpen] = useState(true);
    const motionTimerRef = useRef<number | null>(null);
    const sidebarRailRef = useRef<HTMLDivElement>(null);

    useIsomorphicLayoutEffect(() => {
        const storedSize = readStoredSize();
        const storedCollapsed = readStoredCollapsed();
        restoredSize.current = storedSize;
        setSidebarSize(storedCollapsed ? 0 : storedSize);
        setCollapsed(storedCollapsed);
        setResizeHandleOpen(!storedCollapsed);
        document.documentElement.removeAttribute(BOOT_ATTR);
    }, []);

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
        setFrozenRailWidth(null);
        setResizeHandleOpen(false);
        persistCollapsed(true);
    };

    const finishExpand = () => {
        clearMotionTimer();
        setSidebarSize(restoredSize.current);
        setAnimating(false);
        setCollapsed(false);
        setFrozenRailWidth(null);
        setResizeHandleOpen(true);
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
        setFrozenRailWidth(null);
        setResizeHandleOpen(false);
        persistCollapsed(true);
    };

    const collapseAnimated = () => {
        if (collapsed || animating) return;
        if (sidebarSize > COLLAPSE_AT) {
            persistSize(sidebarSize);
        }
        setFrozenRailWidth(sidebarRailRef.current?.getBoundingClientRect().width ?? null);
        setResizeHandleOpen(false);
        setCollapsed(true);
        runPanelMotion(0, finishCollapse);
    };

    const expandAnimated = () => {
        if (!collapsed || animating) return;
        setSidebarSize(0);
        setResizeHandleOpen(true);
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
    const peekEligible = collapsed && !animating;

    const sidebarBlock = (docked: boolean) => (
        <DocsShellSidebar
            id={docked ? DOCS_SIDEBAR_ID : undefined}
            title={title}
            titleHref={titleHref}
            entries={entries}
            githubHref={githubHref}
        />
    );

    return (
        <SidebarPeek
            enabled={peekEligible}
            widthPercent={restoredSize.current}
            mode="contained"
            onPin={expandAnimated}
            className="relative h-full w-full min-h-0"
        >
            <SidebarProvider
                id={DOCS_SIDEBAR_ID}
                open={!collapsed}
                onOpenChange={(open) => {
                    if (animating) return;
                    if (open) expandAnimated();
                    else collapseAnimated();
                }}
            >
            <ResizablePanelGroup
                orientation="horizontal"
                data-docs-shell="desktop"
                data-docs-sidebar-collapsed={collapsed && !animating ? "" : undefined}
                data-docs-shell-animating={animating ? "" : undefined}
                className="relative h-full w-full min-h-0"
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
                >
                    {railOpen ? (
                        <div
                            ref={sidebarRailRef}
                            data-docs-shell-sidebar
                            className="flex h-full min-h-0 w-full"
                            style={
                                frozenRailWidth == null
                                    ? undefined
                                    : { width: frozenRailWidth, flex: "0 0 auto" }
                            }
                        >
                            {sidebarBlock(true)}
                        </div>
                    ) : null}
                </ResizablePanel>
                {railOpen ? <SidebarResizeHandle animating={animating} open={resizeHandleOpen} /> : null}
                <ResizablePanel
                    size={100 - sidebarSize}
                    minSize={collapsed && !animating ? 100 : 50}
                    className="relative flex min-h-0 min-w-0"
                    style={panelMotionStyle}
                >
                    <DocsShellMain collapsed={collapsed}>{children}</DocsShellMain>
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
                                    name="panel-left"
                                    size={iconSizes.small}
                                    color="currentColor"
                                    fallback="☰"
                                />
                            </Button>
                        </SidebarPeekPin>
                        <div data-docs-shell-sidebar className="flex min-h-0 w-full flex-1">
                            {sidebarBlock(false)}
                        </div>
                    </SidebarPeekPanel>
                </ResizablePanel>
            </ResizablePanelGroup>
            </SidebarProvider>
        </SidebarPeek>
    );
}

/**
 * Docs page shell — RefineUI Sidebar + Resizable + ScrollArea.
 */
export function DocsShell(props: ShellProps) {
    /*
     * Desktop-first: the server HTML already contains the rail so it paints in its final
     * place (no pop-in/shift on hydration). Mobile hides it with CSS until this flips.
     */
    const [desktop, setDesktop] = useState(true);

    useIsomorphicLayoutEffect(() => {
        const media = window.matchMedia(DESKTOP_MQ);
        const sync = () => setDesktop(media.matches);
        sync();
        media.addEventListener("change", sync);
        return () => media.removeEventListener("change", sync);
    }, []);

    if (!desktop) {
        return (
            <div data-docs-shell="mobile" className="w-full min-w-0">
                {props.children}
            </div>
        );
    }

    return <DocsDesktopShell {...props} />;
}
