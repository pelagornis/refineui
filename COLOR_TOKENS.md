# RefineUI — 색(컬러) 토큰 가이드

Pelagornis RefineUI에서 **색은 Foundation(Figma)이 단일 소스**이고, 코드는 그에 맞춰 `packages/tokens`에 반영합니다. 이 문서는 **Primitive → Semantic(Alias) → Component Token → 컴포넌트** 흐름과, **무엇을 어디서 바꿔야 하는지**를 정리합니다.

---

## 1. 레이어 구조 (한 줄 요약)

| 단계 | 역할 | 코드 위치 (주요) |
|------|------|------------------|
| **Primitive** | 팔레트 원시 값 (hex 등). 의미 없음. | `packages/tokens/src/global/colors.ts` → CSS `--refineui-color-{palette}` |
| **Semantic (Alias)** | UI 의미(배경/글자/테두리/상태). Light·Dark 페어. | `packages/tokens/src/semantic/colors.ts` → CSS `--refineui-color-alias-*` |
| **Component Token** | 특정 컴포넌트가 쓰는 “역할 이름”. Semantic만 참조. | `packages/react/src/tokens/componentColorTokens.ts` |
| **Component** | 실제 UI. 가능하면 Component Token 또는 Semantic alias만 사용. | `packages/react/...`, `refineui.css` |

**규칙:** 컴포넌트에서 **Primitive(hex, `neutral-300` 직접 지정 등)를 직접 쓰지 않는 것**을 목표로 합니다. 의미가 필요하면 Semantic, 화면 단위 이름이 필요하면 Component Token으로 올립니다.

---

## 2. Figma와의 관계

- **Foundation (Variables):**  
  [Pelagornis RefineUI Foundation](https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650)  
  여기서 **Global/Colors**가 Primitive, **`Alias/Color/...`**가 Semantic에 대응합니다.
- **Web Kit:** 컴포넌트는 Foundation 변수에 **연결된 값**만 사용해야 합니다. Web Kit만의 임의 hex·간격은 두지 않습니다.

코드의 Semantic 맵(`SEMANTIC_PALETTE_PAIRS`)은 Figma의 **Alias 변수 이름(마지막 세그먼트)** 과 맞추는 것이 원칙입니다. (예: `Alias/Color/Background/Primary/backgroundPrimary` → 키 `backgroundPrimary`)

---

## 3. Alias(Semantic)란 무엇인가

- **Alias** = “이 UI 역할에는 이 팔레트 톤을 쓴다”는 **의미 레이어**입니다.
- Light / Dark는 **서로 다른 팔레트 키**를 가리킬 수 있습니다. (`semantic/colors.ts`의 `{ light, dark }`)
- CSS로는 `semanticColors` 빌드 결과가  
  `:root` / `[data-theme="dark"], .dark` 에  
  `--refineui-color-alias-{이름}` 형태로 출력됩니다.

**Alias를 “어떻게 해야 하냐”면:**

1. **먼저 Figma Foundation**에 해당 Alias가 있는지 확인합니다.
2. 없으면 **Foundation에 변수를 추가·수정**한 뒤, 코드에 반영합니다. (코드만 먼저 바꾸지 않기)
3. 있으면 `packages/tokens/src/semantic/colors.ts`의 `SEMANTIC_PALETTE_PAIRS`에 키를 추가하거나, 기존 키의 `light` / `dark`가 가리키는 **`PaletteColors` 키**를 수정합니다.
4. `surfaceOverlay`만 예외적으로 RGBA 문자열을 쓰며, Foundation 정의와 **수치가 일치하는지** 주기적으로 맞춥니다.

---

## 4. Semantic을 변경할 때 (체크리스트)

### 4.1 값만 바꾸는 경우 (다크 톤 조정 등)

1. `packages/tokens/src/semantic/colors.ts`에서 해당 키의 `light` / `dark`를 `PaletteColors`의 키로 수정합니다.
2. 토큰 패키지 빌드 후 `packages/tokens/dist/css-variables.css`에 `--refineui-color-alias-*`가 기대대로 나오는지 확인합니다.
3. `@refineui/react` 빌드 시 `generate-refineui-css`가 같은 `semanticColors`를 쓰므로, **일관되게** 갱신됩니다.

