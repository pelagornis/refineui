import { clsx } from "clsx";

export const codeBlockStyles = {
    root: clsx(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-refineui-x-large border-refineui-hairline border-refineui-alias-border-subtle",
        "bg-refineui-alias-surface-sunken text-refineui-alias-foreground-primary shadow-refineui-1",
    ),
    header: clsx(
        "flex min-w-0 shrink-0 items-center gap-refineui-size-large",
        "px-refineui-size-x-large pt-refineui-size-x-large pb-refineui-size-large text-refineui-alias-foreground-secondary",
    ),
    title: "refineui-typo-label-2 flex min-w-0 flex-1 items-center gap-refineui-size-x-small truncate text-refineui-alias-foreground-primary [&>span]:shrink-0",
    actions: "ms-auto flex shrink-0 items-center gap-refineui-size-xxx-small",
    content: clsx(
        "refineui-typo-body-1 m-0 min-h-0 min-w-0 overflow-auto bg-refineui-alias-surface-sunken",
        "py-refineui-size-x-large font-mono leading-relaxed text-refineui-alias-foreground-primary outline-none",
        "focus-visible:outline-[length:var(--refineui-stroke-width-thick)] focus-visible:[outline-color:var(--refineui-focus-color)] focus-visible:[outline-offset:calc(-1*var(--refineui-stroke-width-thick))]",
    ),
    contentWrapped: "overflow-x-hidden whitespace-pre-wrap break-words",
    contentUnwrapped: "whitespace-pre",
    line: "flex min-w-full gap-refineui-size-large px-refineui-size-x-large",
    lineHighlighted: "bg-refineui-alias-background-brand-subtle",
    lineNumber: "inline-block w-refineui-size-x-large shrink-0 select-none text-end text-refineui-alias-foreground-tertiary",
    lineContent: "min-w-0 flex-1",
} as const;
