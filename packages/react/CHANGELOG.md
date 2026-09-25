# @refineui/react

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
