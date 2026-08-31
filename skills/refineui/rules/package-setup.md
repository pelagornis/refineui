# Package Setup

Verify app projects declare required RefineUI packages. Category: `setup`.

## Applicability

- **App** workspaces (`dev`/`start` scripts or app entry files): required.
- **Library** workspaces: `not-applicable` — skip dependency check.

## Checks

1. Read `package.json` dependencies, devDependencies, and peerDependencies.
2. App projects must declare:
   - `@refineui/react`
   - `@refineui/tokens`
3. Recommended but not required for pass:
   - `@refineui/web-icons`
   - `@refineui/utilities`

## Severity

| Condition | Severity |
|-----------|----------|
| Missing `@refineui/react` or `@refineui/tokens` in app | `error` |

## References

- https://design.pelagornis.com/refineui/development/installation/
- https://design.pelagornis.com/refineui/llm.txt

## Remediation template

```
Install required packages:
  bun add @refineui/react @refineui/tokens
Optional:
  bun add @refineui/web-icons @refineui/utilities
```
