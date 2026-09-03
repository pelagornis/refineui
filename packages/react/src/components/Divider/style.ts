import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const dividerStyles = {
    line:
        "h-(--refineui-stroke-width-thin) min-h-(--refineui-stroke-width-thin) shrink-0 bg-refineui-alias-border-default",
    lineGrow: "min-w-0 flex-1",
    lineShort: "min-w-refineui-divider-short-end w-refineui-divider-short-end",
    iconCircle:
        "absolute start-refineui-divider-icon-circle-inset top-refineui-divider-icon-circle-inset box-border rounded-refineui-circle border-refineui-thin border-refineui-alias-foreground-brand",
    default:
        "box-border h-(--refineui-stroke-width-thin) min-h-(--refineui-stroke-width-thin) w-full border-none bg-refineui-alias-border-default",
    row: "box-border flex w-full items-center justify-center gap-refineui-size-medium overflow-hidden",
    contentLabel: clsx(
        componentTextClass(componentTypographyTokens.divider.contentLabel),
        "whitespace-nowrap text-refineui-alias-foreground-brand",
    ),
    iconSlot: "relative min-w-refineui-divider-icon-slot size-refineui-divider-icon-slot shrink-0 overflow-visible",
} as const;
