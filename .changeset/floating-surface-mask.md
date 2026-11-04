---
"@refineui/react": patch
---

Popover and Tooltip: clip the frosted floating surface with an SVG mask instead of `clip-path`, so Chrome no longer paints the backdrop blur as a rectangle outside the rounded corners. Their outline now uses the hairline stroke, matching Menu.
