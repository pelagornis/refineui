---
title: Introduction to RefineUI
description: Pelagornis RefineUI Web Kit — design system React components
---

# Introduction to RefineUI

**RefineUI** (`@refineui/react`) is a React component library aligned with the Figma **Pelagornis RefineUI Web Kit** and **Foundation** variables. Color, spacing, and typography follow **`@refineui/tokens`**, and interactions (hover, focus, etc.) are enhanced with **`refineui.css`**.

## Features

- **Web Kit parity** — Implementation matches Figma nodes and `docs/design-specs-web-kit.md` per component
- **Tokens only** — Component styles use `@refineui/tokens` (`colors`, `spacings`, `typographys`, etc.)
- **Accessibility** — ARIA and keyboard behavior for form controls, dialogs, toggles, and more
- **Single CSS import** — `refineui.css` applies shared interaction styles for buttons, inputs, checkboxes, etc.

## Requirements

- **React** 18+
- **react-dom** 18+ (when using components on the client)

## Installation

Example for apps outside this monorepo:

```bash
pnpm add @refineui/react @refineui/tokens
# or
npm install @refineui/react @refineui/tokens
```

## Stylesheet (required)

Interaction states (hover, active, focus-visible) and some default component behavior live in **global CSS**. Import once at your app entry.

```tsx
import "@refineui/react/refineui.css";
```

`Button`, `Input`, `Checkbox`, `Switch`, `Dropdown` items, etc. render without it, but you need this import for **design-system-aligned hover and focus** styles.

## Basic usage

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

## Documentation structure

- **Getting started** — this page
- **Components** — API, examples, and live previews per component
- **Guides** — [Project structure](/guides/packages/), [CLI](/guides/cli/)

## Figma

- [Foundation (variables & tokens)](https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650)
- [Web Kit (components)](https://www.figma.com/design/CxoaTfftpyh8ETDBamkkEK/Pelagornis-RefineUI-Web-Kit?node-id=7-6)

See **`docs/design-specs-web-kit.md`** in the repo for an implementation summary.
