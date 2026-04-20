export const dialogStyles = {
    root: "fixed inset-0 z-refineui-messages flex items-center justify-center p-refineui-size-large",
    scrim: "absolute inset-0 cursor-pointer transition-opacity",
    panel:
        "relative box-border flex max-h-refineui-dialog-max-height-viewport w-full flex-col overflow-hidden rounded-refineui-large bg-refineui-alias-background-primary p-refineui-size-xxlarge shadow-refineui-8light outline-none",
    panelScrollWrap: "flex min-h-0 min-w-0 flex-1 flex-col gap-refineui-size-large overflow-y-auto",
    header: "flex shrink-0 items-start justify-between gap-refineui-size-small",
    headerMain: "flex min-w-0 flex-1 flex-col gap-refineui-size-small",
    title: "refineui-typo-sub-title-2 m-0 min-w-0 text-refineui-alias-foreground-primary",
    description: "refineui-typo-body-4 m-0 min-w-0 text-refineui-alias-foreground-secondary",
} as const;

