# Pelagornis RefineUI Web Kit — Design Specs (구현 기준)

**Figma Web Kit:** https://www.figma.com/design/CxoaTfftpyh8ETDBamkkEK/Pelagornis-RefineUI-Web-Kit?node-id=7-6  
**Foundation:** https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650

> ⚠️ Figma MCP 인증이 필요한 경우, `get_design_context` / `get_variable_defs`로 Figma에서 직접 스펙을 가져올 수 있습니다.  
> 아래 스펙은 `packages/react` 구현과 `packages/tokens`를 기반으로 Figma Web Kit에 맞춰 정합된 값입니다.

**컴포넌트 전체 재검토 진행표:** [web-kit-component-audit.md](web-kit-component-audit.md) (Foundation → Web Kit 규칙, 알파벳 순 체크리스트)

---

## 1. Button — Web Kit `79:3304` (COMPONENT_SET)

| 속성 | sm | md | lg |
|------|----|----|-----|
| **minHeight** | `componentSizes.buttonMinHeightSm` (28px) | `buttonMinHeightMd` (36px) | `buttonMinHeightLg` (48px) |
| **padding (Label)** | `sizeXSmall` `sizeMedium` (4px 10px) | `sizeSmall` `sizeMedium` (6px 10px) | `sizeMedium` `sizeLarge` (10px 16px) |
| **gap** (라벨·아이콘 간) | `sizeXSmall` (4px) | 동일 | 동일 |
| **borderRadius** | `roundedSmall` (4px) | `roundedMedium` (6px) | `roundedLarge` (8px) |
| **typography** | body3 (14/20) | body1 (16/24) | subTitle1 (20/28 Semi Bold) |

### Variants (기본 상태, Figma `style` 이름)

| `variant` | Figma | 배경 / 테두리 |
|-----------|-------|----------------|
| `primary` | Primary | `primaryBlack` 배경, 흰 글자 |
| `secondary` | Secondary | 흰 배경 + `strokeWidthThin` `neutral300` (Secondary는 hover 시 `neutral200` 등 — `refineui.css`) |
| `outline` | Outline | 투명 + `strokeWidthThin` `neutral300` (Figma Default 테두리) |
| `ghost` | Ghost | 투명, 테두리 없음 |

**Disabled:** Primary·Secondary는 배경 `neutral150`, 글자 `neutral500`; Secondary·Outline 테두리 `neutral250` (`refineui.css`). Ghost는 배경 없음·글자만 `neutral500`.

인터랙션 hover·pressed·disabled 등은 **`refineui.css`** `[data-refineui="button"]`로 맞춤.

---

## 2. Input — Web Kit `518:7373` (COMPONENT_SET)

| 속성 | sm | md | lg |
|------|----|----|-----|
| **minHeight** | `componentSizes.controlHeightSm` (32px) | `componentSizes.controlHeightMd` (40px) | `componentSizes.controlHeightLg` (48px) |
| **padding** | `sizeSmall` `sizeMedium` (6px 10px) | `sizeMedium` `sizeLarge` (10px 16px) | `sizeLarge` (16px 전면) |
| **borderRadius** | `roundedMedium` (6px) | `roundedLarge` (8px) | `roundedXLarge` (12px) |
| **typography** | `caption1` | `body2` | `body1` |

기본 테두리 `strokeWidthThin` `neutral300`, 에러 `red500`, 성공 `green500`, disabled 배경 `neutral150` — `packages/react` `Input`·`refineui.css` `[data-refineui="input"]`.

### Select / Textarea

| 속성 | Select | Textarea |
|------|--------|----------|
| **현재 구현** | **Input** `518:7373`과 동일 `size` `sm` / `md` / `lg` (기본 `md`) — 위 Input 표와 동일 토큰 | Web Kit **Textarea** `529:5454` (COMPONENT_SET): `minHeight` `componentSizes.controlTextareaMin` (80px), **`roundedLarge`**, **`body2`**, **필드 패딩** `sizeMedium` `sizeSmall` (10px 6px) — Input **md** 행의 좌우 패딩(`sizeLarge` 16px)과 **다름** |

Web Kit에 **단독 Select COMPONENT_SET** 이름이 없으면, 네이티브 `<select>` 필드는 **Input** 필드 규칙을 따른다.

---

## 3. Badge — Web Kit `Badge` `270:3353` · `Badge Number` `276:515`

| 속성 | `layout="label"` (기본) | `layout="number"` |
|------|-------------------------|-------------------|
| **padding** | `sizeXXSmall` `sizeSmall` (2px 6px) | 동일 |
| **borderRadius** | `roundedMedium` (6px) | `roundedCircle` |
| **typography** | `caption2` (12/16 Regular) | 동일 |

### Variants (기본 상태 = Figma `state=Default` 토큰 매핑)

| `variant` | 배경 | 글자색 | 비고 |
|-----------|------|--------|------|
| `default` | `primaryBlack` | `neutralWhite` | Hover/Pressed는 `refineui.css` `[data-refineui="badge"]` |
| `neutral` (`Secondary`) | `primaryLightGray` | `neutralBlack` | |
| `outline` | 투명 + `strokeWidthThin` `neutral300` | `neutralBlack` | |
| `success` | `green500` | `neutralWhite` | |
| `warning` | `orange500` | `neutralWhite` | 노랑 `yellow*` 아님 |
| `danger` | `red500` | `neutralWhite` | |

---

## 4. Breadcrumb — Web Kit `283:688` (COMPONENT_SET)

| 속성 | 값 |
|------|-----|
| **gap** | `sizeMedium` (10px) |
| **padding** | `sizeSmall` 상·하 (6px) |
| **타이포** | `caption1` — 비현재·구분자 `neutral500`, 현재 `primaryBlack` |
| **ellipsis** | `sizeXLarge`(20×20) 영역 + `more-horizontal` (`iconSizes.sm`) |

**구분자** 기본 `/` (Caption1 · tertiary, `neutral500`).

---

## 5. Alert — Web Kit COMPONENT_SET `Alert` `384:885`

