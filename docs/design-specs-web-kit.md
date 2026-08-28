# RefineUI — Design specs (legacy reference)

> **Deprecated:** Prefer `packages/react`, `packages/tokens`, and https://refineui.dev as the source of truth.
> This file is a historical implementation note. Values may drift from shipped code.

Implementation reference derived from `packages/react` and `packages/tokens`.

**Component audit tracker:** [web-kit-component-audit.md](web-kit-component-audit.md)  
**Live docs:** https://refineui.dev/components/

---

## Typography token model

| Layer | Package | Example |
| ----- | ------- | ------- |
| **Foundation** | `@refineui/tokens` `typographys` | `body2` → 14px / 20px / medium |
| **Semantic** | `@refineui/tokens` `SEMANTIC_TEXT` | `bodyMd` → `body2` |
| **Component** | `@refineui/react` `componentTypographyTokens` | `formControl.md` → `bodyMd` |
| **CSS** | `refineui-typo-*` utility + `--refineui-text-body-md-*` aliases | `semanticTextClass('bodyMd')` |

Shared control scale (`sm` / `md` / `lg`): **label** caption1 · body2 · body1 — **form control** body3 · body2 · body1 — **button** body3 · body1 · subTitle1.

---

## 1. Button — Web Kit `79:3304` (COMPONENT_SET)

| Property                 | sm                                        | md                                  | lg                                   |
| ------------------------ | ----------------------------------------- | ----------------------------------- | ------------------------------------ |
| **minHeight**            | `componentSizes.buttonMinHeightSm` (28px) | `buttonMinHeightMd` (36px)          | `buttonMinHeightLg` (48px)           |
| **padding (Label)**      | `sizeXXSmall` `sizeMedium` (4px 10px)      | `sizeXSmall` `sizeMedium` (6px 10px) | `sizeMedium` `sizeLarge` (10px 16px) |
| **gap** (label · icon)   | `sizeXXSmall` (4px)                        | same                                | same                                 |
| **borderRadius**         | `roundedSmall` (4px)                      | `roundedMedium` (6px)               | `roundedLarge` (8px)                 |
| **typography**           | body3 (14/20)                             | body1 (16/24)                       | subTitle1 (20/28 Semi Bold)          |

### Variants (default state, Figma `style` names)

| `variant`   | Figma     | Background / border                                                                               |
| ----------- | --------- | ------------------------------------------------------------------------------------------------- |
| `primary`   | Primary   | `primaryBlack` fill, white text                                                                  |
| `secondary` | Secondary | White fill + `strokeWidthThin` `neutral300` (Secondary hover uses `neutral200` etc. — `refineui.css`) |
| `outline`   | Outline   | Transparent + `strokeWidthThin` `neutral300` (Figma Default border)                               |
| `ghost`     | Ghost     | Transparent, no border                                                                            |

**Disabled:** Primary·Secondary use fill `neutral150`, text `neutral500`; Secondary·Outline borders
`neutral250` (`refineui.css`). Ghost has no fill—text only `neutral500`.

Interactions (hover·pressed·disabled) match **`refineui.css`** `[data-refineui="button"]`.

---

## 2. Input — Web Kit `518:7373` (COMPONENT_SET)

| Property         | sm                                      | md                                      | lg (default)                            |
| ---------------- | --------------------------------------- | --------------------------------------- | --------------------------------------- |
| **minHeight**    | `componentSizes.controlHeightSm` (36px) | `componentSizes.controlHeightMd` (44px) | `componentSizes.controlHeightLg` (52px) |
| **padding**      | `sizeXSmall` `sizeMedium` (6px 10px)     | `sizeMedium` `sizeLarge` (10px 16px)    | `sizeLarge` `sizeXLarge` (16px 20px)    |
| **borderRadius** | `roundedLarge` (8px)                    | `roundedXLarge` (12px)                  | `roundedXXLarge` (16px)                 |
| **typography**   | `body3`                                 | `body2`                                 | `body1`                                 |

Default border `strokeWidthThin` `neutral300`, error `red500`, success `green500`, disabled fill
`neutral150` — shared **`formControlSizes.ts`** for Input / Select trigger / SpinButton; interactions in **`refineui.css`** `[data-refineui="input"]` · `[data-refineui="select-trigger"]`.

### Select / Textarea

| Property           | Select                                                                                      | Textarea                                                                                                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Current impl.**  | Same `size` `sm` / `md` / `lg` as **Input** `518:7373` (default `md`) — same tokens as Input table above | Web Kit **Textarea** `529:5454` (COMPONENT_SET): `minHeight` `componentSizes.controlTextareaMin` (80px), **`roundedLarge`**, **`body2`**, **field padding** `sizeMedium` `sizeXSmall` (10px 6px) — **differs** from Input **md** horizontal padding (`sizeLarge` 16px). Border / hover / focus / disabled aliases match **Input** (`borderError` · `borderSuccess` · `borderDisabled`). |

If Web Kit has **no standalone Select COMPONENT_SET** name, native `<select>` fields follow **Input**
field rules.

---

## 3. Badge — Web Kit `Badge` `270:3353` · `Badge Number` `276:515`

| Property         | `layout="label"` (default)          | `layout="number"` |
| ---------------- | ----------------------------------- | ----------------- |
| **padding**      | `sizeXXXSmall` `sizeXSmall` (2px 6px) | same              |
| **borderRadius** | `roundedMedium` (6px)               | `roundedCircle`   |
| **typography**   | `caption2` (12/16 Regular)          | same              |

### Variants (default = Figma `state=Default` token mapping)

| `variant`               | Background                            | Text color     | Notes                                                    |
| ----------------------- | ------------------------------------- | -------------- | -------------------------------------------------------- |
| `default`               | `primaryBlack`                        | `neutralWhite` | Hover/Pressed via `refineui.css` `[data-refineui="badge"]` |
| `neutral` (`Secondary`) | `primaryLightGray`                    | `neutralBlack` |                                                          |
| `outline`               | Transparent + `strokeWidthThin` `neutral300` | `neutralBlack` |                                                          |
| `success`               | `green500`                            | `neutralWhite` |                                                          |
| `warning`               | `orange500`                           | `neutralWhite` | Not yellow `yellow*`                                       |
| `danger`                | `red500`                              | `neutralWhite` |                                                          |

---

## 4. Breadcrumb — Web Kit `283:688` (COMPONENT_SET)

| Property     | Value                                                         |
| ------------ | ------------------------------------------------------------- |
| **gap**      | `sizeMedium` (10px)                                           |
| **padding**  | `sizeXSmall` vertical (6px) on root                           |
| **type**     | `caption1` — link/separator `foregroundTertiary`; current `foregroundPrimary` + `font-medium` |
| **link hit** | `px` `sizeMedium`, `py` `sizeXSmall`; hover **color only** (`foregroundSecondary`); pressed `backgroundPrimaryActive` + `roundedSmall` |
| **ellipsis** | same row padding as link (`px` `sizeMedium`, `py` `sizeXSmall`); icon `iconSizes.small` (20px) centered in row |

**Separator** default `/` (Caption1 · tertiary). Inline text nav — not button/chip shell (unlike Pagination).

---

## 5. Alert — Web Kit COMPONENT_SET `Alert` `384:885`

| Property         | Value                                            |
| ---------------- | ------------------------------------------------ |
| **background**   | neutralWhite                                     |
| **border**       | 1px solid neutral300                             |
| **borderRadius** | 6px (roundedMedium)                              |
| **padding**      | 10px (sizeMedium)                                |
| **layout**       | flex, icon (left) + text (center) + actions (right) |

### Icon

- Circular outline (border 2px, accent color)
- Size: 24×24px

### Text

