# Component Spec — Contract Layer

**Status: catalog (v1.1)** — all shipped components have Spec JSON; interactive components declare a11y / keyboard / focus / environment where implementation + CSS already satisfy Doctor.

Source of truth for behavior/DOM contracts consumed by Doctor, MCP, and Docs.

```
packages/react/spec/
├── manifest.json
├── schema/component-spec.schema.json
└── components/*.json
```

Build copies this tree to `packages/react/dist/spec/` and adds `token-trace-v2.json`, `token-graph.json`, `contract-index.json`.

## Boundaries

| Owns | Does not own |
|------|----------------|
| anatomy, variants, states | Tailwind classes / hex |
| accessibility, keyboard, focus | Usage guides / WCAG essays |
| layout (logical / RTL) | Full bidirectional layout proof |
| environment (`forced-colors`, `dir`, …) | Full High Contrast audit |
| `recipe` string reference | Recipe visual implementation |

```
Component Spec  →  Doctor (validate declared contracts only)
                →  MCP (explain)
                →  Docs SpecRenderer (render declared fields only)
recipe ref      →  SlotRecipe / defineRecipe (visual)
                →  Docs ComponentPreview + TokenInspector
```

## Spec fields (v1)

| Field | Purpose |
|-------|---------|
| `anatomy` | Part → `data-refineui` slot |
| `variants` | Axis → allowed values |
| `states` | pseudo / component / availability / environment |
| `dom` | Per-slot state overrides |
| `accessibility` | Slot a11y contracts |
| `keyboard` | Key → action (`native` allowed) |
| `focus` | visual + behavior |
| `layout` | `direction: logical`, `rtl` |
| `tokens.visual` | Component token prefix |
| `recipe` | Recipe name reference |

## Doctor rules (contract)

Doctor validates **declared** fields only. Catalog specs start with anatomy (+ variants / `data-state` where known). Declaring `focus`, `keyboard`, `accessibility`, `layout`, or `forced-colors` opts that component into the matching Doctor rule.

| Rule | Validates |
|------|-----------|
| `component-state-contract` | `data-state` literals vs Spec |
| `accessibility-contract` | required attrs, types, relationships, native |
| `keyboard-contract` | key handlers (skips `native`) |
| `focus-contract` | `:focus-visible` + trap/initial/return patterns |
| `environment-contract` | `forced-colors` + `prefers-contrast` CSS blocks + slots |
| `layout-contract` | no physical left/right utilities |
| `state-contract` | `data-refineui` / focus preference |
| `motion-contract` | reduced-motion / motion roles |

## Coverage

| Surface | Scope |
|---------|--------|
| Spec JSON + Docs SpecRenderer | All catalog components in `manifest.json` |
| Deep a11y / keyboard / focus / environment / layout | Interactive + layout-clean components (Doctor-validated) |
| Docs ComponentPreview | alert, button, accordion, dialog, badge, switch, checkbox, tabs, select, toast, spinner, chip, tag, segmented-control |
| SlotRecipe (`defineSlotRecipe`) | alert, accordion, dialog, segmented-control |
| Single recipe (`defineRecipe`) | button, badge, toast, chip |
| Docs TokenInspector | alert, button, accordion, dialog, badge, toast, tabs, chip, tag, segmented-control, switch, checkbox, select, spinner |

Environment: `forced-colors` + `prefers-contrast` (CSS in `refineui.css`; Doctor validates both).

### Intentional physical leftovers

Doctor `layout-contract` rejects Tailwind `left`/`right`/`pl`/`ml`/`text-left` utilities. These remain **intentional** (not flagged or deferred):

| Pattern | Where | Why |
|---------|-------|-----|
| `-translate-x-1/2` + `start-1/2` | PopOver, Resizable | Horizontal centering; no logical translate utility |
| `left` / `right` / `translateX(-50%)` | Tooltip panel/arrow | MCP position×align map still physical CSS |
| `-translate-x-1/2` | Chart x-axis labels | Tick centering under measured SVG positions |
| Measured `translateX(...)` | Drawer overlay, NavigationMenu indicator | Runtime geometry, not static utilities |

Switch thumb travel uses `translateX` in `refineui.css` with `[dir="rtl"]` negation.

Regenerate baseline then deepen:

```bash
node packages/react/scripts/expand-component-specs.mjs
node packages/react/scripts/deepen-component-specs.mjs
```