### 4.2 새 Semantic 키를 추가하는 경우

1. Figma에 **동일 의미의 Alias**가 있는지 확인합니다.
2. `SEMANTIC_PALETTE_PAIRS`에 키를 추가합니다. (camelCase, Figma tail 이름과 통일)
3. `SEMANTIC_COLOR_ROWS`는 `SEMANTIC_PALETTE_PAIRS`에서 자동으로 늘어나므로, 보통 별도 수동 나열은 필요 없습니다.
4. `surfaceOverlay`처럼 **특수 케이스**면 `buildSemanticColors` / `SEMANTIC_COLOR_ROWS`에 맞춰 처리합니다.

### 4.3 “빈약해 보인다”고 느낄 때

- Semantic 개수를 **임의로 늘리기보다**, Figma `Alias/Color` 트리와 **1:1로 맞추는 것**이 우선입니다.
- 파일 가독성을 위해 `semantic/colors.ts` 안을 **Figma와 같은 그룹**(Background / Foreground / Border / Surface)으로 주석 블록만 나누는 것도 권장합니다.

---

## 5. Component Token (`componentColorTokens.ts`)

- **위치:** `packages/react/src/tokens/componentColorTokens.ts` — `@refineui/react`에서도 `export { componentColorTokens }` 로 노출합니다.
- **역할:** Web Kit 컴포넌트가 쓰는 **화면 단위 이름**(예: pagination nav 아이콘, dropdown 메뉴 행)을 두고, 값은 가능하면 **Semantic Alias를 설명에 맞게 매칭**합니다.
- **구조:** source of truth는 여전히 두 군데입니다.
  - Primitive: `packages/tokens/src/global/colors.ts`
  - Semantic: `packages/tokens/src/semantic/colors.ts`
  - Component Token: `packages/react/src/tokens/componentColorTokens.ts`
- **추가·변경:** 새 컴포넌트 역할이 생기면 `componentColorTokens`에 slot/state 기준으로 추가하고, 내부에서는 `@refineui/utilities/color`의 token helper로 **token ref**를 선언합니다. 실제 CSS variable 문자열은 `@refineui/utilities/color`의 `resolveColorTokenValue()`가 만듭니다.

### 5.0 Component Token 매핑 원칙

| 우선순위 | 레이어 | 언제 사용하나 |
|----------|--------|---------------|
| 1 | `semanticToken(name)` | 공통 UI 의미가 있는 경우. semantic token ref를 만든다 |
| 2 | `paletteToken(name)` | 아직 semantic으로 올리기 이른 Web Kit 전용 accent용 palette token ref를 만든다 |
| 3 | `@refineui/utilities/color`.`resolveColorTokenValue(value)` | token ref를 실제 `var(--refineui-color-...)` 문자열로 바꾼다 |
| 4 | `componentColorTokens` | 컴포넌트의 slot/variant/state 설명에 맞게 1, 2를 조합한 최종 매핑 |

예시:

```ts
button: {
  primary: {
    background: semanticToken("backgroundBrand"),
    foreground: semanticToken("foregroundOnBrand"),
    hoverBackground: semanticToken("backgroundBrandHover"),
  },
}
```

```ts
style={{ backgroundColor: resolveColorTokenValue(componentColorTokens.button.primary.background) }}
```

### 5.1 Alias Token 정리표

아래 표는 현재 코드에서 핵심적으로 쓰는 Alias Token 그룹입니다. Figma Foundation의 `Alias/Color/...`와 1:1로 맞추는 기준표로 사용합니다.