- **title**: subTitle2 (16px/24px Semi Bold), primaryBlack
- **description**: body4 (12px/16px), accent color

### Variants (accent colors)

| Variant | accent       |
| ------- | ------------ |
| default | primaryBlack |
| info    | blue600      |
| success | green600     |
| warning | yellow600    |
| danger  | red600       |
| custom  | purple600    |

### Actions

- Dismiss (×): top right
- Action buttons: up to 2, primary sm

---

## 6. Avatar — Web Kit `Avater` (COMPONENT_SET; Figma spelling as in file)

**Single avatar** is `packages/react` `Avatar`; diameters match `componentSizes.avatarSm` / `avatarMd` /
`avatarLg` to Web Kit `Avater` **Small / Medium / XLarge** (32 / 36 / 56px). Group overlap follows
`Avater Stack` node `69:3008`.

| `size` | Diameter | Web Kit `Size` | Initials type | Initial char count | Empty-slot `person` icon (`iconSizes`) |
| ------ | -------- | -------------- | ------------- | ------------------ | -------------------------------------- |
| `sm`   | 32px     | Small          | caption1      | 1                  | md                                     |
| `md`   | 36px     | Medium         | body2         | 2                  | lg                                     |
| `lg`   | 56px     | XLarge         | subTitle1     | 2                  | xl                                     |

- **Orange `layout=Initials` (MCP `76:1451`)**: 56px tier initials use **`typographys.title3`** (Web/Title/Title 3 — 24px semibold); 32·36px tiers keep **Body 1** (16px medium).
- **Background (initials·icon)**: `neutral300` (Neutral tone)
- **Image**: `object-fit: cover`, circular mask `roundedCircle`

### Avatars (`Avater Stack` / `Avater Spread`)

`packages/react` `Avatars` — `layout="stack"` (default) is **Avater Stack** `69:3008`;
`layout="spread"` is **Avater Spread** `69:3007`.

| Item              | `stack`                                                                                                                   | `spread`                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Spacing**       | Adjacent tiles **overlap** — `componentSizes.avatarStackOverlapSm` / `Md` / `Lg` (6 / 8 / 10px). Same value on container `paddingRight` | `gap`: `sm` → `spacings.sizeMedium`(10px), `md` → `spacings.sizeLarge`(16px), `lg` → `spacings.sizeXLarge`(20px) — MCP Avater Spread `69:3007` |
| **Tile border**   | Avatar tile vectors handle separation — stack rows have **no wrapper `border`** | No border (horizontal gap only)                                                                                                           |
| **+N overflow**   | White fill, `strokeWidthThin` + `neutral300`, type `sm`→caption2 / `md`→caption1 / `lg`→body2, `neutral600`               | same                                                                                                                                           |

---

## 7. Card — Web Kit COMPONENT_SET `Card` `394:865`

| Property         | elevated                                                       | outlined                       |
| ---------------- | -------------------------------------------------------------- | ------------------------------ |
| **background**   | `neutralWhite` / alias `backgroundPrimary` per state           | `neutralWhite`                 |
| **borderRadius** | `roundedXXLarge` (16px)                                        | same                           |
| **shadow**       | `shadows.shadow4Light` (`toBoxShadow`) — Elevation Shadow 4    | none                           |
| **border**       | none                                                           | `strokeWidthThin` `neutral300` |

**Regions (MCP `394:853` / `Card / Header` · `Card / Footer`):**

| Slot            | Padding / gap                                                                 |
| --------------- | ------------------------------------------------------------------------------- |
| **Card / Header** | Horizontal `sizeXLarge` (20px), vertical `sizeLarge` (16px) — `py`, not `pt` only |
| **Card / Content** | Match header horizontal inset: `sizeXLarge`; vertical per layout (default body uses bottom `sizeLarge` in React) |
| **Card / Footer** | Horizontal `sizeXLarge` (align with header/content), vertical `sizeMedium`   |
| **Title ↔ description** | `sizeXXSmall` (4px) gap in **CardHeaderMain**                                |

---

## Checkbox — Web Kit `327:2539` (COMPONENT_SET)

| Property      | Value                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **box**       | `componentSizes.controlCheckbox` (20×20), `gap` to label `sizeXSmall` (6px)                                                        |
| **variant**   | `default` — `roundedSmall` (4px); `circular` — `roundedCircle`                                                                  |
| **Unchecked** | Fill `neutralWhite`, border `strokeWidthThin` `neutral300`                                                                        |
| **Checked**   | Default `primaryDarkGray`, hover `neutralBlack`, pressed `neutral600`, focus `primaryBlack` + `strokeWidthThick` `neutral450` border |
| **Disabled**  | Unchecked: fill `neutral100`, border `neutral250`; checked: fill `neutral200`, check mark `neutral600`                            |
| **label**     | `body2`; with `description`, `caption2`, secondary `neutral600`                                                                  |

Interactions (hover·active·focus-visible) use **`refineui.css`** `[data-refineui="checkbox"]` (same hex as Foundation palette).

---

## Chip / Tag — Web Kit COMPONENT_SET `Tag` `574:6578` (`packages/react` **`Chip`** export · **`Tag`** same component)

