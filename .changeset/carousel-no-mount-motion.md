---
"@refineui/react": patch
---

Carousel: no motion on first load. With `loop`, the initial track alignment (after slides register and edge clones are inserted) now snaps instead of sliding in from the leading clone. The indicator pill no longer grows from zero width — its transition is gated by `data-animate` after the first measured paint, like Segmented Control, and respects `prefers-reduced-motion`.
