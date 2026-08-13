import { labelCompanionStyles } from "../Label/style";

export const checkboxStyles = {
    root: "inline-flex gap-refineui-size-x-small",
    textTop: "items-start",
    textCenter: "items-center",
    disabledCursor: "cursor-not-allowed",
    enabledCursor: "cursor-pointer",
    controlWrap:
        "relative h-[var(--refineui-size-control-checkbox,20px)] w-[var(--refineui-size-control-checkbox,20px)] shrink-0",
    controlWrapDesc: "mt-refineui-size-xxx-small",
    input: "absolute inset-0 z-1 m-0 h-full w-full cursor-pointer opacity-0 outline-none",
    inputDisabled: "cursor-not-allowed",
    visual: "pointer-events-none absolute inset-0 box-border flex items-center justify-center overflow-hidden",
    textCol: "flex min-w-0 flex-col gap-refineui-size-x-small",
    label: labelCompanionStyles.label,
    desc: labelCompanionStyles.description,
    textEnabled: labelCompanionStyles.enabled,
    textDisabled: labelCompanionStyles.disabled,
    descEnabled: labelCompanionStyles.descriptionEnabled,
} as const;
