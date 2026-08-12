---
name: review
description: Code review with RefineUI checklist. Invoke when reviewing diffs or PRs.
allowed-tools: Read Grep Glob Bash(git:*)
disable-model-invocation: true
---

# Review (required criteria)

## Scope
MUST: Review all of — full diff, new dependencies, config and env changes.
MUST NOT: Approve changes that add/remove/restructure packages/ — packages structure is fixed.

## Checklist (report only violations as file:line)
1. Consistency: match existing naming, style, layout, patterns.
2. Quality: single responsibility, no duplication, no magic values.
3. Security: no secrets in code or logs; input validation required.
4. Errors: failure cases, timeouts considered; error messages specific.
5. Compatibility: no breaking API or behavior without documentation.
6. Figma alignment: components match Web Kit spec; tokens from Foundation only.

## Output format
MUST: Summary in 1–2 sentences (Approve / Conditional approve / Request changes).
MUST: Only violated items as file:line and concrete description.
If any item fails, conclude "Request changes".