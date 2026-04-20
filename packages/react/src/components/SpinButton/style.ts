import type { SpinButtonProps } from "./types";

type SpinButtonSize = NonNullable<SpinButtonProps["size"]>;

export const spinButtonStyles = {
    root: "box-border inline-flex items-stretch overflow-hidden outline-none",
    borderDisabled: "border-refineui-thin border-refineui-alias-border-disabled",
    borderDefault: "border-refineui-thin border-refineui-alias-border-default",
    bgDisabled: "bg-refineui-alias-background-surface-disabled",
    bgDefault: "bg-refineui-alias-background-primary",
    value:
        "flex min-w-refineui-spin-value-min-width flex-[1_1_auto] items-center pl-refineui-spin-field-padding-inline-start pr-refineui-size-small",
    valueTextDisabled: "text-refineui-alias-foreground-disabled",
    valueTextDefault: "text-refineui-alias-foreground-primary",
    stepper: "flex w-refineui-spin-stepper-width shrink-0 flex-col",
    stepButtonBase:
        "flex w-refineui-spin-stepper-width items-center justify-center border-none p-0 text-refineui-alias-foreground-placeholder",
    stepButtonUpPadding: "pt-refineui-size-xsmall",
    stepButtonDownPadding: "pb-refineui-size-xsmall",
    stepButtonDisabled: "cursor-not-allowed bg-refineui-alias-background-surface-disabled opacity-50",
    stepButtonEnabled: "cursor-pointer bg-refineui-alias-background-primary opacity-100",
} as const;

export const spinButtonShellClass: Record<SpinButtonSize, string> = {
    sm: "min-h-refineui-control-height-sm h-refineui-control-height-sm rounded-refineui-medium",
    md: "min-h-refineui-control-height-md h-refineui-control-height-md rounded-refineui-large",
    lg: "min-h-refineui-control-height-lg h-refineui-control-height-lg rounded-refineui-xlarge",
};

export const spinButtonValueTypo: Record<SpinButtonSize, string> = {
    sm: "refineui-typo-caption-1",
    md: "refineui-typo-body-2",
    lg: "refineui-typo-body-1",
};

export const spinButtonStepHeight: Record<SpinButtonSize, string> = {
    sm: "h-refineui-spin-stepper-step-height-sm",
    md: "h-refineui-spin-stepper-step-height-md",
    lg: "h-refineui-spin-stepper-step-height-lg",
};

