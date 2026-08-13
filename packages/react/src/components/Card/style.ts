import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const cardStyles = {
    root: "box-border flex h-full flex-col gap-refineui-size-none overflow-hidden rounded-refineui-xx-large bg-refineui-alias-background-primary",
    elevated: "border-refineui-none shadow-refineui-4",
    outlined: "border-refineui-thin border-refineui-alias-border-default shadow-none",
    stateDefault: "bg-refineui-alias-background-primary",
    stateHover: "bg-refineui-alias-background-primary-hover",
    statePressed: "bg-refineui-alias-background-surface-active",
    stateDisabled: "bg-refineui-alias-background-surface-disabled",
    interactive:
        "cursor-pointer transition-[background-color,border-color,box-shadow,outline-color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    headerMain: "flex min-w-0 flex-1 flex-col gap-refineui-size-xx-small",
    header:
        "flex flex-row flex-wrap items-start justify-between gap-refineui-size-medium px-refineui-size-x-large py-refineui-size-large",
    title: clsx(
        componentTextClass(componentTypographyTokens.card.title),
        "text-refineui-alias-foreground-primary",
    ),
    description: clsx(
        componentTextClass(componentTypographyTokens.card.description),
        "text-refineui-alias-foreground-tertiary",
    ),
    action: "flex shrink-0 items-center justify-end",
    content: "flex flex-1 flex-col px-refineui-size-x-large pb-refineui-size-large",
    footer:
        "mt-auto flex shrink-0 items-center justify-end gap-refineui-size-x-small px-refineui-size-x-large py-refineui-size-medium",
} as const;
