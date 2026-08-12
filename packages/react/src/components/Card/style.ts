export const cardStyles = {
    root: "box-border flex flex-col gap-refineui-size-none rounded-refineui-xxlarge border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary",
    elevated: "shadow-refineui-4light",
    outlined: "",
    stateDefault: "border-refineui-alias-border-default bg-refineui-alias-background-primary",
    stateHover: "border-refineui-alias-border-default bg-refineui-alias-background-primary-hover",
    statePressed: "border-refineui-alias-border-strong bg-refineui-alias-background-surface-active",
    stateDisabled: "border-refineui-alias-border-disabled bg-refineui-alias-background-surface-disabled",
    interactive: "transition-colors hover:border-refineui-alias-border-default hover:bg-refineui-alias-background-primary-hover active:border-refineui-alias-border-strong active:bg-refineui-alias-background-surface-active",
    headerMain: "flex min-w-0 flex-1 flex-col gap-refineui-size-x-small",
    header:
        "flex flex-row flex-wrap items-start justify-between gap-refineui-size-medium px-refineui-size-xlarge py-refineui-size-large",
    title: "refineui-typo-title-3 text-refineui-alias-foreground-primary",
    description: "refineui-typo-body-2 text-refineui-alias-foreground-tertiary",
    action: "flex shrink-0 items-center justify-end",
    content: "px-refineui-size-xlarge pb-refineui-size-large",
    footer: "flex items-center justify-end p-refineui-size-medium",
} as const;
