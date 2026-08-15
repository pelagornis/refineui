import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * Site footer — sitemap, then OpenAI-like meta: social icons | lockup | locale pill.
 */
export const footerStyles = {
    root: clsx(
        "box-border flex w-full flex-col gap-refineui-size-xxx-large",
        "border-t-refineui-hairline border-refineui-alias-border-default",
        "bg-transparent",
        "px-refineui-size-xx-large py-refineui-size-xxx-large",
    ),
    explore: "flex w-full flex-col",
    /** One-line lockup — sits in the meta middle. */
    brand: "flex min-w-0 flex-row flex-wrap items-center justify-center gap-refineui-size-small",
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
        "grid w-full items-start",
        "gap-x-refineui-size-xxx-large gap-y-refineui-size-xx-large",
    ),
    group: "flex min-w-0 flex-col gap-refineui-size-large",
    groupLabel: clsx(
        componentTextClass(componentTypographyTokens.footer.groupLabel),
        "m-0 text-refineui-alias-foreground-primary",
    ),
    link: clsx(
        componentTextClass(componentTypographyTokens.footer.link),
        "box-border inline-flex w-fit cursor-pointer items-center",
        "text-refineui-alias-foreground-tertiary no-underline outline-none",
        "transition-[color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    meta: clsx(
        "flex w-full flex-col items-center",
        "gap-refineui-size-xx-large",
        "md:flex-row md:items-center md:justify-between md:gap-refineui-size-x-large",
    ),
    metaEnd: "flex shrink-0 items-center",
    locale: "flex shrink-0 items-center",
    localeLink: clsx(
        componentTextClass(componentTypographyTokens.footer.copyright),
        "box-border inline-flex w-fit cursor-pointer items-center",
        "text-refineui-alias-foreground-tertiary no-underline outline-none",
        "transition-[color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    localeTrigger: clsx(
        componentTextClass(componentTypographyTokens.footer.copyright),
        "box-border inline-flex w-fit shrink-0 cursor-pointer items-center justify-center",
        "min-h-refineui-foundation-size-400",
        "gap-refineui-size-small rounded-refineui-circle border-refineui-none",
        "bg-refineui-alias-background-surface-hover px-refineui-size-x-large py-refineui-size-small shadow-none",
        "text-refineui-alias-foreground-primary",
    ),
    copyright: clsx(
        componentTextClass(componentTypographyTokens.footer.copyright),
        "m-0 text-refineui-alias-foreground-primary",
    ),
    social: "flex flex-wrap items-center justify-center gap-refineui-size-large md:justify-start",
    socialLink: clsx(
        "box-border inline-flex size-refineui-foundation-size-160 shrink-0 cursor-pointer items-center justify-center",
        "text-refineui-alias-foreground-tertiary no-underline outline-none",
        "transition-[color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
} as const;
