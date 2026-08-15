# RefineUI — Color tokens guide

In Pelagornis RefineUI, **color is sourced from Foundation (Figma)**; code mirrors it in `packages/tokens`. This document covers **Primitive → Semantic (Alias) → Component Token → components**, and **what to change where**.

---

## 1. Layer overview (one-line summary)

| Stage | Role | Code location (main) |
|-------|------|----------------------|
| **Primitive** | Raw palette values (hex, etc.). No meaning. | `packages/tokens/src/global/colors.ts` → CSS `--refineui-color-{palette}` |
| **Semantic (Alias)** | UI meaning (background/text/border/state). Light·Dark pairs. | `packages/tokens/src/semantic/colors.ts` → CSS `--refineui-color-alias-*` |
| **Component Token** | Role names for specific components. References Semantic only. | `packages/react/src/tokens/componentColorTokens.ts` |
| **Component** | Actual UI. Prefer Component Tokens or Semantic aliases. | `packages/react/...`, `refineui.css` |

**Rule:** Avoid using **Primitives** directly in components (raw hex, `neutral-300` literals, etc.). Use Semantic when you need meaning; use Component Tokens when you need screen-level names.

---

## 2. Relationship to Figma

- **Foundation (Variables):**  
  [Pelagornis RefineUI Foundation](https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650)  
  **Global/Colors** maps to Primitive; **`Alias/Color/...`** maps to Semantic.
- **Web Kit:** Components must use values **bound to Foundation variables**. Do not invent Web Kit–only hex or spacing.

The Semantic map (`SEMANTIC_PALETTE_PAIRS`) should align with Figma **Alias variable names (last segment)**. (e.g. `Alias/Color/Background/Primary/backgroundPrimary` → key `backgroundPrimary`)

---

## 3. What is Alias (Semantic)?

- **Alias** = the **meaning layer**: “this UI role uses this palette tone.”
- Light / Dark may point to **different palette keys** (`semantic/colors.ts` `{ light, dark }`).
- Built `semanticColors` output CSS as  
  `:root` / `[data-theme="dark"], .dark`  
  `--refineui-color-alias-{name}`.

**How to work with Alias:**

1. Check **Figma Foundation** for the Alias first.
2. If missing, **add or fix variables in Foundation**, then mirror in code. (Do not change code alone first.)
3. If present, add keys in `SEMANTIC_PALETTE_PAIRS` in `packages/tokens/src/semantic/colors.ts`, or update `light` / `dark` to point at different **`PaletteColors` keys**.
4. `surfaceOverlay` is the exception using RGBA strings—keep numeric values aligned with Foundation periodically.

---

## 4. Changing Semantic (checklist)

### 4.1 Changing values only (e.g. dark tuning)

1. Edit that key’s `light` / `dark` in `packages/tokens/src/semantic/colors.ts` to other `PaletteColors` keys.
2. After building tokens, verify `--refineui-color-alias-*` in `packages/tokens/dist/css-variables.css`.
3. `@refineui/react` build (`generate-refineui-css`) uses the same `semanticColors`, so it stays **consistent**.

### 4.2 Adding a new Semantic key

1. Confirm the **same meaning** exists as an Alias in Figma.
2. Add the key to `SEMANTIC_PALETTE_PAIRS` (camelCase, match Figma tail name).
3. `SEMANTIC_COLOR_ROWS` grows from `SEMANTIC_PALETTE_PAIRS`; usually no manual listing.
4. For **special cases** like `surfaceOverlay`, wire through `buildSemanticColors` / `SEMANTIC_COLOR_ROWS` as needed.

### 4.3 When it feels “thin”

- Prefer **1:1 alignment** with the Figma `Alias/Color` tree over randomly adding Semantic keys.
- For readability, group `semantic/colors.ts` with comment blocks matching Figma (**Background / Foreground / Border / Surface**).

---

## 5. Component Token (`componentColorTokens.ts`)

- **Path:** `packages/react/src/tokens/componentColorTokens.ts` — also `export { componentColorTokens }` from `@refineui/react`.
- **Role:** Screen-level names for Web Kit components (e.g. pagination nav icon, dropdown menu row), mapped to **Semantic aliases** where possible.
- **Structure:** Truth still lives in:
  - Primitive: `packages/tokens/src/global/colors.ts`
  - Semantic: `packages/tokens/src/semantic/colors.ts`
  - Component Token: `packages/react/src/tokens/componentColorTokens.ts`
