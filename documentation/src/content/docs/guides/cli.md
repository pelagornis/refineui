---
title: CLI
description: Prompt Guide CLI — prompt.config.js and prompts sync
---

# CLI (Prompt Guide)

This repo uses **[Prompt Guide](https://github.com/pelagornis/prompt-guide)** (`prompt.config.js`, `prompts/`) to centralize AI/editor rules. It is **separate from RefineUI component docs**—use it when installing or validating prompt rules for your team.

## When to use it

- Adding `prompt.config.js` / `prompts/` templates to a new project
- Running `prompt-guide doctor` to verify configuration

## Install & run

### Global install

```bash
npm install -g @pelagornis/prompt-guide
prompt-guide init
prompt-guide doctor --fix
```

### npx (recommended for one-offs)

```bash
npx @pelagornis/prompt-guide init
npx @pelagornis/prompt-guide init --platform=web
npx @pelagornis/prompt-guide doctor --fix
```

## Commands

| Command | Description |
|---------|-------------|
| `init` | Interactive setup — creates `prompt.config.js` and `prompts/` |
| `doctor` | Validate configuration |
| `doctor --fix` | Auto-fix what can be fixed |

## In this RefineUI repo

If `prompt.config.js` and `prompts/` already exist at the root, you **do not need to run `init` again.** Changes apply from the next editor/chat session.

For the UI library **build and release**, use `pnpm build`. Do not confuse that with Prompt Guide CLI.
