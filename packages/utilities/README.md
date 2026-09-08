# @refineui/utilities

Shared helpers behind [RefineUI](https://ui.pelagornis.com) components — token references, DOM attribute normalization, and React composition primitives.

This package holds the logic that would otherwise be duplicated across components. It depends only on `@refineui/version`, never on `@refineui/tokens`, so token packages stay at the bottom of the dependency graph.

## Install

```bash
npm install @refineui/utilities
yarn add @refineui/utilities
pnpm add @refineui/utilities
bun add @refineui/utilities
```

React 18+ is a peer dependency, required only for the `react` entry point.

## Entry points

| Import | Contents |
|--------|----------|
| `@refineui/utilities` | animation + color + dom + react + typography |
| `@refineui/utilities/color` | Color token refs, CSS var resolution, `hexToRgba`, `shadowWithColor` |
| `@refineui/utilities/typography` | Semantic text and Foundation typography token refs |
| `@refineui/utilities/animation` | Motion presets, transition/animation style builders, reduced-motion query |
| `@refineui/utilities/react` | `useComposedRefs`, `composeRefs`, `acquireBodyScrollLock`, `getMergeableTriggerChild` |

Subpath imports keep React out of the bundle when you only need token helpers.

## Color tokens

```ts
import {
  hexToRgba,
  resolveColorTokenValue,
  semanticColorToken,
} from "@refineui/utilities/color";

const surface = semanticColorToken("background-surface");
resolveColorTokenValue(surface); // var(--refineui-color-alias-background-surface)
hexToRgba("#1a1a1a", 0.6); // rgba(26, 26, 26, 0.6)
```

Raw strings pass through `resolveColorTokenValue` unchanged, so a token ref and a literal can share one prop type.

## Motion

```ts
import { createTransitionStyle, getReducedMotionQuery } from "@refineui/utilities/animation";

const style = createTransitionStyle({
  properties: ["opacity", "transform"],
  duration: "fast", // instant | fast | normal | slow | toast
  easing: "standard", // standard | emphasized | linear
});
```

Durations and easings resolve to token CSS variables, so motion stays in step with `@refineui/tokens`. Pass `reduceMotion: true` to collapse a transition to `instant`, and use `getReducedMotionQuery()` — which returns the `@media (prefers-reduced-motion: reduce)` at-rule — when emitting the same contract in a stylesheet.

## React composition

```tsx
import { useComposedRefs, acquireBodyScrollLock } from "@refineui/utilities/react";

const ref = useComposedRefs(localRef, forwardedRef);

// Overlay surfaces lock the body once and release on the last unmount.
useEffect(() => acquireBodyScrollLock(), []);
```

`acquireBodyScrollLock` is reference counted, so nested Dialog and Drawer instances do not fight over `overflow`.

## DOM attributes

```ts
import { ariaAttr, dataAttr } from "@refineui/utilities";

dataAttr(isSelected); // "" | undefined     → renders data-selected only when true
ariaAttr(isDisabled); // "true" | undefined → omits aria-disabled when false
```

## Development

```bash
bun run build   # one tsup pass per entry point
```