- **Add/change:** When new component roles appear, extend `componentColorTokens` by slot/state; declare **token refs** with `@refineui/utilities/color` helpers. Actual CSS variable strings come from `resolveColorTokenValue()`.

### 5.0 Component Token mapping principles

| Priority | Layer | When to use |
|----------|-------|-------------|
| 1 | `semanticToken(name)` | Shared UI meaning—create a semantic token ref |
| 2 | `paletteToken(name)` | Web Kit–specific accent not yet lifted to semantic—palette token ref |
| 3 | `@refineui/utilities/color`.`resolveColorTokenValue(value)` | Turn token refs into real `var(--refineui-color-...)` strings |
| 4 | `componentColorTokens` | Final mapping combining 1 and 2 per slot/variant/state |

Example:

```ts
button: {
  primary: {
    background: semanticToken("backgroundBrand"),
    foreground: semanticToken("foregroundOnBrand"),
    hoverBackground: semanticToken("backgroundBrandHover"),
  },
}
```

```ts
style={{ backgroundColor: resolveColorTokenValue(componentColorTokens.button.primary.background) }}
```

### 5.1 Alias token reference table

Core Alias groups used in code. Use as the mirror for Figma Foundation `Alias/Color/...`.

| Group | Representative Alias tokens | Use |
|-------|----------------------------|-----|
| Background / Brand | `backgroundBrand`, `backgroundBrandHover`, `backgroundBrandActive`, `backgroundBrandDisabled`, `backgroundBrandSubtle` | Primary brand action backgrounds |
| Background / Primary | `backgroundPrimary`, `backgroundPrimaryHover`, `backgroundPrimaryActive` | Default surface / ghost interactions |
| Background / Surface | `backgroundSurface`, `backgroundSurfaceHover`, `backgroundSurfaceActive`, `backgroundSurfaceSelected`, `backgroundSurfaceDisabled` | Panels, menus, secondary surfaces |
| Background / State | `backgroundSuccess`, `backgroundWarning`, `backgroundError`, `backgroundInfo`, `backgroundDiscovery` and each `Hover` / `Subtle` | Status backgrounds |
| Foreground / Primary | `foregroundPrimary`, `foregroundPrimaryHover`, `foregroundSecondary`, `foregroundTertiary`, `foregroundDisabled`, `foregroundPlaceholder`, `foregroundInversed` | Default text/icons |
| Foreground / Interactive | `foregroundLink`, `foregroundLinkHover`, `foregroundLinkActive`, `foregroundLinkVisited` | Link / interactive text |
| Foreground / On-Background | `foregroundOnBrand`, `foregroundOnSuccess`, `foregroundOnWarning`, `foregroundOnError`, `foregroundOnInfo`, `foregroundOnDiscovery` | Text on colored fills |
| Foreground / State-Specific | `foregroundSuccess`, `foregroundWarning`, `foregroundError`, `foregroundInfo`, `foregroundDiscovery` | Status emphasis text/icons |
| Border / Primary | `borderDefault`, `borderSubtle`, `borderStrong` | Default borders |
| Border / Interactive | `borderHover`, `borderFocus`, `borderDisabled` | Focus/hover/disabled borders |
| Border / State | `borderSuccess`, `borderWarning`, `borderError`, `borderInfo`, `borderDiscovery` | Status borders |
| Surface | `surfaceElevated`, `surfaceInverse`, `surfacePopover`, `surfaceTooltip`, `surfaceSunken`, `surfaceOverlay` | Overlay, popover, tooltip, elevated panels |

### 5.2 Component token reference table

Contracts in `packages/react/src/tokens/componentColorTokens.ts`, aligned with Web Kit component roles.

