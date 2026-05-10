# Figma Foundation — RefineUI design tokens

## Foundation URL

**Pelagornis RefineUI Foundation (Figma) — Variables:**
https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650

**Pelagornis RefineUI Web Kit (Figma) — components:**
https://www.figma.com/design/CxoaTfftpyh8ETDBamkkEK/Pelagornis-RefineUI-Web-Kit?node-id=0-1

(`node-id=7-6` opens only an **Accordion example page** inside the file. Per-component specs use MCP `search_design_system` and `get_design_context` on that node — e.g. Breadcrumb `283:688`, Breadcrumb/BreadcrumbItem variants `279:2539` / `289:41` / `289:44`.)

### Foundation and Web Kit

- **Foundation → Web Kit**: Web Kit components use values **linked to Foundation Variables** (color, spacing, padding, radius, etc.).
- **All sizes·padding·gaps** go through Foundation. Do not invent Web Kit–only numbers.

## Roles

- **Foundation = single source** for color, typography, spacing, radius, shadow, and all design tokens.
- **Code sync**: keep `packages/tokens/src/global/*.ts` aligned with Foundation.

## Token mapping

| Foundation (Figma) | Code (`packages/tokens`) |
|--------------------|---------------------------|
| Colors / Variables | `global/colors.ts` |
| Typography | `global/fonts.ts` |
| Typography styles | `global/typographys.ts` |
| Spacing | `global/spacings.ts` |
| Stroke width | `global/strokeWidths.ts` |
| Border radius | `global/borderRadii.ts` |
| Shadow | `global/shadows.ts` (Lighter~Darker, shadowColors) |
| Z-index | `global/zIndex.ts` |
| Text alignment | `global/textAlignments.ts` |

## Using Figma MCP

1. Connect Figma MCP in Cursor.
2. `get_variable_defs` — query Foundation variables (node-id=1-650).
3. `get_design_context` — pass the **component node** in Web Kit (file entry default link `node-id=0-1`; e.g. Breadcrumb `283:688`).
4. For a specific frame/layer use `?node-id=XXX-YYY` / MCP `nodeId` `XXX:YYY`.

## Sync workflow

### Automatic sync via Figma MCP (recommended)

1. **Authenticate Figma MCP** in Cursor (`mcp_auth` or Connect).
2. Ask in chat, for example:
   - *"Pull Foundation (node-id=1-650) variables into packages/tokens."*
   - *"Run get_design_context on Web Kit Breadcrumb (283:688) and update design-specs-web-kit.md and React."*
3. AI uses `get_variable_defs` / `get_design_context` to sync from Figma.

### Manual sync

When Foundation changes:

1. Review changes in Figma.
2. Edit the matching `packages/tokens/src/global/*.ts` files.
3. Update `types.ts` if types drift.
4. Run `pnpm build` (or equivalent) to verify.

## Related files

- `.cursor/rules/figma-foundation.mdc` — Cursor rules
- `prompts/design-system.figma.yml` — prompt rules
- `prompt.config.js` — references `taskPresets.design`
