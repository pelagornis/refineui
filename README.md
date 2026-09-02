# RefineUI

Design system for Pelagornis products. Foundation variables ship as `@refineui/tokens`. Components ship as `@refineui/react`. Docs: [ui.pelagornis.com](https://ui.pelagornis.com/).

**Docs:** [ui.pelagornis.com](https://ui.pelagornis.com/) · **AI context:** [`llm.txt`](https://ui.pelagornis.com/llm.txt) · **Icons:** [refineui-system-icons](https://github.com/pelagornis/refineui-system-icons)

## Install

```bash
bun add @refineui/react @refineui/tokens
# or
npm install @refineui/react @refineui/tokens
```

React 18+ and `react-dom` 18+ are required.

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

## Usage

```tsx
import { Button, Card, Input } from "@refineui/react";
import "@refineui/react/refineui.css";

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

## Packages

| Package | Role |
| --- | --- |
| [`@refineui/react`](packages/react) | Accessible React components aligned with the Web Kit |
| [`@refineui/tokens`](packages/tokens) | Color, typography, spacing, sizing, radius, elevation, motion, z-index |
| [`@refineui/utilities`](packages/utilities) | Shared helpers and layout algorithms |
| [`@refineui/web-icons`](https://www.npmjs.com/package/@refineui/web-icons) | System icon font (used by `WebIcon`) |

## Monorepo

```
packages/react       @refineui/react
packages/tokens      @refineui/tokens
packages/utilities   @refineui/utilities
docs/                Astro + Starlight docs site
```

## Develop

```bash
bun install
bun run build          # utilities → tokens → react
bun run docs           # local docs dev server
bun run docs:build     # build packages + static docs
```

## Documentation

| Section | Topics |
| --- | --- |
| [Getting started](https://ui.pelagornis.com/getting-started/) | Install, architecture, first example |
| [Foundations](https://ui.pelagornis.com/foundations/) | Design tokens, layout, visual language |
| [Components](https://ui.pelagornis.com/components/) | Full component catalog with live previews |
| [Development](https://ui.pelagornis.com/development/) | Installation, theming, motion |
| [AI & Tools](https://ui.pelagornis.com/ai-tools/) | llms.txt, Skill, MCP |

Machine-readable indexes: [`llm.txt`](https://ui.pelagornis.com/llm.txt) · [`llms.txt`](https://ui.pelagornis.com/llms.txt)

## License

MIT. See [LICENSE](LICENSE).
