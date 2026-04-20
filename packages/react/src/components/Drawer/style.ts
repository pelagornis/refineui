export const drawerStyles = {
    root: "fixed inset-0 z-refineui-messages flex",
    rootLeft: "justify-start",
    rootRight: "justify-end",
    scrim: "absolute inset-0 cursor-pointer transition-opacity",
    panel:
        "relative box-border flex h-full flex-col overflow-hidden bg-refineui-alias-background-primary shadow-refineui-16light outline-none",
    header: "flex shrink-0 items-start gap-refineui-size-small px-refineui-size-xxlarge pb-refineui-size-medium pt-refineui-size-xxlarge",
    headerMain: "flex min-h-0 min-w-0 flex-1 items-center gap-refineui-size-small",
    headerMainText: "flex min-w-0 flex-1 flex-col gap-refineui-size-xxsmall",
    headerActions: "flex shrink-0 items-center gap-refineui-size-small",
    title: "refineui-typo-sub-title-1 m-0 min-w-0 text-refineui-alias-foreground-primary",
    description: "refineui-typo-body-4 m-0 min-w-0 text-refineui-alias-foreground-secondary",
    body:
        "refineui-typo-body-2 box-border min-h-0 flex-1 overflow-auto border-t-refineui-thin border-t-refineui-alias-border-default p-refineui-size-xxlarge text-refineui-alias-foreground-primary",
    footer:
        "mt-auto flex shrink-0 items-center justify-end gap-refineui-size-small border-t-refineui-thin border-t-refineui-alias-border-default px-refineui-size-xxlarge py-refineui-size-medium",
} as const;

