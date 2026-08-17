import type { AlertVariant } from "./types";
import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const alertStyles = {
    iconSlot:
        "relative box-border flex size-refineui-size-xx-large min-w-refineui-size-xx-large shrink-0 items-center justify-center overflow-hidden rounded-refineui-circle",
    bodyCol: "flex min-w-0 flex-1 flex-col gap-refineui-size-xx-small",
    root: "box-border flex items-start border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary px-refineui-size-large py-refineui-size-medium",
    contentCol: "flex min-w-0 flex-1 flex-col gap-refineui-size-medium",
    row: "flex w-full flex-row items-start gap-refineui-size-medium",
    actionRow: "flex w-full flex-row flex-wrap items-center justify-end gap-refineui-size-medium",
    titleBase: clsx(
        componentTextClass(componentTypographyTokens.alert.title),
        "m-0 w-full min-w-0 font-medium",
    ),
    descriptionBase: clsx(
        componentTextClass(componentTypographyTokens.alert.description),
        "w-full min-w-0 font-medium",
    ),
} as const;

export const variantTitleClass: Record<AlertVariant, string> = {
    default: "text-refineui-alias-foreground-primary",
    info: "text-refineui-alias-foreground-info",
    success: "text-refineui-alias-foreground-success",
    warning: "text-refineui-alias-foreground-warning",
    danger: "text-refineui-alias-foreground-error",
    custom: "text-refineui-alias-foreground-discovery",
};

export const variantDescriptionClass: Record<AlertVariant, string> = {
    default: "text-refineui-alias-foreground-secondary",
    info: "text-refineui-alias-background-info",
    success: "text-refineui-alias-background-success",
    warning: "text-refineui-alias-background-warning",
    danger: "text-refineui-alias-background-error",
    custom: "text-refineui-alias-background-discovery",
};

export const variantIconNames: Record<AlertVariant, string> = {
    default: "circle",
    info: "info",
    success: "checkmark",
    warning: "warning",
    danger: "error-circle",
    custom: "star",
};
