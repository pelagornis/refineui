import docsIndex from "./generated/docs-index.json";
import { SEMANTIC_TEXT } from "@refineui/tokens";

export type DocCategory = "components" | "foundations" | "development" | "guides" | "ai-tools";

export type DocSummary = {
    slug: string;
    href: string;
    title: string;
    description: string;
    category: DocCategory;
};

export type DocPage = DocSummary & {
    content: string;
};

type DocPageRecord = DocPage & {
    content: string;
    searchText: string;
};

type DocsIndexFile = {
    generatedAt: string;
    llmIndex: string;
    pages: DocPageRecord[];
};

const index = docsIndex as DocsIndexFile;

const TOKEN_CATEGORIES = [
    "colors",
    "typography",
    "spacing",
    "sizing",
    "radius",
    "stroke",
    "shadows",
    "motion",
    "zIndex",
] as const;

export type TokenCategory = (typeof TOKEN_CATEGORIES)[number];

export function normalizeSlug(input: string): string {
    return input
        .trim()
        .replace(/^https?:\/\/[^/]+/i, "")
        .replace(/^\//, "")
        .replace(/\/$/, "");
}

export function getLlmIndex(): string {
    return index.llmIndex;
}

export function listPages(category?: DocCategory): DocSummary[] {
    return index.pages
        .filter((page) => (category ? page.category === category : true))
        .map(({ slug, href, title, description, category: pageCategory }) => ({
            slug,
            href,
            title,
            description,
            category: pageCategory,
        }));
}

export function getDocPage(slugInput: string): DocPage | null {
    const slug = normalizeSlug(slugInput);
    const page = index.pages.find((item) => item.slug === slug);
    if (!page) return null;
    const { searchText, ...doc } = page;
    void searchText;
    return doc;
}

export function searchDocs(query: string, category?: DocCategory, limit = 10): DocSummary[] {
    const terms = query
        .toLowerCase()
        .split(/\s+/)
        .map((term) => term.trim())
        .filter(Boolean);

    if (terms.length === 0) {
        return listPages(category).slice(0, limit);
    }

    const scored = index.pages
        .filter((page) => (category ? page.category === category : true))
        .map((page) => {
            let score = 0;
            for (const term of terms) {
                if (page.slug.includes(term)) score += 4;
                if (page.title.toLowerCase().includes(term)) score += 3;
                if (page.description.toLowerCase().includes(term)) score += 2;
                if (page.searchText.includes(term)) score += 1;
            }
            return { page, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scored.map(({ page }) => ({
        slug: page.slug,
        href: page.href,
        title: page.title,
        description: page.description,
        category: page.category,
    }));
}

export function listTokenCategories(): TokenCategory[] {
    return [...TOKEN_CATEGORIES];
}

export function listSemanticTextRoles(): string[] {
    return Object.keys(SEMANTIC_TEXT);
}

export function getIndexMeta(): { generatedAt: string; pageCount: number } {
    return {
        generatedAt: index.generatedAt,
        pageCount: index.pages.length,
    };
}