| Component | Component token keys (examples) | Notes |
|-----------|--------------------------------|-------|
| `WebIcon` | `webIcon.primary`, `webIcon.secondary`, `webIcon.disabled`, `webIcon.inversed` | Shared icon colors |
| `Button` | `button.primary.*`, `button.secondary.*`, `button.outline.*`, `button.ghost.*` | Per-variant states |
| `Input` | `input.text`, `input.placeholder`, `input.background`, `input.border.*` | Default field |
| `Textarea` | `textarea.text`, `textarea.placeholder`, `textarea.background`, `textarea.border.*` | Multiline field |
| `Select` | `select.text`, `select.placeholder`, `select.background`, `select.border.*` | Native select |
| `Checkbox` | `checkbox.label.*`, `checkbox.checkIcon.*` | Label vs check |
| `Radio` | `radio.label.*`, `radio.control.*` | Dot vs border |
| `Switch` / `Toggle` | `switch.track.*`, `switch.thumb.*`, `toggle.track.*`, `toggle.thumb.*` | On/off abstraction |
| `Field` | `field.label`, `field.required`, `field.hint`, `field.error` | Form wrapper |
| `Label` | `label.text`, `label.disabledText`, `label.required` | Augmented per Figma MCP |
| `Alert` | `alert.background`, `alert.border`, `alert.title`, `alert.description.*`, `alert.accent.*` | Per-variant accent |
| `Badge` | `badge.default.*`, `badge.neutral.*`, `badge.outline.*`, `badge.success.*`, `badge.warning.*`, `badge.danger.*` | Badge family |
| `Chip` / `Tag` | `chip.default.*`, `chip.outline.*`, `chip.filled.*`, `chip.remove.icon`, `tag.*` | Tag/chip states |
| `Progress` | `progress.track`, `progress.indicator.*` | Ready for variant extensions |
| `Spinner` | `spinner.track`, `spinner.indicator`, `spinner.label` | Loading |
| `Skeleton` | `skeleton.background`, `skeleton.shimmer` | Shimmer colors |
| `Toast` / `Toaster` | `toast.background`, `toast.border`, `toast.title`, `toast.message`, `toast.accent.*`, `toaster.stackBackground` | Toast stack |
| `Tooltip` | `tooltip.default.*`, `tooltip.inverted.*` | Background/foreground incl. beak |
| `PopOver` | `popover.default.*`, `popover.inverted.*` | Panel colors |
| `Dialog` | `dialog.overlay`, `dialog.content.background`, `dialog.title.foreground`, `dialog.description.foreground`, `dialog.close.icon` | Compound slots |
| `Drawer` | `drawer.overlay`, `drawer.content.background`, `drawer.header.*`, `drawer.title.*`, `drawer.description.*`, `drawer.body.*`, `drawer.footer.*`, `drawer.close.icon` | Compound slots |
| `Dropdown` | `dropdown.trigger.*`, `dropdown.menu.*` | Trigger vs menu |
| `Menu` | `menu.panel.*`, `menu.popover.*`, `menu.list.*`, `menu.sectionToken.*`, `menu.dividerToken.*`, `menu.item.*` | Compound slots |
| `Tabs` | `tabs.*` | Underline track / sliding indicator |
| `SegmentedControl` | `segmentedControl.*` | Pill track / sliding indicator |
| `Accordion` | `accordion.item.border`, `accordion.trigger.*`, `accordion.content.*` | Item/trigger/content |
| `Breadcrumb` | `breadcrumb.list.*`, `breadcrumb.link.*`, `breadcrumb.page.*`, `breadcrumb.separatorToken.*`, `breadcrumb.ellipsis`, `breadcrumb.ellipsisTrigger.*` | Compound slots |
| `Pagination` | `pagination.navIcon.*`, `pagination.page.*` | Includes page item states |
| `Link` | `link.default`, `link.hover`, `link.active`, `link.visited`, `link.disabled`, `link.subtle.*` | Default/subtle |
| `Calendar` | `calendar.background`, `calendar.weekday`, `calendar.day.*` | Selected/range/otherMonth |
| `Card` | `card.elevated.*`, `card.outlined.*`, `card.header.*`, `card.titleToken.*`, `card.descriptionToken.*`, `card.content.*`, `card.footer.*`, `card.action.*` | Compound slots |
| `Divider` | `divider.line`, `divider.label`, `divider.icon` | Content/icon layouts |
| `Avatar` / `Avatars` | `avatar.shell.*`, `avatar.icon.*`, `avatar.status.*`, `avatar.overflow.*`, `avatar.group.*`, `avatar.groupCount.*`, `avatars.*` | Full avatar family |

