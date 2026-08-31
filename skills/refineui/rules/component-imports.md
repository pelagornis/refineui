# Component Imports

Verify imports follow `@refineui/react` conventions. Category: `components`.

## Violations

| Pattern | Severity |
|---------|----------|
| Deep import: `@refineui/react/components/...` or `@refineui/react/src/...` | `error` |
| Legacy unscoped: `from "refineui"` | `error` |

## Correct pattern

```tsx
import { Button, Field, Input } from "@refineui/react";
```

## References

- https://design.pelagornis.com/refineui/development/installation/

## Remediation template

Replace deep or legacy imports with root package imports.