| 그룹 | 대표 Alias Token | 용도 |
|------|------------------|------|
| Background / Brand | `backgroundBrand`, `backgroundBrandHover`, `backgroundBrandActive`, `backgroundBrandDisabled`, `backgroundBrandSubtle` | 브랜드 주요 액션 배경 |
| Background / Primary | `backgroundPrimary`, `backgroundPrimaryHover`, `backgroundPrimaryActive` | 기본 표면/ghost 계열 상호작용 |
| Background / Surface | `backgroundSurface`, `backgroundSurfaceHover`, `backgroundSurfaceActive`, `backgroundSurfaceSelected`, `backgroundSurfaceDisabled` | panel, menu, secondary surface |
| Background / State | `backgroundSuccess`, `backgroundWarning`, `backgroundError`, `backgroundInfo`, `backgroundDiscovery` 및 각 `Hover` / `Subtle` | 상태성 배경 |
| Foreground / Primary | `foregroundPrimary`, `foregroundPrimaryHover`, `foregroundSecondary`, `foregroundTertiary`, `foregroundDisabled`, `foregroundPlaceholder`, `foregroundInversed` | 기본 텍스트/아이콘 |
| Foreground / Interactive | `foregroundLink`, `foregroundLinkHover`, `foregroundLinkActive`, `foregroundLinkVisited` | 링크/interactive text |
| Foreground / On-Background | `foregroundOnBrand`, `foregroundOnSuccess`, `foregroundOnWarning`, `foregroundOnError`, `foregroundOnInfo`, `foregroundOnDiscovery` | 컬러 배경 위 텍스트 |
| Foreground / State-Specific | `foregroundSuccess`, `foregroundWarning`, `foregroundError`, `foregroundInfo`, `foregroundDiscovery` | 상태 강조 텍스트/아이콘 |
| Border / Primary | `borderDefault`, `borderSubtle`, `borderStrong` | 일반 경계선 |
| Border / Interactive | `borderHover`, `borderFocus`, `borderDisabled` | focus/hover/disabled 경계선 |
| Border / State | `borderSuccess`, `borderWarning`, `borderError`, `borderInfo`, `borderDiscovery` | 상태성 경계선 |
| Surface | `surfaceElevated`, `surfaceInverse`, `surfacePopover`, `surfaceTooltip`, `surfaceSunken`, `surfaceOverlay` | overlay, popover, tooltip, elevated panel |

### 5.2 Component Token 정리표

아래 표는 현재 `packages/react/src/tokens/componentColorTokens.ts`에 반영된 컴포넌트 색 계약입니다. Figma Web Kit 기준으로 컴포넌트가 어떤 역할 이름을 가져야 하는지 정리한 것입니다.

