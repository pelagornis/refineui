/**
 * Toast recipe — visual mapping only.
 * Contract: packages/react/spec/components/toast.json
 * Tokens: componentColorTokens.toast
 */
import { clsx } from "clsx";
import { componentTypographyTokens } from "../tokens/componentTypographyTokens";
import { componentTextClass } from "../typography";
import { defineRecipe } from "./types";

export const toastRecipe = defineRecipe({
    name: "toast",
    base: "relative isolate box-border flex w-fit max-w-refineui-toast-max-width cursor-grab items-center gap-refineui-size-small rounded-refineui-circle border-none py-refineui-size-medium ps-refineui-size-medium pe-refineui-size-large select-none",
    variants: {
        variant: {
            default: "",
            success: "",
            error: "",
            warning: "",
        },
    },
    defaultVariants: {
        variant: "default",
    },
    dataStates: ["default"],
});

export const toastStyles = {
    card: toastRecipe.base,
    iconWrap: "flex shrink-0 items-center justify-center self-center",
    contentWrap: "flex min-h-px min-w-0 flex-1 items-center",
    message: clsx(
        componentTextClass(componentTypographyTokens.toast.message),
        "text-refineui-alias-foreground-primary",
    ),
    actionButton: "shrink-0 whitespace-nowrap",
    toasterRoot: "refineui-toaster group",
} as const;
