import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";
import {
    buttonLabelSizeClass,
    buttonStyles,
    buttonVariantClass,
} from "../../recipes/button.recipe";

/**
 * Site footer — sitemap, then meta: social | lockup | locale.
 * Brand stays centered even when social / locale slots are omitted
 * (`md:grid-cols-[1fr_auto_1fr]` + explicit column starts).
 */
export const footerStyles = {
    root: clsx(
        "box-border flex w-full flex-col gap-refineui-size-xxx-large",
        "border-t-refineui-hairline border-refineui-alias-border-default",
        "bg-transparent",
        "px-refineui-size-xx-large py-refineui-size-xxx-large",
    ),
    explore: "flex w-full flex-col",
    /** One-line lockup — always meta center column. */
    brand: clsx(
        "flex min-w-0 flex-row flex-wrap items-center justify-center gap-refineui-size-small",
        "md:col-start-2 md:justify-self-center",
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
        "grid w-full items-center gap-refineui-size-xx-large",
        "grid-cols-1 justify-items-center",
        "md:grid-cols-[1fr_auto_1fr] md:justify-items-stretch md:gap-refineui-size-x-large",
    ),
    metaEnd: "flex shrink-0 items-center md:col-start-3 md:justify-self-end",
    locale: "flex shrink-0 items-center",
    localeLink: clsx(
        componentTextClass(componentTypographyTokens.footer.copyright),
        "box-border inline-flex w-fit cursor-pointer items-center",
        "text-refineui-alias-foreground-tertiary no-underline outline-none",
        "transition-[color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    /** Select trigger chrome — Button `outline` / `sm` recipe (plain Select). */
    localeTrigger: clsx(
        buttonStyles.base,
        buttonVariantClass.outline,
        buttonLabelSizeClass.sm,
        "w-fit min-w-0 shrink-0",
    ),
    copyright: clsx(
        componentTextClass(componentTypographyTokens.footer.copyright),
        "m-0 text-refineui-alias-foreground-primary",
    ),
    social: clsx(
        "flex flex-wrap items-center justify-center gap-refineui-size-large",
        "md:col-start-1 md:justify-self-start md:justify-start",
    ),
    socialLink: clsx(
        "box-border inline-flex size-refineui-foundation-size-160 shrink-0 cursor-pointer items-center justify-center",
        "text-refineui-alias-foreground-tertiary no-underline outline-none",
        "transition-[color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
} as const;
