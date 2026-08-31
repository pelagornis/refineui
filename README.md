# RefineUI

Design system for Pelagornis products. Foundation variables ship as `@refineui/tokens`. Components ship as `@refineui/react`. Docs: [design.pelagornis.com/refineui](https://design.pelagornis.com/refineui/).

**Docs:** [design.pelagornis.com/refineui](https://design.pelagornis.com/refineui/) · **AI context:** [`llm.txt`](https://design.pelagornis.com/refineui/llm.txt) · **Icons:** [refineui-system-icons](https://github.com/pelagornis/refineui-system-icons)

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
| [Getting started](https://design.pelagornis.com/refineui/getting-started/) | Install, architecture, first example |
| [Foundations](https://design.pelagornis.com/refineui/foundations/) | Design tokens, layout, visual language |
| [Components](https://design.pelagornis.com/refineui/components/) | Full component catalog with live previews |
| [Development](https://design.pelagornis.com/refineui/development/) | Installation, theming, motion |
| [AI & Tools](https://design.pelagornis.com/refineui/ai-tools/) | llms.txt, Skill, MCP |

Machine-readable indexes: [`llm.txt`](https://design.pelagornis.com/refineui/llm.txt) · [`llms.txt`](https://design.pelagornis.com/refineui/llms.txt)

## License

MIT. See [LICENSE](LICENSE).
