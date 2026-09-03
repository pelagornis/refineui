/** Condensed RefineUI rules for LLM tool responses — mirrors repo agent rules. */
declare const DESIGN_RULES = "# RefineUI design-system rules (for AI assistants)\n\n## Architecture\n```\nFoundation \u2192 Semantic \u2192 Theme/Context \u2192 Component Tokens \u2192 Recipe \u2192 Component \u2192 State/Interaction\n```\n- **Tokens:** `@refineui/tokens` \u2014 palette, spacing, radius, typography, motion, z-index, focus, spec JSON\n- **Utilities:** `@refineui/utilities` \u2014 color/typography/motion helpers (depends on tokens, not vice versa)\n- **Components:** `@refineui/react` \u2014 composable subcomponents, recipes, contracts\n- **Stylesheet:** `@import \"@refineui/tokens/tailwind.css\"`, web-icons CSS, `@refineui/react/refineui.css`\n\n## Layer roles\n| Layer | Purpose |\n|-------|---------|\n| Foundation | Raw hex, px, ms \u2014 single source of literals |\n| Semantic | Meaning aliases (backgroundBrand, bodyMd, fast) |\n| Theme/Context | light/dark today; highContrast/forcedColors/brand reserved |\n| Component tokens | Per-component roles; use appearance + states |\n| Recipe | base, variants, compoundVariants, slot recipes |\n| Component | TSX + data-refineui |\n| Interaction | refineui.css (:hover, :focus-visible) + data-state |\n\n## DOM contract\n- `data-refineui` \u2014 component identity\n- `data-variant` / `data-size` \u2014 visual options\n- `data-state` \u2014 open, selected, loading, \u2026 (component state)\n- CSS pseudo states (hover, active, focus-visible, disabled) \u2014 refineui.css only\n\n## MUST\n- Use design tokens for color, spacing, radius, stroke, typography, shadow, z-index, motion\n- Match existing component patterns in `packages/react` before adding or changing APIs\n- Composable subcomponent APIs only \u2014 no convenience props (`title`, `description`, `items`, `actions`, `onClose`)\n- Import components from `@refineui/react` only\n- Honor `prefers-reduced-motion` \u2014 import refineui.css\n\n## MUST NOT\n- Hardcode hex/rgba or arbitrary px in component styles\n- Reference Foundation directly from component tokens (use semantic/componentSizes)\n- Invent variants, props, or dimensions not reflected in tokens + existing patterns\n- Use `:focus` alone for focus rings \u2014 use `:focus-visible`\n- Use `any` in TypeScript\n\n## MCP tools\n- `inspect_token` \u2014 trace semantic/component token dependency graph\n- `get_component_recipe` \u2014 variants, sizes, states, slots\n- `get_token_spec` \u2014 generated spec manifest\n\n## Stylesheet (product apps)\n```css\n@import \"@refineui/tokens/tailwind.css\";\n@import \"@refineui/web-icons/dist/fonts/refineui-system-icons.css\";\n@import \"@refineui/react/refineui.css\";\n```\n\n## Docs\n- Site: https://ui.pelagornis.com\n- Machine-readable index: https://ui.pelagornis.com/llm.txt\n- Foundations: /foundations/* \u2014 tokens and layout\n- Components: /components/* \u2014 flat A\u2013Z catalog\n";

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
