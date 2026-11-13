export const toggleStyles = {
    root: "box-border flex w-refineui-switch-width items-center rounded-refineui-x-large border-none p-refineui-switch-padding transition-colors duration-[var(--refineui-motion-duration-medium)] focus-visible:outline-[length:var(--refineui-stroke-width-thick)] focus-visible:outline-refineui-alias-border-focus focus-visible:outline-offset-refineui-size-xxx-small",
    /** OFF rest — Web Kit track fill off */
    unchecked: "cursor-pointer bg-refineui-alias-background-primary-active hover:bg-refineui-alias-background-surface-selected active:bg-refineui-alias-background-brand-subtle",
    /** ON rest */
    checked: "cursor-pointer bg-refineui-alias-background-brand hover:bg-refineui-alias-background-brand-hover active:bg-refineui-alias-background-brand-active",
    /** Disabled OFF — muted empty track */
    disabledUnchecked: "cursor-not-allowed bg-refineui-alias-background-surface-disabled",
    /** Disabled ON — muted brand so on/off stay distinguishable */
    disabledChecked: "cursor-not-allowed bg-refineui-alias-background-brand-subtle",
    thumb: "block h-refineui-switch-thumb w-refineui-switch-thumb rounded-refineui-x-large shadow-refineui-2 transition-[translate,background-color] duration-[var(--refineui-motion-duration-medium)] ease-[var(--refineui-motion-easing-ease-out)]",
    thumbChecked: "translate-x-refineui-switch-thumb rtl:-translate-x-refineui-switch-thumb",
    thumbDefault: "bg-refineui-alias-background-primary",
    /** Disabled OFF thumb — slightly darker than track */
    thumbDisabledUnchecked: "bg-refineui-alias-background-brand-subtle shadow-none",
    /** Disabled ON thumb — keep white chip, no elevation */
    thumbDisabledChecked: "bg-refineui-alias-background-primary shadow-none",
} as const;
