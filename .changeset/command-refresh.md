---
"@refineui/react": patch
---

Command: cleaner, motion-aware palette that works inline as well as in `CommandDialog`.

- Detached layout: `CommandInput` is the standard (filled) SearchField on top, and `CommandList` is its own bordered, raised results panel below. The `Command` root and the `CommandDialog` panel no longer draw a surface.
- One sliding `command-indicator` highlights the selected item (soft surface fill); it slides on keyboard/pointer navigation and snaps when filtering.
- `CommandList` height follows its results up to the existing max height and animates as results filter.
- The results scrollbar rail is shortened at both ends (half the panel radius) so it clears the rounded corners. Scoped to Command — the ScrollArea rail look is unchanged.
- `CommandEmpty` fades in. All motion respects `prefers-reduced-motion`; forced colors outline the selected item.
