import type { LabelProps } from "./types";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass, sizedComponentTextClass } from "../../typography";

/** Shared by `Label` and `FieldLabel` — Web Kit Label `216:1681` / Field label typography */
export const labelStyles = {
    base: "mb-refineui-size-xx-small block",
    disabled: "text-refineui-alias-foreground-disabled",
    enabled: "text-refineui-alias-foreground-primary",
    required: "ms-refineui-size-xxx-small text-refineui-alias-foreground-error",
} as const;

export const labelSizeTypo: Record<NonNullable<LabelProps["size"]>, string> = {
    sm: sizedComponentTextClass(componentTypographyTokens.label, "sm"),
    md: sizedComponentTextClass(componentTypographyTokens.label, "md"),
    lg: sizedComponentTextClass(componentTypographyTokens.label, "lg"),
};

/** Inline copy beside controls — same typography/colors as `Label` (Checkbox / Radio). */
export const labelCompanionStyles = {
    label: componentTextClass(componentTypographyTokens.labelCompanion.label),
    description: componentTextClass(componentTypographyTokens.labelCompanion.description),
    enabled: "text-refineui-alias-foreground-primary",
    descriptionEnabled: "text-refineui-alias-foreground-secondary",
    disabled: "text-refineui-alias-foreground-disabled",
} as const;
