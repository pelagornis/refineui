/**
 * Embedded from `docs/public/DESIGN.md` at MCP build time (Stitch DESIGN.md alpha).
 * Prefer `getDesignMd()` for new call sites.
 */
declare const DESIGN_RULES: string;

type DocCategory = "components" | "foundations" | "development" | "guides" | "ai-tools";
type DocSummary = {
    slug: string;
    href: string;
    title: string;
    description: string;
    category: DocCategory;
};
type DocPage = DocSummary & {
    content: string;
};
declare const TOKEN_CATEGORIES: readonly ["colors", "typography", "spacing", "sizing", "radius", "stroke", "shadows", "motion", "zIndex"];
type TokenCategory = (typeof TOKEN_CATEGORIES)[number];
declare function normalizeSlug(input: string): string;
declare function getLlmIndex(): string;
/** Canonical DESIGN.md (Google Stitch alpha) embedded at MCP build time. */
declare function getDesignMd(): string;
declare function listPages(category?: DocCategory): DocSummary[];
declare function getDocPage(slugInput: string): DocPage | null;
declare function searchDocs(query: string, category?: DocCategory, limit?: number): DocSummary[];
declare function listTokenCategories(): TokenCategory[];
declare function listSemanticTextRoles(): string[];
declare function getIndexMeta(): {
    generatedAt: string;
    pageCount: number;
};

export { DESIGN_RULES, type DocCategory, type DocPage, type DocSummary, getDesignMd, getDocPage, getIndexMeta, getLlmIndex, listPages, listSemanticTextRoles, listTokenCategories, normalizeSlug, searchDocs };
