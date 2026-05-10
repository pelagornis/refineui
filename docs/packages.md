# Packages — RefineUI monorepo layout

RefineUI is a **pnpm workspace** monorepo.  
The `packages/` directory is **kept as-is** and is not treated as something to restructure in AI prompt guides.

---

## Package list

| Package | Path | Description |
|---------|------|---------------|
| **@refineui/react** | `packages/react/` | React components |
| **@refineui/tokens** | `packages/tokens/` | Theme tokens (colors, fonts, spacings, strokeWidths, etc.) |
| **@refineui/utilities** | `packages/utilities/` | React utilities (dom, version, etc.) |
| **@refineui/version** | `packages/version/` | Version utilities |

---

## Policy: keep `packages/` stable

- **No structural moves**: do not add/remove/move packages inside `packages/` as part of routine AI tasks.
- **Dependencies**: respect `pnpm-workspace.yaml` and each package’s `package.json` exports.
- **AI scope**: work requested via the prompt guide is limited to edits **inside** existing packages (e.g. add components in `packages/react`, edit tokens in `packages/tokens`).

---

## See also

- Workspace definition: `pnpm-workspace.yaml`
- Root config: `package.json`, `tsconfig.base.json`, `tsconfig.json`
