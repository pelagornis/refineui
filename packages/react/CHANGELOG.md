# @refineui/react

## 0.2.1

### Patch Changes

- Depend on the current `@refineui/tokens` (2.2.0) instead of 1.0.4. The previous release was packed from a stale lockfile, so installs pulled tokens 1.0.4 — which lacks the Popover / Tooltip beak sizes and rendered the beaks as NaN. Drop any `overrides` / `resolutions` you added for `@refineui/tokens`.

## 0.2.0

### Minor Changes

- 4c609a6: Command: add `size` (`"sm" | "md" | "lg"`, default `"md"`). It sets the SearchField size, the results panel radius (matching the field), and item text, vertical padding, and icon slot. `CommandDialog` defaults its Command to `"lg"`; pass `commandProps.size` to override. `componentTypographyTokens.command.item` is now a per-size record, and `CommandSize` is exported.
- 4c609a6: ScrollArea: picker-style edge blur, always on. Rows marked `data-scroll-edge-item` blur progressively across the outer quarter of the scrollport on each side; size and opacity never change. The blur applies only toward an edge that actually hides content — ScrollArea publishes `--refineui-scroll-edge-top` / `--refineui-scroll-edge-bottom` (0 → 1 as content hides past that edge) — so lists that do not scroll, and the edge you are parked at, are untouched, and the blur fades in as you scroll away. Unmarked content is never affected. Scroll-driven via `animation-timeline: view()`; no effect where unsupported or under `prefers-reduced-motion`.

  Command, Select, and Dropdown mark their rows (items and group labels); Command's selection plate is marked too, so it blurs with its row. `CommandGroup` uses `overflow: clip` so the viewport stays the scroll container. Command's forced-colors root rule is restored.

  Tokens: semantic blur role `scrollEdge` → `blur2` (`--refineui-blur-scroll-edge`).

- 4c609a6: SearchField: add `size` (`"sm" | "md" | "lg"`, default `"md"`) using the same height, radius, padding, and typography tiers as Input. Inherits the `Field` size when omitted; the leading and clear icons scale with it. Command's search field uses `lg` so its radius matches the results panel.
- 4c609a6: Sidebar: `SidebarContent` now scrolls through a built-in ScrollArea (hover overlay scrollbar) instead of native `overflow-y: auto`; its padding moved inside the viewport so rows scroll under the edges. `SidebarLink` and `SidebarGroupLabel` inside `SidebarContent` take the ScrollArea edge blur; footer rows do not. Remove any ScrollArea you nested inside `SidebarContent`.

### Patch Changes

- 4c609a6: Carousel: no motion on first load. With `loop`, the initial track alignment (after slides register and edge clones are inserted) now snaps instead of sliding in from the leading clone. The indicator pill no longer grows from zero width — its transition is gated by `data-animate` after the first measured paint, like Segmented Control, and respects `prefers-reduced-motion`.
- 4c609a6: Command: cleaner, motion-aware palette that works inline as well as in `CommandDialog`.

  - Detached layout: `CommandInput` is the standard (filled) SearchField on top, and `CommandList` is its own bordered, raised results panel below. The `Command` root and the `CommandDialog` panel no longer draw a surface.
  - One sliding `command-indicator` highlights the selected item (soft surface fill); it slides on keyboard/pointer navigation and snaps when filtering.
  - `CommandList` height follows its results up to the existing max height and animates as results filter.
  - The results scrollbar rail is shortened at both ends (half the panel radius) so it clears the rounded corners. Scoped to Command — the ScrollArea rail look is unchanged.
  - `CommandEmpty` fades in. All motion respects `prefers-reduced-motion`; forced colors outline the selected item.

