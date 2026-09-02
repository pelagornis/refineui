import { clsx } from "clsx";

export const sidebarPeekStyles = {
    root: "relative h-full w-full min-h-0 min-w-0",
    edgeContained: clsx(
        "absolute inset-y-0 inset-inline-start-0 z-[calc(var(--refineui-z-floating)-1)]",
        "w-refineui-foundation-size-120",
    ),
    edgeViewport: clsx(
        "fixed inset-inline-start-0 inset-block-end-0 z-[calc(var(--refineui-z-floating)-1)]",
        "w-refineui-foundation-size-120",
        "top-[var(--refineui-sidebar-peek-viewport-offset,0px)]",
    ),
    surfaceContained: clsx("absolute z-refineui-floating flex min-h-0"),
    surfaceViewport: clsx("fixed z-refineui-floating flex min-h-0"),
    panel: clsx("box-border flex min-h-0 w-full flex-1 flex-col overflow-hidden"),
    toolbar: "flex shrink-0 justify-end px-refineui-size-x-small pt-refineui-size-x-small",
    panelBody: "flex min-h-0 w-full flex-1 flex-col",
    inset: "relative flex min-h-0 min-w-0 flex-1 flex-col",
} as const;
