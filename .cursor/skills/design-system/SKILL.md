---
name: design-system
description: UI/design/token work from code and docs. Invoke for token or component tasks.
allowed-tools: Read Write Grep Glob
paths:
  - "packages/react/**"
  - "packages/tokens/**"
  - "docs/**"
disable-model-invocation: true
---

# Design system (code-first)

Apply system-core + design-system + tokens-in-components rules.

## Where to look
- Tokens: `packages/tokens/src/global/*.ts`, `packages/tokens/src/semantic/*.ts`, `packages/tokens/README.md`
- Components: `packages/react/src/components/<Name>/`, `packages/react/src/tokens/`
- Docs: `docs/src/content/docs/foundations/`, `docs/src/content/docs/components/`
- Previews: `docs/src/components/*Preview.tsx`, `docs/src/components/catalog/`

## Rules
MUST: Use color, spacing, typography, stroke, radius, shadow, motion only from @refineui/tokens or component token maps.
MUST: New tokens extend foundationSizes → componentSizes; rebuild tokens before react.
MUST: New/changed components follow composable API patterns and update docs + catalog previews.
MUST NOT: Hardcode hex/rgba or arbitrary px in component styles.