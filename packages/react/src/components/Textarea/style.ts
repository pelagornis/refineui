export const textareaStyles = {
    base: "refineui-typo-body-2 min-h-refineui-control-textarea-min resize-y rounded-refineui-large px-refineui-size-small py-refineui-size-medium text-refineui-alias-foreground-primary placeholder:text-refineui-alias-foreground-placeholder outline-none transition-[border-color,box-shadow,background-color] duration-[var(--refineui-motion-duration-fast)]",
    bgDisabled: "bg-refineui-alias-background-surface-disabled",
    bgDefault: "bg-refineui-alias-background-primary",
} as const;

export const textareaBorderClass = {
    disabled: "border-refineui-thin border-refineui-alias-border-default",
    error: "border-refineui-thin border-refineui-alias-background-error",
    success: "border-refineui-thin border-refineui-alias-background-success",
    default: "border-refineui-thin border-refineui-alias-border-default",
} as const;

