# Stylesheet Setup

Verify global CSS imports for RefineUI. Category: `setup`.

## Applicability

- **App** workspaces only.
- Library packages that re-export styles: `not-applicable`.

## Checks

Scan global CSS entry files (`src/index.css`, `src/styles/global.css`, `src/app.css`, …) for:

**Required imports:**

```css
@import "@refineui/tokens/tailwind.css";
@import "@refineui/react/refineui.css";
```

**Recommended:**

```css
@import "@refineui/web-icons/dist/fonts/refineui-system-icons.css";
```

Read current installation/theming docs — do not hardcode paths that differ from live docs.

## Severity

| Condition | Severity |
|-----------|----------|
| Missing required `@import` | `error` |
| Missing icons CSS only | pass with evidence note |

## References

- https://ui.pelagornis.com/development/theming/
- https://ui.pelagornis.com/development/installation/

## Remediation template

Add imports to the app root CSS file in the order documented on the theming page.
