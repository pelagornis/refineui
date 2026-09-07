import { isLocaleAgnosticPath, toLocaleAgnosticPath } from "../lib/docs-locale";

export type DocsNavLink = {
    type: "link";
    label: string;
    href: string;
    isCurrent: boolean;
    external?: boolean;
};

export type DocsNavGroup = {
    type: "group";
    label: string;
    entries: DocsNavLink[];
    isCurrent: boolean;
};

export type DocsNavEntry = DocsNavLink | DocsNavGroup;

type StarlightLink = {
    type: "link";
    label: string;
    href: string;
    isCurrent: boolean;
};

type StarlightGroup = {
    type: "group";
    label: string;
    entries: StarlightEntry[];
};

type StarlightEntry = StarlightLink | StarlightGroup;

function isExternalHref(href: string): boolean {
    return /^https?:\/\//i.test(href);
}

/** Starlight locale-prefixes sidebar `link` entries — undo that for public root files. */
function normalizeNavHref(href: string): string {
    return isLocaleAgnosticPath(href) ? toLocaleAgnosticPath(href) : href;
}

function flattenLinks(entries: StarlightEntry[]): DocsNavLink[] {
    const links: DocsNavLink[] = [];
    for (const entry of entries) {
        if (entry.type === "link") {
            const href = normalizeNavHref(entry.href);
            links.push({
                type: "link",
                label: entry.label,
                href,
                isCurrent: entry.isCurrent,
                external: isExternalHref(href),
            });
            continue;
        }
        links.push(...flattenLinks(entry.entries));
    }
    return links;
}

/** JSON-safe nav tree for React islands — one group level, links flattened. */
export function serializeNav(entries: StarlightEntry[]): DocsNavEntry[] {
    return entries.map((entry) => {
        if (entry.type === "link") {
            const href = normalizeNavHref(entry.href);
            return {
                type: "link",
                label: entry.label,
                href,
                isCurrent: entry.isCurrent,
                external: isExternalHref(href),
            };
        }
        const links = flattenLinks(entry.entries);
        return {
            type: "group",
            label: entry.label,
            entries: links,
            isCurrent: links.some((link) => link.isCurrent),
        };
    });
}
