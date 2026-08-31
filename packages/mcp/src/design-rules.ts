/** Condensed RefineUI rules for LLM tool responses — mirrors repo agent rules. */
export const DESIGN_RULES = `# RefineUI design-system rules (for AI assistants)

## Architecture
- **Tokens:** \`@refineui/tokens\` — palette, spacing, radius, typography, motion, z-index
- **Components:** \`@refineui/react\` — composable subcomponents only
- **Stylesheet:** \`@import "@refineui/tokens/tailwind.css"\`, web-icons CSS, \`@refineui/react/refineui.css\`

## MUST
- Use design tokens for color, spacing, radius, stroke, typography, shadow, z-index, motion
- Match existing component patterns in \`packages/react\` before adding or changing APIs
- Composable subcomponent APIs only — no convenience props (\`title\`, \`description\`, \`items\`, \`actions\`, \`onClose\`)
- Import components from \`@refineui/react\` only

## MUST NOT
- Hardcode hex/rgba or arbitrary px in component styles
- Invent variants, props, or dimensions not reflected in tokens + existing patterns
- Use \`any\` in TypeScript
- Change monorepo \`packages/\` layout arbitrarily

## Stylesheet (product apps)
\`\`\`css
@import "@refineui/tokens/tailwind.css";
@import "@refineui/web-icons/dist/fonts/refineui-system-icons.css";
@import "@refineui/react/refineui.css";
\`\`\`

## Docs
- Site: https://design.pelagornis.com/refineui
- Machine-readable index: https://design.pelagornis.com/refineui/llm.txt
- Foundations: /foundations/* — tokens and layout
- Components: /components/* — flat A–Z catalog
`;
