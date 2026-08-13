import { labelCompanionStyles } from "../Label/style";

export const radioStyles = {
    root: "inline-flex gap-refineui-size-x-small",
    rootWithDescription: "items-start",
    rootWithoutDescription: "items-center",
    rootDisabled: "cursor-not-allowed",
    rootEnabled: "cursor-pointer",
    input: "h-[var(--refineui-size-control-checkbox-radio,20px)] w-[var(--refineui-size-control-checkbox-radio,20px)] shrink-0 cursor-pointer",
    inputWithDescriptionOffset: "mt-refineui-size-xxx-small",
    textWrap: "flex min-w-0 flex-col gap-refineui-size-x-small",
    label: labelCompanionStyles.label,
    description: labelCompanionStyles.description,
    textDisabled: labelCompanionStyles.disabled,
    labelEnabled: labelCompanionStyles.enabled,
    descriptionEnabled: labelCompanionStyles.descriptionEnabled,
} as const;
