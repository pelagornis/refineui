# RefineUI Doctor

Read-only diagnostics for RefineUI workspaces.

Doctor finds workspaces that use `@refineui/*` packages and runs applicable health checks. It does **not** modify code or install packages. Results are written as schema v2 YAML to a temp directory (or `--output`).

## When to use

| User request | Action |
|--------------|--------|
| "RefineUI 잘 쓰고 있나 봐줘" | Run all applicable rules |
| "셋업만 진단해줘" | Category: `setup` only |
| "토큰/Foundations 계약 검사" | Category: `foundations` |
| "이 모노레포 전부 진단" | Discover all workspaces, one report each |

There is no Quick/Deep mode — run all applicable rules unless the user scopes a category.

## Documentation routing

Do **not** copy doc content into rules. At runtime, read:

- **Index:** `https://ui.pelagornis.com/llm.txt`
- **Installation:** `https://ui.pelagornis.com/development/installation/`
- **Theming / stylesheets:** `https://ui.pelagornis.com/development/theming/`
- **Doctor page:** `https://ui.pelagornis.com/ai-tools/doctor/`

Use `references` in findings to cite URLs actually read. If an index fetch fails, mark affected checks `not-verified` — do not guess.

## Discovery order

1. User-specified path (default: project root)
2. Root `package.json` with `@refineui/*` dependencies
3. `packages/*`, `apps/*`, `examples/*` in monorepos
4. Deduplicate by package boundary

Multiple workspaces → confirm target or run all when user asks for "전체".

## CLI (optional)

When `@refineui/doctor` is installed:

```bash
refineui-doctor
refineui-doctor ./apps/web
refineui-doctor --workspace packages/my-app --output ./doctor-report.yaml
refineui-doctor --category setup
```

Or via MCP tool `run_doctor` when `@refineui/mcp` is configured.

## Rules

| Rule | Category | File |
|------|----------|------|
| `package-setup` | setup | [rules/package-setup.md](../rules/package-setup.md) |
| `stylesheet-setup` | setup | [rules/stylesheet-setup.md](../rules/stylesheet-setup.md) |
| `foundation-contract` | foundations | [rules/foundation-contract.md](../rules/foundation-contract.md) |
| `composition-api` | components | [rules/composition-api.md](../rules/composition-api.md) |
| `component-imports` | components | [rules/component-imports.md](../rules/component-imports.md) |

Severity: missing required setup → `error`; token/convention violations → `warn`; arbitrary px hints → `info`.

## Agent workflow

1. **Read-only first** — run Doctor or follow rules manually; produce YAML/summary.
2. **Present findings** — group by severity; cite doc URLs.
3. **Fix only when asked** — use each finding's `remediation` block as the fix brief.
4. **Re-run** — verify with `refineui-doctor` after changes.

Do not auto-fix without explicit user approval.

## Report schema

```yaml
schemaVersion: 2
meta:
  target: /path/to/project
  workspace: apps/web
  projectKinds: [app]
  date: "2026-08-31"
  refineui:
    declared:
      "@refineui/react": "^0.x"
summary:
  error: 0
  warn: 1
  info: 0
checks: [...]
findings: [...]
```

Every `fail` check must have at least one finding with the same `rule`. Summary counts must match findings.
