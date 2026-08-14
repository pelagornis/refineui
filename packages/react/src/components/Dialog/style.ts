import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const dialogStyles = {
    root: "fixed inset-0 z-refineui-messages flex items-center justify-center p-refineui-size-large",
    scrim: "absolute inset-0 cursor-pointer transition-opacity",
    panel:
        "relative box-border flex max-h-refineui-dialog-max-height-viewport w-full flex-col overflow-hidden rounded-refineui-large bg-refineui-alias-background-primary p-refineui-size-xx-large shadow-refineui-8 outline-none",
    panelScrollWrap: "flex min-h-0 min-w-0 flex-1 flex-col",
    header: "flex shrink-0 items-start justify-between gap-refineui-size-x-small",
    headerMain: "flex min-w-0 flex-1 flex-col gap-refineui-size-x-small",
    title: clsx(
        componentTextClass(componentTypographyTokens.dialog.title),
        "m-0 min-w-0 text-refineui-alias-foreground-primary",
    ),
    description: clsx(
        componentTextClass(componentTypographyTokens.dialog.description),
        "m-0 min-w-0 text-refineui-alias-foreground-secondary",
    ),
} as const;
