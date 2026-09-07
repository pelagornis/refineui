import type { ReactNode } from "react";
import {
    Footer,
    FooterBrand,
    FooterCopyright,
    FooterExplore,
    FooterGroup,
    FooterGroupLabel,
    FooterLink,
    FooterMeta,
    FooterNav,
    FooterSocial,
} from "@refineui/react";
import { toDocsLocale, withLocalePath, type DocsLocaleCode } from "../lib/docs-locale";
import { DocsFooterLocaleSelect } from "./DocsFooterLocaleSelect";

function siteHref(path: string, locale: DocsLocaleCode) {
    return withLocalePath(path, locale);
}

function SocialIcon({ children }: { children: ReactNode }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-hidden>
            {children}
        </svg>
    );
}

const COPY = {
    en: {
        docs: "Docs",
        foundations: "Foundations",
        components: "Components",
        development: "Development",
        installation: "Installation",
        theming: "Theming",
        motion: "Motion",
        aiTools: "AI & Tools",
        resources: "Resources",
        button: "Button",
        input: "Input",
        dialog: "Dialog",
        sidebar: "Sidebar",
        language: "Language",
    },
    ko: {
        docs: "문서",
        foundations: "파운데이션",
        components: "컴포넌트",
        development: "개발",
        installation: "설치",
        theming: "테마",
        motion: "모션",
        aiTools: "AI & 도구",
        resources: "리소스",
        button: "Button",
        input: "Input",
        dialog: "Dialog",
        sidebar: "Sidebar",
        language: "언어",
    },
} as const;

export type DocsSiteFooterProps = {
    locale?: string;
};

export function DocsSiteFooter({ locale }: DocsSiteFooterProps) {
    const docsLocale = toDocsLocale(locale);
    const t = docsLocale === "ko" ? COPY.ko : COPY.en;

    return (
        <Footer data-refineui-docs-site-footer>
            <FooterExplore>
                <FooterNav>
                    <FooterGroup>
                        <FooterGroupLabel>{t.docs}</FooterGroupLabel>
                        <FooterLink href={siteHref("/foundations", docsLocale)}>{t.foundations}</FooterLink>
                        <FooterLink href={siteHref("/components", docsLocale)}>{t.components}</FooterLink>
                        <FooterLink href={siteHref("/development", docsLocale)}>{t.development}</FooterLink>
                    </FooterGroup>
                    <FooterGroup>
                        <FooterGroupLabel>{t.development}</FooterGroupLabel>
                        <FooterLink href={siteHref("/development/installation", docsLocale)}>
                            {t.installation}
                        </FooterLink>
                        <FooterLink href={siteHref("/development/theming", docsLocale)}>{t.theming}</FooterLink>
                        <FooterLink href={siteHref("/development/motion", docsLocale)}>{t.motion}</FooterLink>
                        <FooterLink href={siteHref("/ai-tools", docsLocale)}>{t.aiTools}</FooterLink>
                    </FooterGroup>
                    <FooterGroup>
                        <FooterGroupLabel>{t.components}</FooterGroupLabel>
                        <FooterLink href={siteHref("/components/button", docsLocale)}>{t.button}</FooterLink>
                        <FooterLink href={siteHref("/components/input", docsLocale)}>{t.input}</FooterLink>
                        <FooterLink href={siteHref("/components/dialog", docsLocale)}>{t.dialog}</FooterLink>
                        <FooterLink href={siteHref("/components/sidebar", docsLocale)}>{t.sidebar}</FooterLink>
                    </FooterGroup>
                    <FooterGroup>
                        <FooterGroupLabel>{t.resources}</FooterGroupLabel>
                        <FooterLink href="https://github.com/pelagornis/refineui" target="_blank">
                            GitHub
                        </FooterLink>
                        <FooterLink href="https://www.npmjs.com/package/@refineui/react" target="_blank">
                            npm
                        </FooterLink>
                    </FooterGroup>
                </FooterNav>
            </FooterExplore>
            <FooterMeta>
                <FooterSocial>
                    <FooterLink
                        href="https://github.com/pelagornis/refineui"
                        target="_blank"
                        aria-label="GitHub"
                    >
                        <SocialIcon>
                            <path
                                fill="currentColor"
                                d="M8 1.3a6.665 6.665 0 0 1 6.667 6.667 6.68 6.68 0 0 1-4.542 6.325c-.333.067-.458-.142-.458-.316 0-.226.008-.942.008-1.834 0-.625-.208-1.025-.45-1.233 1.483-.167 3.042-.734 3.042-3.292a2.58 2.58 0 0 0-.684-1.792c.067-.166.3-.85-.066-1.766 0 0-.559-.184-1.834.683a6.2 6.2 0 0 0-1.666-.225c-.567 0-1.134.075-1.667.225-1.275-.858-1.833-.683-1.833-.683-.367.916-.134 1.6-.067 1.766a2.6 2.6 0 0 0-.683 1.792c0 2.55 1.55 3.125 3.033 3.292-.192.166-.367.458-.425.891-.383.175-1.342.459-1.942-.55-.125-.2-.5-.691-1.025-.683-.558.008-.225.317.009.442.283.158.608.75.683.941.133.376.567 1.092 2.242.784 0 .558.008 1.083.008 1.242 0 .174-.125.374-.458.316a6.66 6.66 0 0 1-4.559-6.325A6.665 6.665 0 0 1 8 1.3"
                            />
                        </SocialIcon>
                    </FooterLink>
                </FooterSocial>
                <FooterBrand>
                    <FooterCopyright>Pelagornis © 2026</FooterCopyright>
                </FooterBrand>
                <DocsFooterLocaleSelect locale={locale} label={t.language} />
            </FooterMeta>
        </Footer>
    );
}
