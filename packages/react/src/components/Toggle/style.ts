export const toggleStyles = {
    root: "box-border flex w-refineui-switch-width items-center rounded-refineui-x-large border-none p-refineui-switch-padding transition-colors duration-[var(--refineui-motion-duration-medium)]",
    /** OFF rest — Web Kit track fill off */
    unchecked: "cursor-pointer bg-refineui-alias-background-primary-active",
    /** ON rest */
    checked: "cursor-pointer bg-refineui-alias-background-brand",
    /** Disabled OFF — muted empty track */
    disabledUnchecked: "cursor-not-allowed bg-refineui-alias-background-surface-disabled",
    /** Disabled ON — muted brand so on/off stay distinguishable */
    disabledChecked: "cursor-not-allowed bg-refineui-alias-background-brand-subtle",
    thumb: "block h-refineui-switch-thumb w-refineui-switch-thumb rounded-refineui-x-large shadow-refineui-2 transition-[transform,background-color] duration-[var(--refineui-motion-duration-medium)]",
    thumbDefault: "bg-refineui-alias-background-primary",
    /** Disabled OFF thumb — slightly darker than track */
    thumbDisabledUnchecked: "bg-refineui-alias-background-brand-subtle shadow-none",
    /** Disabled ON thumb — keep white chip, no elevation */
    thumbDisabledChecked: "bg-refineui-alias-background-primary shadow-none",
} as const;
