import type { FieldProps } from "./types";

export const fieldStyles = {
    root: "mb-refineui-size-medium",
    label: "mb-refineui-size-xsmall block",
    required: "ml-refineui-size-xxsmall",
    feedback: "refineui-typo-caption-3 mt-refineui-size-xsmall",
} as const;

export const fieldLabelTypo: Record<NonNullable<FieldProps["size"]>, string> = {
    sm: "refineui-typo-caption-1",
    md: "refineui-typo-body-2",
    lg: "refineui-typo-body-1",
};