| Property         | Value                                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **minHeight**    | `sm` `chipMinHeightSm` (20px · Foundation 200) · `md` `chipMinHeightMd` (24px · 240) · `lg` `chipMinHeightLg` (32px · 320) — **below** Button `28/36/48`; Chakra/Carbon/M3 compact-tag norm     |
| **padding-x**    | `sm`/`md` → `sizeXSmall` (6px); `lg` → `sizeSmall` (8px). Vertical centering via `min-h` + `items-center`                                                                                         |
| **gap**          | `sizeXXSmall` (4px) — between text·dismiss·`avatar`                                                                                                                                               |
| **borderRadius** | `roundedMedium` (6px)                                                                                                                                                                           |
| **size**         | default **`md`**. Typo `labelSm` / `bodySm` / `bodyLg`; dismiss icon `iconSizes.xxsmall` / `xsmall` / `small` (12/16/20) — kept under chip height                                                 |
| **variant**      | `default` — fill `neutralWhite`, text `primaryBlack` (Figma `foregroundbrand` #212121); `outline` — `strokeWidthThin` `neutral300`; `filled` — Figma `Selected`, `primaryBlack` + `neutralWhite` |
| **disabled**     | `default`/`outline`: fill `neutral150`, text `neutral400`; `outline` border `neutral250`; `filled`: fill `neutral200`                                                                           |
| **avatar**       | Optional slot (Figma `showAvater`); size aligned by consumer with `Avatar`, etc.                                                                                                                  |

Interactions use **`refineui.css`** `[data-refineui="chip"]` (Default hover·pressed
neutral100·neutral150; Outline border neutral500·`#333`; Filled matches Badge primary tone).

---

## Dialog — Web Kit COMPONENT_SET `Dialog` `393:1181`

| Property           | Value                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **panel padding**  | `sizeXXLarge` (24px)                                                                                                          |
| **header–body**    | `sizeLarge` (16px) — no header bottom border (Figma auto-layout `gap`)                                                         |
| **width**          | Large → `componentSizes.dialogMaxWidth` (600px); Small → `componentSizes.dialogWidthSm` (300px) — `Dialog` `size` `lg` / `sm` |
| **borderRadius**   | `roundedLarge` (8px)                                                                                                          |
| **shadow**         | `shadows.shadow8Light` (`toBoxShadow`)                                                                                        |
| **title**          | `subTitle2` (16/24 Semi Bold), `primaryBlack`                                                                                 |
| **dismiss**        | dismiss `iconSizes.xl` (24px hit area)                                                                                        |
| **body**           | default `body2`                                                                                                               |

Scrim uses `overlays.backdrop`; overlay, ESC, portal — `packages/react` `Dialog`.

---

## Drawer — Web Kit COMPONENT_SET `Drawer` `635:1756`

| Property        | Value                                                                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **type**        | Figma `Overlay` · `Inline` — React `Drawer` is **Overlay (portal·scrim) only**                                                                                                          |
| **width**       | `lg` → `componentSizes.drawerWidthLg` (850px); `md` → `componentSizes.drawerWidthMd` (575px); `sm` → `componentSizes.drawerWidthSm` (320px) — `size` `"sm"` \| `"md"` \| `"lg"` |
| **panel shadow**| `shadows.shadow16Light` (`toBoxShadow`)                                                                                                                                                 |
| **header**      | `paddingTop`/`paddingLeft`/`paddingRight` `sizeXXLarge` (24px), `paddingBottom` `sizeMedium` (10px); dismiss·title row `gap` `sizeXSmall` (6px); title `subTitle1` (20/28 Semi Bold)       |
| **Divider**     | `strokeWidthThin` `neutral300` (between header and body)                                                                                                                                |
| **body**        | `padding` `sizeXXLarge`; default `body2`                                                                                                                                                |

Figma includes header **Cancel/Ok** **Button Container** and bottom **Drawer / Footer** variants;
`packages/react` `Drawer` exposes **dismiss + title + Divider + `children`** only. Actions and footer go in
`children` or parent layout.

---

## Dropdown — Web Kit COMPONENT_SET `Dropdown` `503:2985`

| Property            | Value                                                                                                                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **menu width**      | `componentSizes.dropdownMenuWidth` (180px)                                                                                                                                                                                                                                                 |
| **menu**            | `padding` `sizeXXSmall` (4px); **`gap` 1px** between items (`gap-px`); `borderRadius` `roundedLarge`; border **`strokeWidthHairline`** · **`alias.borderDefault`**; fill **`alias.backgroundPrimary`**; `shadows.shadow2Light`                                                               |
| **Title Item**      | `padding` vertical `sizeXSmall` · horizontal `sizeMedium` (6px 10px); `body2` · **`alias.foregroundPrimary`**                                                                                                                                                                             |
| **Menu / Item**     | Same padding; `body4`; label **`alias.foregroundPrimary`**; (Figma More·Avatar etc.) **left 16px icon** — React `DropdownItem` `startIcon`; shortcuts etc. secondary **`alias.foregroundSecondary`**; hover **`alias.backgroundSurfaceHover`**; selected/check rows per MCP **`alias.backgroundSurfaceActive`** |
| **trigger (Default)** | `roundedSmall`, `strokeWidthThin` **`alias.borderDefault`**; when chevron is split, vertical hairline left of right zone **`strokeWidthHairline`**; chevron glyph **`iconSizes.small`** (20px)                                                                                               |

React `Dropdown`·`DropdownItem` support `selected`·`selection`(`none` \| `checkbox` \| `radio`) for checkbox/radio
rows and ARIA (`menuitemcheckbox` / `menuitemradio`). Match Figma **Avatar** triggers via Preview·`startIcon`.

---

## Menu — Web Kit COMPONENT_SET `Menu` `633:4268`

| Property    | Value                                                                                                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **panel width** | `componentSizes.menuPanelWidth` (244px)                                                                                                                                               |
| **panel**   | `padding` `sizeXXSmall`; `gap` `sizeMinimal` (between items); `borderRadius` `roundedLarge`; `strokeWidthHairline` `alias.borderDefault`; fill `alias.backgroundSurface`; `shadows.shadow2Light` |
| **item**    | `padding` `sizeXSmall` (6px); `borderRadius` `roundedLarge`; `body2`; default `alias.foregroundPrimary`; disabled `alias.foregroundDisabled`; description/shortcut `body4` `alias.foregroundTertiary` |
| **composition** | Per `Menu / Item` Content `633:4270` — `startIcon`(20px slot), `label`(body2), optional `description`(body4), optional `shortcut`, optional `endIcon`(chevron etc.)                    |

Figma has **Section Header**, **Divider**, and **icon·shortcut** columns; React `Menu` exposes composition
slots (`startIcon` / `description` / `shortcut` / `endIcon`) plus **`MenuSub` / `MenuSubTrigger` / `MenuSubContent`**
for chevron nested panels. Separate from **Dropdown**’s narrow menu (180px, `body4`/`neutral850` rows).

---

## Pagination — Web Kit `Pagination` `558:1989` · COMPONENT_SET `Pagination / Item` `570:2332`

| Property        | Value                                                                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **row gap**     | `sizeMedium` (10px)                                                                                                                          |
| **item**        | `padding` `sizeXSmall`; min `componentSizes.paginationButtonMinWidth` (40×40); `borderRadius` `roundedXLarge` (12px); `strokeWidthThin` `alias.borderDefault`; fill `alias.backgroundPrimary` |
| **icon**        | chevron `iconSizes.medium` (24px slot)                                                                                                           |
| **page label**  | `body1`                                                                                                                                      |

Hover/disabled fill/border via **`refineui.css`** `[data-refineui="pagination"]`. Does **not** ship the full Figma **number grid·ellipsis (…)·current highlight**—only **Previous / `page / totalPages` / Next**.

---

## Progress bar — Web Kit COMPONENT_SET `Progress bar` `452:3994`

| Property       | Value                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| **size**       | `sm` — track height `componentSizes.progressTrackHeightSm` (2px); `lg` — `componentSizes.progressTrackHeightLg` (4px) |
| **track fill** | `alias.backgroundBrandSubtle`                                                                                      |
| **fill (default)** | `alias.backgroundBrand`                                                                                        |

`variant` `success` / `warning` / `danger` — treat as product extension if missing from Web Kit **Progress bar** grid.

---

## Radio — Web Kit COMPONENT_SET `Radio` `397:1001` · `Radio / Input`

| Property            | Value                                                                                                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Radio / Input`** | 20×20 circle — unchecked: `strokeWidthThin` `alias.borderDefault`, `alias.backgroundPrimary`; inner dot `sizeMedium` (10px); focus (unchecked/checked): `strokeWidthThick` outer `alias.borderStrong` (MCP `397:1147` etc.) |
| **control**         | `componentSizes.controlCheckboxRadio` (20×20), `roundedCircle` — **`refineui.css`** `[data-refineui="radio"]` (alias colors·`label:hover` / `label:focus-within`)                 |
| **selected**        | Ring `alias.backgroundBrand`, inner dot same; hover ring·dot `alias.backgroundBrandActive`; focus ring `alias.borderStrong` + dot `alias.backgroundBrand`                              |
| **disabled**        | Fill `alias.backgroundPrimary`, border `alias.borderDisabled`; when selected, dot `alias.foregroundDisabled`                                                                         |
| **row**             | Control·text `gap` `sizeXSmall` (6px); label `body2` / description `caption2` (shared `Label` companion styles)                                                              |
| **label**           | `body2`, `alias.foregroundPrimary` — when disabled `alias.foregroundDisabled`                                                                                               |
| **description**     | `caption3`, `alias.foregroundSecondary` — when disabled `alias.foregroundDisabled`                                                                                             |

---

## Skeleton — Web Kit COMPONENT_SET `Skeleton` `570:6175`

| Property      | Value                                                                                                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **fill**      | `alias.backgroundBrandSubtle` (Shimmer Color)                                                                                                                                                       |
| **shape**     | `shape` `rectangle` → `roundedLarge`; `circle` → `roundedCircle`                                                                                                                                    |
| **default height** | `componentSizes.skeletonDefaultHeight` (20px) — rectangle defaults width `100%`; circle is square when one dimension set                                                                                                   |
| **shimmer**   | MCP Mask(`570:6320`): `90deg` — `transparent 0%` → `alias.backgroundPrimary` `22.5%`–`32.5%` → `transparent 50%` — **`refineui.css`** `refineui-skeleton-shimmer`; stops under `prefers-reduced-motion` |

---

## Slider — Web Kit COMPONENT_SET `Slider` `526:1556`

| Property                 | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **size**                 | `sm` — rail height `componentSizes.sliderTrackHeightSm` (2px); `md` (default) — `componentSizes.sliderTrackHeightMd` (4px)                                                                                                                                                                                                                                                                                                                                                          |
| **rail (unfilled)**      | `alias.backgroundBrandSubtle` — `borderRadii.roundedXSmall` (2px)                                                                                                                                                                                                                                                                                                                                                                                                             |
| **fill**                 | `alias.backgroundBrand` — **disabled** uses `alias.foregroundDisabled` (Track-fill)                                                                                                                                                                                                                                                                                                                                                                                             |
| **thumb (Slider / Item)** | Per COMPONENT_SET node MCP vars — 16×16 `roundedCircle` (**`refineui.css`**): shared white ring `alias.backgroundPrimary` + outer ring — **Default** `526:1739` center `alias.backgroundBrand`, ring `alias.borderDefault`(thin); **Hover** `526:1714` center `alias.backgroundBrandHover`, ring `alias.borderStrong`; **Focus** `526:1718` center `alias.backgroundBrandActive`, ring `alias.borderDefault`; **Disabled** `526:1840` center `alias.backgroundBrandDisabled`, ring `alias.borderDisabled` |
| **touch target**         | Input height `componentSizes.sliderInteractionHeight` (28px · Foundation 280; Web Kit visual row ~24px, slightly taller hit area)                                                                                                                                                                                                                                                                                  |

WebKit uses `--refineui-slider-fill` (0–100%) for rail gradient; Firefox uses `::-moz-range-progress` for fill.

---

## Spin Button — Web Kit COMPONENT_SET `Spin Button` `561:2067`

| Property              | `sm`                                                                                        | `md` (default)                          | `lg`                                    |
| --------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------- |
| **height**            | `componentSizes.controlHeightSm` (32px)                                                     | `componentSizes.controlHeightMd` (40px) | `componentSizes.controlHeightLg` (48px) |
| **radius**            | `roundedMedium` (6px)                                                                       | `roundedLarge` (8px)                    | `roundedXLarge` (12px)                  |
| **value area type**   | `caption1`                                                                                  | `body2`                                 | `body1`                                 |
| **value area padding start** | `componentSizes.spinFieldPaddingInlineStart` (12px)                                  | same                                    | same                                    |
| **Stepper column**    | `componentSizes.spinStepperWidth` (32px); half-step heights `spinStepperStepHeightSm` / `Md` / `Lg` |                                         |                                         |
| **icon**              | chevron `iconSizes.sm` (12px)                                                               | same                                    | same                                    |

| State                 | Style                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **default**           | Fill `alias.backgroundPrimary`, border `strokeWidthThin` `alias.borderDefault`, text `alias.foregroundPrimary`                  |
| **focus (whole field)** | Border `alias.borderFocus` — **`refineui.css`** `[data-refineui="spinbutton"]:focus-within`                                     |
| **disabled**          | Fill `alias.backgroundSurfaceDisabled`, border `alias.borderDisabled`, text `alias.foregroundDisabled`; Stepper at `opacity` 0.5 |

---

## Spinner — Web Kit COMPONENT_SET `Spinner` `550:3669`

| `size`      | Diameter                                  | Ring width                | Label type (Figma `showLabel`) |
| ----------- | ----------------------------------------- | ------------------------- | ------------------------------ |
| `xs`        | `componentSizes.spinnerSizeXSmall` (16px) | `spinnerRingWidthXSmall`  | `caption1`                     |
| `sm`        | `spinnerSizeSmall` (20px)                 | `spinnerRingWidthSmall`   | `body2`                        |
| `md` (default) | `spinnerSizeMedium` (24px)             | `spinnerRingWidthMedium`  | `body1`                        |
| `lg`        | `spinnerSizeLarge` (28px)                 | `spinnerRingWidthLarge`   | `subTitle2`                    |
| `xl`        | `spinnerSizeXLarge` (32px)                | `spinnerRingWidthXLarge`  | `subTitle1`                    |
| `xxl`       | `spinnerSizeXXLarge` (48px)               | `spinnerRingWidthXXLarge` | `title3`                       |

| Property             | Value                                                                               |
| -------------------- | ----------------------------------------------------------------------------------- |
| **track**            | `alias.backgroundBrandSubtle` (`#e6e6e6`)                                           |
| **accent (spin arc)**| `alias.backgroundBrand` (`#212121`) — CSS `border-top-color` + rotation             |
| **label·icon gap**   | `sizeXSmall` (6px)                                                                   |
| **`labelPosition`**  | `left` \| `right` (Figma default) \| `top` \| `bottom`                              |
| **animation**        | **`refineui.css`** `[data-refineui="spinner"]` `refineui-spin` 0.8s linear infinite |

Figma default `size` is `XSmall`; React defaults to `md` for readability in apps.

---

## PopOver — Web Kit COMPONENT_SET `PopOver` `553:5669`

| Property | `variant="default"`                                                                                                                                         | `variant="inverted"`                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **panel**| `minWidth` `componentSizes.popoverPanelWidth` (325px); `padding` `sizeLarge` (16px); `roundedXXLarge`; `strokeWidthThin` `neutral300`; `shadows.shadow8Light` | Fill `surfaceInverse`, text `foregroundInversed`, border `borderStrong`, `shadows.shadow8Dark` |

| API                                                       | Figma mapping                                                                                                                                                                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`placement`**                                           | `position` — `top` \| `bottom` \| `left` \| `right`                                                                                                                                                                |
| **`align`** (`start` \| `center` \| `end`, default `center`) | `align` — panel·beak alignment on axis                                                                                                                                                                           |
| **beak**                                                  | Triangle on panel edge (`foundationSize160` × `foundationSize80`). Bottom/Top Start·End horizontal beak inset: `popoverBeakInsetFromStartEdge`·`popoverBeakInsetFromEndEdge`; left/right placements use vertical inset + `sizeMedium`. |

---

## Field — Web Kit COMPONENT_SET `Field` `525:1074`

| Property           | Value                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **size** (`Field`) | `sm` — label `caption1`; `md` — `body2`; `lg` (default) — `body1` (Figma Label Small / Medium / Large) |
| **label·control·feedback** | Stack `gap` `sizeXXSmall` (4px) between label, control, hint/error                                      |
| **validation (error)** | `caption3`, `red700`                                                                          |
| **helper (hint)**  | `caption3`, `neutral500` (Figma foreground tertiary)                                              |
| **required**       | `*` `red700`                                                                                      |

Figma has **Info** icon beside label and per-slot validation icons; React `Field` exposes **text label + child
control + error/hint** only.

---

## Label — Web Kit COMPONENT_SET `Label` `216:1681`

| Property       | sm         | md      | lg      |
| -------------- | ---------- | ------- | ------- |
| **typography** | `caption1` | `body2` | `body1` |

| Property      | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| **disabled**  | When `true`, text `neutral400` (Figma `foregrounddisabled`) |
| **block spacing** | `marginBottom` `sizeXXSmall` — same as `Field` label      |
| **required `*`** | `red700` — same as `Field`                              |

`packages/react` `Label` default `size` is **`md`**. **`Field`** default is **`lg`** (Figma COMPONENT_SET default variant Large). Child **`Input`** inherits `Field` `size` when its own `size` is omitted.

**React mapping:** `Label` + `LabelRequired` are the shared atoms; `FieldLabel` / `FieldRequired` are Field-scoped wrappers (size from `Field` context).

---

## Link — Web Kit COMPONENT_SET `Link` `226:158`

| State        | `variant="default"` (tokens)                        |
| ------------ | --------------------------------------------------- |
| **Default**  | `body1`, `blue700`, no underline                    |
| **Hover**    | `blue800`, underline (`refineui.css`)               |
| **Focus**    | `blue900`, underline + focus ring                   |
| **Pressed**  | `blue500` (Figma Pressed / `foregroundlinkvisited`) |
| **Disabled** | `neutral400`, no underline                          |

**External link icon** — `open` `iconSizes.lg` (20px), `gap` to text `sizeXXSmall` (4px).

**`variant="subtle"`** — not in Web Kit grid. Base `neutral600`; interaction colors in `refineui.css`
(`neutral700` / `neutral800`).

---

## 8. Divider — Web Kit COMPONENT_SET `Divider` `346:722`

| layout      | Description                                                                                                                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **default** | Full-width 1px (`strokeWidthThin`), `neutral300`                                                                                                                                                                                                         |
| **content** | Caption 2 (12/16 Regular), **text `neutralBlack`** (Figma `global/colors/neutral/black`), split lines + text, `gap` sizeMedium(10px), `overflow` clip, row `justify-center`, short side **`componentSizes.dividerShortEnd`(8px)**, long side **`flex: 1 0 0`** |
| **icon**    | **`componentSizes.dividerIconSlot`(20×20)** frame, Shape **`componentSizes.dividerIconCircleDiameter`** + **`componentSizes.dividerIconCircleInset`** (3px) offset (Figma `346:722`), same gap·line·flex rules                                               |

| align      | (content / icon)                       |
| ---------- | -------------------------------------- |
| **center** | Both lines `flex: 1 0 0`               |
| **left**   | Left `dividerShortEnd` + right grows   |
| **right**  | Left grows + right `dividerShortEnd`   |

(Web Kit `346:722` has **no vertical Divider** variant. Implementation supports **horizontal** only.)

---

## 9. Accordion — Web Kit `COMPONENT_SET` node-id `54:146` (page root link `7-6`)

| Property                 | Value                                                            |
| ------------------------ | ---------------------------------------------------------------- |
| **root gap**             | `sizeXSmall` between items                                       |
| **trigger minHeight**    | 44px                                                             |
| **trigger padding**      | 6px 10px (sizeXSmall sizeMedium)                                  |
| **trigger gap**          | 10px (sizeMedium)                                                |
| **trigger typography**   | `size`: sm → body2, md → body1, lg → subTitle1 |
| **icon size**            | scales with `size`: sm → xsmall, md → small, lg → medium         |
| **chevron**              | `chevron-down` + rotate 180° when open                           |
| **content padding**      | 10px horizontal/bottom (`sizeMedium`); flush under trigger (no top gap) |
| **open item shell**        | single `backgroundPrimaryHover` on item — trigger + content share surface |
| **trigger press**          | `:active` only — `backgroundPrimaryActive` + `scale(0.98)` (no hover) |
| **content typography**     | sm → body3, md → body2, lg → body1; color `foregroundSecondary` |

---

## 10. Switch / Toggle — Web Kit COMPONENT_SET `Switch` `270:3057`

| Property            | Value                                                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **track (overall)** | `componentSizes.switchWidth` (44px) × `componentSizes.switchHeight` (24px); inner track area 40×20                                                                                        |
| **padding**         | `componentSizes.switchPadding` (2px)                                                                                                                                                    |
| **radius**          | `roundedXLarge` (12px)                                                                                                                                                                  |
| **thumb**           | `componentSizes.switchThumb` (20×20), `roundedXLarge` (12px), default `alias.backgroundPrimary` (`#ffffff`)                                                                             |
| **track fill (on)** | `alias.backgroundBrand` (`#212121`)                                                                                                                                                     |
| **track fill (off)**| `alias.backgroundPrimaryActive` (`#f0f0f0`)                                                                                                                                            |
| **disabled track**  | OFF `alias.backgroundSurfaceDisabled`; ON `alias.backgroundBrandSubtle` (on/off stay distinguishable)                                                                                   |
| **disabled thumb**  | OFF `alias.backgroundBrandSubtle`; ON `alias.backgroundPrimary`                                                                                                                          |
| **hover / pressed** | OFF: `surfaceSelected` / `brandSubtle` (darken vs rest); ON: `brandHover` / `brandActive` (aligned with Checkbox) — **`refineui.css`** `[data-refineui="switch"]`                      |
| **focus**           | `outline` 2px `alias.borderFocus`                                                                                                                                                       |
| **thumb elevation** | enabled `shadow2`; disabled none                                                                                                                                                        |

`packages/react` `Switch` and `Toggle` share the same implementation.

---

## 10.1 Tabs — Web Kit `Tabs` `636:5371` · `Tabs / Item` `636:5372`

Web Kit still names this COMPONENT_SET **Tabs**. `packages/react` ships that **pill** visual as **`SegmentedControl`**. Code **`Tabs`** is a token-based underline + `tabpanel` composition (not a second Web Kit set).

(Aligned with shipped `Tabs` / `SegmentedControl` token values.)

| Property | MCP value |
| --- | --- |
| **Tab bar (wrapper)** | Fill **`alias.backgroundSurfaceActive`** (MCP `Background/Surface/Active` · `#f0f0f0`), border `strokeWidthThin` **`alias.borderDefault`**, padding `sizeXSmall`, **item gap `sizeMedium`(10px)**, outer radius **`roundedXLarge`(12px)** |
| **Tab chip** | `py` **sizeXXSmall**(4px) · `px` **sizeXSmall**(6px) (latest MCP), inner radius **`roundedLarge`(8px)** |
| **Leading icon** | Optional 16×16 (MCP `showIcon`), gap to label **`sizeXSmall`(6px)** |
| **type** | **Caption 1** — Web Font Size 200 / Line 200 (`refineui-typo-caption-1`) |
| **Selected** | Fill **`alias.backgroundSurface`**, **`shadows.shadow2Light`** |
| **Selected · Hover** | Fill **`alias.backgroundSurfaceHover`**, keep Shadow 2 (`Active=True, State=Hover`) |
| **Unselected · Hover** | No fill (transparent), text only **`alias.foregroundPrimaryHover`** (`Active=False, State=Hover`) |
| **Selected + disabled** | Fill **`alias.backgroundSurfaceDisabled`**, same Shadow 2 (MCP `Tabs / Item`) |
| **Unselected** | Transparent fill, text **`alias.foregroundPrimary`** |
| **disabled (unselected)** | Text **`alias.foregroundDisabled`** |

---

## 11. Spacing (packages/tokens)

| Token        | Value |
| ------------ | ----- |
| sizeNone     | 0    |
| sizeXXXSmall | 2px  |
| sizeXXSmall  | 4px  |
| sizeXSmall   | 6px  |
| sizeSmall    | 8px  |
| sizeMedium   | 10px |
| sizeLarge    | 16px |
| sizeXLarge   | 20px |
| sizeXXLarge  | 24px |
| sizeXXXLarge | 32px |

---

## 12. Typography (packages/tokens) — Foundation node-id=1-650

| Style     | fontSize | lineHeight | fontWeight  |
| --------- | -------- | ---------- | ----------- |
| heading1  | 64px     | 86px       | 800 (Heavy) |
| heading2  | 40px     | 60px       | 700         |
| heading3  | 32px     | 40px       | 700         |
| heading4  | 28px     | 36px       | 600         |
| title1    | 32px     | 40px       | 600         |
| title2    | 28px     | 36px       | 600         |
| title3    | 24px     | 32px       | 600         |
| subTitle1 | 20px     | 28px       | 600         |
| subTitle2 | 16px     | 24px       | 600         |
| body1     | 16px     | 24px       | 500         |
| body2     | 14px     | 20px       | 500         |
| body3     | 14px     | 20px       | 400         |
| body4     | 12px     | 16px       | 400         |
| caption1  | 12px     | 16px       | 500         |
| caption2  | 12px     | 16px       | 400         |
| caption3  | 10px     | 14px       | 400         |

---

## 13. Border Radius (packages/tokens)

| Token          | Value  |
| -------------- | ------ |
| roundedNone    | 0      |
| roundedXSmall  | 2px    |
| roundedSmall   | 4px    |
| roundedMedium  | 6px    |
| roundedLarge   | 8px    |
| roundedXLarge  | 12px   |
| roundedXXLarge | 16px   |
| roundedCircle  | 9999px |

---

## 14. Stroke Width (packages/tokens)

| Token               | Value |
| ------------------- | ----- |
| strokeWidthNone     | 0   |
| strokeWidthThin     | 1px |
| strokeWidthThick    | 2px |
| strokeWidthThicker  | 4px |
| strokeWidthThickest | 6px |

---

## 15. Shadow (packages/tokens)

- **Button**: `shadow2Light` (key + ambient)
- **Toast**: `shadow4Light` (key + ambient)
- **Tooltip**: `shadow8Light`
- **Card (elevated)**: `shadow4Light`

Shadow levels: shadow2, shadow4, shadow8, shadow16, shadow24, shadow32, shadow64  
Per level: Lighter, Light, (default), Dark, Darker

---

## 16. Color (common usage)

| Use case        | Token                  |
| --------------- | ---------------------- |
| primary text/bg | primaryBlack (#212121) |
| primary outline | primaryBlack           |
| secondary bg    | neutral200             |
| border default  | neutral300             |
| error           | red500, red200, red900 |
| success         | green200, green900     |
| warning         | yellow200, yellow900   |
| background      | neutralWhite           |

---

## Toast — Web Kit COMPONENT_SET `548:655`

| Property                      | Value                                                                                                                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **width**                     | 325px — `componentSizes.toastMinWidth` · `componentSizes.toastMaxWidth` (default cards `548:654`·`552:2029`)                                                                                                                       |
| **padding**                   | `sizeLarge` (16px)                                                                                                                                                                                                                 |
| **row gap** (icon·body·action)| `sizeMedium` (10px)                                                                                                                                                                                                                |
| **borderRadius**              | `roundedXLarge` (12px) — MCP/Web Kit Toast card refresh                                                                                                                                                                            |
| **border**                    | `strokeWidthThin` `neutral300`; **Focus** (`552:2029`) keeps thin width and uses `neutral450` / `alias.borderStrong` color only (no width jump)                                                                                          |
| **shadow**                    | `shadows.shadow4Light` (Elevation Shadow 4)                                                                                                                                                                                      |
| **Toast / Icon** (left)       | 24×24 (`spacings.sizeXXLarge`); `WebIcon` `iconSizes.md`; row `items-center` for **vertical center** in card; DOM `data-refineui="toast-icon"`; Type from root `data-variant` (`default` \| `success` \| `error` \| `warning`) + default icon map |
| **title**                     | `body2`                                                                                                                                                                                                                            |
| **message**                   | `body4`, `neutral500`                                                                                                                                                                                                              |
| **action**                    | `Toast / Action` — inner **Button** Small (Web Kit button sm)                                                                                                                                                                      |

**`variant`** (`default` \| `success` \| `error` \| `warning`) maps to Figma **Type** and switches **default
icon name·accent color**. Web Kit **Toast** grid only has **`State=Default`**·**`Focus`**;
Type variants are distinguished in React via `data-variant` only.

**`<Toaster />` viewport placement:** not in Figma component set; React extension for app UX.
`data-refineui="toaster"` gets `data-position` (`top-left` \| `top-center` \| `top-right` \|
`bottom-left` \| `bottom-center` \| `bottom-right`); `refineui.css` branches anchor and bottom-stack
`translateY` sign.

---

## Tooltip — Web Kit COMPONENT_SET `90:1686`

| Property         | Value                                                                               |
| ---------------- | ----------------------------------------------------------------------------------- |
| **padding**      | `sizeXSmall` `sizeMedium` (6px 10px)                                                 |
| **borderRadius** | `roundedMedium` (6px)                                                               |
| **typography**   | `body4`                                                                             |
| **shadow**       | `shadows.shadow8Light`                                                              |
| **maxWidth**     | `componentSizes.tooltipMaxWidth` (200px)                                            |
| **arrow**        | Half-edge `sizeXSmall`(6px) CSS triangle (12px wide) — Figma uses SVG beaks per `position`×`align` |

**`position` × `align`:** Same **PascalCase** as MCP — `position` `Top` \| `Bottom` \| `Left` \| `Right`, `align` `Start` \| `Center` \| `End` (**12 combos**). `packages/react` `Tooltip` uses the prop names·values above; **defaults** `position="Bottom"`, `align="Start"`. Figma beaks are SVG; React approximates with token-based CSS triangles.

---

## Calendar — Web Kit (`Calendar / Day` COMPONENT_SET MCP `639:7052`; Month row container MCP **`639:6845`**)

| Property                 | Value                                                                                                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **container**            | `padding` `sizeXLarge`(20px), `minWidth` `componentSizes.calendarMinWidth`, `borderRadius` `roundedLarge`, fill `alias.backgroundPrimary` — **no outer stroke**                                                                                  |
| **month header** (`639:6845`) | One row **`flex` + `justify-between` + `items-center`**, **4** children: prev · month · year · next. **`pb` `sizeLarge`(16px)** — horizontal inset from container only. Web Kit **`Button`** Ghost · Small — do not override `data-refineui` |
| **prev/next**            | `Button` Ghost · Icon · Small, chevron `iconSizes.small`                                                                                                                                                                                    |
| **month·year**           | `Button` Ghost · Label · Small — label type per MCP export **`body3`** (14/20 Regular)                                                                                                                                                        |
| **weekday·date cells**   | `componentSizes.calendarDaySize`(32×32), `caption1`(MCP `Calendar / Day`), other-month `neutral400`; weekday label `py` `sizeXSmall`(6px)                                                                                                     |
| **Day interaction**      | `refineui.css` `[data-refineui="calendar-day"]` — unselected cell hover·pressed fill `neutral200`/`neutral300` (same as Ghost); `data-range-middle` same; **`data-selected` has no hover·pressed fill** (selection locked)                  |
| **month grid**           | Weekday row + week rows in one column with `gap` `sizeSmall`(8px) — enough air so range-middle rows don’t fuse; **no** horizontal gap (in-row range stays continuous)                                                                         |
| **selection**            | Single/endpoints `primaryBlack` + white text, range middle fill `neutral100`, endpoint wrappers match MCP with `roundedLarge` on one side only                                                                                             |

`packages/react` `Calendar` supports `single` / `range` modes; range UI follows the Figma grid rules above.

---

## JSON summary (implementation reference)

```json
{
  "button": {
    "node": "79:3304",
    "sizes": {
      "sm": {
        "minHeight": "componentSizes.buttonMinHeightSm",
        "padding": "sizeXXSmall sizeMedium",
        "borderRadius": "roundedSmall",
        "type": "body3"
      },
      "md": {
        "minHeight": "componentSizes.buttonMinHeightMd",
        "padding": "sizeXSmall sizeMedium",
        "borderRadius": "roundedMedium",
        "type": "body1"
      },
      "lg": {
        "minHeight": "componentSizes.buttonMinHeightLg",
        "padding": "sizeMedium sizeLarge",
        "borderRadius": "roundedLarge",
        "type": "subTitle1"
      }
    },
    "outline": { "border": "strokeWidthThin neutral300" },
    "shadow": "shadow2Light (refineui.css)"
  },
  "calendar": {
    "dayComponentSet": "639:7052",
    "monthHeaderContainer": "639:6845",
    "padding": "sizeXLarge",
    "minWidth": "componentSizes.calendarMinWidth",
    "dayCell": "componentSizes.calendarDaySize",
    "navButton": "Button ghost icon sm; do not override data-refineui (refineui.css ghost hover)",
    "monthHeader": "639:6845 — flex justify-between items-center 4× Button ghost sm; pb sizeLarge (container sizeXLarge supplies horizontal inset)",
    "weekRowGap": "sizeSmall",
    "weekdayPy": "sizeXSmall"
  },
  "input": {
    "node": "518:7373",
    "sizes": {
      "sm": {
        "minHeight": "componentSizes.controlHeightSm",
        "padding": "sizeXSmall sizeMedium",
        "borderRadius": "roundedLarge",
        "type": "body3"
      },
      "md": {
        "minHeight": "componentSizes.controlHeightMd",
        "padding": "sizeMedium sizeLarge",
        "borderRadius": "roundedXLarge",
        "type": "body2"
      },
      "lg": {
        "minHeight": "componentSizes.controlHeightLg",
        "padding": "sizeLarge sizeXLarge",
        "borderRadius": "roundedXXLarge",
        "type": "body1"
      }
    },
    "border": "strokeWidthThin neutral300",
    "error": "red500",
    "success": "green500",
    "defaultSize": "lg"
  },
  "select": {
    "note": "No standalone Web Kit COMPONENT_SET — same size as Input 518:7373",
    "sizes": "same as input"
  },
  "textarea": {
    "node": "529:5454",
    "minHeight": "componentSizes.controlTextareaMin",
    "padding": "sizeMedium sizeXSmall",
    "borderRadius": "roundedLarge",
    "type": "body2",
    "note": "Field padding differs from Input md (10px 16px) — per Web Kit Textarea instances"
  },
  "badge": {
    "padding": "2px 6px",
    "borderRadiusLabel": "6px roundedMedium",
    "borderRadiusNumber": "roundedCircle",
    "typography": "caption2"
  },
  "breadcrumb": {
    "node": "283:688",
    "gap": "sizeMedium",
    "padding": "sizeXSmall 0",
    "typography": "caption1",
    "linkColor": "foregroundTertiary",
    "currentColor": "foregroundPrimary",
    "linkRadius": "roundedSmall",
    "separator": "/"
  },
  "card": {
    "node": "394:865",
    "borderRadius": "roundedXXLarge (16px)",
    "elevated": { "shadow": "shadow4Light" },
    "outlined": { "border": "1px solid neutral300" },
    "header": "px sizeXLarge, py sizeLarge",
    "footer": "px sizeXLarge, py sizeMedium",
    "note": "Spec §7 JSON previously listed 8px radius + shadow8 — Web Kit file uses 16px radius + Shadow 4"
  },
  "checkbox": {
    "node": "327:2539",
    "box": "componentSizes.controlCheckbox",
    "gap": "sizeXSmall",
    "variant": { "default": "roundedSmall", "circular": "roundedCircle" },
    "checked": {
      "default": "primaryDarkGray",
      "hover": "neutralBlack",
      "pressed": "neutral600",
      "focusBorder": "strokeWidthThick neutral450"
    }
  },
  "chip": {
    "node": "574:6578",
    "figmaName": "Tag",
    "export": "Chip",
    "minHeight": {
      "sm": "chipMinHeightSm (20)",
      "md": "chipMinHeightMd (24)",
      "lg": "chipMinHeightLg (32)"
    },
    "paddingX": { "sm": "sizeXSmall", "md": "sizeXSmall", "lg": "sizeSmall" },
    "gap": "sizeXXSmall",
    "borderRadius": "roundedMedium",
    "defaultSize": "md",
    "size": {
      "sm": "labelSm + iconSizes.xxsmall",
      "md": "bodySm + iconSizes.xsmall",
      "lg": "bodyLg + iconSizes.small"
    },
    "variant": {
      "default": "neutralWhite + primaryBlack text",
      "outline": "strokeWidthThin neutral300 + primaryBlack text",
      "filled": "primaryBlack Selected + neutralWhite text"
    }
  },
  "dialog": {
    "node": "393:1181",
    "padding": "sizeXXLarge",
    "gap": "sizeLarge",
    "widthLg": "componentSizes.dialogMaxWidth",
    "widthSm": "componentSizes.dialogWidthSm",
    "title": "subTitle2",
    "shadow": "shadow8Light"
  },
  "drawer": {
    "node": "635:1756",
    "type": "Overlay (React)",
    "width": {
      "small": "componentSizes.drawerWidthSm",
      "medium": "componentSizes.drawerWidthMd",
      "large": "componentSizes.drawerWidthLg"
    },
    "shadow": "shadow16Light",
    "header": "pt/px sizeXXLarge, pb sizeMedium, title subTitle1, dismiss gap sizeXSmall",
    "body": "padding sizeXXLarge, body2"
  },
  "dropdown": {
    "node": "503:2985",
    "menuWidth": "componentSizes.dropdownMenuWidth",
    "menuPadding": "sizeXXSmall",
    "itemGap": "sizeMinimal",
    "shadow": "shadow2Light",
    "titleItem": "body2",
    "menuItem": "body4"
  },
  "menu": {
    "node": "633:4268",
    "panelWidth": "componentSizes.menuPanelWidth",
    "padding": "sizeXXSmall",
    "itemGap": "sizeMinimal",
    "border": "strokeWidthHairline alias.borderDefault",
    "panelBackground": "alias.backgroundSurface",
    "shadow": "shadow2Light",
    "itemPadding": "sizeXSmall",
    "itemRadius": "roundedLarge",
    "itemType": "body2 alias.foregroundPrimary",
    "itemDisabled": "alias.foregroundDisabled",
    "itemSlots": "startIcon(20), description(body4), shortcut(body4), endIcon(chevron)"
  },
  "pagination": {
    "pagination": "558:1989",
    "item": "570:2332",
    "rowGap": "sizeMedium",
    "itemMin": "componentSizes.paginationButtonMinWidth",
    "itemPadding": "sizeXSmall",
    "itemRadius": "roundedXLarge",
    "chevron": "iconSizes.medium",
    "label": "body1"
  },
  "progress": {
    "node": "452:3994",
    "name": "Progress bar",
    "size": { "sm": "progressTrackHeightSm", "lg": "progressTrackHeightLg" },
    "track": "alias.backgroundBrandSubtle",
    "fillDefault": "alias.backgroundBrand"
  },
  "radio": {
    "node": "397:1001",
    "radioInput": "COMPONENT_SET Radio / Input (16px circle; MCP states Default|Focused|Disabled × checked)",
    "control": "componentSizes.controlCheckboxRadio",
    "gap": "sizeMedium",
    "title": "caption1 alias.foregroundPrimary",
    "description": "caption3 alias.foregroundSecondary",
    "css": "refineui.css [data-refineui=radio]: alias borders, backgroundPrimary, brand dot, borderStrong focus-visible"
  },
  "skeleton": {
    "node": "570:6175",
    "maskNode": "570:6320",
    "fill": "alias.backgroundBrandSubtle",
    "shimmerHighlight": "alias.backgroundPrimary",
    "maskGradient": "90deg transparent 0%, backgroundPrimary 22.5%, backgroundPrimary 32.5%, transparent 50%",
    "rectangleRadius": "roundedLarge",
    "circleRadius": "roundedCircle",
    "defaultHeight": "componentSizes.skeletonDefaultHeight",
    "animation": "refineui-skeleton-shimmer (refineui.css), reduced-motion: static fill only"
  },
  "slider": {
    "node": "526:1556",
    "size": { "sm": "sliderTrackHeightSm", "md": "sliderTrackHeightMd" },
    "rail": "alias.backgroundBrandSubtle roundedXSmall",
    "fill": "alias.backgroundBrand",
    "fillDisabled": "alias.foregroundDisabled",
    "thumb": "Slider/Item COMPONENT_SET: default 526:1739, hover 526:1714, focus 526:1718, disabled 526:1840 — 16x16 roundedCircle + ring backgroundPrimary + state border (default borderDefault thin, hover borderStrong thick, focus borderDefault+backgroundBrandActive, disabled borderDisabled+backgroundBrandDisabled)",
    "interactionHeight": "componentSizes.sliderInteractionHeight",
    "fillVar": "--refineui-slider-fill (WebKit); --refineui-slider-rail / --refineui-slider-fill-color (alias)"
  },
  "spinButton": {
    "node": "561:2067",
    "name": "Spin Button",
    "size": {
      "sm": {
        "height": "controlHeightSm",
        "radius": "roundedMedium",
        "type": "caption1",
        "stepHalf": "spinStepperStepHeightSm"
      },
      "md": {
        "height": "controlHeightMd",
        "radius": "roundedLarge",
        "type": "body2",
        "stepHalf": "spinStepperStepHeightMd"
      },
      "lg": {
        "height": "controlHeightLg",
        "radius": "roundedXLarge",
        "type": "body1",
        "stepHalf": "spinStepperStepHeightLg"
      }
    },
    "fieldPaddingStart": "componentSizes.spinFieldPaddingInlineStart",
    "stepperWidth": "componentSizes.spinStepperWidth",
    "chevron": "iconSizes.sm",
    "focusBorder": "alias.borderFocus",
    "disabled": "alias.backgroundSurfaceDisabled alias.borderDisabled alias.foregroundDisabled"
  },
  "spinner": {
    "node": "550:3669",
    "sizes": [
      "spinnerSizeXSmall",
      "spinnerSizeSmall",
      "spinnerSizeMedium",
      "spinnerSizeLarge",
      "spinnerSizeXLarge",
      "spinnerSizeXXLarge"
    ],
    "rings": [
      "spinnerRingWidthXSmall",
      "spinnerRingWidthSmall",
      "spinnerRingWidthMedium",
      "spinnerRingWidthLarge",
      "spinnerRingWidthXLarge",
      "spinnerRingWidthXXLarge"
    ],
    "track": "alias.backgroundBrandSubtle",
    "accent": "alias.backgroundBrand",
    "labelGap": "sizeXSmall",
    "labelPosition": ["left", "right", "top", "bottom"],
    "animation": "refineui-spin (refineui.css)"
  },
  "popover": {
    "node": "553:5669",
    "minWidth": "componentSizes.popoverPanelWidth",
    "padding": "sizeLarge",
    "radius": "roundedLarge",
    "default": { "bg": "neutralWhite", "border": "neutral300", "shadow": "shadow8Light" },
    "inverted": {
      "bg": "primaryBlack",
      "text": "neutralWhite",
      "border": "neutral800",
      "shadow": "shadow8Dark"
    }
  },
  "field": {
    "node": "525:1074",
    label: { "sm": "caption1", "md": "body2", "lg": "body1", "default": "lg" },
    "error": "caption3 red700",
    "hint": "caption3 neutral500"
  },
  "label": {
    "node": "216:1681",
    "sizes": { "sm": "caption1", "md": "body2", "lg": "body1" },
    "disabledColor": "neutral400",
    "required": "red700"
  },
  "link": {
    "node": "226:158",
    "typography": "body1",
    "default": "blue700",
    "hover": "blue800",
    "focus": "blue900",
    "pressed": "blue500",
    "disabled": "neutral400",
    "externalIcon": "iconSizes.lg",
    "gapIcon": "sizeXXSmall",
    "subtle": "neutral600 (extension beyond Web Kit)"
  },
  "divider": {
    "node": "346:722",
    "default": { "line": "1px neutral300", "margin": "none (consumer spacing)" },
    "contentIcon": {
      "gap": "sizeMedium",
      "shortEnd": "componentSizes.dividerShortEnd",
      "longFlex": "1 0 0",
      "row": "justify-center, overflow hidden",
      "labelColor": "neutralBlack",
      "caption": "caption2",
      "iconSlot": "componentSizes.dividerIconSlot",
      "circle": "SVG r=13.33/2, stroke neutralBlack, strokeWidth 1"
    },
    "vertical": { "when": "layout default only", "minHeight": "sizeXXLarge" }
  },
  "switch": {
    "node": "270:3057",
    "name": "Switch",
    "sizes": {
      "width": "componentSizes.switchWidth",
      "height": "componentSizes.switchHeight",
      "padding": "componentSizes.switchPadding",
      "thumb": "componentSizes.switchThumb"
    },
    "track": {
      "on": "alias.backgroundBrand",
      "off": "alias.backgroundPrimaryActive",
      "hoverOff": "alias.backgroundSurfaceSelected",
      "activeOff": "alias.backgroundBrandSubtle",
      "hoverOn": "alias.backgroundBrandHover",
      "activeOn": "alias.backgroundBrandActive",
      "disabledOff": "alias.backgroundSurfaceDisabled",
      "disabledOn": "alias.backgroundBrandSubtle"
    },
    "thumb": {
      "default": "alias.backgroundPrimary + shadow2",
      "disabledOff": "alias.backgroundBrandSubtle",
      "disabledOn": "alias.backgroundPrimary"
    },
    "focus": "outline 2px alias.borderFocus",
    "interaction": "refineui.css [data-refineui=switch] hover/active/focus"
  },
  "toggle": {
    "node": "270:3057",
    "figmaName": "Switch",
    "note": "packages/react Toggle — same implementation as Switch, same data-refineui=switch"
  },
  "tabs": {
    "container": "636:5371",
    "item": "636:5372",
    "codeName": "SegmentedControl (pill). packages/react Tabs is underline + tabpanel composition.",
    "pill": {
      "bar": "alias.backgroundPrimaryActive strokeWidthThin alias.borderDefault padding sizeXSmall gap sizeMedium roundedLarge",
      "selected": "alias.backgroundPrimary shadow2Light roundedLarge body1 (dark contrast)",
      "disabled": "alias.foregroundDisabled; selected+disabled alias.backgroundSurfaceDisabled"
    }
  },
  "toast": {
    "node": "548:655",
    "width": "componentSizes.toastMinWidth (325px)",
    "padding": "sizeLarge",
    "gap": "sizeMedium",
    "borderRadius": "roundedXLarge",
    "border": "strokeWidthThin neutral300",
    "focus": "strokeWidthThick neutral450 (552:2029)",
    "shadow": "shadow4Light",
    "iconSlot": "data-refineui toast-icon; sizeXXLarge (24px); iconSizes.md; items-center row; data-variant Type",
    "title": "body2",
    "message": "body4 neutral500",
    "variantNote": "React only — accent icons; Figma State Default|Focus only"
  },
  "tooltip": {
    "node": "90:1686",
    "padding": "sizeXSmall sizeMedium",
    "borderRadius": "roundedMedium",
    "type": "body4",
    "shadow": "shadow8Light",
    "maxWidth": "componentSizes.tooltipMaxWidth",
    "arrow": "half sizeXSmall (6px), CSS triangle",
    "position": "Top | Bottom | Left | Right",
    "align": "Start | Center | End",
    "defaults": "position Bottom, align Start — same as MCP"
  }
}
```
