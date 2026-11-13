import { clsx } from "clsx";

export const sidebarPeekStyles = {
    root: "relative h-full w-full min-h-0 min-w-0",
    edgeContained: clsx(
        "absolute inset-y-0 inset-inline-start-0 z-[calc(var(--refineui-z-floating)-1)] data-[sidebar-peek-edge-suspended]:pointer-events-none",
        "w-refineui-foundation-size-120",
    ),
    edgeViewport: clsx(
        "fixed inset-inline-start-0 inset-block-end-0 z-[calc(var(--refineui-z-floating)-1)] data-[sidebar-peek-edge-suspended]:pointer-events-none",
        "w-refineui-foundation-size-120",
        "top-[var(--refineui-sidebar-peek-viewport-offset,0px)]",
    ),
    surfaceContained: clsx(
        "group/sidebar-peek-surface absolute z-refineui-floating flex min-h-0 box-border pointer-events-none invisible",
        "inset-y-[calc(var(--refineui-spacing-size-small)-var(--refineui-spacing-size-x-small))]",
        "start-[calc(var(--refineui-size-foundation-size-120)-var(--refineui-spacing-size-x-small))]",
        "w-[calc(var(--refineui-sidebar-peek-panel-width)+2*var(--refineui-spacing-size-x-small))]",
        "p-refineui-size-x-small",
        "translate-x-[calc(-100%-var(--refineui-size-foundation-size-120)+var(--refineui-spacing-size-x-small))]",
        "transition-[translate,visibility] duration-refineui-overlay ease-refineui-standard motion-reduce:transition-none",
        "data-[sidebar-peek-panel-open]:pointer-events-auto data-[sidebar-peek-panel-open]:visible data-[sidebar-peek-panel-open]:translate-x-0",
    ),
    surfaceViewport: clsx(
        "group/sidebar-peek-surface fixed z-refineui-floating flex min-h-0 box-border pointer-events-none invisible",
        "bottom-[calc(var(--refineui-spacing-size-small)-var(--refineui-spacing-size-x-small))]",
        "start-[calc(var(--refineui-size-foundation-size-120)-var(--refineui-spacing-size-x-small))]",
        "top-[calc(var(--refineui-sidebar-peek-viewport-offset,0px)+var(--refineui-spacing-size-small)-var(--refineui-spacing-size-x-small))]",
        "w-[calc(var(--refineui-sidebar-peek-panel-width)+2*var(--refineui-spacing-size-x-small))]",
        "p-refineui-size-x-small",
        "translate-x-[calc(-100%-var(--refineui-size-foundation-size-120)+var(--refineui-spacing-size-x-small))]",
        "transition-[translate,visibility] duration-refineui-overlay ease-refineui-standard motion-reduce:transition-none",
        "data-[sidebar-peek-panel-open]:pointer-events-auto data-[sidebar-peek-panel-open]:visible data-[sidebar-peek-panel-open]:translate-x-0",
    ),
    panel: clsx(
        "box-border flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden pointer-events-auto",
        "rounded-refineui-xx-large border-refineui-hairline border-refineui-alias-border-default",
        "bg-refineui-alias-surface-frosted backdrop-blur-refineui-surface-frost",
        "shadow-refineui-16 transition-shadow duration-refineui-overlay ease-refineui-standard motion-reduce:transition-none",
        "group-data-[sidebar-peek-panel-open]/sidebar-peek-surface:shadow-refineui-24",
        "[&_[data-refineui=sidebar]]:h-full [&_[data-refineui=sidebar]]:border-e-0 [&_[data-refineui=sidebar]]:rounded-inherit [&_[data-refineui=sidebar]]:bg-transparent",
    ),
    toolbar: "flex shrink-0 justify-end px-refineui-size-x-small pt-refineui-size-x-small",
    panelBody: "flex min-h-0 w-full flex-1 flex-col",
    inset: "relative flex min-h-0 min-w-0 flex-1 flex-col",
} as const;
