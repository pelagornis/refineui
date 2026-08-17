import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * App sidebar landmark — token composition (no Web Kit COMPONENT_SET).
 */
export const sidebarStyles = {
    root: clsx(
        "box-border flex h-full min-h-0 w-full min-w-0 flex-1 flex-col",
        "border-e-refineui-hairline border-refineui-alias-border-default",
        "bg-refineui-alias-background-primary",
    ),
    header: clsx(
        "flex shrink-0 flex-col",
        "border-b-refineui-hairline border-refineui-alias-border-default",
        "px-refineui-size-large py-refineui-size-large",
    ),
    brand: clsx(
        componentTextClass(componentTypographyTokens.sidebar.brand),
        "m-0 flex min-w-0 items-center gap-refineui-size-small text-refineui-alias-foreground-primary",
    ),
    content: "flex min-h-0 flex-1 flex-col overflow-y-auto px-refineui-size-medium py-refineui-size-medium",
    nav: "flex min-h-0 flex-col gap-refineui-size-x-large",
    group: "flex min-w-0 flex-col gap-refineui-size-xx-small",
    groupLabel: clsx(
        componentTextClass(componentTypographyTokens.sidebar.groupLabel),
        "m-0 px-refineui-size-medium py-refineui-size-xxx-small text-refineui-alias-foreground-tertiary",
    ),
    link: clsx(
        componentTextClass(componentTypographyTokens.sidebar.link),
        "box-border flex w-full min-w-0 cursor-pointer items-center gap-refineui-size-x-small",
        "rounded-refineui-large border-none bg-transparent px-refineui-size-medium py-refineui-size-x-small",
        "text-refineui-alias-foreground-tertiary no-underline outline-none",
        "transition-[color,background-color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    linkActive: "font-medium text-refineui-alias-foreground-primary",
    linkDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    footer: clsx(
        "mt-auto flex shrink-0 flex-col",
        "border-t-refineui-hairline border-refineui-alias-border-default",
        "px-refineui-size-medium py-refineui-size-medium",
    ),
} as const;
