# Composition API

Detect convenience props on RefineUI components. Category: `components`.

## Forbidden convenience props

`title`, `description`, `items`, `actions`, `onClose`

RefineUI uses **composable subcomponents only** — e.g. `Dialog.Title`, `Dialog.Content`, not `title="..."` on the root.

## Checks

Scan `.tsx` files for JSX passing forbidden props to PascalCase components (likely RefineUI).

## Severity

| Condition | Severity |
|-----------|----------|
| Convenience prop on RefineUI-like component | `warn` |

## References

- https://ui.pelagornis.com/components/
- https://ui.pelagornis.com/llm.txt

## Remediation template

Refactor to documented subcomponent composition. Read the component's doc page for the correct structure.
