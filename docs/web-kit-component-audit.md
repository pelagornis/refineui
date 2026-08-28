# Component audit (code-first)

**Goal:** Keep `packages/react` aligned with **`@refineui/tokens`** and shipped docs/previews.

## Principles (required)

1. **Token chain** — Component dimensions alias `foundationSizes` via `componentSizes` (`.cursor/rules/design-system.mdc`).
2. **Variants·API match** — Follow existing shipped components; do not add props·slots·behavior outside established patterns.
3. **Tokens only** — `colors`, `spacings`, `typographys`, `strokeWidths`, `borderRadii`, `shadows`, `iconSizes`, `foundationSizes`, `componentSizes`, etc. No arbitrary `#hex` / `px` (`.cursor/rules/tokens-in-components.mdc`).
4. **Verification** — Per component, read `packages/react/src/components/<Name>/`, `documentation/src/content/docs/components/<name>.mdx`, and catalog preview.

## Per-component checklist (copy-paste)

- [ ] Confirm component folder and public exports in `packages/react/src/index.ts`
- [ ] Variants (props) match existing implementation and docs
- [ ] Styles use only `@refineui/tokens`
- [ ] Docs `documentation/.../components/*.mdx`·Preview align at least at a high level

## Order

Work **alphabetically**, one at a time. Track status in [components-list.md](components-list.md).

## Current status

- All shipped components are listed in [components-list.md](components-list.md) with package paths and docs links.
- After token or component changes, re-run the checklist above for affected rows only.
- Run `pnpm docs:build` when docs or previews change.
