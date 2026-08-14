import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const drawerStyles = {
    root: "fixed inset-0 z-refineui-messages flex",
    inlineRoot: "relative z-auto flex",
    rootLeft: "justify-start",
    rootRight: "justify-end",
    scrim: "absolute inset-0 cursor-pointer transition-opacity",
    panel:
        "relative box-border flex h-full flex-col overflow-hidden bg-refineui-alias-background-primary outline-none",
    panelOverlay: "shadow-refineui-16",
    panelInline: "shadow-none",
    header: "flex shrink-0 items-start px-refineui-size-xx-large pb-refineui-size-medium pt-refineui-size-xx-large",
    headerMain: "flex min-h-0 min-w-0 flex-1 items-center gap-refineui-size-x-small",
    headerMainText: "flex min-w-0 flex-1 flex-col gap-refineui-size-xxx-small",
    headerActions: "flex shrink-0 items-center gap-refineui-size-x-small",
    title: clsx(
        componentTextClass(componentTypographyTokens.drawer.title),
        "m-0 min-w-0 text-refineui-alias-foreground-primary",
    ),
    description: clsx(
        componentTextClass(componentTypographyTokens.drawer.description),
        "m-0 min-w-0 text-refineui-alias-foreground-secondary",
    ),
    body: clsx(
        componentTextClass(componentTypographyTokens.drawer.body),
        "box-border min-h-0 flex-1 text-refineui-alias-foreground-primary",
    ),
    footerRoot: "mt-auto shrink-0",
    footer: "flex items-center justify-end gap-refineui-size-x-small px-refineui-size-xx-large py-refineui-size-x-large",
    footerIcons: "",
    footerSingle: "[&>*]:w-full",
    footerSplit: "[&>*]:min-w-0 [&>*]:flex-1",
} as const;
