import { useState } from "react";
import {
    Footer,
    FooterBottom,
    FooterBrand,
    FooterBrandDescription,
    FooterBrandName,
    FooterContent,
    FooterCopyright,
    FooterGroup,
    FooterGroupLabel,
    FooterLink,
    FooterLocale,
    FooterNav,
    FooterSocial,
    Select,
    SelectContent,
    SelectItem,
    SelectPortal,
    SelectTrigger,
    SelectValue,
    footerLocaleTriggerClassName,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const languages = [
    { value: "en", label: "English" },
    { value: "ko", label: "한국어" },
    { value: "ja", label: "日本語" },
] as const;

/**
 * Site Footer preview — signature wordmark, ghost locale Select, quiet columns.
 */
export default function FooterPreview() {
    const [locale, setLocale] = useState("en");

    return (
        <PreviewFrame minHeight="min(45vh, 360px)">
            <Footer className="w-full">
                <FooterContent>
                    <FooterBrand>
                        <FooterBrandName>RefineUI</FooterBrandName>
                        <FooterBrandDescription>
                            Design system for calm product interfaces.
                        </FooterBrandDescription>
                    </FooterBrand>
                    <FooterNav>
                        <FooterGroup>
                            <FooterGroupLabel>Product</FooterGroupLabel>
                            <FooterLink href="#">Components</FooterLink>
                            <FooterLink href="#">Tokens</FooterLink>
                            <FooterLink href="#">CLI</FooterLink>
                        </FooterGroup>
                        <FooterGroup>
                            <FooterGroupLabel>Resources</FooterGroupLabel>
                            <FooterLink href="#">Guides</FooterLink>
                            <FooterLink href="#">Changelog</FooterLink>
                            <FooterLink href="#">GitHub</FooterLink>
                        </FooterGroup>
                        <FooterGroup>
                            <FooterGroupLabel>Company</FooterGroupLabel>
                            <FooterLink href="#">About</FooterLink>
                            <FooterLink href="#">Contact</FooterLink>
                            <FooterLink href="#">Privacy</FooterLink>
                        </FooterGroup>
                    </FooterNav>
                </FooterContent>
                <FooterBottom>
                    <FooterCopyright>© 2026 Pelagornis</FooterCopyright>
                    <FooterLocale>
                        <Select size="sm" value={locale} onValueChange={setLocale}>
                            <SelectTrigger
                                aria-label="Language"
                                className={footerLocaleTriggerClassName}
                                style={{ minWidth: 0 }}
                            >
                                <SelectValue />
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
                    <FooterSocial>
                        <FooterLink href="#">GitHub</FooterLink>
                        <FooterLink href="#">X</FooterLink>
                    </FooterSocial>
                </FooterBottom>
            </Footer>
        </PreviewFrame>
    );
}
