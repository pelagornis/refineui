import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const toastStyles = {
    card:
        "box-border flex w-fit max-w-refineui-toast-max-width cursor-grab items-center gap-refineui-size-small rounded-refineui-circle border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary px-refineui-size-large py-refineui-size-small shadow-refineui-4light select-none",
    iconWrap: "flex size-refineui-size-xx-large shrink-0 items-center justify-center self-center",
    contentWrap: "flex min-h-px min-w-0 flex-1 items-center",
    message: clsx(
        componentTextClass(componentTypographyTokens.toast.message),
        "text-refineui-alias-foreground-primary",
    ),
    actionButton: "shrink-0 whitespace-nowrap",
    toasterRoot: "refineui-toaster group",
} as const;
