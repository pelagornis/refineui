---
name: refineui
description: >-
  RefineUI design-system guide for AI agents. Routes to official docs and llm.txt
  for components, foundations, tokens, and React implementation. Use for RefineUI
  component usage, token questions, docs search, MCP setup, setup/install/theming,
  or "am I using RefineUI correctly?" requests. Do not duplicate docs in answers —
  read the linked official pages.
user-invocable: true
argument-hint: "[question or topic]"
---

# RefineUI

RefineUI ships as `@refineui/tokens` (Foundation + semantic variables) and `@refineui/react` (Web Kit components). **Official docs and `llm.txt` are the single source of truth.** This skill only provides routing and judgment procedures — not copied component lists or token tables.

## 1. Classify the request first

| Kind | Examples | Read project first? |
|------|----------|---------------------|
| **Foundations & tokens** | Color aliases, spacing, typography, motion roles | No |
| **Component spec & usage** | Button variants, Field + Input composition, Sidebar API | No (read docs); yes if checking existing code |
| **Product setup** | Install, stylesheet, Tailwind, theming | Yes — `package.json`, app entry CSS |
| **Docs / discovery** | "What components exist?", search by keyword | No — use index below |
| **MCP & tooling** | `@refineui/mcp` tools | No — read [MCP doc](https://ui.pelagornis.com/ai-tools/mcp/) |
| **Health check** | "RefineUI 잘 쓰고 있나?", setup audit | Yes — read-only Doctor first |

If the user only asks for design/token meaning, open Foundations docs — do not infer from memory.

## 2. Documentation routing (always use live index)

Do **not** memorize paths or invent APIs. Start from:

- **Full index:** `https://ui.pelagornis.com/llm.txt` (expanded) or `https://ui.pelagornis.com/llms.txt` (curated)
- **Site:** `https://ui.pelagornis.com`
- **AI & Tools hub:** `https://ui.pelagornis.com/ai-tools/`

### Routing order

1. Read `llm.txt` or `llms.txt` for the current page list and slugs.
2. Open the linked leaf doc (e.g. `/components/button/`, `/foundations/color/`) for API, examples, and PropSpec tables.
3. For implementation in code, also read `/development/installation/` and `/development/theming/` when setup is involved.
4. If `@refineui/mcp` is available, prefer `search_docs` and `get_doc_page` over guessing.

If an index entry is missing after a successful fetch, treat the topic as undocumented — do not substitute another component's API.

## 3. Code-writing contract

When generating or editing UI code:

- Import from `@refineui/react` only; load `@refineui/react/refineui.css` at the app root (plus tokens + icons CSS — see installation doc).
- Use **composable subcomponents** (e.g. `Field` + `Input`, `Command` + `CommandDialog`) — no convenience props (`title`, `description`, `items`, `actions`, `onClose`).
- Style with **design tokens** (`bg-refineui-alias-*`, `text-refineui-alias-*`, spacing/radius utilities) — no hardcoded hex, rgba, or arbitrary px in component styles.
- Match existing patterns in `packages/react` before adding variants or props.
- Preserve a11y: labels, keyboard focus, ARIA on interactive controls.

Detailed rules: [references/design-rules.md](references/design-rules.md)

## 4. Monorepo contributors

When the workspace **is** the RefineUI repo:

- Tokens: `packages/tokens/src/global/`, `packages/tokens/src/semantic/`
- Components: `packages/react/src/components/<Name>/`
- Docs: `docs/src/content/docs/`

Run `bun run build:tokens` before `@refineui/react` when tokens change.

## 5. MCP (optional)

If the host supports MCP, configure `@refineui/mcp` — tools: `search_docs`, `get_doc_page`, `list_components`, `get_design_rules`, `get_llm_index`, `run_doctor`. See [references/mcp.md](references/mcp.md).

## 6. Doctor (health check)

For "using RefineUI correctly?" or setup audit requests, run **read-only** diagnostics before suggesting fixes:

1. Prefer CLI `refineui-doctor` or MCP `run_doctor` when available.
2. Otherwise follow [references/doctor.md](references/doctor.md) and [rules/](rules/) with live docs from `llm.txt`.
3. Present findings by severity; cite doc URLs in `references`.
4. **Do not auto-fix** unless the user asks — use each finding's `remediation` as the fix brief.

Docs: https://ui.pelagornis.com/ai-tools/doctor/

## 7. Response principles

- Cite official doc URLs you actually used.
- Separate **read-only guidance** from **apply changes** — only edit code when the user asks.
- Do not invent props, variants, or token names not present in docs or `@refineui/tokens`.
- Suggest one clear next step when useful (e.g. open a specific doc page or run MCP search).
