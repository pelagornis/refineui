export const toastStyles = {
    card:
        "box-border flex w-refineui-toast-max-width min-w-refineui-toast-min-width max-w-refineui-toast-max-width items-center gap-refineui-size-medium rounded-refineui-xlarge border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary py-refineui-size-medium px-refineui-size-large shadow-refineui-4light transition-[border-color,border-width,opacity] duration-[var(--refineui-motion-duration-medium)] ease-[var(--refineui-motion-easing-ease-out)]",
    iconWrap: "flex size-refineui-size-xxlarge shrink-0 items-center justify-center self-center",
    contentWrap: "flex min-h-px min-w-0 flex-1 flex-col gap-refineui-size-xsmall",
    title: "refineui-typo-body-2 text-refineui-alias-foreground-primary",
    message: "refineui-typo-body-3 text-refineui-alias-foreground-tertiary",
    actionButton: "shrink-0 whitespace-nowrap",
    toasterRoot: "refineui-toaster group",
} as const;

