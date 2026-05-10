# Prompt Guide — RefineUI docs index

**Config, rules, and CLI** docs for the RefineUI project.  
Config: `prompt.config.js` · rule sources: `prompts/*.yml` · human-readable summaries: this directory.

---

## Document list

| Document | Audience | Content |
|----------|----------|---------|
| **[packages.md](packages.md)** | All | **packages/ layout and policy** — monorepo package list; keep `packages/` as-is. |
| **[CLI.md](CLI.md)** | Users, developers | How to run the CLI, `init` / `doctor`, options, examples, errors/exit codes. |
| **[what-install.md](what-install.md)** | Users, maintainers | What the CLI, config, presets, and platforms **add** and **what to edit later**. |
| **[request-guide.md](request-guide.md)** | Developers | **How to write requests**: per-preset tips, guide.template fields, spec/ticket style, examples. |
| **[system.core.md](system.core.md)** | Developers, reviewers | Core rules summary (role, quality, security, errors, docs, collaboration). Source: `prompts/system.core.yml`. |
| **[review.md](review.md)** | Reviewers | Review scope, checklist, output format, conclusion rules. Source: `prompts/review.yml`. |
| **[rules-by-platform.md](rules-by-platform.md)** | Platform developers | Per-platform rules summary (Web/RefineUI focused). Source: `prompts/rules.by-platform.yml`. |
| **[rules-by-tool.md](rules-by-tool.md)** | Users, maintainers | **Where each AI tool loads rules**: Cursor, Claude Code, Codex, Windsurf. Formats and limits. |

---

## Suggested reading order

1. **RefineUI project layout**  
   [packages.md](packages.md) — `packages/` structure and keep-as-is policy

2. **First-time setup**  
   [CLI.md](CLI.md) → [what-install.md](what-install.md) (sections 1, 2, 6, 7)

3. **When asking the AI to do work**  
   [request-guide.md](request-guide.md) (request principles, per-preset tips, template/spec examples)

4. **Day-to-day development and review**  
   [system.core.md](system.core.md), [review.md](review.md), [rules-by-platform.md](rules-by-platform.md)

5. **Changing config or adding presets/platforms**  
   [what-install.md](what-install.md) (sections 2–6)

6. **Using a specific AI tool (Cursor, Codex, Windsurf, etc.)**  
   [rules-by-tool.md](rules-by-tool.md) (where each tool loads rules and how to align with prompt-guide)

---

## YAML source mapping

| Markdown doc | YAML source | Key used by tools |
|--------------|-------------|-------------------|
| system.core.md | prompts/system.core.yml | `prompt` |
| review.md | prompts/review.yml | `prompt` |
| rules-by-platform.md | prompts/rules.by-platform.yml | `platforms.<name>.prompt` |
| packages.md | — | (policy doc, no YAML) |

Tools read the corresponding key from the YAML and inject it as system role / prompt.  
The Markdown docs are **human-friendly summaries** of the same content.
