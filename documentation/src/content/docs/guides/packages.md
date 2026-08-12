---
title: Project structure
description: RefineUI monorepo packages and builds
---

# Project structure

RefineUI is a **workspace monorepo** (pnpm or Bun). Running scripts from the root builds packages in order.

## Directory overview

| Path | Role |
| ---- | ---- |
| `packages/tokens` | `@refineui/tokens` — TS tokens; `build` emits `css-variables` / `tailwind-theme`; Tailwind utilities use the `refineui-*` prefix |
| `packages/react` | `@refineui/react` — UI components + `refineui.css` |
| `packages/utilities` | `@refineui/utilities` — shared utilities |
| `documentation` | Astro + Starlight **this site** |
| `examples` | Example apps (when present) |

## Package dependencies

- `@refineui/react` depends on **`@refineui/tokens`**, **`@refineui/utilities`**, and **`@refineui/web-icons`**.
- Apps typically install **`@refineui/react`** and **`@refineui/tokens`** (when using tokens directly).

## Tailwind

- **Other projects**: `@import "@refineui/tokens/tailwind.css";` in global CSS (Tailwind v4 + `tailwindcss` as a peer).
- **This monorepo docs**: `global.css` imports `packages/tokens/tailwind.css` via a relative path (no Vite alias).
- **Example classes**: `bg-refineui-neutral-500`, `p-refineui-size-medium` — `:root` vars remain `var(--refineui-*)`.

## Build

From the repo root:

```bash
# Bun
bun install
bun run build

# or pnpm
pnpm install
pnpm build
```

Order is **`utilities` → `tokens` → `react`** (see root `package.json` `build` script).

## Documentation site

```bash
bun run docs        # or: pnpm docs
bun run docs:build  # or: pnpm docs:build — static build (includes package builds)
```

## Single source of truth

- Figma **Foundation** and **Web Kit** are the design sources of truth.
- For audit tables vs implementation, see `docs/web-kit-component-audit.md` and `docs/design-specs-web-kit.md`.
