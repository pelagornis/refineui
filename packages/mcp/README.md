# @refineui/mcp

MCP server for [RefineUI](https://ui.pelagornis.com) — search docs, fetch component pages, read design rules, and browse token categories from MCP-compatible agents.

## Install

```bash
npm install -D @refineui/mcp
yarn add -D @refineui/mcp
pnpm add -D @refineui/mcp
bun add -d @refineui/mcp
```

## MCP configuration

Add to your MCP host config:

```json
{
  "mcpServers": {
    "refineui": {
      "command": "bunx",
      "args": ["@refineui/mcp"]
    }
  }
}
```

Swap `bunx` for `npx`, `yarn dlx`, or `pnpm dlx` to match your toolchain.

From the monorepo after build:

```json
{
  "mcpServers": {
    "refineui": {
      "command": "node",
      "args": ["/absolute/path/to/refineui/packages/mcp/lib/server.js"]
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `search_docs` | Keyword search across docs (optional category filter) |
| `get_doc_page` | Fetch a page by slug (`components/button`, …) |
| `list_components` | All component doc pages |
| `list_foundations` | All foundation doc pages |
| `get_llm_index` | Full `llm.txt` content |
| `get_design_rules` | Full `DESIGN.md` (Stitch alpha) |
| `list_tokens` | Token categories + semantic text roles |
| `get_index_meta` | Embedded index generation metadata |
| `run_doctor` | Read-only RefineUI workspace diagnostics (via `@refineui/doctor`) |

## Resources

- `refineui://llm.txt` — machine-readable docs index
- `refineui://DESIGN.md` — Stitch-compatible design identity
- `refineui://design-rules` — alias of `DESIGN.md`

## Development

```bash
bun run build:index   # regenerate docs index from ../../docs
bun run build
bun run start         # stdio MCP server
```

Requires Node.js ≥ 20.
