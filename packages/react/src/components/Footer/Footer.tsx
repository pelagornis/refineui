import { clsx } from "clsx";
import { createContext, useContext } from "react";
import { footerStyles } from "./style";
import type {
    FooterBrandDescriptionProps,
    FooterBrandNameProps,
    FooterBrandProps,
    FooterCopyrightProps,
    FooterExploreProps,
    FooterGroupLabelProps,
    FooterGroupProps,
    FooterLinkProps,
    FooterLocaleProps,
    FooterLogoProps,
    FooterMetaEndProps,
    FooterMetaProps,
    FooterNavProps,
    FooterProps,
    FooterSocialProps,
} from "./types";

type FooterLinkRegion = "default" | "social" | "locale";

const FooterLinkRegionContext = createContext<FooterLinkRegion>("default");

/** Site footer landmark — token composition (no Web Kit COMPONENT_SET). */
export function Footer({ className, ...props }: FooterProps) {
    return (
        <footer
            data-refineui="footer"
            className={clsx(footerStyles.root, className)}
            {...props}
        />
    );
}

export function FooterExplore({ className, ...props }: FooterExploreProps) {
    return (
        <div
            data-refineui="footer-explore"
            className={clsx(footerStyles.explore, className)}
            {...props}
        />
    );
}

/** Alias of `FooterExplore`. */
export const FooterContent = FooterExplore;

export function FooterBrand({ className, ...props }: FooterBrandProps) {
    return (
        <div
            data-refineui="footer-brand"
            className={clsx(footerStyles.brand, className)}
            {...props}
        />
    );
}

export function FooterLogo({ className, ...props }: FooterLogoProps) {
    return (
        <div
            data-refineui="footer-logo"
            className={clsx(footerStyles.logo, className)}
            {...props}
        />
    );
}

export function FooterBrandName({ className, ...props }: FooterBrandNameProps) {
    return (
        <p
            data-refineui="footer-brand-name"
            className={clsx(footerStyles.brandName, className)}
            {...props}
        />
    );
}

export function FooterBrandDescription({ className, ...props }: FooterBrandDescriptionProps) {
    return (
        <p
            data-refineui="footer-brand-description"
            className={clsx(footerStyles.brandDescription, className)}
            {...props}
        />
    );
}

export function FooterNav({ className, "aria-label": ariaLabel = "Footer", ...props }: FooterNavProps) {
    return (
        <nav
            data-refineui="footer-nav"
            aria-label={ariaLabel}
            className={clsx(footerStyles.nav, className)}
            {...props}
        />
    );
}

export function FooterGroup({ className, ...props }: FooterGroupProps) {
    return (
        <div
            data-refineui="footer-group"
            className={clsx(footerStyles.group, className)}
            {...props}
        />
    );
}

export function FooterGroupLabel({ className, ...props }: FooterGroupLabelProps) {
    return (
        <p
            data-refineui="footer-group-label"
            className={clsx(footerStyles.groupLabel, className)}
            {...props}
        />
    );
}

export const footerLinkClassName = footerStyles.link;
export const footerSocialLinkClassName = footerStyles.socialLink;
export const footerLocaleLinkClassName = footerStyles.localeLink;
export const footerLocaleTriggerClassName = footerStyles.localeTrigger;

export function FooterLink({ className, ...props }: FooterLinkProps) {
    const region = useContext(FooterLinkRegionContext);
    const regionClass =
        region === "social"
            ? footerSocialLinkClassName
            : region === "locale"
              ? footerLocaleLinkClassName
              : footerLinkClassName;
    return (
        <a
            data-refineui="footer-link"
            className={clsx(regionClass, className)}
            {...props}
        />
    );
}

export function FooterMeta({ className, ...props }: FooterMetaProps) {
    return (
        <div
            data-refineui="footer-meta"
            className={clsx(footerStyles.meta, className)}
            {...props}
        />
    );
}

/** Alias of `FooterMeta`. */
export const FooterBottom = FooterMeta;

export function FooterMetaEnd({ className, ...props }: FooterMetaEndProps) {
    return (
        <div
            data-refineui="footer-meta-end"
            className={clsx(footerStyles.metaEnd, className)}
            {...props}
        />
    );
}

export function FooterCopyright({ className, ...props }: FooterCopyrightProps) {
    return (
        <p
            data-refineui="footer-copyright"
            className={clsx(footerStyles.copyright, className)}
            {...props}
        />
    );
}

export function FooterLocale({
    className,
    ...props
}: FooterLocaleProps) {
    return (
        <FooterLinkRegionContext.Provider value="locale">
            <div
                data-refineui="footer-locale"
                className={clsx(footerStyles.locale, className)}
                {...props}
            />
        </FooterLinkRegionContext.Provider>
    );
}

export function FooterSocial({ className, ...props }: FooterSocialProps) {
    return (
        <FooterLinkRegionContext.Provider value="social">
            <div
                data-refineui="footer-social"
                className={clsx(footerStyles.social, className)}
                {...props}
            />
        </FooterLinkRegionContext.Provider>
    );
}
