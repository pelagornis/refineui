# Figma Foundation — RefineUI 디자인 토큰

## Foundation URL

**Pelagornis RefineUI Foundation (Figma) — Variables:**
https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650

**Pelagornis RefineUI Web Kit (Figma) — 컴포넌트:**
https://www.figma.com/design/CxoaTfftpyh8ETDBamkkEK/Pelagornis-RefineUI-Web-Kit?node-id=0-1

(`node-id=7-6`은 파일 내 **Accordion 예시 페이지**만 연다. 컴포넌트별 스펙은 MCP `search_design_system`과 해당 노드의 `get_design_context`를 쓴다 — 예: Breadcrumb `283:688`, Breadcrumb/BreadcrumbItem 변형 `279:2539` / `289:41` / `289:44`.)

### Foundation과 Web Kit의 관계

- **Foundation → Web Kit**: Web Kit 컴포넌트는 **Foundation Variables**(색, spacing, padding, radius 등)에 **연결된 값**만 사용한다.
- **모든 사이즈·padding·간격**은 Foundation을 거친다. Web Kit만의 임의 수치는 두지 않는다.

## 역할

- **Foundation = 단일 소스**: 색상, 타이포그래피, 간격, radius, shadow 등 모든 디자인 토큰의 기준
- **코드 동기화**: `packages/tokens/src/global/*.ts`는 이 Foundation과 일치하도록 유지

## 토큰 매핑

| Foundation (Figma) | 코드 (packages/tokens) |
|--------------------|------------------------|
| Colors / Variables | `global/colors.ts` |
| Typography | `global/fonts.ts` |
| Typography styles | `global/typographys.ts` |
| Spacing | `global/spacings.ts` |
| Stroke width | `global/strokeWidths.ts` |
| Border radius | `global/borderRadii.ts` |
| Shadow | `global/shadows.ts` (Lighter~Darker, shadowColors 기반) |
| Z-index | `global/zIndex.ts` |
| Text alignment | `global/textAlignments.ts` |

## Figma MCP 사용

1. Cursor에서 Figma MCP 연결 후
2. `get_variable_defs` — Foundation (node-id=1-650) 변수 조회
3. `get_design_context` — Web Kit에서 **조회할 컴포넌트 노드** 지정(파일 진입용 기본 링크는 `node-id=0-1`; 예: Breadcrumb `283:688`)
4. 특정 프레임/레이어만 필요하면 `?node-id=XXX-YYY` / MCP 인자 `nodeId` `XXX:YYY` 형태로 지정

## 동기화 절차

### Figma MCP로 자동 동기화 (권장)

1. Cursor에서 **Figma MCP 인증** (`mcp_auth` tool 호출 또는 Connect)
2. 채팅에서 다음을 요청:
   - *"Foundation (node-id=1-650) 변수를 가져와서 packages/tokens에 반영해줘"*
   - *"Web Kit에서 Breadcrumb(283:688) 등 **해당 컴포넌트 node-id**로 get_design_context 해서 design-specs-web-kit.md와 React에 반영해줘"*
3. AI가 `get_variable_defs` / `get_design_context`로 Figma에서 직접 값을 가져와 동기화

### 수동 동기화

Foundation 수정 시:

1. Figma에서 변경 사항 확인
2. `packages/tokens/src/global/*.ts` 해당 파일 수정
3. 타입(`types.ts`)과 불일치 시 타입도 업데이트
4. `pnpm build` 등으로 빌드 확인

## 관련 파일

- `.cursor/rules/figma-foundation.mdc` — Cursor 규칙
- `prompts/design-system.figma.yml` — 프롬프트 규칙
- `prompt.config.js` — `taskPresets.design` 참조
