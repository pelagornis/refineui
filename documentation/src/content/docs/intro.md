---
title: Introduction
description: RefineUI is the design system for Pelagornis products — tokens, layout, and components as one language.
---

# RefineUI

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

- [Foundations](/foundations/) — color, type, space, radius, elevation, motion
- [Layout](/layout/) — Stack, Grid, Container, Box
- [Components](/components/) — live looks and the API

[Foundation](https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650) · [Web Kit](https://www.figma.com/design/CxoaTfftpyh8ETDBamkkEK/Pelagornis-RefineUI-Web-Kit?node-id=0-1)
