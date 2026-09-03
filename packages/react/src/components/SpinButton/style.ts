import type { SpinButtonProps } from "./types";
import { formControlShellHeightClass, formControlTypoClass } from "../../formControlSizes";

type SpinButtonSize = NonNullable<SpinButtonProps["size"]>;

export const spinButtonStyles = {
    root: "box-border flex w-full min-w-0 items-stretch overflow-hidden outline-none",
    borderDisabled: "border-refineui-thin border-refineui-alias-border-disabled",
    borderDefault: "border-refineui-thin border-refineui-alias-border-default",
    bgDisabled: "bg-refineui-alias-background-surface-disabled",
    bgDefault: "bg-refineui-alias-background-primary",
    value:
        "flex min-w-0 flex-[1_1_auto] items-center ps-refineui-spin-field-padding-inline-start pe-refineui-size-x-small",
    valueInput: "w-full border-none bg-transparent p-0 outline-none placeholder:text-refineui-alias-foreground-placeholder",
    valueTextDisabled: "text-refineui-alias-foreground-disabled",
    valueTextDefault: "text-refineui-alias-foreground-primary",
    stepper: "flex h-full min-h-0 w-refineui-spin-stepper-width shrink-0 flex-col",
    /** Split column evenly inside shared `controlHeight*` shell */
    stepButtonBase:
        "box-border flex min-h-0 w-full flex-1 items-center justify-center border-none p-0 text-refineui-alias-foreground-secondary",
    stepButtonDisabled: "cursor-not-allowed bg-refineui-alias-background-surface-disabled opacity-50",
    stepButtonEnabled: "cursor-pointer bg-refineui-alias-background-primary opacity-100",
} as const;

/** Height + radius from shared form-control tokens; typography on value only */
export const spinButtonShellClass: Record<SpinButtonSize, string> = formControlShellHeightClass;

export const spinButtonValueTypo: Record<SpinButtonSize, string> = formControlTypoClass;
