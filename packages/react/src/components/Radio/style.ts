import { labelCompanionStyles } from "../Label/style";

export const radioStyles = {
    root: "inline-flex gap-refineui-size-x-small",
    rootWithDescription: "items-start",
    rootWithoutDescription: "items-center",
    rootDisabled: "cursor-not-allowed",
    rootEnabled: "cursor-pointer",
    input:
        "relative m-0 inline-grid size-[var(--refineui-size-control-checkbox-radio,20px)] min-h-[var(--refineui-size-control-checkbox-radio,20px)] min-w-[var(--refineui-size-control-checkbox-radio,20px)] shrink-0 cursor-pointer appearance-none place-content-center rounded-full border border-refineui-alias-border-default bg-refineui-alias-background-primary shadow-none outline-none transition-[border-color,background-color,box-shadow,opacity] duration-[var(--refineui-motion-duration-fast)] after:size-refineui-size-medium after:scale-0 after:rounded-full after:bg-refineui-alias-background-primary after:content-[''] after:transition-transform after:duration-[var(--refineui-motion-duration-fast)] after:ease-[var(--refineui-motion-easing-ease-out)] focus-visible:shadow-[0_0_0_var(--refineui-stroke-width-thick)_var(--refineui-color-alias-border-strong)] checked:border-refineui-alias-foreground-primary checked:bg-refineui-alias-foreground-primary checked:after:scale-100 checked:focus-visible:shadow-[0_0_0_var(--refineui-stroke-width-thick)_var(--refineui-color-alias-border-strong)] disabled:cursor-not-allowed disabled:border-refineui-alias-border-disabled disabled:opacity-100 disabled:checked:border-refineui-alias-foreground-disabled disabled:checked:bg-refineui-alias-foreground-disabled disabled:checked:after:scale-100",
    inputWithDescriptionOffset: "mt-refineui-size-xxx-small",
    textWrap: "flex min-w-0 flex-col gap-refineui-size-x-small",
    label: labelCompanionStyles.label,
    description: labelCompanionStyles.description,
    textDisabled: labelCompanionStyles.disabled,
    labelEnabled: labelCompanionStyles.enabled,
    descriptionEnabled: labelCompanionStyles.descriptionEnabled,
} as const;
