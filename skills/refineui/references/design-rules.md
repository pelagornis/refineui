# Design rules (summary)

Full foundations: `https://ui.pelagornis.com/foundations/`  
Component catalog: `https://ui.pelagornis.com/components/`

## MUST

- Use tokens from `@refineui/tokens` / Tailwind `refineui-*` utilities for color, space, radius, stroke, typography, shadow, motion, z-index.
- Follow composable APIs in `packages/react` — read a sibling component before adding patterns.
- Update `docs/src/content/docs` and catalog previews when changing public component behavior.

## MUST NOT

- Hardcode hex, rgba, or arbitrary px in component styles.
- Add convenience props (`title`, `description`, `items`, `actions`, `onClose`) or variants not in tokens + docs.
- Use `any` in TypeScript.
- Restructure `packages/` layout without an explicit request.

## Stylesheet (product apps)

```css
@import "@refineui/tokens/tailwind.css";
@import "@refineui/web-icons/dist/fonts/refineui-system-icons.css";
@import "@refineui/react/refineui.css";
```

## Docs index for LLMs

- `https://ui.pelagornis.com/llm.txt`
- `https://ui.pelagornis.com/llms.txt`