| 컴포넌트 | Component Token 키(대표) | 비고 |
|------|---------------------------|------|
| `WebIcon` | `webIcon.primary`, `webIcon.secondary`, `webIcon.disabled`, `webIcon.inversed` | 공통 아이콘 색 |
| `Button` | `button.primary.*`, `button.secondary.*`, `button.outline.*`, `button.ghost.*` | variant별 상태 분리 |
| `Input` | `input.text`, `input.placeholder`, `input.background`, `input.border.*` | 기본 입력 필드 |
| `Textarea` | `textarea.text`, `textarea.placeholder`, `textarea.background`, `textarea.border.*` | multiline 필드 |
| `Select` | `select.text`, `select.placeholder`, `select.background`, `select.border.*` | native select |
| `Checkbox` | `checkbox.label.*`, `checkbox.checkIcon.*` | 라벨/체크 분리 |
| `Radio` | `radio.label.*`, `radio.control.*` | dot/border 구분 |
| `Switch` / `Toggle` | `switch.track.*`, `switch.thumb.*`, `toggle.track.*`, `toggle.thumb.*` | on/off 상태 추상화 |
| `Field` | `field.label`, `field.required`, `field.hint`, `field.error` | form wrapper |
| `Label` | `label.text`, `label.disabledText`, `label.required` | Figma MCP 기준 보강 |
| `Alert` | `alert.background`, `alert.border`, `alert.title`, `alert.description.*`, `alert.accent.*` | variant별 accent |
| `Badge` | `badge.default.*`, `badge.neutral.*`, `badge.outline.*`, `badge.success.*`, `badge.warning.*`, `badge.danger.*` | badge 계열 |
| `Chip` / `Tag` | `chip.default.*`, `chip.outline.*`, `chip.filled.*`, `chip.remove.icon`, `tag.*` | tag/chip 상태 |
| `Progress` | `progress.track`, `progress.indicator.*` | variant 확장 대비 |
| `Spinner` | `spinner.track`, `spinner.indicator`, `spinner.label` | 로딩 표시 |
| `Skeleton` | `skeleton.background`, `skeleton.shimmer` | shimmer 색 |
| `Toast` / `Toaster` | `toast.background`, `toast.border`, `toast.title`, `toast.message`, `toast.accent.*`, `toaster.stackBackground` | toast stack |
| `Tooltip` | `tooltip.default.*`, `tooltip.inverted.*` | beak 포함 배경/전경 |
| `PopOver` | `popover.default.*`, `popover.inverted.*` | panel 색 |
| `Dialog` | `dialog.overlay`, `dialog.content.background`, `dialog.title.foreground`, `dialog.description.foreground`, `dialog.close.icon` | compound slot 반영 |
| `Drawer` | `drawer.overlay`, `drawer.content.background`, `drawer.header.*`, `drawer.title.*`, `drawer.description.*`, `drawer.body.*`, `drawer.footer.*`, `drawer.close.icon` | compound slot 반영 |
| `Dropdown` | `dropdown.trigger.*`, `dropdown.menu.*` | trigger/menu 분리 |
| `Menu` | `menu.panel.*`, `menu.popover.*`, `menu.list.*`, `menu.sectionToken.*`, `menu.dividerToken.*`, `menu.item.*` | compound slot 반영 |
| `Tabs` | `tabs.pill.*`, `tabs.underline.*` | variant별 분리 |
| `Accordion` | `accordion.item.border`, `accordion.trigger.*`, `accordion.content.*` | item/trigger/content 분리 |
| `Breadcrumb` | `breadcrumb.list.*`, `breadcrumb.link.*`, `breadcrumb.page.*`, `breadcrumb.separatorToken.*`, `breadcrumb.ellipsis`, `breadcrumb.ellipsisTrigger.*` | compound slot 반영 |
| `Pagination` | `pagination.navIcon.*`, `pagination.page.*` | page item 상태 포함 |
| `Link` | `link.default`, `link.hover`, `link.active`, `link.visited`, `link.disabled`, `link.subtle.*` | default/subtle |
| `Calendar` | `calendar.background`, `calendar.weekday`, `calendar.day.*` | selected/range/otherMonth 포함 |
| `Card` | `card.elevated.*`, `card.outlined.*`, `card.header.*`, `card.titleToken.*`, `card.descriptionToken.*`, `card.content.*`, `card.footer.*`, `card.action.*` | compound slot 반영 |
| `Divider` | `divider.line`, `divider.label`, `divider.icon` | content/icon layout 대응 |
| `Avatar` / `Avatars` | `avatar.shell.*`, `avatar.icon.*`, `avatar.status.*`, `avatar.overflow.*`, `avatar.group.*`, `avatar.groupCount.*`, `avatars.*` | avatar family 전체 |

### 5.3 내가 먼저 보강해둔 항목

아래는 코드에서 먼저 정리해둔 내용입니다. 사용 중 괜찮다면 Figma Foundation / Web Kit에도 같은 구조로 정리하는 것을 권장합니다.

| 구분 | 보강 내용 | Figma에서 확인/정리할 것 |
|------|-----------|--------------------------|
| `Label` | `label.text`, `label.disabledText`, `label.required` 추가 | `Label` 컴포넌트의 default / disabled / required 색을 Alias로 명시 |
| Compound components | `dialog.*`, `drawer.*`, `menu.*`, `breadcrumb.*`, `card.*`, `avatar.*`에 slot 단위 키 추가 | Web Kit에서 sub-slot 이름과 상태 이름을 더 명시적으로 정리 |
| Form controls | `input.*`, `textarea.*`, `select.*`, `checkbox.*`, `radio.*`, `switch.*`, `toggle.*` 분리 | hover / focus / error / success / disabled 토큰이 충분한지 확인 |
| Feedback | `alert.*`, `badge.*`, `chip.*`, `tag.*`, `toast.*`, `spinner.*`, `skeleton.*`, `progress.*` 보강 | status accent가 palette인지 alias인지 Foundation에서 확정 |
| Navigation | `tabs.*`, `accordion.*`, `pagination.*`, `breadcrumb.*`, `menu.*`, `link.*`, `calendar.*` 보강 | state별 역할(hover, active, selected, disabled)을 Alias로 충분히 제공하는지 점검 |
| Overlay | `tooltip.*`, `popover.*`, `dialog.overlay`, `drawer.overlay` 정리 | overlay / popover / tooltip surface 계열을 Foundation alias로 더 명확히 분리할지 검토 |
| Avatar family | `avatar.shell.*`, `avatar.icon.*`, `avatar.status.*`, `avatars.count.*` 정리 | Avatar color variant를 Alias로 둘지, palette wrapper로 둘지 Figma 규칙 확정 |

