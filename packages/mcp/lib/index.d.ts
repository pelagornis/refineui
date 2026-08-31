/** Condensed RefineUI rules for LLM tool responses — mirrors repo agent rules. */
declare const DESIGN_RULES = "# RefineUI design-system rules (for AI assistants)\n\n## Architecture\n- **Tokens:** `@refineui/tokens` \u2014 palette, spacing, radius, typography, motion, z-index\n- **Components:** `@refineui/react` \u2014 composable subcomponents only\n- **Stylesheet:** `@import \"@refineui/tokens/tailwind.css\"`, web-icons CSS, `@refineui/react/refineui.css`\n\n## MUST\n- Use design tokens for color, spacing, radius, stroke, typography, shadow, z-index, motion\n- Match existing component patterns in `packages/react` before adding or changing APIs\n- Composable subcomponent APIs only \u2014 no convenience props (`title`, `description`, `items`, `actions`, `onClose`)\n- Import components from `@refineui/react` only\n\n## MUST NOT\n- Hardcode hex/rgba or arbitrary px in component styles\n- Invent variants, props, or dimensions not reflected in tokens + existing patterns\n- Use `any` in TypeScript\n- Change monorepo `packages/` layout arbitrarily\n\n## Stylesheet (product apps)\n```css\n@import \"@refineui/tokens/tailwind.css\";\n@import \"@refineui/web-icons/dist/fonts/refineui-system-icons.css\";\n@import \"@refineui/react/refineui.css\";\n```\n\n## Docs\n- Site: https://design.pelagornis.com/refineui\n- Machine-readable index: https://design.pelagornis.com/refineui/llm.txt\n- Foundations: /foundations/* \u2014 tokens and layout\n- Components: /components/* \u2014 flat A\u2013Z catalog\n";

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
declare function listPages(category?: DocCategory): DocSummary[];
declare function getDocPage(slugInput: string): DocPage | null;
declare function searchDocs(query: string, category?: DocCategory, limit?: number): DocSummary[];
declare function listTokenCategories(): TokenCategory[];
declare function listSemanticTextRoles(): string[];
declare function getIndexMeta(): {
    generatedAt: string;
    pageCount: number;
};

export { DESIGN_RULES, type DocCategory, type DocPage, type DocSummary, getDocPage, getIndexMeta, getLlmIndex, listPages, listSemanticTextRoles, listTokenCategories, normalizeSlug, searchDocs };
