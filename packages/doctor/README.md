# @refineui/doctor

Read-only diagnostics for RefineUI app and library workspaces. Inspired by [SEED Doctor](https://seed-design.io/ai-integration/skill/doctor), adapted for RefineUI's token-first React design system.

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
| `component-imports` | components | Import from `@refineui/react` root only |

## Output

YAML report (schema v2) written to a temp directory or `--output` path. Use with the RefineUI Skill for agent-guided remediation.

Docs: https://design.pelagornis.com/refineui/ai-tools/doctor/
