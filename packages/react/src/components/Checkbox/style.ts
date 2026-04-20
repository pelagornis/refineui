export const checkboxStyles = {
    root: "inline-flex gap-refineui-size-small",
    textTop: "items-start",
    textCenter: "items-center",
    disabledCursor: "cursor-not-allowed",
    enabledCursor: "cursor-pointer",
    controlWrap: "relative size-refineui-control-checkbox shrink-0",
    controlWrapDesc: "mt-refineui-size-xxsmall",
    input: "absolute inset-0 z-1 m-0 h-full w-full cursor-pointer opacity-0 outline-none",
    inputDisabled: "cursor-not-allowed",
    visual: "pointer-events-none absolute inset-0 box-border flex items-center justify-center",
    textCol: "flex min-w-0 flex-col gap-refineui-size-small",
    label: "refineui-typo-body-2",
    desc: "refineui-typo-caption-2",
    textEnabled: "text-refineui-alias-foreground-primary",
    textDisabled: "text-refineui-alias-foreground-disabled",
    descEnabled: "text-refineui-alias-foreground-secondary",
} as const;