### 5.3 Items pre-filled in code

These were structured in code first; if they work well, mirror the same structure in Foundation / Web Kit.

| Area | What was added | Confirm / tidy in Figma |
|------|----------------|-------------------------|
| `Label` | Added `label.text`, `label.disabledText`, `label.required` | Express default / disabled / required colors as Aliases on `Label` |
| Compound components | Slot-level keys under `dialog.*`, `drawer.*`, `menu.*`, `breadcrumb.*`, `card.*`, `avatar.*` | Clarify sub-slot and state names in Web Kit |
| Form controls | Split `input.*`, `textarea.*`, `select.*`, `checkbox.*`, `radio.*`, `switch.*`, `toggle.*` | Enough hover/focus/error/success/disabled tokens |
| Feedback | Extended `alert.*`, `badge.*`, `chip.*`, `tag.*`, `toast.*`, `spinner.*`, `skeleton.*`, `progress.*` | Decide in Foundation whether status accents are palette vs alias |
| Navigation | Extended `tabs.*`, `segmentedControl.*`, `accordion.*`, `pagination.*`, `breadcrumb.*`, `menu.*`, `link.*`, `calendar.*` | Enough Aliases for hover, active, selected, disabled |
| Overlay | Tidied `tooltip.*`, `popover.*`, `dialog.overlay`, `drawer.overlay` | Consider clearer Foundation aliases for overlay surfaces |
| Avatar family | `avatar.shell.*`, `avatar.icon.*`, `avatar.status.*`, `avatars.count.*` | Decide Avatar color variants as Aliases vs palette wrappers |

### 5.4 Recommended Figma cleanup directions

| Priority | Recommendation | Why |
|----------|----------------|-----|
| High | Fully organize `Alias/Color` under Background / Foreground / Border / Surface | Easier 1:1 map to `semantic/colors.ts` |
| High | Model error/success/disabled/focus for `Label`, `Field`, `Input`, `Select`, `Textarea` as Variables | Forms are reused most |
| High | Name sub-slots explicitly for `Dialog`, `Drawer`, `Menu`, `Breadcrumb`, `Card`, `Avatar` | Maps cleanly to compound tokens |
| Medium | Rule whether accents for `Alert`, `Badge`, `Chip`, `Tag`, `Toast` are alias vs palette | Some palette wrappers mixed today |
| Medium | Clarify selected/hover/active/disabled for `SegmentedControl`, `Accordion`, `Pagination`, `Calendar` | Better interaction consistency |
| Medium | Sharpen roles among `surfacePopover`, `surfaceTooltip`, `surfaceOverlay`, `surfaceElevated`, `surfaceInverse` | Reduce overlap in overlay family |
| Low | Decide whether Avatar color groups become semantic vs stay palette wrappers | Works either way; needs agreement |

---

## 6. Build outputs and consumption

- `packages/tokens` build → `dist/css-variables.css` (palette + semantic aliases)
- `packages/react` build script merges layout etc. (`packages/react/scripts/generate-refineui-css.mjs`)
- Apps load via `import "@refineui/react/refineui.css"`, etc.

After Semantic changes, safest order is **token build → react build (if needed)**.

---

## 7. Quick file reference

| Topic | Path |
|-------|------|
| Primitive palette | `packages/tokens/src/global/colors.ts` |
| Semantic (alias pairs) | `packages/tokens/src/semantic/colors.ts` |
| Component color tokens | `packages/react/src/tokens/componentColorTokens.ts` |
| Package exports | `packages/tokens/src/index.ts` |
| CSS variable generation (react) | `packages/react/scripts/generate-refineui-css.mjs` |
| Global base & interactions | `packages/react/refineui.css` |
| Web Kit spec notes | `docs/design-specs-web-kit.md` |

---

## 8. Cursor / AI rules (summary)

For UI work, use **Foundation URLs and node-ids** with Figma MCP for specs; do not add arbitrary hex or px in components. See `.cursor/rules/figma-foundation.mdc` and `prompts/design-system.figma.yml` for details.
