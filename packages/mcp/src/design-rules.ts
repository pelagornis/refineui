/** Condensed RefineUI rules for LLM tool responses — mirrors repo agent rules. */
export const DESIGN_RULES = `# RefineUI design-system rules (for AI assistants)

## Architecture
\`\`\`
Foundation → Semantic → Theme/Context → Component Tokens → Recipe → Component → State/Interaction
\`\`\`
- **Tokens:** \`@refineui/tokens\` — palette, spacing, radius, typography, motion, z-index, focus, spec JSON
- **Utilities:** \`@refineui/utilities\` — color/typography/motion helpers (depends on tokens, not vice versa)
- **Components:** \`@refineui/react\` — composable subcomponents, recipes, contracts
- **Stylesheet:** \`@import "@refineui/tokens/tailwind.css"\`, web-icons CSS, \`@refineui/react/refineui.css\`

## Layer roles
| Layer | Purpose |
|-------|---------|
| Foundation | Raw hex, px, ms — single source of literals |
| Semantic | Meaning aliases (backgroundBrand, bodyMd, fast) |
| Theme/Context | light/dark today; highContrast/forcedColors/brand reserved |
| Component tokens | Per-component roles; use appearance + states |
| Recipe | base, variants, compoundVariants, slot recipes |
| Component | TSX + data-refineui |
| Interaction | refineui.css (:hover, :focus-visible) + data-state |

## DOM contract
- \`data-refineui\` — component identity
- \`data-variant\` / \`data-size\` — visual options
- \`data-state\` — open, selected, loading, … (component state)
- CSS pseudo states (hover, active, focus-visible, disabled) — refineui.css only

## MUST
- Use design tokens for color, spacing, radius, stroke, typography, shadow, z-index, motion
- Match existing component patterns in \`packages/react\` before adding or changing APIs
- Composable subcomponent APIs only — no convenience props (\`title\`, \`description\`, \`items\`, \`actions\`, \`onClose\`)
- Import components from \`@refineui/react\` only
- Honor \`prefers-reduced-motion\` — import refineui.css

## MUST NOT
- Hardcode hex/rgba or arbitrary px in component styles
- Reference Foundation directly from component tokens (use semantic/componentSizes)
- Invent variants, props, or dimensions not reflected in tokens + existing patterns
- Use \`:focus\` alone for focus rings — use \`:focus-visible\`
- Use \`any\` in TypeScript

## MCP tools
- \`inspect_token\` — trace semantic/component token dependency graph
- \`get_component_recipe\` — variants, sizes, states, slots
- \`get_token_spec\` — generated spec manifest

## Stylesheet (product apps)
\`\`\`css
@import "@refineui/tokens/tailwind.css";
@import "@refineui/web-icons/dist/fonts/refineui-system-icons.css";
@import "@refineui/react/refineui.css";
\`\`\`

## Docs
- Site: https://ui.pelagornis.com
- Machine-readable index: https://ui.pelagornis.com/llm.txt
- Foundations: /foundations/* — tokens and layout
- Components: /components/* — flat A–Z catalog
`;
