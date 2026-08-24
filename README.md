# RefineUI

Design system for Pelagornis products. Foundation variables live in `@refineui/tokens`. The UI you ship is `@refineui/react`.

## Install

```bash
bun add @refineui/react @refineui/tokens
```

React 18+ and `react-dom` 18+ are required.

## Usage

Import the stylesheet once at the app entry.

```tsx
import { Button, Card, Input } from "@refineui/react";
import "@refineui/react/refineui.css";

export function Example() {
  return (
    <Card>
      <Input placeholder="Email" type="email" />
      <Button variant="primary" type="button">
        Submit
      </Button>
    </Card>
  );
}
```

## Packages

| Package | Role |
| --- | --- |
| [`@refineui/react`](packages/react) | Components |
| [`@refineui/tokens`](packages/tokens) | Color, type, space, motion |
| [`@refineui/utilities`](packages/utilities) | Shared helpers |

## Develop

```bash
bun install
bun run build
bun run docs
```

## Design

- [Foundation](https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650) — tokens
- [Web Kit](https://www.figma.com/design/CxoaTfftpyh8ETDBamkkEK/Pelagornis-RefineUI-Web-Kit?node-id=0-1) — components

## License

MIT. See [LICENSE](LICENSE).