| 속성 | 값 |
|------|-----|
| **배경** | neutralWhite |
| **border** | 1px solid neutral300 |
| **borderRadius** | 6px (roundedMedium) |
| **padding** | 10px (sizeMedium) |
| **레이아웃** | flex, 아이콘(왼쪽) + 텍스트(중앙) + 액션(오른쪽) |

### 아이콘
- 원형 아웃라인 (border 2px, accent 색상)
- 크기: 24×24px

### 텍스트
- **title**: subTitle2 (16px/24px Semi Bold), primaryBlack
- **description**: body4 (12px/16px), accent 색상

### Variants (accent 색상)
| Variant | accent |
|---------|--------|
| default | primaryBlack |
| info | blue600 |
| success | green600 |
| warning | yellow600 |
| danger | red600 |
| custom | purple600 |

### 액션
- 닫기 버튼 (×): 우측 상단
- 액션 버튼: 최대 2개, primary sm

---

## 6. Avatar — Web Kit `Avater` (COMPONENT_SET; Figma 철자 원문)

**단일 아바타**는 `packages/react` `Avatar`로, 크기는 `componentSizes.avatarSm` / `avatarMd` / `avatarLg`와 Web Kit `Avater`의 **Small / Medium / XLarge** 지름이 같다 (32 / 36 / 56px). 그룹 겹침은 `Avater Stack` 노드 `69:3008` 참고.

| `size` | 지름 | Web Kit `Size` | 이니셜 타이포 | 이니셜 글자 수 | 빈 슬롯 `person` 아이콘 (`iconSizes`) |
|--------|------|----------------|---------------|----------------|----------------------------------------|
| `sm` | 32px | Small | caption1 | 1 | md |
| `md` | 36px | Medium | body2 | 2 | lg |
| `lg` | 56px | XLarge | subTitle1 | 2 | xl |

- **Orange `layout=Initials` (MCP `76:1451`)**: 56px 티어 이니셜 타이포는 **`typographys.title3`**(Web/Title/Title 3 — 24px semibold); 32·36px 티어는 **Body 1**(16px medium) 유지.
- **배경(이니셜·아이콘)**: `neutral300` (Neutral 톤)
- **이미지**: `object-fit: cover`, 원형 마스크 `roundedCircle`

### Avatars (`Avater Stack` / `Avater Spread`)

`packages/react` `Avatars` — `layout="stack"`(기본)은 **Avater Stack** `69:3008`, `layout="spread"`는 **Avater Spread** `69:3007`.

| 항목 | `stack` | `spread` |
|------|---------|----------|
| **간격** | 인접 타일 **겹침** — `componentSizes.avatarStackOverlapSm` / `Md` / `Lg`(6 / 8 / 10px). 컨테이너 `paddingRight`에 동일 값 | `gap`: `sm` → `spacings.sizeMedium`(10px), `md` → `spacings.sizeLarge`(16px), `lg` → `spacings.sizeXLarge`(20px) — MCP Avater Spread `69:3007` |
| **타일 테두리** | Figma `Avater` 벡터(Subtract 등)에 포함된 분리감 — MCP `get_design_context` 스택 행에는 **래퍼 `border` 없음** | 테두리 없음(나란히 간격만) |
| **+N 오버플로** | 흰 배경, `strokeWidthThin` + `neutral300`, 타이포 `sm`→caption2 / `md`→caption1 / `lg`→body2, `neutral600` | 동일 |

---

## 7. Card — Web Kit COMPONENT_SET `Card` (node-id는 파일 내에서 MCP `search_design_system` "Card" + `get_design_context`로 확인)

| 속성 | elevated | outlined |
|------|----------|----------|
| **배경** | `neutralWhite` | `neutralWhite` |
| **padding** | `sizeLarge` (16px) | 동일 |
| **borderRadius** | `roundedLarge` (8px) | 동일 |
| **shadow** | `shadows.shadow8Light` (`toBoxShadow`) | 없음 |
| **border** | 없음 | `strokeWidthThin` `neutral300` |

---

## Checkbox — Web Kit `327:2539` (COMPONENT_SET)

| 속성 | 값 |
|------|-----|
| **박스** | `componentSizes.controlCheckbox` (16×16), 라벨과 `gap` `sizeSmall` (6px) |
| **variant** | `default` — `roundedSmall` (4px); `circular` — `roundedCircle` |
| **Unchecked** | 배경 `neutralWhite`, 테두리 `strokeWidthThin` `neutral300` |
| **Checked** | 기본 `primaryDarkGray`, hover `neutralBlack`, pressed `neutral600`, focus `primaryBlack` + `strokeWidthThick` `neutral450` 테두리 |
| **Disabled** | 미선택: 배경 `neutral100`, 테두리 `neutral250`; 선택: 배경 `neutral200`, 체크 `neutral600` |
| **라벨** | `body2`; `description` 있으면 `caption2`, 보조색 `neutral600` |

인터랙션(hover·active·focus-visible)은 **`refineui.css`** `[data-refineui="checkbox"]` (Foundation 팔레트와 동일 hex).

---

## Chip / Tag — Web Kit COMPONENT_SET `Tag` `574:6578` (`packages/react`는 **`Chip`** export · **`Tag`** 동일 컴포넌트)

