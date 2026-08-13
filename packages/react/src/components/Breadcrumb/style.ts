import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const breadcrumbStyles = {
    textRow: `${componentTextClass(componentTypographyTokens.breadcrumb.row)} whitespace-nowrap`,
    root: "py-refineui-size-x-small",
    list: "m-0 flex flex-wrap list-none items-center gap-refineui-size-medium p-0",
    item: "inline-flex items-center overflow-clip",
    link:
        "inline-flex items-center rounded-refineui-small px-refineui-size-medium py-refineui-size-x-small text-refineui-alias-foreground-tertiary no-underline outline-none transition-[color,background-color] duration-[var(--refineui-motion-duration-fast)]",
    page:
        "inline-flex items-center px-refineui-size-medium py-refineui-size-x-small font-medium text-refineui-alias-foreground-primary",
    separator: "inline-flex shrink-0 items-center",
    separatorText: "inline-flex items-center text-refineui-alias-foreground-tertiary select-none",
    ellipsis:
        "inline-flex shrink-0 items-center justify-center rounded-refineui-small px-refineui-size-medium py-refineui-size-x-small text-refineui-alias-foreground-tertiary leading-none",
    ellipsisTrigger:
        "box-border inline-flex shrink-0 cursor-pointer items-center justify-center rounded-refineui-small border-none bg-transparent px-refineui-size-medium py-refineui-size-x-small text-refineui-alias-foreground-tertiary leading-none outline-none transition-[color,background-color] duration-[var(--refineui-motion-duration-fast)]",
} as const;
