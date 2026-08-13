import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const toastStyles = {
    card:
        "box-border flex w-refineui-toast-max-width min-w-refineui-toast-min-width max-w-refineui-toast-max-width items-center gap-refineui-size-medium rounded-refineui-x-large border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-large shadow-refineui-4light transition-[border-color,opacity] duration-[var(--refineui-motion-duration-medium)] ease-[var(--refineui-motion-easing-ease-out)]",
    iconWrap: "flex size-refineui-size-xx-large shrink-0 items-center justify-center self-center",
    contentWrap: "flex min-h-px min-w-0 flex-1 flex-col gap-refineui-size-x-small",
    title: clsx(
        componentTextClass(componentTypographyTokens.toast.title),
        "text-refineui-alias-foreground-primary",
    ),
    message: clsx(
        componentTextClass(componentTypographyTokens.toast.message),
        "text-refineui-alias-foreground-tertiary",
    ),
    actionButton: "shrink-0 whitespace-nowrap",
    toasterRoot: "refineui-toaster group",
} as const;
