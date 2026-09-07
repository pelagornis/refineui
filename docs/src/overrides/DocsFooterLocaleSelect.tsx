import { iconSizes } from "@refineui/tokens";
import {
    FooterLocale,
    FooterMetaEnd,
    Select,
    SelectContent,
    SelectItem,
    SelectPortal,
    SelectTrigger,
    footerLocaleTriggerClassName,
} from "@refineui/react";
import { splitLocalePath, withLocalePath } from "../lib/docs-locale";

const LANGUAGES = [
    { code: "root", label: "English" },
    { code: "ko", label: "한국어" },
] as const;

export type DocsFooterLocaleSelectProps = {
    /** Starlight locale (`undefined` / omit = root English). */
    locale?: string;
    label?: string;
};

function GlobeIcon() {
    return (
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
    );
}

/** Footer meta language switch — same chrome as Footer Preview (`FooterLocale` + plain Select). */
export function DocsFooterLocaleSelect({
    locale,
    label = "Language",
}: DocsFooterLocaleSelectProps) {
    const localeCode = locale === "ko" ? "ko" : "root";
    const localeLabel = LANGUAGES.find((language) => language.code === localeCode)?.label ?? "English";

    return (
        <FooterMetaEnd>
            <FooterLocale>
                <Select
                    size="sm"
                    value={localeCode}
                    onValueChange={(code) => {
                        const { path } = splitLocalePath(window.location.pathname);
                        const next = withLocalePath(path, code === "ko" ? "ko" : undefined);
                        if (next !== window.location.pathname) {
                            window.location.assign(next);
                        }
                    }}
                >
                    <SelectTrigger
                        appearance="plain"
                        aria-label={label}
                        className={`${footerLocaleTriggerClassName} min-w-0`}
                    >
                        <GlobeIcon />
                        {localeLabel}
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectContent>
                            {LANGUAGES.map((language) => (
                                <SelectItem key={language.code} value={language.code}>
                                    {language.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectPortal>
                </Select>
            </FooterLocale>
        </FooterMetaEnd>
    );
}
