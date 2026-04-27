export const menuStyles = {
    panel:
        "box-border flex w-refineui-menu-panel-width flex-col gap-refineui-size-xxsmall rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-surface p-refineui-size-xsmall shadow-refineui-2light",
    root: "relative inline-block",
    triggerFallback: "cursor-pointer border-none bg-transparent p-0 font-inherit text-inherit",
    popover: "absolute top-full left-0 z-refineui-popup pt-refineui-size-xsmall",
    list:
        "box-border flex w-full flex-col gap-refineui-size-xxsmall rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-surface p-refineui-size-xsmall shadow-refineui-2light",
    section: "flex w-full items-center overflow-hidden px-refineui-size-small py-refineui-size-medium",
    sectionText: "refineui-typo-caption-1 text-refineui-alias-foreground-primary",
    dividerWrap: "flex w-full items-center px-refineui-size-small py-refineui-size-xxsmall",
    dividerLine: "w-full border-t border-refineui-hairline border-refineui-alias-border-default",
    itemBase: "block w-full rounded-refineui-xlarge border-none bg-transparent p-refineui-size-small text-left",
    itemDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    itemEnabled: "cursor-pointer text-refineui-alias-foreground-primary",
    row: "flex items-center gap-refineui-size-small",
    iconWrap: "inline-flex shrink-0 items-center justify-center [&>span]:leading-none",
    textCol: "flex min-w-0 flex-1 flex-col px-refineui-size-xxsmall",
    title: "refineui-typo-body-2 truncate",
    description: "refineui-typo-body-4 truncate",
    descriptionEnabled: "text-refineui-alias-foreground-primary",
    descriptionDisabled: "text-refineui-alias-foreground-disabled",
    rightWrap: "flex shrink-0 items-center gap-refineui-size-small",
    shortcut: "refineui-typo-body-4 text-refineui-alias-foreground-primary",
} as const;

