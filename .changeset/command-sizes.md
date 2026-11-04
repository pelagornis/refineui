---
"@refineui/react": minor
---

Command: add `size` (`"sm" | "md" | "lg"`, default `"md"`). It sets the SearchField size, the results panel radius (matching the field), and item text, vertical padding, and icon slot. `CommandDialog` defaults its Command to `"lg"`; pass `commandProps.size` to override. `componentTypographyTokens.command.item` is now a per-size record, and `CommandSize` is exported.
