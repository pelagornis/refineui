# Web Kit component audit (Foundation → rules)

**Goal:** Re-align `packages/react` with the `Pelagornis RefineUI Web Kit` Figma file and **`@refineui/tokens`** (Foundation-linked) only.

## Principles (required)

1. **Foundation → Web Kit** — Web Kit padding·size·color must use values tied to Foundation Variables (`.cursor/rules/figma-foundation.mdc`).
2. **Variants·API match** — Do not add props·slots·behavior that are not in Figma.
3. **Tokens only** — `colors`, `spacings`, `typographys`, `strokeWidths`, `borderRadii`, `shadows`, `iconSizes`, `foundationSizes`, `componentSizes`, etc. No arbitrary `#hex` / `px` (`.cursor/rules/tokens-in-components.mdc`).
4. **Verification** — Per component, confirm spec with Figma MCP `get_design_context` (that node-id).

## Per-component checklist (copy-paste)

- [ ] Confirm **COMPONENT_SET** name·node-id in Web Kit
- [ ] Variants (props) match Figma scope
- [ ] Styles use only `@refineui/tokens`
- [ ] Docs `documentation/.../components/*.mdx`·Preview align at least at a high level

## Order

Work **alphabetically**, one at a time. Update the table below with ✅ in order.

| # | Component | Web Kit node (fill after lookup) | Status |
|---|-----------|-----------------------------------|--------|
| 1 | Accordion | `54:146` (COMPONENT_SET) | ✅ |
| 2 | Alert | `384:885` (COMPONENT_SET) | ✅ |
| 3 | Avatar | Web Kit `Avater` (COMPONENT_SET); stack `69:3008` | ✅ |
| 4 | Avatars | `Avater Stack` `69:3008`, `Avater Spread` `69:3007` | ✅ |
| 5 | Badge | `Badge` `270:3353`, `Badge Number` `276:515` | ✅ |
| 6 | Breadcrumb | `283:688` (COMPONENT_SET) | ✅ |
| 7 | Button | `79:3304` (COMPONENT_SET) | ✅ |
| 8 | Calendar | Day `639:7052` · Month container `639:6845` | ✅ |
| 9 | Card | COMPONENT_SET `Card` (§7 in design-specs; confirm node-id via MCP) | ✅ |
| 10 | Checkbox | `327:2539` (COMPONENT_SET) | ✅ |
| 11 | Chip | Web Kit name `Tag` `574:6578` (`Chip`/`Tag` same) | ✅ |
| 12 | Dialog | `393:1181` (COMPONENT_SET) | ✅ |
| 13 | Divider | `346:722` (COMPONENT_SET) | ✅ |
| 14 | Drawer | `635:1756` (COMPONENT_SET) | ✅ |
| 15 | Dropdown | `503:2985` (COMPONENT_SET) | ✅ |
| 16 | Field | `525:1074` (COMPONENT_SET) | ✅ |
| 17 | Input | `518:7373` (COMPONENT_SET) | ✅ |
| 18 | Label | `216:1681` (COMPONENT_SET) | ✅ |
| 19 | Link | `226:158` (COMPONENT_SET) | ✅ |
| 20 | Menu | `633:4268` (COMPONENT_SET) | ✅ |
| 21 | Pagination | `558:1989` · `Pagination / Item` `570:2332` | ✅ |
| 22 | PopOver | `553:5669` (COMPONENT_SET) | ✅ |
| 23 | Progress | `452:3994` COMPONENT_SET `Progress bar` | ✅ |
| 24 | Radio | `397:1001` (COMPONENT_SET) | ✅ |
| 25 | Select | (no standalone set) field = **Input** `518:7373` | ✅ |
| 26 | Skeleton | `570:6175` (COMPONENT_SET) | ✅ |
| 27 | Slider | `526:1556` (COMPONENT_SET) | ✅ |
| 28 | SpinButton | `561:2067` (COMPONENT_SET `Spin Button`) | ✅ |
| 29 | Spinner | `550:3669` (COMPONENT_SET) | ✅ |
| 30 | Switch | `270:3057` (COMPONENT_SET) | ✅ |
| 31 | Tabs | `636:5371` · `Tabs / Item` `636:5372` | ✅ pill → `SegmentedControl`; underline `Tabs` is token-based |
| 32 | Tag | `574:6578` (COMPONENT_SET `Tag`; same as `Chip`) | ✅ |
| 33 | Textarea | `529:5454` (COMPONENT_SET) | ✅ |
| 34 | Toast | `548:655` (COMPONENT_SET) | ✅ |
| 35 | Toggle | `270:3057` (Web Kit name **Switch**; same impl as `Toggle`) | ✅ |
| 36 | Tooltip | `90:1686` (COMPONENT_SET) | ✅ |

> `WebIcon` is an icon wrapper and does not need to appear in this table.

## Current status

- Rows **1–36** above are ✅. Web Kit **Tabs** pill is `SegmentedControl`; underline `Tabs` is token-based. After Web Kit·token changes, re-check **only the rows that matter** with the checklist above.
- **Examples next:** run `pnpm docs:build` for the docs site; if Foundation/Web Kit files change, re-verify `design-specs-web-kit.md` and the matching nodes in this table; for items without a standalone set (like `Select`), confirm parent rules (**Input**, etc.) still hold.
