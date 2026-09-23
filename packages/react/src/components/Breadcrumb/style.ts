import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/** Icon-only chip — same box as Button `layout="icon" size="sm"`. */
const ellipsisChip =
    "box-border inline-flex min-h-refineui-button-min-height-sm min-w-refineui-button-min-height-sm shrink-0 items-center justify-center rounded-refineui-large p-refineui-size-xx-small leading-none";

export const breadcrumbStyles = {
    textRow: `${componentTextClass(componentTypographyTokens.breadcrumb.row)} whitespace-nowrap`,
    root: "py-refineui-size-x-small",
    list: "m-0 flex flex-wrap list-none items-center gap-refineui-size-medium p-0",
    item: "inline-flex items-center",
    link:
        "box-border inline-flex min-h-refineui-button-min-height-sm items-center justify-center rounded-refineui-large px-refineui-size-medium py-refineui-size-x-small text-refineui-alias-foreground-tertiary no-underline outline-none transition-[color,background-color] duration-[var(--refineui-motion-duration-fast)]",
    page:
        "inline-flex items-center px-refineui-size-medium py-refineui-size-x-small font-medium text-refineui-alias-foreground-primary",
    separator: "inline-flex shrink-0 items-center",
    separatorText: "inline-flex items-center text-refineui-alias-foreground-tertiary select-none",
    ellipsis: `${ellipsisChip} text-refineui-alias-foreground-tertiary`,
    /** Color only — size/layout come from Button `layout="icon" size="sm"`. */
    ellipsisTrigger: "text-refineui-alias-foreground-tertiary",
} as const;
