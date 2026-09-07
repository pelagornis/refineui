---
version: alpha
name: RefineUI
description: >-
  Pelagornis design system for product UI. YAML values are light-theme identity
  snapshots for Stitch and coding agents. Authoritative tokens live in
  @refineui/tokens; shipped UI lives in @refineui/react. Prefer semantic aliases
  and components over copying these hex values into product code.
colors:
  primary: "#212121"
  on-primary: "#FFFFFF"
  secondary: "#6C6C6C"
  tertiary: "#7694FF"
  neutral: "#FFFFFF"
  surface: "#FFFFFF"
  surface-sunken: "#F0F0F0"
  foreground: "#212121"
  foreground-secondary: "#6C6C6C"
  border: "#DBDBDB"
  error: "#FF6969"
  success: "#26B12D"
  warning: "#F1B500"
  discovery: "#BD7BFF"
  inverse: "#000000"
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: 800
    lineHeight: 86px
  heading-md:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 700
    lineHeight: 60px
  title-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 36px
  subtitle-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  caption-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
rounded:
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  "2xl": 16px
  full: 9999px
spacing:
  none: 0px
  xxxs: 2px
  xxs: 4px
  xs: 6px
  sm: 8px
  md: 10px
  lg: 16px
  xl: 20px
  "2xl": 24px
  "3xl": 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: 10px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 10px
  surface-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: 16px
---

# RefineUI

How agents should use this file: treat YAML as the **visual identity snapshot** (Stitch / UI generation). For product code, prefer `@refineui/react` components and `@refineui/tokens` semantic aliases — do not hardcode these hex/px values. Full page index: https://ui.pelagornis.com/llm.txt · Live site: https://ui.pelagornis.com

## Overview

RefineUI is Pelagornis’s unified design system: Foundation variables become `@refineui/tokens`; the Web Kit ships as `@refineui/react`. Docs render real package output, not mockups.

The system feels **precise, neutral, and product-first** — high-contrast ink on clean surfaces, restrained radius, and semantic color roles (brand, status, discovery) rather than decorative gradients. Light and dark resolve through `[data-theme]` semantic aliases; agents generating screens should assume light tokens unless the task asks for dark.

Architecture (do not skip layers):

```
Foundation → Semantic → Theme/Context → Component tokens → Recipe → Component → State/Interaction
```

## Colors

Palette roles map to semantic aliases (`backgroundBrand`, `foregroundPrimary`, `borderDefault`, …). Light-theme identity values are in the YAML front matter.

- **Primary (#212121):** Brand ink — primary actions, strong emphasis, brand fills (`backgroundBrand` / `foregroundBrand`).
- **On-primary (#FFFFFF):** Text and icons on brand fills (`foregroundOnBrand`).
- **Secondary (#6C6C6C):** Supporting copy and quieter chrome (`foregroundSecondary`).
- **Tertiary (#7694FF):** Info and links — not a second brand (`foregroundLink`, `backgroundInfo`).
- **Neutral / surface (#FFFFFF):** Page and card canvases (`backgroundPrimary`, `backgroundSurface`).
- **Surface-sunken:** Recessed wells (`surfaceSunken`).
- **Border (#DBDBDB):** Default dividers and control outlines (`borderDefault`).
- **Error / success / warning / discovery:** Status and accent roles only — never as generic decoration.

Dark theme flips the same semantic names via CSS variables; do not invent a second hex palette in product CSS.

## Typography

Single family **Inter** for UI. Prefer semantic text roles (`displayLg`, `headingMd`, `titleMd`, `bodyMd`, `captionMd`, …) over raw Foundation keys.

- **Display / heading:** Heavy–bold for marketing and page titles.
- **Title / subtitle:** Semibold for component and section headers.
- **Body:** Medium or regular at 14px for primary reading and controls.
- **Caption / label:** 12–14px for metadata, helpers, and form labels.

## Layout

Spacing uses the RefineUI T-shirt scale (`sizeNone` … `sizeXXXLarge`: 0–32px). Prefer token utilities (`gap-refineui-*`, Box/Stack `gap`) over arbitrary Tailwind spacing.

Layout primitives: `Box`, `Stack`, `Grid`, `Container`. Prefer **logical** insets (`ps`/`pe`/`ms`/`me`, `text-start`) for RTL. Spec `layout.direction=logical` is the contract — avoid physical `left`/`right` unless intentional (documented in component Spec).

## Elevation & Depth

Elevation steps are semantic shadows (`shadow2` … `shadow64`) with separate light/dark recipes. Use the lowest step that establishes hierarchy; do not stack multi-layer custom box-shadows. Overlays use `surfaceOverlay` scrims, not ad-hoc rgba.

## Shapes

Radius scale: `roundedXSmall` (2px) through `roundedXXLarge` (16px), plus `roundedCircle`. Default interactive controls land around **large (8px)**; cards and panels often **x-large (12px)**. Prefer token radii over arbitrary `rounded-*` values.

## Components

Compose from `@refineui/react` — no convenience props (`title`, `description`, `items`, `actions`, `onClose`). Match sibling component patterns before inventing APIs.

DOM / state contract:

- `data-refineui` — component identity
- `data-variant` / `data-size` — visual options
- `data-state` — open, selected, loading, …
- Hover / `:focus-visible` / disabled — `refineui.css` (do not reimplement with `:focus` alone)

Import only from `@refineui/react`. Stylesheet at app root:

```css
@import "@refineui/tokens/tailwind.css";
@import "@refineui/web-icons/dist/fonts/refineui-system-icons.css";
@import "@refineui/react/refineui.css";
```

Deep lookup: catalog at https://ui.pelagornis.com/components/ · MCP tools `get_component_spec`, `get_component_recipe`, `inspect_token`.

## Do's and Don'ts

**Do**

- Use design tokens for color, spacing, radius, stroke, typography, shadow, z-index, and motion.
- Follow composable subcomponent APIs and existing `packages/react` patterns.
- Honor `:focus-visible`, `prefers-reduced-motion`, and forced-colors contracts from Spec / Doctor.
- Start from https://ui.pelagornis.com/llm.txt (or `@refineui/mcp`) before inventing APIs.

**Don't**

- Hardcode hex, rgba, or arbitrary px in component styles.
- Reference Foundation literals from component tokens — use semantic / `componentSizes`.
- Invent variants, props, or dimensions not reflected in tokens + docs.
- Duplicate this file’s token tables into agent skills — link here instead.
