export type DocsNavLink = {
    type: "link";
    label: string;
    href: string;
    isCurrent: boolean;
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

function flattenLinks(entries: StarlightEntry[]): DocsNavLink[] {
    const links: DocsNavLink[] = [];
    for (const entry of entries) {
        if (entry.type === "link") {
            links.push({
                type: "link",
                label: entry.label,
                href: entry.href,
                isCurrent: entry.isCurrent,
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
            return {
                type: "link",
                label: entry.label,
                href: entry.href,
                isCurrent: entry.isCurrent,
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
