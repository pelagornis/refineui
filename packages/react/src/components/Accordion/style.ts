export const accordionStyles = {
    triggerBase:
        "flex min-h-refineui-control-touch-min w-full cursor-pointer items-center justify-between gap-refineui-size-medium border-none bg-transparent px-refineui-size-medium py-refineui-size-small text-left text-refineui-alias-foreground-primary",
    triggerRow: "flex min-w-0 flex-1 items-center gap-refineui-size-medium",
    panelOuter: "min-h-0 overflow-hidden",
    panelInner: "0 var(--refineui-spacing-size-medium) var(--refineui-spacing-size-medium)",
} as const;

export const triggerTypo = {
    small: "refineui-typo-caption-1",
    medium: "refineui-typo-body-1",
    large: "refineui-typo-sub-title-1",
} as const;

