---
name: design-system
description: UI/design/token work using Figma Foundation. Invoke for design token or component spec tasks.
allowed-tools: Read Write Grep Glob
paths:
  - "packages/react/**"
  - "packages/tokens/**"
disable-model-invocation: true
---

# Design System (Figma Foundation based)

Apply system-core + figma-foundation + tokens-in-components rules.

## Foundation (single source)
- Figma: https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650
- Code: packages/tokens/src/global/*.ts

## Rules
MUST: Use color, spacing, typography, stroke, radius, shadow only from Foundation or @refineui/tokens.
MUST: New components/styles match tokens defined in Foundation. Confirm before adding values not in Foundation.
MUST NOT: Hardcode hex/rgba or px. Import tokens instead.
MUST: When pulling design via Figma MCP pass the Foundation URL or the relevant node-id.