---
"@refineui/react": minor
---

Sidebar: `SidebarContent` now scrolls through a built-in ScrollArea (hover overlay scrollbar) instead of native `overflow-y: auto`; its padding moved inside the viewport so rows scroll under the edges. `SidebarLink` and `SidebarGroupLabel` inside `SidebarContent` take the ScrollArea edge blur; footer rows do not. Remove any ScrollArea you nested inside `SidebarContent`.
