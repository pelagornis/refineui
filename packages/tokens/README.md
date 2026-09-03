# @refineui/tokens

Design tokens for RefineUI — TypeScript source of truth plus generated CSS.

## Install / build

```bash
bun run build   # or pnpm build — builds utilities → tokens → react
```

`@refineui/tokens` `build` runs `tsup` then `scripts/generate-css.mjs` and `scripts/generate-spec.mjs`, writing:

| File | Contents |
|------|----------|
| `dist/css-variables.css` | `:root` + dark semantic colors, motion, theme elevation, foundation sizes, focus ring, reduced-motion overrides |
| `dist/tailwind-theme.css` | Tailwind v4 `@theme` |
| `dist/refineui-typography.css` | `@utility refineui-typo-*` |
| `dist/spec/*.json` | Machine-readable token spec for Docs / MCP / Doctor |

`@refineui/react` build appends component recipes spec to `dist/spec/`.

## Layers

1. **Primitive / Foundation** (`src/global`) — palette, spacing, radius, shadows, foundation sizes, opacities, icon sizes, **`typographys`**, **`motion`** (raw duration / easing / scale / distance steps)
2. **Semantic** (`src/semantic`) — color aliases, **`semanticInteraction`** (motion roles → Foundation steps), elevation pairs, **`SEMANTIC_TEXT`** (bodyMd, labelSm, … → Foundation keys)
3. **Component** — colors/sizes/typography/state role maps in `@refineui/react` (`componentColorTokens`, `componentTypographyTokens`)
4. **Recipe** — `packages/react/src/recipes/` (base, variants, compoundVariants; slot recipes for Alert/Dialog/…)
5. **Interaction** — `refineui.css` + `data-state` contract

### Motion flow

```
motion.duration.duration150 (Foundation)
    → semanticInteraction.duration.fast (semantic role)
    → --refineui-foundation-motion-duration-150
    → --refineui-motion-duration-fast: var(--refineui-foundation-motion-duration-150)

motion.scale.scale98
    → semanticInteraction.scale.press (+ alias buttonActive)
    → --refineui-motion-scale-press
    → --refineui-motion-button-active-scale: var(--refineui-motion-scale-press)
```

Prefer semantic role CSS vars (`--refineui-motion-duration-fast`, `--refineui-motion-scale-press`) in components.

### Typography flow

```
typographys.body2 (Foundation)
    → SEMANTIC_TEXT.bodyMd (semantic role)
    → componentTypographyTokens.formControl.md (Web Kit)
    → semanticTextClass('bodyMd') → refineui-typo-body-2 (CSS utility)
```

CSS also emits semantic aliases: `--refineui-text-body-md-font-size` → `--refineui-typography-body-2-font-size`.

## Theme

- Semantic colors and bare elevations (`--refineui-elevation-8`, `shadow-refineui-8`) switch under `[data-theme="dark"]` / `.dark`
- Explicit `*light` / `*dark` elevations remain available when you need a fixed mode

## Consumption

```ts
import {
  foundationSizes,
  motion,
  opacities,
  semanticColors,
  semanticInteraction,
  spacings,
} from "@refineui/tokens";
```

```css
@import "@refineui/tokens/css-variables.css";
@import "@refineui/tokens/tailwind.css";
```

Spacing uses `sizeNone` … `sizeXXXLarge` (2→4→6→8→10… after the scale shift). 8px is `sizeSmall`.