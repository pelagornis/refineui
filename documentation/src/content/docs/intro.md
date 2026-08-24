---
title: Getting Started
description: Install RefineUI and ship your first screen with tokens and React components.
---

# Getting Started

RefineUI is the design system for Pelagornis products. Foundation variables become `@refineui/tokens`. UI is `@refineui/react`. The Web Kit you design against is the React you ship.

## Install

```bash
bun add @refineui/react @refineui/tokens
```

## Stylesheet

Import once at the app entry. Hover, active, and focus-visible live here.

```tsx
import "@refineui/react/refineui.css";
```

## Example

```tsx
import { Button, Input, Card } from "@refineui/react";
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

Requires React 18+ and react-dom 18+ on the client.

## Next Steps

- **[Foundations](/foundations/)** — color, type, space, radius, elevation, motion
- **[Design Tokens](/foundations/design-tokens/)** — use semantic tokens in your components
- **[Layout](/components/stack/)** — Stack, Grid, Container, Box, ScrollArea
- **[Components](/components/)** — explore the full component catalog

## Design Files

- [Foundation](https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650) — design tokens and variables
- [Web Kit](https://www.figma.com/design/CxoaTfftpyh8ETDBamkkEK/Pelagornis-RefineUI-Web-Kit?node-id=0-1) — component specifications
