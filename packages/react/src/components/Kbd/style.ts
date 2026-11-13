import { clsx } from "clsx";

export const kbdStyles = {
    root: clsx(
        "refineui-typo-caption-2",
        "inline-flex min-h-refineui-size-x-large min-w-refineui-size-x-large items-center justify-center",
        "rounded-refineui-medium border-refineui-thin border-refineui-alias-border-strong",
        "bg-refineui-alias-background-surface px-refineui-size-x-small",
        "text-refineui-alias-foreground-secondary shadow-refineui-1",
        "whitespace-nowrap",
    ),
} as const;
