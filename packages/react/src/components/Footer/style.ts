import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * Site footer — two regions (explore / meta) divided by a hairline.
 * No Web Kit COMPONENT_SET; no fill surfaces.
 */
export const footerStyles = {
    root: clsx(
        "box-border flex w-full flex-col gap-refineui-size-xx-large",
        "border-t-refineui-hairline border-refineui-alias-border-default",
        "bg-transparent",
        "px-refineui-size-xx-large py-refineui-size-xxx-large",
    ),
    /** Explore — brand column + sitemap columns. */
    content: clsx(
        "flex w-full flex-wrap items-start justify-between",
        "gap-x-refineui-size-xxx-large gap-y-refineui-size-xx-large",
    ),
    brand: clsx(
        "flex w-refineui-menu-panel-width shrink-0 flex-col",
        "gap-x-refineui-size-x-small gap-y-refineui-size-x-small",
    ),
    logo: "flex shrink-0 items-center text-refineui-alias-foreground-primary",
    brandName: clsx(
        componentTextClass(componentTypographyTokens.footer.brandName),
        "m-0 text-refineui-alias-foreground-primary",
    ),
    brandDescription: clsx(
        componentTextClass(componentTypographyTokens.footer.brandDescription),
        "m-0 text-refineui-alias-foreground-tertiary",
    ),
    nav: clsx(
        "flex min-w-0 flex-1 flex-wrap items-start justify-between",
        "gap-x-refineui-size-xxx-large gap-y-refineui-size-x-large",
    ),
    group: "flex min-w-0 flex-1 flex-col gap-refineui-size-small",
    groupLabel: clsx(
        componentTextClass(componentTypographyTokens.footer.groupLabel),
        "m-0 text-refineui-alias-foreground-secondary",
    ),
    link: clsx(
        componentTextClass(componentTypographyTokens.footer.link),
        "box-border inline-flex w-fit cursor-pointer items-center",
        "text-refineui-alias-foreground-tertiary no-underline outline-none",
        "transition-[color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    /** Meta — copyright · locale · social, separated from explore. */
    bottom: clsx(
        "flex w-full flex-wrap items-center",
        "gap-x-refineui-size-large gap-y-refineui-size-medium",
        "border-t-refineui-hairline border-refineui-alias-border-default",
        "pt-refineui-size-x-large",
    ),
    locale: "flex shrink-0 items-center",
    localeLink: clsx(
        componentTextClass(componentTypographyTokens.footer.copyright),
        "box-border inline-flex w-fit cursor-pointer items-center",
        "text-refineui-alias-foreground-tertiary no-underline outline-none",
        "transition-[color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    localeTrigger: clsx(
        componentTextClass(componentTypographyTokens.footer.copyright),
        "box-border inline-flex w-fit cursor-pointer items-center gap-refineui-size-xxx-small",
        "border-refineui-none bg-transparent p-refineui-size-none shadow-none",
        "text-refineui-alias-foreground-tertiary",
    ),
    copyright: clsx(
        componentTextClass(componentTypographyTokens.footer.copyright),
        "m-0 mr-auto text-refineui-alias-foreground-tertiary",
    ),
    social: "flex flex-wrap items-center gap-refineui-size-large",
    socialLink: clsx(
        componentTextClass(componentTypographyTokens.footer.link),
        "box-border inline-flex w-fit cursor-pointer items-center",
        "text-refineui-alias-foreground-tertiary no-underline outline-none",
        "transition-[color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
} as const;
