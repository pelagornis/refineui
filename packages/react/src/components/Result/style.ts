import { clsx } from "clsx";

export const resultStyles = {
    root: "flex w-full flex-col items-center gap-refineui-size-large px-refineui-size-xx-large py-refineui-size-xxx-large text-center",
    figure: "flex size-refineui-foundation-size-480 items-center justify-center text-refineui-alias-foreground-brand",
    figureSuccess: "text-refineui-alias-foreground-success",
    figureInfo: "text-refineui-alias-foreground-info",
    figureWarning: "text-refineui-alias-foreground-warning",
    figureError: "text-refineui-alias-foreground-error",
    content: "flex max-w-refineui-foundation-size-3200 flex-col items-center gap-refineui-size-small",
    title: "m-0 refineui-typo-body-1 font-semibold text-refineui-alias-foreground-primary",
    description: "m-0 whitespace-pre-line refineui-typo-body-2 text-refineui-alias-foreground-secondary",
    actions: "flex w-full max-w-refineui-foundation-size-2000 flex-col gap-refineui-size-small",
    button: "w-full",
} as const;
