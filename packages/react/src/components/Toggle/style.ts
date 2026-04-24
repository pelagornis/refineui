export const toggleStyles = {
    root: "box-border flex w-refineui-switch-width items-center rounded-refineui-xlarge border-none p-refineui-switch-padding transition-colors duration-[var(--refineui-motion-duration-medium)]",
    disabled: "cursor-not-allowed bg-refineui-alias-background-brand-disabled",
    checked: "cursor-pointer bg-refineui-alias-background-brand",
    unchecked: "cursor-pointer bg-refineui-alias-background-primary-active",
    thumb: "block h-refineui-switch-thumb w-refineui-switch-thumb rounded-refineui-xlarge transition-[transform,background-color] duration-[var(--refineui-motion-duration-medium)]",
    thumbDisabled: "bg-refineui-alias-background-brand-subtle",
    thumbDefault: "bg-refineui-alias-background-primary",
} as const;

