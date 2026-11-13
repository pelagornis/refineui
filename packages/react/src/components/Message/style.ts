import { clsx } from "clsx";

export const messageStyles = {
    root: clsx(
        "flex min-w-0 items-end gap-refineui-size-small",
        "data-[align=end]:flex-row-reverse",
        "[&[data-align=start]_[data-refineui=message-content]]:items-start",
        "[&[data-align=end]_[data-refineui=message-content]]:items-end",
        "[&[data-align=end]_[data-refineui=message-footer]]:text-end",
    ),
    avatar: "shrink-0 self-end",
    content: clsx(
        "flex min-w-0 flex-1 flex-col gap-refineui-size-xx-small",
    ),
    footer: clsx(
        "refineui-typo-caption-2",
        "px-refineui-size-small text-refineui-alias-foreground-tertiary",
    ),
} as const;
