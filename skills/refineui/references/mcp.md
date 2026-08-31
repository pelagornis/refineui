# MCP (`@refineui/mcp`)

Docs: `https://design.pelagornis.com/refineui/ai-tools/mcp/`

## Cursor (published package)

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

## Monorepo (local build)

```json
{
  "mcpServers": {
    "refineui": {
      "command": "node",
      "args": ["packages/mcp/lib/server.js"]
    }
  }
}
```

Run `bun run build:mcp` first.

## Tools

| Tool | Use when |
|------|----------|
| `search_docs` | Find pages by keyword |
| `get_doc_page` | Load full MDX body for a slug |
| `list_components` | A–Z component list |
| `list_foundations` | Foundation pages |
| `get_llm_index` | Full llm.txt text |
| `get_design_rules` | Condensed rules for codegen |
| `list_tokens` | Token categories + semantic text roles |
| `run_doctor` | Read-only workspace diagnostics |

Resources: `refineui://llm.txt`, `refineui://design-rules`