### 5.4 Figma를 바꿀 때 추천하는 방향

아래 방향으로 Figma를 정리하면 코드와 구조가 더 안정적으로 맞아집니다.

| 우선순위 | 추천 작업 | 이유 |
|----------|-----------|------|
| 높음 | `Alias/Color`를 `Background / Foreground / Border / Surface` 그룹으로 완전하게 정리 | `semantic/colors.ts`와 1:1 매핑 쉬움 |
| 높음 | `Label`, `Field`, `Input`, `Select`, `Textarea`의 error / success / disabled / focus 상태를 Variables로 명시 | form 계열이 가장 자주 재사용됨 |
| 높음 | `Dialog`, `Drawer`, `Menu`, `Breadcrumb`, `Card`, `Avatar`의 sub-slot 이름을 Figma에서 명시 | compound component token 구조와 직접 연결 가능 |
| 중간 | `Alert`, `Badge`, `Chip`, `Tag`, `Toast`의 accent 색이 alias인지 palette인지 규칙 확정 | 지금은 일부 palette wrapper가 섞여 있음 |
| 중간 | `Tabs`, `Accordion`, `Pagination`, `Calendar`의 selected / hover / active / disabled 상태를 더 명시 | interaction mapping 일관성 향상 |
| 중간 | `surfacePopover`, `surfaceTooltip`, `surfaceOverlay`, `surfaceElevated`, `surfaceInverse` 역할 경계를 더 분명히 정의 | overlay 계열 중복 방지 |
| 낮음 | Avatar 색상군을 semantic으로 올릴지, 현재처럼 palette wrapper로 둘지 결정 | 현재도 동작은 가능하지만 규칙 합의가 필요 |

---

## 6. 빌드 산출물과 소비

- `packages/tokens` 빌드 → `dist/css-variables.css` (palette + semantic alias)
- `packages/react` 빌드 스크립트 → 위 산출물에 layout 등을 합침 (`packages/react/scripts/generate-refineui-css.mjs`)
- 앱에서는 `import "@refineui/react/refineui.css"` 등으로 로드합니다.

Semantic 변경 후에는 **토큰 빌드 → 리액트 빌드(필요 시)** 순으로 확인하는 것이 안전합니다.

---

## 7. 관련 파일 빠른 참조

| 내용 | 경로 |
|------|------|
| Primitive 팔레트 | `packages/tokens/src/global/colors.ts` |
| Semantic (Alias 페어) | `packages/tokens/src/semantic/colors.ts` |
| Component 색 토큰 | `packages/react/src/tokens/componentColorTokens.ts` |
| 패키지 export | `packages/tokens/src/index.ts` |
| CSS 변수 생성 (react 쪽) | `packages/react/scripts/generate-refineui-css.mjs` |
| 글로벌 베이스·인터랙션 | `packages/react/refineui.css` |
| Web Kit 스펙 메모 | `docs/design-specs-web-kit.md` |

---

## 8. Cursor / AI 규칙 (요약)

프로젝트 규칙상 UI 작업 시 **Foundation URL·node-id**를 기준으로 Figma MCP로 스펙을 확인하고, **임의 hex·임의 px**를 컴포넌트에 넣지 않습니다. 자세한 규칙은 `.cursor/rules/figma-foundation.mdc`, `prompts/design-system.figma.yml`을 참고합니다.
