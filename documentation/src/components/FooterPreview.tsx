import { useState, type ReactNode } from "react";
import { iconSizes } from "@refineui/tokens";
import {
    Footer,
    FooterBrand,
    FooterCopyright,
    FooterExplore,
    FooterGroup,
    FooterGroupLabel,
    FooterLink,
    FooterLocale,
    FooterMeta,
    FooterMetaEnd,
    FooterNav,
    FooterSocial,
    Select,
    SelectContent,
    SelectItem,
    SelectPortal,
    SelectTrigger,
    footerLocaleTriggerClassName,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const languages = [
    { value: "en", label: "English" },
    { value: "ko", label: "한국어" },
    { value: "ja", label: "日本語" },
] as const;

function SocialIcon({ children }: { children: ReactNode }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-hidden>
            {children}
        </svg>
    );
}

/**
 * Site Footer preview — OpenAI-like meta: social icons, inline lockup, locale pill.
 */
export default function FooterPreview() {
    const [locale, setLocale] = useState("ko");
    const localeLabel = languages.find((language) => language.value === locale)?.label ?? "한국어";

    return (
        <PreviewFrame>
            <Footer>
                <FooterExplore>
                    <FooterNav>
                        <FooterGroup>
                            <FooterGroupLabel>Product</FooterGroupLabel>
                            <FooterLink href="#">Components</FooterLink>
                            <FooterLink href="#">Tokens</FooterLink>
                            <FooterLink href="#">CLI</FooterLink>
                            <FooterLink href="#">Changelog</FooterLink>
                        </FooterGroup>
                        <FooterGroup>
                            <FooterGroupLabel>Resources</FooterGroupLabel>
                            <FooterLink href="#">Guides</FooterLink>
                            <FooterLink href="#">Examples</FooterLink>
                            <FooterLink href="#">GitHub</FooterLink>
                        </FooterGroup>
                        <FooterGroup>
                            <FooterGroupLabel>Developers</FooterGroupLabel>
                            <FooterLink href="#">React</FooterLink>
                            <FooterLink href="#">Icons</FooterLink>
                            <FooterLink href="#">Playground</FooterLink>
                        </FooterGroup>
                        <FooterGroup>
                            <FooterGroupLabel>Company</FooterGroupLabel>
                            <FooterLink href="#">About</FooterLink>
                            <FooterLink href="#">Careers</FooterLink>
                            <FooterLink href="#">Contact</FooterLink>
                            <FooterLink href="#">News</FooterLink>
                        </FooterGroup>
                        <FooterGroup>
                            <FooterGroupLabel>Legal</FooterGroupLabel>
                            <FooterLink href="#">Privacy</FooterLink>
                            <FooterLink href="#">Terms</FooterLink>
                            <FooterLink href="#">Security</FooterLink>
                        </FooterGroup>
                    </FooterNav>
                </FooterExplore>
                <FooterMeta>
                    <FooterSocial>
                        <FooterLink href="#" aria-label="X">
                            <SocialIcon>
                                <path
                                    fill="currentColor"
                                    d="M11.819 2h2.035L9.407 7.083 14.639 14h-4.097L7.334 9.805 3.662 14H1.625l4.757-5.437L1.363 2h4.2l2.901 3.834zm-.715 10.782h1.128L4.951 3.153h-1.21z"
                                />
                            </SocialIcon>
                        </FooterLink>
                        <FooterLink href="#" aria-label="YouTube">
                            <SocialIcon>
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M13.47 2.672c.602.186 1.076.734 1.237 1.431C15 5.365 15 8 15 8s0 2.635-.293 3.897c-.161.697-.635 1.245-1.238 1.431-1.09.339-5.469.339-5.469.339s-4.378 0-5.47-.339c-.602-.186-1.076-.734-1.237-1.431C1 10.635 1 8 1 8s0-2.635.293-3.897c.161-.697.635-1.245 1.237-1.431C3.622 2.333 8 2.333 8 2.333s4.378 0 5.47.339M10.342 8l-3.81 2.2V5.8z"
                                />
                            </SocialIcon>
                        </FooterLink>
                        <FooterLink href="#" aria-label="LinkedIn">
                            <SocialIcon>
                                <path
                                    fill="currentColor"
                                    d="M13.1 2H2.9a.9.9 0 0 0-.9.9v10.2a.9.9 0 0 0 .9.9h10.2a.9.9 0 0 0 .9-.9V2.9a.9.9 0 0 0-.9-.9M5.6 12.2H3.8V6.8h1.8zm-.9-6.45A1.05 1.05 0 1 1 5.78 4.7 1.07 1.07 0 0 1 4.7 5.75m7.5 6.45h-1.8V9.356c0-.852-.36-1.158-.828-1.158A1.044 1.044 0 0 0 8.6 9.314a.4.4 0 0 0 0 .084V12.2H6.8V6.8h1.74v.78a1.87 1.87 0 0 1 1.62-.84c.93 0 2.016.516 2.016 2.196z"
                                />
                            </SocialIcon>
                        </FooterLink>
                        <FooterLink href="#" aria-label="GitHub">
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
                    <FooterMetaEnd>
                        <FooterLocale>
                            <Select size="sm" value={locale} onValueChange={setLocale}>
                                <SelectTrigger
                                    aria-label="Language"
                                    className={footerLocaleTriggerClassName}
                                    style={{ minWidth: 0 }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={iconSizes.xxsmall}
                                        height={iconSizes.xxsmall}
                                        fill="none"
                                        viewBox="0 0 20 20"
                                        aria-hidden
                                    >
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M1.667 10a8.333 8.333 0 1 1 16.666 0 8.333 8.333 0 0 1-16.666 0M10 3.333h-.009l.001.002c-.032.008-.186.074-.411.409-.214.319-.43.792-.622 1.414-.325 1.056-.55 2.446-.61 4.009h3.302c-.06-1.563-.285-2.953-.61-4.009-.192-.622-.408-1.095-.622-1.414-.224-.335-.379-.401-.41-.409l.001-.002zm1.651 7.5H8.349c.062 1.621.302 3.055.646 4.123.203.628.428 1.089.644 1.383.107.146.198.232.265.28a.4.4 0 0 0 .071.041l.023.007h.004l.023-.007a.4.4 0 0 0 .071-.041c.067-.048.158-.134.265-.28.216-.294.441-.755.644-1.383.344-1.068.584-2.502.646-4.123m-4.97-1.666c.061-1.704.306-3.264.685-4.499q.152-.493.338-.929a6.68 6.68 0 0 0-4.319 5.428zm-3.296 1.666h3.296c.063 1.766.323 3.379.728 4.635q.134.417.295.793a6.68 6.68 0 0 1-4.319-5.428m9.934 0h3.296a6.68 6.68 0 0 1-4.319 5.428 9 9 0 0 0 .295-.793c.405-1.256.665-2.869.728-4.635m3.296-1.666h-3.296c-.061-1.704-.305-3.264-.685-4.499a9 9 0 0 0-.338-.929 6.68 6.68 0 0 1 4.319 5.428"
                                        />
                                    </svg>
                                    {localeLabel}
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectContent>
                                        {languages.map((language) => (
                                            <SelectItem key={language.value} value={language.value}>
                                                {language.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        </FooterLocale>
                    </FooterMetaEnd>
                </FooterMeta>
            </Footer>
        </PreviewFrame>
    );
}
