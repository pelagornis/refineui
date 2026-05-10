export const tabsStyles = {
    list: "box-border inline-flex max-w-full w-fit flex-wrap items-start gap-refineui-size-none rounded-refineui-circle border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-surface-active p-refineui-size-small",
    trigger:
        "refineui-typo-caption-1 box-border inline-flex min-h-0 min-w-0 flex-[0_1_auto] items-center gap-refineui-size-x-small rounded-refineui-circle border-none p-refineui-size-small outline-none",
    triggerDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    triggerEnabled: "cursor-pointer text-refineui-alias-foreground-primary",
    triggerSelectedShadow: "shadow-refineui-2light",
    triggerSelectedEnabled: "bg-refineui-alias-background-surface",
    triggerSelectedDisabled: "bg-refineui-alias-background-surface-disabled",
    triggerUnselected: "bg-transparent",
} as const;

