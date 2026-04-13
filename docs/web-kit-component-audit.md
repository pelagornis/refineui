# Web Kit 컴포넌트 재검토 (Foundation → 규칙 적용)

**목적:** `Pelagornis RefineUI Web Kit` Figma와 **`@refineui/tokens`(Foundation 연동)** 만으로 `packages/react`를 다시 맞춘다.

## 원칙 (반드시)

1. **Foundation → Web Kit** — Web Kit의 padding·size·색은 모두 Foundation Variables와 연결된 값이어야 한다 (`.cursor/rules/figma-foundation.mdc`).
2. **변형·API 일치** — Figma에 없는 props·슬롯·동작은 넣지 않는다.
3. **토큰만 사용** — `colors`, `spacings`, `typographys`, `strokeWidths`, `borderRadii`, `shadows`, `iconSizes`, `foundationSizes`, `componentSizes` 등. 임의 `#hex` / `px` 금지 (`.cursor/rules/tokens-in-components.mdc`).
4. **검증** — 컴포넌트별로 Figma MCP `get_design_context`(해당 node-id)로 스펙 확인.

## 컴포넌트별 체크리스트 (복사용)

- [ ] Web Kit에서 **COMPONENT_SET** 이름·node-id 확인
- [ ] 변형(props)이 Figma와 동일한 범위인가
- [ ] 스타일이 전부 `@refineui/tokens`인가
- [ ] 문서 `documentation/.../components/*.mdx`·Preview와 한 줄이라도 맞는가

## 진행 순서

**알파벳 순**으로 하나씩 진행한다. 아래 표에서 순서대로 ✅로 갱신한다.

| # | 컴포넌트 | Web Kit 노드 (조회 후 기입) | 상태 |
|---|----------|----------------------------|------|
| 1 | Accordion | `54:146` (COMPONENT_SET) | ✅ |
| 2 | Alert | `384:885` (COMPONENT_SET) | ✅ |
| 3 | Avatar | Web Kit `Avater` (COMPONENT_SET); 스택 `69:3008` | ✅ |
| 4 | Avatars | `Avater Stack` `69:3008`, `Avater Spread` `69:3007` | ✅ |
| 5 | Badge | `Badge` `270:3353`, `Badge Number` `276:515` | ✅ |
| 6 | Breadcrumb | `283:688` (COMPONENT_SET) | ✅ |
| 7 | Button | `79:3304` (COMPONENT_SET) | ✅ |
| 8 | Calendar | `656:2958` (COMPONENT_SET) | ✅ |
| 9 | Card | COMPONENT_SET `Card` (§7, node-id MCP로 확인) | ✅ |
| 10 | Checkbox | `327:2539` (COMPONENT_SET) | ✅ |
| 11 | Chip | Web Kit 이름 `Tag` `574:6578` (`Chip`/`Tag` 동일) | ✅ |
| 12 | Dialog | `393:1181` (COMPONENT_SET) | ✅ |
| 13 | Divider | `346:722` (COMPONENT_SET) | ✅ |
| 14 | Drawer | `635:1756` (COMPONENT_SET) | ✅ |
| 15 | Dropdown | `503:2985` (COMPONENT_SET) | ✅ |
| 16 | Field | `525:1074` (COMPONENT_SET) | ✅ |
| 17 | Input | `518:7373` (COMPONENT_SET) | ✅ |
| 18 | Label | `216:1681` (COMPONENT_SET) | ✅ |
| 19 | Link | `226:158` (COMPONENT_SET) | ✅ |
| 20 | Menu | `633:4268` (COMPONENT_SET) | ✅ |
| 21 | Pagination | `558:1989` · `Pagination / Item` `570:2332` | ✅ |
| 22 | PopOver | `553:5669` (COMPONENT_SET) | ✅ |
| 23 | Progress | `452:3994` COMPONENT_SET `Progress bar` | ✅ |
| 24 | Radio | `397:1001` (COMPONENT_SET) | ✅ |
| 25 | Select | (단독 세트 없음) 필드 = **Input** `518:7373` | ✅ |
| 26 | Skeleton | `570:6175` (COMPONENT_SET) | ✅ |
| 27 | Slider | `526:1556` (COMPONENT_SET) | ✅ |
| 28 | SpinButton | `561:2067` (COMPONENT_SET `Spin Button`) | ✅ |
| 29 | Spinner | `550:3669` (COMPONENT_SET) | ✅ |
| 30 | Switch | `270:3057` (COMPONENT_SET) | ✅ |
| 31 | Tabs | `636:5371` · `Tabs / Item` `636:5372` | ✅ |
| 32 | Tag | `574:6578` (COMPONENT_SET `Tag`; `Chip` 동일) | ✅ |
| 33 | Textarea | `529:5454` (COMPONENT_SET) | ✅ |
| 34 | Toast | `548:655` (COMPONENT_SET) | ✅ |
| 35 | Toggle | `270:3057` (Web Kit 이름 **Switch**; `Toggle` 동일 구현) | ✅ |
| 36 | Tooltip | `90:1686` (COMPONENT_SET) | ✅ |

> `WebIcon`은 아이콘 래퍼로 이 표에 포함하지 않아도 된다.

## 현재 진행

- **알파벳 순 표(위 1–36)** 항목은 모두 ✅ 처리됨. 추가로 Web Kit·토큰을 바꾼 뒤에는 **필요한 행만** 위 체크리스트로 재확인하면 된다.
- **이후 작업 예시:** 문서 사이트 `pnpm docs:build`로 Astro 빌드 확인, Foundation/Web Kit 파일이 바뀌면 `design-specs-web-kit.md`·이 표의 해당 노드 재대조, `Select`처럼 단독 세트가 없는 항목은 **Input** 등 상위 규칙만 유지되는지 점검.
