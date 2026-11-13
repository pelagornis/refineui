import { labelCompanionStyles } from "../Label/style";

export const checkboxStyles = {
    root: "group inline-flex gap-refineui-size-x-small",
    textTop: "items-start",
    textCenter: "items-center",
    disabledCursor: "cursor-not-allowed",
    enabledCursor: "cursor-pointer",
    controlWrap:
        "relative h-[var(--refineui-size-control-checkbox,20px)] w-[var(--refineui-size-control-checkbox,20px)] shrink-0",
    controlWrapDesc: "mt-refineui-size-xxx-small",
    input: "peer absolute inset-0 z-1 m-0 h-full w-full cursor-pointer opacity-0 outline-none",
    inputDisabled: "cursor-not-allowed",
    visual:
        "pointer-events-none absolute inset-0 box-border flex size-[var(--refineui-size-control-checkbox,20px)] min-h-[var(--refineui-size-control-checkbox,20px)] min-w-[var(--refineui-size-control-checkbox,20px)] items-center justify-center overflow-hidden rounded-[var(--refineui-radius-rounded-large)] border border-refineui-alias-border-default bg-refineui-alias-background-primary transition-[background-color,border-color,border-width] duration-[var(--refineui-motion-duration-fast)] data-[variant=circular]:rounded-refineui-circle data-[checked=true]:border-refineui-alias-background-brand data-[checked=true]:bg-refineui-alias-background-brand group-hover:data-[checked=false]:border-refineui-alias-border-subtle group-active:data-[checked=false]:border-refineui-alias-border-strong group-hover:data-[checked=true]:border-refineui-alias-background-brand-hover group-hover:data-[checked=true]:bg-refineui-alias-background-brand-hover group-active:data-[checked=true]:border-refineui-alias-background-brand-active group-active:data-[checked=true]:bg-refineui-alias-background-brand-active peer-focus-visible:border-2 peer-focus-visible:border-refineui-alias-border-strong peer-focus-visible:bg-refineui-alias-background-primary peer-focus-visible:data-[checked=true]:border-refineui-alias-border-focus peer-focus-visible:data-[checked=true]:bg-refineui-alias-background-brand-active data-[disabled=true]:border-refineui-alias-border-disabled data-[disabled=true]:bg-refineui-alias-background-primary-hover [&[data-disabled=true][data-checked=true]]:border-refineui-alias-background-surface-selected [&[data-disabled=true][data-checked=true]]:bg-refineui-alias-background-surface-selected",
    textCol: "flex min-w-0 flex-col gap-refineui-size-x-small",
    label: labelCompanionStyles.label,
    desc: labelCompanionStyles.description,
    textEnabled: labelCompanionStyles.enabled,
    textDisabled: labelCompanionStyles.disabled,
    descEnabled: labelCompanionStyles.descriptionEnabled,
} as const;