- 4c609a6: Popover and Tooltip: clip the frosted floating surface with an SVG mask instead of `clip-path`, so Chrome no longer paints the backdrop blur as a rectangle outside the rounded corners. Their outline now uses the hairline stroke, matching Menu.
- 4c609a6: SearchField (filled) and InputOTP slots: rest fill is now `backgroundSurfaceHover` instead of `backgroundSurfaceSelected`, matching the secondary Button fill. The plate no longer matches the border tone in dark mode, and hover (`backgroundSurfaceActive`) now moves in the expected direction in both themes.
- Updated dependencies [4c609a6]
  - @refineui/tokens@2.2.0

## 0.1.2

### Patch Changes

- a67965c: Draw Popover and Tooltip panels and their beaks as one shape so the beak shares the frosted fill, blur, stroke, and floating shadow. The beak tip is rounded, keeps clear space from the trigger, and the Popover beak is larger. Tokens add beak sizes for Popover and Tooltip, `toDropShadowFilter`, and `--refineui-elevation-*-filter` variables.
- Updated dependencies [a67965c]
  - @refineui/tokens@2.1.0

## 0.1.1

### Patch Changes

- Remove the Toast minimum-width token and refine overlay, Dialog, and Toast presentation.
- Updated dependencies
  - @refineui/tokens@2.0.0

## 0.1.0

### Minor Changes

- e67a58f: Add an editor-neutral authoring manifest for every public component export,
  including compositional slots, serializable controls, presets, state bindings,
  portal contracts, and a React rendering fixture.

## Unreleased

### Added

- Add the editor-neutral `@refineui/react/authoring-manifest` and JSON manifest exports. They provide explicit component composition, safe editable props, controlled-state bindings, portal contracts, and ready-to-render presets without changing the React component API.

## 0.0.12

### Patch Changes

- 2be54fc: Improve Avatar borders across image and initials layouts, and make neutral Badge and Tag variants easier to distinguish from their surrounding surfaces.

## 0.0.11

### Patch Changes

- 83e530f: Align Navigation Menu, Menu, Tooltip, and Popover surface styling; improve portal-based blur behavior; match floating-panel beaks to their content surfaces; and preserve readable menu titles and descriptions.
- Updated dependencies [83e530f]
  - @refineui/tokens@1.0.4

## 0.0.10

### Patch Changes

- ffa9888: Add SidebarProvider and SidebarTrigger so the collapse control can sit anywhere inside the provider. Secondary buttons drop their stroke and use surface fill for rest, hover, and press.

## 0.0.9

### Patch Changes

- 017ca1a: Add SelectTrigger ghost for Calendar captions, stabilize caption width with short months, give Calendar a Card/Dialog-like panel border and radius, fix Select placeholder gray before items mount, and show the Tabs underline on first paint before the sliding indicator is ready.

## 0.0.8

### Patch Changes

- 20eb17d: CollapsibleTrigger defaults to Button ghost (keep `data-refineui="button"` for hover), remove DrawerClose / header X, and refresh LLM indexes so agents match the dismiss and trigger APIs.

## 0.0.7

### Patch Changes

- Add Collapsible and Context Menu, frosted floating panels with blur tokens, SidebarPeek glass, and control polish (SegmentedControl, Breadcrumb, InputOTP).
- Updated dependencies
  - @refineui/tokens@1.0.3
  - @refineui/utilities@0.0.4

## 0.0.4

### Patch Changes

- Skip Segmented Control/Tabs mount animation, align Toast/Tooltip/PopOver with Menu semantic colors, and match Tooltip beak to the PopOver SVG pattern.
- Updated dependencies
  - @refineui/tokens@1.0.2

## 0.0.3

### Patch Changes

- 928ceba: Give every Alert variant the same surface instead of tinting only `danger`, and color Alert descriptions with the foreground aliases the recipe renders so `warning` text is no longer far under contrast.

## 0.0.2

### Patch Changes

- b240e67: Scope ScrollArea overflow per axis so a horizontal-only area no longer swallows vertical wheel gestures, and give every published package a README with install steps for npm, yarn, pnpm, and bun.
- Updated dependencies [b240e67]
  - @refineui/tokens@1.0.1
  - @refineui/utilities@0.0.2
