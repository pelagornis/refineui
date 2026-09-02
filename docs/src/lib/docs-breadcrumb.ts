export type DocsBreadcrumbCrumb = {
    label: string;
    href?: string;
};

const DOCS_SECTIONS: Record<string, { label: string; slug: string }> = {
    foundations: { label: "Foundations", slug: "foundations" },
    components: { label: "Components", slug: "components" },
    development: { label: "Development", slug: "development" },
    "ai-tools": { label: "AI & Tools", slug: "ai-tools" },
};

function normalizePageId(pageId: string): string {
    if (pageId === "index") return "";
    if (pageId.endsWith("/index")) return pageId.slice(0, -"/index".length);
    return pageId;
}

function sectionHref(slug: string): string {
    return `/${slug}/`;
}

/** Build breadcrumb trail for a docs page. Returns null on the home page. */
export function buildDocsBreadcrumbTrail(
    pageId: string,
    pageTitle: string,
): DocsBreadcrumbCrumb[] | null {
    const normalizedId = normalizePageId(pageId);
    if (!normalizedId) return null;

    const crumbs: DocsBreadcrumbCrumb[] = [{ label: "Home", href: "/" }];
    const segments = normalizedId.split("/");
    const section = segments[0];
    const sectionConfig = DOCS_SECTIONS[section];

    if (sectionConfig && segments.length === 1) {
        crumbs.push({ label: pageTitle });
        return crumbs;
    }

    if (sectionConfig) {
        crumbs.push({ label: sectionConfig.label, href: sectionHref(sectionConfig.slug) });
        crumbs.push({ label: pageTitle });
        return crumbs;
    }

    crumbs.push({ label: pageTitle });
    return crumbs;
}