| 속성 | 값 |
|------|-----|
| **패딩** | `sizeSmall` (6px) |
| **gap** | `sizeXSmall` (4px) — 텍스트·dismiss·`avatar` 사이 |
| **borderRadius** | `roundedMedium` (6px) |
| **size** | `lg` → `body1` + dismiss `iconSizes.lg`; `md` → `body3` + `iconSizes.md`; `sm` → `caption1` + `iconSizes.xs` |
| **variant** | `default` — 배경 `neutralWhite`, 글자 `primaryBlack`(Figma `foregroundbrand` #212121); `outline` — `strokeWidthThin` `neutral300`; `filled` — Figma `Selected`, `primaryBlack` + `neutralWhite` |
| **disabled** | `default`/`outline`: 배경 `neutral150`, 글자 `neutral400`; `outline` 테두리 `neutral250`; `filled`: 배경 `neutral200` |
| **avatar** | 선택 슬롯 (Figma `showAvater`); 크기는 소비자가 `Avatar` 등으로 맞춤 |

인터랙션은 **`refineui.css`** `[data-refineui="chip"]` (Default hover·pressed는 neutral100·neutral150; Outline은 테두리 neutral500·`#333`; Filled는 Badge primary 톤).

---

## Dialog — Web Kit COMPONENT_SET `Dialog` `393:1181`

| 속성 | 값 |
|------|-----|
| **패널 패딩** | `sizeXXLarge` (24px) |
| **헤더·본문 사이** | `sizeLarge` (16px) — 헤더 하단 보더 없음(Figma auto-layout `gap`) |
| **폭** | Large → `componentSizes.dialogMaxWidth` (600px); Small → `componentSizes.dialogWidthSm` (300px) — `Dialog` `size` `lg` / `sm` |
| **borderRadius** | `roundedLarge` (8px) |
| **shadow** | `shadows.shadow8Light` (`toBoxShadow`) |
| **제목** | `subTitle2` (16/24 Semi Bold), `primaryBlack` |
| **닫기** | dismiss `iconSizes.xl` (24px 영역) |
| **본문** | 기본 `body2` |

스크rim은 `overlays.backdrop`; 오버레이·ESC·포털은 `packages/react` `Dialog` 구현.

---

## Drawer — Web Kit COMPONENT_SET `Drawer` `635:1756`

| 속성 | 값 |
|------|-----|
| **type** | Figma `Overlay` · `Inline` — React `Drawer`는 **Overlay(포털·스크림)** 만 |
| **폭** | Large → `componentSizes.drawerWidthLg` (850px); Medium → `componentSizes.drawerWidthMd` (575px); Small → `componentSizes.drawerWidthSm` (320px) — `size` `large` \| `medium` \| `small` |
| **패널 그림자** | `shadows.shadow16Light` (`toBoxShadow`) |
| **헤더** | `paddingTop`/`paddingLeft`/`paddingRight` `sizeXXLarge` (24px), `paddingBottom` `sizeMedium` (10px); 닫기·제목 행 `gap` `sizeSmall` (6px); 제목 `subTitle1` (20/28 Semi Bold) |
| **Divider** | `strokeWidthThin` `neutral300` (헤더·본문 사이) |
| **본문** | `padding` `sizeXXLarge`; 기본 `body2` |

Figma에는 헤더에 **Cancel/Ok** 등 **Button Container**, 하단 **Drawer / Footer** 변형이 있으나, `packages/react` `Drawer`는 **닫기 + 제목 + Divider + `children`** 만 제공합니다. 액션·푸터는 `children` 또는 상위 레이아웃에서 구성합니다.

---

## Dropdown — Web Kit COMPONENT_SET `Dropdown` `503:2985`

| 속성 | 값 |
|------|-----|
| **메뉴 폭** | `componentSizes.dropdownMenuWidth` (180px) |
| **메뉴** | `padding` `sizeXSmall` (4px); 항목 간 `gap` `sizeMinimal` (1px); `borderRadius` `roundedLarge`; `strokeWidthHairline` `neutral300`; `shadows.shadow2Light` |
| **Title Item** | `padding` `sizeSmall` `sizeMedium` (6px 10px); `body2` |
| **Menu / Item** | 동일 패딩; `body4`; `neutral850` |
| **트리거(Default)** | `roundedSmall`, `strokeWidthThin` `neutral300`; chevron 분리 시 세로선 `strokeWidthHairline` |

React 구현은 **Default** 트리거·메뉴 중심이며, Figma의 Checkbox/Radio/Avatar 등 옵션 변형 전체는 포함하지 않습니다.

---

## Menu — Web Kit COMPONENT_SET `Menu` `633:4268`

| 속성 | 값 |
|------|-----|
| **패널 폭** | `componentSizes.menuPanelWidth` (244px) |
| **패널** | `padding` `sizeXSmall`; `gap` `sizeMinimal` (항목 간); `borderRadius` `roundedLarge`; `strokeWidthHairline` `neutral300`; `shadows.shadow2Light` |
| **항목** | `padding` `sizeSmall` (6px); `borderRadius` `roundedLarge`; `body2`; 기본 `primaryBlack` |

Figma에는 **Section Header**, **Divider**, **아이콘·단축키** 열이 있으나, `packages/react` `Menu`는 **`items` 텍스트 행**만 제공합니다. **Dropdown**의 좁은 메뉴(180px, `body4`/`neutral850` 행)와는 별도 컴포넌트입니다.

---

## Pagination — Web Kit `Pagination` `558:1989` · COMPONENT_SET `Pagination / Item` `570:2332`

| 속성 | 값 |
|------|-----|
| **행 간격** | `sizeMedium` (10px) |
| **항목** | `padding` `sizeSmall`; 최소 `componentSizes.paginationButtonMinWidth` (36×36); `borderRadius` `roundedLarge`; `strokeWidthThin` `neutral300` |
| **아이콘** | chevron `iconSizes.xl` (24px 슬롯) |
| **페이지 표시** | `body1` |

호버·비활성 배경/테두리는 **`refineui.css`** `[data-refineui="pagination"]`. Figma의 **번호 그리드·생략(…)·현재 페이지 강조** 전체는 포함하지 않고, **이전 / `page / totalPages` / 다음** 만 제공합니다.

---

## Progress bar — Web Kit COMPONENT_SET `Progress bar` `452:3994`

| 속성 | 값 |
|------|-----|
| **size** | `sm` — 트랙 높이 `componentSizes.progressTrackHeightSm` (2px); `lg` — `componentSizes.progressTrackHeightLg` (4px) |
| **트랙 배경** | `neutral400` (Figma `foregrounddisabled` / 비진행) |
| **채움(기본)** | `primaryBlack` |

`variant` `success` / `warning` / `danger` 는 Web Kit **Progress bar** 그리드에 없으면 프로덕트 확장으로 둔다.

---

## Radio — Web Kit COMPONENT_SET `Radio` `397:1001` · `Radio / Input`

| 속성 | 값 |
|------|-----|
| **`Radio / Input`** | 16×16 원 — 미선택: `strokeWidthThin` `alias.borderDefault`, `alias.backgroundPrimary`; 포커스(미선택/선택): `strokeWidthThick` 외곽 `alias.borderStrong` (MCP `397:1147` 등) |
| **컨트롤** | `componentSizes.controlCheckboxRadio` (16×16), `roundedCircle` — **`refineui.css`** `[data-refineui="radio"]` (별칭 색·`label:hover` / `label:focus-within`) |
| **선택 시** | 링 `alias.backgroundBrand`, 내부 점 동일; 호버 링·점 `alias.backgroundBrandActive`; 포커스 링 `alias.borderStrong` + 점 `alias.backgroundBrand` |
| **disabled** | 배경 `alias.backgroundPrimary`, 테두리 `alias.borderDisabled`; 선택 시 점 `alias.foregroundDisabled` |
| **행** | 컨트롤·텍스트 `gap` `sizeMedium` (10px); 라벨 래퍼 `padding` `sizeXXSmall` |
| **라벨** | `caption1`, `alias.foregroundPrimary` — disabled 시 `alias.foregroundDisabled` |
| **설명** | `caption3`, `alias.foregroundSecondary` — disabled 시 `alias.foregroundDisabled` |

---

## Skeleton — Web Kit COMPONENT_SET `Skeleton` `570:6175`

| 속성 | 값 |
|------|-----|
| **배경** | `alias.backgroundBrandSubtle` (Shimmer Color) |
| **모양** | `shape` `rectangle` → `roundedLarge`; `circle` → `roundedCircle` |
| **기본 높이** | `componentSizes.skeletonDefaultHeight` (20px) — 사각은 너비 기본 `100%`, 원은 한 변만 주면 정사각 |
| **쉬머** | MCP Mask(`570:6320`): `90deg` — `transparent 0%` → `alias.backgroundPrimary` `22.5%`–`32.5%` → `transparent 50%` — **`refineui.css`** `refineui-skeleton-shimmer`; `prefers-reduced-motion` 시 정지 |

---

## Slider — Web Kit COMPONENT_SET `Slider` `526:1556`

| 속성 | 값 |
|------|-----|
| **size** | `sm` — 레일 높이 `componentSizes.sliderTrackHeightSm` (2px); `md`(기본) — `componentSizes.sliderTrackHeightMd` (4px) |
| **레일(비채움)** | `alias.backgroundBrandSubtle` — `borderRadii.roundedXSmall` (2px) |
| **채움** | `alias.backgroundBrand` — **disabled** 시 `alias.foregroundDisabled` (Track-fill) |
| **썸 (Slider / Item)** | COMPONENT_SET 노드별 MCP 변수 — 16×16 `roundedCircle` (**`refineui.css`**): 공통 흰 링 `alias.backgroundPrimary` + 바깥 링 — **Default** `526:1739` 중심 `alias.backgroundBrand`, 링 `alias.borderDefault`(얇음); **Hover** `526:1714` 중심 `alias.backgroundBrandHover`, 링 `alias.borderStrong`; **Focus** `526:1718` 중심 `alias.backgroundBrandActive`, 링 `alias.borderDefault`; **Disabled** `526:1840` 중심 `alias.backgroundBrandDisabled`, 링 `alias.borderDisabled` |
| **터치 영역** | 입력 높이 `componentSizes.sliderInteractionHeight` (24px) |

WebKit 계열은 `--refineui-slider-fill`(0–100%)로 레일 그라데이션을 맞추고, Firefox는 `::-moz-range-progress`로 채움을 처리한다.

---

## Spin Button — Web Kit COMPONENT_SET `Spin Button` `561:2067`

| 속성 | `sm` | `md`(기본) | `lg` |
|------|------|------------|------|
| **높이** | `componentSizes.controlHeightSm` (32px) | `componentSizes.controlHeightMd` (40px) | `componentSizes.controlHeightLg` (48px) |
| **모서리** | `roundedMedium` (6px) | `roundedLarge` (8px) | `roundedXLarge` (12px) |
| **값 영역 타이포** | `caption1` | `body2` | `body1` |
| **값 영역 좌측 패딩** | `componentSizes.spinFieldPaddingInlineStart` (12px) | 동일 | 동일 |
| **Stepper 열** | `componentSizes.spinStepperWidth` (32px); 반칸 높이 `spinStepperStepHeightSm` / `Md` / `Lg` | | |
| **아이콘** | chevron `iconSizes.sm` (12px) | 동일 | 동일 |

| 상태 | 스타일 |
|------|--------|
| **기본** | 배경 `alias.backgroundPrimary`, 테두리 `strokeWidthThin` `alias.borderDefault`, 글자 `alias.foregroundPrimary` |
| **포커스(포함 영역)** | 테두리 `alias.borderFocus` — **`refineui.css`** `[data-refineui="spinbutton"]:focus-within` |
| **disabled** | 배경 `alias.backgroundSurfaceDisabled`, 테두리 `alias.borderDisabled`, 글자 `alias.foregroundDisabled`; Stepper는 `opacity` 0.5 |

---

## Spinner — Web Kit COMPONENT_SET `Spinner` `550:3669`

| `size` | 지름 | 링 두께 | 라벨 타이포(Figma `showLabel`) |
|--------|------|---------|--------------------------------|
| `xSmall` | `componentSizes.spinnerSizeXSmall` (16px) | `spinnerRingWidthXSmall` | `caption1` |
| `small` | `spinnerSizeSmall` (20px) | `spinnerRingWidthSmall` | `body2` |
| `medium`(기본) | `spinnerSizeMedium` (24px) | `spinnerRingWidthMedium` | `body1` |
| `large` | `spinnerSizeLarge` (28px) | `spinnerRingWidthLarge` | `subTitle2` |
| `xLarge` | `spinnerSizeXLarge` (32px) | `spinnerRingWidthXLarge` | `subTitle1` |
| `xxLarge` | `spinnerSizeXXLarge` (48px) | `spinnerRingWidthXXLarge` | `title3` |

| 속성 | 값 |
|------|-----|
| **트랙** | `alias.backgroundBrandSubtle` (`#e6e6e6`) |
| **강조(회전 구간)** | `alias.backgroundBrand` (`#212121`) — CSS `border-top-color` + 회전 |
| **라벨·아이콘 간격** | `sizeSmall` (6px) |
| **`labelPosition`** | `left` \| `right`(Figma 기본) \| `top` \| `bottom` |
| **애니메이션** | **`refineui.css`** `[data-refineui="spinner"]` `refineui-spin` 0.8s linear infinite |

Figma 기본 `size`는 `XSmall`이나, 앱에서 가독성을 위해 React 기본값은 `medium`으로 둔다.

---

## PopOver — Web Kit COMPONENT_SET `PopOver` `553:5669`

| 속성 | `variant="default"` | `variant="inverted"` |
|------|---------------------|----------------------|
| **패널** | `minWidth` `componentSizes.popoverPanelWidth` (325px); `padding` `sizeLarge` (16px); `roundedLarge`; `strokeWidthThin` `neutral300`; `shadows.shadow8Light` | 배경 `primaryBlack`, 글자 `neutralWhite`, 테두리 `neutral800`, `shadows.shadow8Dark` |

Figma에는 **position**·**align**·**beak(화살표)** 조합이 있으나, `packages/react` `PopOver`는 `placement`(top/bottom/left/right)만 지원하고 **화살표·서브 정렬은 미구현**입니다.

---

## Field — Web Kit COMPONENT_SET `Field` `525:1074`

| 속성 | 값 |
|------|-----|
| **size** (`Field`) | `sm` — 라벨 `caption1`; `md`(기본) — `body2`; `lg` — `body1` (Figma Label Small / Medium / Large) |
| **라벨·컨트롤** | 라벨 하단 `margin` `sizeXSmall` (4px) |
| **검증(error)** | `caption3`, `red700` |
| **헬퍼(hint)** | `caption3`, `neutral500`(Figma foreground tertiary) |
| **필수** | `*` `red700` |

Figma에는 라벨 옆 **Info** 아이콘·슬롯별 검증 아이콘이 있으나, React `Field`는 **텍스트 라벨 + 자식 컨트롤 + error/hint** 만 제공합니다.

---

## Label — Web Kit COMPONENT_SET `Label` `216:1681`

| 속성 | sm | md | lg |
|------|----|----|-----|
| **typography** | `caption1` | `body2` | `body1` |

| 속성 | 값 |
|------|-----|
| **disabled** | `true`일 때 글자색 `neutral400` (Figma `foregrounddisabled`) |
| **블록 간격** | `marginBottom` `sizeXSmall` — `Field` 라벨과 동일 |
| **필수 `*`** | `red700` — `Field`와 동일 |

`packages/react` `Label` 기본 `size`는 **`md`** (`Field`/`Input`과 맞춤). Figma COMPONENT_SET의 기본 변형은 **Large** (`lg`).

---

## Link — Web Kit COMPONENT_SET `Link` `226:158`

| 상태 | `variant="default"` (토큰) |
|------|---------------------------|
| **Default** | `body1`, `blue700`, 밑줄 없음 |
| **Hover** | `blue800`, 밑줄 (`refineui.css`) |
| **Focus** | `blue900`, 밑줄 + 포커스 링 |
| **Pressed** | `blue500` (Figma Pressed / `foregroundlinkvisited`) |
| **Disabled** | `neutral400`, 밑줄 없음 |

**외부 링크 아이콘** — `open` `iconSizes.lg` (20px), 텍스트와 `gap` `sizeXSmall` (4px).

**`variant="subtle"`** — Web Kit 그리드에 없음. `neutral600` 기준, 상호작용 색은 `refineui.css` (`neutral700` / `neutral800`).

---

## 8. Divider — Web Kit COMPONENT_SET `Divider` `346:722`

| layout | 설명 |
|--------|------|
| **default** | 전폭 1px (`strokeWidthThin`), `neutral300` |
| **content** | Caption 2(12/16 Regular), **글자색 `neutralBlack`** (Figma `global/colors/neutral/black`), 분할 선 + 텍스트, `gap` sizeMedium(10px), `overflow` clip, 행 `justify-center`, 짧은 쪽 선 **`componentSizes.dividerShortEnd`(8px)**, 긴 쪽 **`flex: 1 0 0`** |
| **icon** | **`componentSizes.dividerIconSlot`(20×20)** 프레임, Shape **`componentSizes.dividerIconCircleDiameter`** + **`componentSizes.dividerIconCircleInset`**(3px) 오프셋(Figma `346:722`), 동일 gap·선·flex 규칙 |

| align | (content / icon) |
|-------|------------------|
| **center** | 양쪽 선 `flex: 1 0 0` |
| **left** | 왼쪽 `dividerShortEnd` + 오른쪽 늘어남 |
| **right** | 왼쪽 늘어남 + 오른쪽 `dividerShortEnd` |

(Web Kit `346:722`에는 **세로 Divider** 변형이 없습니다. 구현도 **수평**만 지원합니다.)

---

## 9. Accordion — Web Kit `COMPONENT_SET` node-id `54:146` (페이지 루트 링크는 `7-6`)

(Figma MCP 심볼: `Size=Small` → Caption1, `Medium` → Body1, `Larger` → SubTitle1 20/28 Semi Bold.)

| 속성 | 값 |
|------|-----|
| **trigger minHeight** | 44px |
| **trigger padding** | 6px 10px (sizeSmall sizeMedium) |
| **trigger gap** | 10px (sizeMedium) |
| **trigger typography** | `size` prop: small → caption1, medium → body1, large → subTitle1 |
| **icon size** | 20px (@refineui/web-icons) |
| **icon container** | 20×20px |
| **content padding** | 10px (sizeMedium) |
| **content bg** | primaryLightGray |
| **content typography** | body4 (12px/16px) |
| **content borderRadius** | 4px (roundedSmall) |
| **border** | strokeWidthThin solid neutral300 |

---

## 10. Switch / Toggle — Web Kit COMPONENT_SET `Switch` `270:3057`

| 속성 | 값 |
|------|-----|
| **트랙(전체)** | `componentSizes.switchWidth` (44px) × `componentSizes.switchHeight` (24px); 내부 트랙 영역 40×20 |
| **패딩** | `componentSizes.switchPadding` (2px) |
| **모서리** | `roundedXLarge` (12px) |
| **썸** | `componentSizes.switchThumb` (20×20), `roundedXLarge` (12px), 기본 `alias.backgroundPrimary` (`#ffffff`) |
| **트랙 배경(켜짐)** | `alias.backgroundBrand` (`#212121`) |
| **트랙 배경(꺼짐)** | `alias.backgroundPrimaryActive` (`#f0f0f0`) |
| **disabled 트랙** | `alias.backgroundBrandDisabled` (`#f0f0f0`) |
| **disabled 썸** | `alias.backgroundBrandSubtle` (`#e6e6e6`) |
| **hover / pressed** | **`refineui.css`** `[data-refineui="switch"]` — OFF: `alias.backgroundPrimaryHover` / `alias.backgroundPrimaryActive`; ON: `alias.backgroundBrandHover` / `alias.backgroundBrandStrong` |

`packages/react`의 `Switch`는 `Toggle`과 동일 구현이다.

---

## 10.1 Tabs — Web Kit `Tabs` `636:5371` · `Tabs / Item` `636:5372`

| 속성 | `variant="pill"` | `variant="underline"` |
|------|------------------|------------------------|
| **탭 바(래퍼)** | 배경 **`alias.backgroundPrimaryActive`** (Figma `Background/Primary/Active` · MCP `#f0f0f0`), 테두리 `strokeWidthThin` **`alias.borderDefault`**, 패딩 `sizeSmall`, 항목 간격 `sizeMedium`, 모서리 `roundedLarge` | 배경 투명, 하단 구분선 `strokeWidthThick` `neutral200` |
| **항목 패딩** | `sizeSmall` `sizeMedium` (6px 10px) | 동일 |
| **타이포** | `body1` | 동일 |
| **선택됨** | 배경 **`alias.backgroundPrimary`**(light=white, dark=neutral900), `shadows.shadow2Light`, 모서리 `roundedLarge` | 하단 `strokeWidthThick` `primaryBlack` |
| **비선택(활성)** | 글자 **`alias.foregroundPrimary`**, 배경 투명 | 글자 `primaryBlack`, 하단 투명 2px (레이아웃 정렬) |
| **disabled** | 글자 **`alias.foregroundDisabled`**; 선택+disabled 시 배경 **`alias.backgroundSurfaceDisabled`** | 글자 `neutral400` |

`underline` 변형은 Web Kit 세그먼트(`636:5371`)와 동일 토큰으로 정렬한 **선형 탭** 패턴이다.

---

## 11. Spacing (packages/tokens)

| 토큰 | 값 |
|------|-----|
| sizeNone | 0 |
| sizeXXSmall | 2px |
| sizeXSmall | 4px |
| sizeSmall | 6px |
| sizeMedium | 10px |
| sizeLarge | 16px |
| sizeXLarge | 20px |
| sizeXXLarge | 24px |
| sizeXXXLarge | 32px |

---

## 12. Typography (packages/tokens) — Foundation node-id=1-650

| 스타일 | fontSize | lineHeight | fontWeight |
|--------|----------|------------|------------|
| heading1 | 64px | 86px | 800 (Heavy) |
| heading2 | 40px | 60px | 700 |
| heading3 | 32px | 40px | 700 |
| heading4 | 28px | 36px | 600 |
| title1 | 32px | 40px | 600 |
| title2 | 28px | 36px | 600 |
| title3 | 24px | 32px | 600 |
| subTitle1 | 20px | 28px | 600 |
| subTitle2 | 16px | 24px | 600 |
| body1 | 16px | 24px | 500 |
| body2 | 14px | 20px | 500 |
| body3 | 14px | 20px | 400 |
| body4 | 12px | 16px | 400 |
| caption1 | 12px | 16px | 500 |
| caption2 | 12px | 16px | 400 |
| caption3 | 10px | 14px | 400 |

---

## 13. Border Radius (packages/tokens)

| 토큰 | 값 |
|------|-----|
| roundedNone | 0 |
| roundedXSmall | 2px |
| roundedSmall | 4px |
| roundedMedium | 6px |
| roundedLarge | 8px |
| roundedXLarge | 12px |
| roundedXXLarge | 16px |
| roundedCircle | 9999px |

---

## 14. Stroke Width (packages/tokens)

| 토큰 | 값 |
|------|-----|
| strokeWidthNone | 0 |
| strokeWidthThin | 1px |
| strokeWidthThick | 2px |
| strokeWidthThicker | 4px |
| strokeWidthThickest | 6px |

---

## 15. Shadow (packages/tokens)

- **Button**: `shadow2Light` (key + ambient)
- **Toast**: `shadow4Light` (key + ambient)
- **Tooltip**: `shadow8Light` / `shadow8Dark` (`variant`)
- **Card (elevated)**: `shadow8Light`

Shadow 레벨: shadow2, shadow4, shadow8, shadow16, shadow24, shadow32, shadow64  
각 레벨별: Lighter, Light, (default), Dark, Darker

---

## 16. Color (주요 사용)

| 용도 | 토큰 |
|------|------|
| primary text/bg | primaryBlack (#212121) |
| primary outline | primaryBlack |
| secondary bg | neutral200 |
| border default | neutral300 |
| error | red500, red200, red900 |
| success | green200, green900 |
| warning | yellow200, yellow900 |
| background | neutralWhite |

---

## Toast — Web Kit COMPONENT_SET `548:655`

| 속성 | 값 |
|------|-----|
| **폭** | 325px — `componentSizes.toastMinWidth` · `componentSizes.toastMaxWidth` (기본 카드 `548:654`·`552:2029`) |
| **padding** | `sizeLarge` (16px) |
| **행 gap** (아이콘·본문·액션) | `sizeMedium` (10px) |
| **borderRadius** | `roundedXLarge` (12px) — MCP/Web Kit Toast 카드 갱신 |
| **border** | `strokeWidthThin` `neutral300`; **Focus** (`552:2029`)는 `strokeWidthThick` + `neutral450` 테두리 — 키보드 포커스는 **`refineui.css`** `focus-visible` 링 패턴으로 정렬 |
| **shadow** | `shadows.shadow4Light` (Elevation Shadow 4) |
| **Toast / Icon** (왼쪽) | 24×24 (`spacings.sizeXXLarge`); `WebIcon` `iconSizes.md`; 행 `items-center`로 **카드 세로 중앙**; DOM `data-refineui="toast-icon"`, Type은 루트 `data-variant` (`default` \| `success` \| `error` \| `warning`) + 기본 아이콘 매핑 |
| **title** | `body2` |
| **message** | `body4`, `neutral500` |
| **액션** | `Toast / Action` — 내부 **Button** Small (Web Kit 버튼 sm) |

**`variant`** (`default` \| `success` \| `error` \| `warning`)는 Figma **Type**에 대응하며 **기본 아이콘 이름·액센트 색**을 바꾼다. Web Kit **Toast** 그리드는 **`State=Default`**·**`Focus`**만 있고, Type 변형은 React·`data-variant`로만 구분한다.

**`<Toaster />` 뷰포트 위치:** Figma 컴포넌트 세트에는 없고, 앱 UX를 위한 React 확장이다. `data-refineui="toaster"`에 `data-position`(`top-left` \| `top-center` \| `top-right` \| `bottom-left` \| `bottom-center` \| `bottom-right`)을 붙이며, `refineui.css`에서 앵커·하단 스택 `translateY` 부호를 분기한다.

---

## Tooltip — Web Kit COMPONENT_SET `90:1686`

| 속성 | 값 |
|------|-----|
| **padding** | `sizeSmall` `sizeMedium` (6px 10px) |
| **borderRadius** | `roundedMedium` (6px) |
| **typography** | `body4` |
| **shadow** | `shadows.shadow8Light` (Default) · `shadows.shadow8Dark` (Inverted) |
| **maxWidth** | `componentSizes.tooltipMaxWidth` (200px) |
| **화살표** | 반변 `sizeSmall`(6px) CSS 삼각형(너비 12px) — Figma는 `position`×`align`별 SVG 비크 |

**`placement`:** Figma는 **`position`**(Top/Bottom/Left/Right) × **`align`**(Start/Center/End) **12조합**이다. `packages/react` `Tooltip`은 **`placement`** `top` \| `bottom` \| `left` \| `right`만 지원하며, **트리거 대비 화살표·본문은 중앙 정렬**이다.

---

## Calendar — Web Kit `656:2958` (COMPONENT_SET)

| 속성 | 값 |
|------|-----|
| **컨테이너** | `padding` `sizeLarge`(16px), `minWidth` `componentSizes.calendarMinWidth`, `borderRadius` `roundedLarge`, 배경 `neutralWhite` |
| **월 헤더** (`656:2959`) | Web Kit **`Button`** 4개 — 이전·월·연·다음, 모두 **`variant` Ghost** · Small. 인터랙션(hover·pressed)은 **`refineui.css`** `[data-refineui="button"][data-variant="ghost"]` — 캘린더에서 `data-refineui`를 다른 값으로 덮어쓰면 적용되지 않음 |
| **이전/다음** | `Button` Ghost · Icon · Small, chevron `iconSizes.small` |
| **월·연도** | `Button` Ghost · Label · Small (`body3`) |
| **요일·날짜 셀** | `componentSizes.calendarDaySize`(32×32), `caption1`(MCP `Calendar / Day`), 타월 `neutral400` |
| **Day 인터랙션** | `refineui.css` `[data-refineui="calendar-day"]` — 비선택 셀 hover·pressed 배경 `neutral200`/`neutral300`(Ghost와 동일); `data-range-middle`도 동일; **`data-selected`는 배경 hover·pressed 없음**(선택 고정) |
| **월 그리드** | 요일 행 + 주 행을 `gap` `sizeSmall`(6px) 한 열에 둠 (MCP `656:2960` `Month`) |
| **선택** | 단일/끝점 `primaryBlack` + 흰 글자, 범위 중간 배경 `neutral100`, 엔드포인트 래퍼는 MCP와 동일하게 한쪽만 `roundedLarge` |

`packages/react` `Calendar`는 `single` / `range` 모드를 지원하며, 범위 UI는 위 Figma 그리드와 같은 규칙을 따른다.

---

## JSON 요약 (구현 참조용)

```json
{
  "button": {
    "node": "79:3304",
    "sizes": {
      "sm": { "minHeight": "componentSizes.buttonMinHeightSm", "padding": "sizeXSmall sizeMedium", "borderRadius": "roundedSmall", "type": "body3" },
      "md": { "minHeight": "componentSizes.buttonMinHeightMd", "padding": "sizeSmall sizeMedium", "borderRadius": "roundedMedium", "type": "body1" },
      "lg": { "minHeight": "componentSizes.buttonMinHeightLg", "padding": "sizeMedium sizeLarge", "borderRadius": "roundedLarge", "type": "subTitle1" }
    },
    "outline": { "border": "strokeWidthThin neutral300" },
    "shadow": "shadow2Light (refineui.css)"
  },
  "calendar": {
    "node": "656:2958",
    "padding": "sizeLarge",
    "minWidth": "componentSizes.calendarMinWidth",
    "dayCell": "componentSizes.calendarDaySize",
    "navButton": "Button ghost icon sm; do not override data-refineui (refineui.css ghost hover)",
    "monthHeader": "656:2959 — 4× Button ghost sm (icon|label); px sizeSmall pb sizeMedium",
    "weekRowGap": "sizeSmall"
  },
  "input": {
    "node": "518:7373",
    "sizes": {
      "sm": { "minHeight": "componentSizes.controlHeightSm", "padding": "sizeSmall sizeMedium", "borderRadius": "roundedMedium", "type": "caption1" },
      "md": { "minHeight": "componentSizes.controlHeightMd", "padding": "sizeMedium sizeLarge", "borderRadius": "roundedLarge", "type": "body2" },
      "lg": { "minHeight": "componentSizes.controlHeightLg", "padding": "sizeLarge", "borderRadius": "roundedXLarge", "type": "body1" }
    },
    "border": "strokeWidthThin neutral300",
    "error": "red500",
    "success": "green500"
  },
  "select": {
    "note": "Web Kit 단독 COMPONENT_SET 없음 — Input 518:7373 동일 size",
    "sizes": "same as input"
  },
  "textarea": {
    "node": "529:5454",
    "minHeight": "componentSizes.controlTextareaMin",
    "padding": "sizeMedium sizeSmall",
    "borderRadius": "roundedLarge",
    "type": "body2",
    "note": "필드 패딩은 Input md(10px 16px)와 다름 — Web Kit Textarea 인스턴스 기준"
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
    "padding": "sizeSmall 0",
    "typography": "caption1",
    "linkColor": "neutral500",
    "currentColor": "primaryBlack",
    "separator": "/"
  },
  "card": {
    "padding": "16px",
    "borderRadius": "8px",
    "elevated": { "shadow": "shadow8Light" },
    "outlined": { "border": "1px solid neutral300" }
  },
  "checkbox": {
    "node": "327:2539",
    "box": "componentSizes.controlCheckbox",
    "gap": "sizeSmall",
    "variant": { "default": "roundedSmall", "circular": "roundedCircle" },
    "checked": { "default": "primaryDarkGray", "hover": "neutralBlack", "pressed": "neutral600", "focusBorder": "strokeWidthThick neutral450" }
  },
  "chip": {
    "node": "574:6578",
    "figmaName": "Tag",
    "export": "Chip",
    "padding": "sizeSmall",
    "gap": "sizeXSmall",
    "borderRadius": "roundedMedium",
    "size": { "lg": "body1 + iconSizes.lg", "md": "body3 + iconSizes.md", "sm": "caption1 + iconSizes.xs" },
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
    "width": { "small": "componentSizes.drawerWidthSm", "medium": "componentSizes.drawerWidthMd", "large": "componentSizes.drawerWidthLg" },
    "shadow": "shadow16Light",
    "header": "pt/px sizeXXLarge, pb sizeMedium, title subTitle1, dismiss gap sizeSmall",
    "body": "padding sizeXXLarge, body2"
  },
  "dropdown": {
    "node": "503:2985",
    "menuWidth": "componentSizes.dropdownMenuWidth",
    "menuPadding": "sizeXSmall",
    "itemGap": "sizeMinimal",
    "shadow": "shadow2Light",
    "titleItem": "body2",
    "menuItem": "body4"
  },
  "menu": {
    "node": "633:4268",
    "panelWidth": "componentSizes.menuPanelWidth",
    "padding": "sizeXSmall",
    "itemGap": "sizeMinimal",
    "border": "strokeWidthHairline neutral300",
    "shadow": "shadow2Light",
    "itemPadding": "sizeSmall",
    "itemRadius": "roundedLarge",
    "itemType": "body2 primaryBlack"
  },
  "pagination": {
    "pagination": "558:1989",
    "item": "570:2332",
    "rowGap": "sizeMedium",
    "itemMin": "componentSizes.paginationButtonMinWidth",
    "itemPadding": "sizeSmall",
    "itemRadius": "roundedLarge",
    "chevron": "iconSizes.xl",
    "label": "body1"
  },
  "progress": {
    "node": "452:3994",
    "name": "Progress bar",
    "size": { "sm": "progressTrackHeightSm", "lg": "progressTrackHeightLg" },
    "track": "neutral400",
    "fillDefault": "primaryBlack"
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
      "sm": { "height": "controlHeightSm", "radius": "roundedMedium", "type": "caption1", "stepHalf": "spinStepperStepHeightSm" },
      "md": { "height": "controlHeightMd", "radius": "roundedLarge", "type": "body2", "stepHalf": "spinStepperStepHeightMd" },
      "lg": { "height": "controlHeightLg", "radius": "roundedXLarge", "type": "body1", "stepHalf": "spinStepperStepHeightLg" }
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
    "labelGap": "sizeSmall",
    "labelPosition": ["left", "right", "top", "bottom"],
    "animation": "refineui-spin (refineui.css)"
  },
  "popover": {
    "node": "553:5669",
    "minWidth": "componentSizes.popoverPanelWidth",
    "padding": "sizeLarge",
    "radius": "roundedLarge",
    "default": { "bg": "neutralWhite", "border": "neutral300", "shadow": "shadow8Light" },
    "inverted": { "bg": "primaryBlack", "text": "neutralWhite", "border": "neutral800", "shadow": "shadow8Dark" }
  },
  "field": {
    "node": "525:1074",
    "label": { "sm": "caption1", "md": "body2", "lg": "body1" },
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
    "gapIcon": "sizeXSmall",
    "subtle": "neutral600 (Web Kit 외 확장)"
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
    "track": { "on": "alias.backgroundBrand", "off": "alias.backgroundPrimaryActive", "disabled": "alias.backgroundBrandDisabled" },
    "thumb": { "on": "alias.backgroundPrimary", "off": "alias.backgroundPrimary", "disabled": "alias.backgroundBrandSubtle" },
    "interaction": "refineui.css [data-refineui=switch] hover/active"
  },
  "toggle": {
    "node": "270:3057",
    "figmaName": "Switch",
    "note": "packages/react Toggle — Switch와 동일 구현·동일 data-refineui=switch"
  },
  "tabs": {
    "container": "636:5371",
    "item": "636:5372",
    "pill": {
      "bar": "alias.backgroundPrimaryActive strokeWidthThin alias.borderDefault padding sizeSmall gap sizeMedium roundedLarge",
      "selected": "alias.backgroundPrimary shadow2Light roundedLarge body1 (dark contrast)",
      "disabled": "alias.foregroundDisabled; selected+disabled alias.backgroundSurfaceDisabled"
    },
    "underline": "borderBottom thick neutral200; selected thick primaryBlack (React 확장)"
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
    "padding": "sizeSmall sizeMedium",
    "borderRadius": "roundedMedium",
    "type": "body4",
    "shadow": { "default": "shadow8Light", "inverted": "shadow8Dark" },
    "maxWidth": "componentSizes.tooltipMaxWidth",
    "arrow": "half sizeSmall (6px), CSS triangle",
    "placementNote": "Figma position×align 12-way; React placement top|bottom|left|right only, centered"
  }
}
```
