# @refineui/doctor

Read-only diagnostics for RefineUI app and library workspaces.

## Install

```bash
bun add -D @refineui/doctor
# or
npx @refineui/doctor
```

## Usage

```bash
refineui-doctor
refineui-doctor ./apps/web
refineui-doctor --workspace packages/my-app --output ./doctor-report.yaml
refineui-doctor --category setup --category foundations
```

Exit code `1` when error-severity findings exist.

## Rules

| Rule | Category | Checks |
|------|----------|--------|
| `package-setup` | setup | `@refineui/react` + `@refineui/tokens` in app projects |
| `stylesheet-setup` | setup | Global CSS imports for tokens, icons, refineui.css |
| `foundation-contract` | foundations | No hardcoded hex/rgba/arbitrary px in component styles |
| `composition-api` | components | No convenience props on RefineUI components |
| `component-state-contract` | components | `data-state` values match Component Spec |
| `accessibility-contract` | accessibility | Declared a11y attributes, types, and ARIA relationships |
| `keyboard-contract` | accessibility | Declared keyboard bindings (skips native `<button>` activate) |
| `focus-contract` | accessibility | Focus visual (:focus-visible) and behavior structure patterns |
| `environment-contract` | accessibility | Declared environment contexts (P0: forced-colors CSS patterns) |
| `layout-contract` | accessibility | Logical direction / RTL — no physical left/right utilities |
| `state-contract` | components | `data-refineui` roots, `:focus-visible` preference |
| `motion-contract` | accessibility | Reduced-motion contract, no hardcoded motion durations |

## Contract Layer v1

Doctor contract rules above validate **declared** Component Spec fields only.
Pilot components and next expansions: `packages/react/spec/README.md` / `manifest.json` (`status: v1-closed`).

## Output

YAML report (schema v2) written to a temp directory or `--output` path. Use with the RefineUI Skill for agent-guided remediation.

Docs: https://ui.pelagornis.com/ai-tools/doctor/
