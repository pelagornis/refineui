# @refineui/react

Accessible React components for [RefineUI](https://ui.pelagornis.com) — composed from `@refineui/tokens`, shipped with a machine-readable component contract.

## Install

```bash
npm install @refineui/react @refineui/tokens
yarn add @refineui/react @refineui/tokens
pnpm add @refineui/react @refineui/tokens
bun add @refineui/react @refineui/tokens
```

React 18+ and `react-dom` 18+ are required as peers.

## Stylesheet

Load token CSS, system icons, and component interaction styles once at the app root:

```css
@import "@refineui/tokens/tailwind.css";
@import "@refineui/web-icons/dist/fonts/refineui-system-icons.css";
@import "@refineui/react/refineui.css";
```

Or in JS:

```tsx
import "@refineui/react/refineui.css";
```

`refineui.css` carries the pseudo-state layer (`:hover`, `:focus-visible`, `data-state`), so components render unstyled interactions without it.

## Usage

```tsx
import { Button, Card, Input } from "@refineui/react";

export function Example() {
  return (
    <Card>
      <Input placeholder="Email" type="email" />
      <Button variant="primary" type="button">
        Continue
      </Button>
    </Card>
  );
}
```

Subcomponents compose explicitly — there are no convenience props such as `title`, `items`, or `actions`:

```tsx
import {
  Alert,
  AlertBody,
  AlertDescription,
  AlertIcon,
  AlertRow,
  AlertTitle,
} from "@refineui/react";

<Alert variant="warning">
  <AlertRow>
    <AlertIcon />
    <AlertBody>
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>Free up space to keep syncing.</AlertDescription>
    </AlertBody>
  </AlertRow>
</Alert>;
```

## Component Spec

Every component ships a behavior contract — anatomy, variants, states, DOM attributes, accessibility, keyboard, focus, and layout direction:

```
spec/manifest.json          # catalog of all component specs
spec/components/*.json      # one contract per component
spec/schema/*.json          # JSON Schema for the contract shape
dist/spec/contract-index.json
dist/spec/token-trace-v2.json
```

These files are what [`@refineui/doctor`](https://www.npmjs.com/package/@refineui/doctor) validates against and what [`@refineui/mcp`](https://www.npmjs.com/package/@refineui/mcp) serves to agents. See `spec/README.md` for the contract layer status.

## Conventions

- Root elements carry `data-refineui`; component states carry `data-state`.
- Color, spacing, radius, stroke, typography, shadow, z-index, and motion come from tokens only.
- Focus rings use `:focus-visible` with `--refineui-focus-ring-*`.
- Motion collapses under `prefers-reduced-motion`; forced-colors mode maps to system colors.
- Layout uses logical properties (`ps`/`pe`/`ms`/`me`) so RTL works without overrides.

## Development

```bash
bun run build   # utilities → tokens → tsup → refineui.css → component spec
bun run dev     # tsup --watch
```

Docs: [ui.pelagornis.com/components](https://ui.pelagornis.com/components/) · AI context: [`llm.txt`](https://ui.pelagornis.com/llm.txt)
