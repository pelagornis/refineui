import { stripLocaleFromPageId, withLocalePath, type DocsLocaleCode } from "./docs-locale";

export type DocsBreadcrumbCrumb = {
    label: string;
    href?: string;
};

const DOCS_SECTIONS: Record<string, { label: string; labelKo: string; slug: string }> = {
    foundations: { label: "Foundations", labelKo: "파운데이션", slug: "foundations" },
    components: { label: "Components", labelKo: "컴포넌트", slug: "components" },
    development: { label: "Development", labelKo: "개발", slug: "development" },
    "ai-tools": { label: "AI & Tools", labelKo: "AI & 도구", slug: "ai-tools" },
};

function normalizePageId(pageId: string): string {
    if (pageId === "index") return "";
    if (pageId.endsWith("/index")) return pageId.slice(0, -"/index".length);
    return pageId;
}

/** Build breadcrumb trail for a docs page. Returns null on the home page. */
export function buildDocsBreadcrumbTrail(
    pageId: string,
    pageTitle: string,
    locale?: DocsLocaleCode,
): DocsBreadcrumbCrumb[] | null {
    const normalizedId = normalizePageId(stripLocaleFromPageId(pageId));
    if (!normalizedId) return null;

    const homeLabel = locale === "ko" ? "홈" : "Home";
    const crumbs: DocsBreadcrumbCrumb[] = [
        { label: homeLabel, href: withLocalePath("/", locale) },
    ];
    const segments = normalizedId.split("/");
    const section = segments[0];
    const sectionConfig = DOCS_SECTIONS[section];

    if (sectionConfig && segments.length === 1) {
        crumbs.push({ label: pageTitle });
        return crumbs;
    }

    if (sectionConfig) {
        crumbs.push({
            label: locale === "ko" ? sectionConfig.labelKo : sectionConfig.label,
            href: withLocalePath(`/${sectionConfig.slug}/`, locale),
        });
        crumbs.push({ label: pageTitle });
        return crumbs;
    }

    crumbs.push({ label: pageTitle });
    return crumbs;
}
