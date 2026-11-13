# @refineui/mcp

## 0.1.10

### Patch Changes

- Refresh NavigationMenu layouts and interaction behavior, complete the Tailwind-backed component styling migration, and update generated MCP documentation data.
- Updated dependencies
  - @refineui/tokens@2.2.1

## 0.1.9

### Patch Changes

- Depend on the current `@refineui/tokens` (2.2.0) instead of 1.0.4. The previous release was packed from a stale lockfile, so installs pulled tokens 1.0.4 — which lacks the Popover / Tooltip beak sizes and rendered the beaks as NaN. Drop any `overrides` / `resolutions` you added for `@refineui/tokens`.

## 0.1.8

### Patch Changes

- Updated dependencies [4c609a6]
  - @refineui/tokens@2.2.0

## 0.1.7

### Patch Changes

- Updated dependencies [a67965c]
  - @refineui/tokens@2.1.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @refineui/tokens@2.0.0

## 0.1.5

### Patch Changes

- Updated dependencies [83e530f]
  - @refineui/tokens@1.0.4

## 0.1.4

### Patch Changes

- 20eb17d: CollapsibleTrigger defaults to Button ghost (keep `data-refineui="button"` for hover), remove DrawerClose / header X, and refresh LLM indexes so agents match the dismiss and trigger APIs.

## 0.1.3

### Patch Changes

- Add Collapsible and Context Menu, frosted floating panels with blur tokens, SidebarPeek glass, and control polish (SegmentedControl, Breadcrumb, InputOTP).
- Updated dependencies
  - @refineui/tokens@1.0.3

## 0.1.2

### Patch Changes

- Updated dependencies
  - @refineui/tokens@1.0.2

## 0.1.1

### Patch Changes

- b240e67: Scope ScrollArea overflow per axis so a horizontal-only area no longer swallows vertical wheel gestures, and give every published package a README with install steps for npm, yarn, pnpm, and bun.
- Updated dependencies [b240e67]
  - @refineui/tokens@1.0.1
  - @refineui/doctor@0.1.1
