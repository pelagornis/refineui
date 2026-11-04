---
"@refineui/tokens": minor
"@refineui/react": minor
---

ScrollArea: picker-style edge blur, always on. Rows marked `data-scroll-edge-item` blur progressively across the outer quarter of the scrollport on each side; size and opacity never change. The blur applies only toward an edge that actually hides content — ScrollArea publishes `--refineui-scroll-edge-top` / `--refineui-scroll-edge-bottom` (0 → 1 as content hides past that edge) — so lists that do not scroll, and the edge you are parked at, are untouched, and the blur fades in as you scroll away. Unmarked content is never affected. Scroll-driven via `animation-timeline: view()`; no effect where unsupported or under `prefers-reduced-motion`.

Command, Select, and Dropdown mark their rows (items and group labels); Command's selection plate is marked too, so it blurs with its row. `CommandGroup` uses `overflow: clip` so the viewport stays the scroll container. Command's forced-colors root rule is restored.

Tokens: semantic blur role `scrollEdge` → `blur2` (`--refineui-blur-scroll-edge`).
