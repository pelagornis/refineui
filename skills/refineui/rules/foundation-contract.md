# Foundation Contract

Detect hardcoded colors and arbitrary px in component source. Category: `foundations`.

## Scope

Scan `.tsx`, `.jsx`, `.css` under `src/`. Skip comments and lines that already use `var(--refineui` or token utilities.

## Violations

| Pattern | Severity |
|---------|----------|
| Hex colors (`#rgb`, `#rrggbb`) | `warn` |
| `rgb()` / `rgba()` literals | `warn` |
| Raw `Npx` in style values (not token-backed) | `info` |

Do **not** infer whether a semantic token choice is "correct" — only flag contract violations (hardcoded values).

## References

- https://design.pelagornis.com/refineui/foundations/
- https://design.pelagornis.com/refineui/foundations/design-tokens/

## Remediation template

Replace hardcoded values with semantic aliases (`var(--refineui-color-alias-*)`) or Tailwind utilities from `@refineui/tokens`.
