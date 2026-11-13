import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const cardStyles = {
    root: "group box-border flex h-full flex-col gap-refineui-size-none overflow-hidden rounded-[var(--refineui-radius-rounded-xx-large)] bg-refineui-alias-background-primary data-[selected=true]:shadow-[inset_0_0_0_var(--refineui-stroke-width-thick)_var(--refineui-color-alias-border-focus)]",
    elevated: "border-refineui-none shadow-refineui-4 data-[selected=true]:shadow-[var(--refineui-elevation-4),inset_0_0_0_var(--refineui-stroke-width-thick)_var(--refineui-color-alias-border-focus)]",
    outlined: "border-refineui-thin border-refineui-alias-border-default shadow-none",
    stateDefault: "bg-refineui-alias-background-primary",
    stateHover: "bg-refineui-alias-background-primary-hover",
    statePressed: "bg-refineui-alias-background-surface-active",
    stateDisabled: "bg-refineui-alias-background-surface-disabled",
    interactive:
        "cursor-pointer transition-[background-color,border-color,box-shadow,outline-color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)] hover:bg-refineui-alias-background-primary-hover active:bg-refineui-alias-background-surface-selected",
    interactiveOutlined: "hover:border-refineui-alias-border-default active:border-refineui-alias-border-strong",
    headerMain: "flex min-w-0 flex-1 flex-col gap-refineui-size-xx-small",
    header:
        "flex flex-row flex-wrap items-start justify-between gap-refineui-size-medium px-refineui-size-x-large py-refineui-size-large",
    title: clsx(
        componentTextClass(componentTypographyTokens.card.title),
        "text-refineui-alias-foreground-primary group-aria-disabled:text-refineui-alias-foreground-disabled",
    ),
    description: clsx(
        componentTextClass(componentTypographyTokens.card.description),
        "text-refineui-alias-foreground-tertiary group-aria-disabled:text-refineui-alias-foreground-disabled",
    ),
    action: "flex shrink-0 items-center justify-end",
    content: "flex flex-1 flex-col px-refineui-size-x-large pb-refineui-size-large group-aria-disabled:text-refineui-alias-foreground-disabled",
    footer:
        "mt-auto flex shrink-0 items-center justify-end gap-refineui-size-x-small px-refineui-size-x-large py-refineui-size-medium",
} as const;
