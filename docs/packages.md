# Packages — RefineUI monorepo 구조

RefineUI는 **pnpm workspace** 기반 monorepo입니다.  
`packages/` 디렉터리는 **그대로 유지**하며, AI 프롬프트 가이드에서 수정 대상으로 다루지 않습니다.

---

## 패키지 목록

| 패키지 | 경로 | 설명 |
|--------|------|------|
| **@refineui/react** | `packages/react/` | React 컴포넌트 |
| **@refineui/tokens** | `packages/tokens/` | 테마 토큰 (colors, fonts, spacings, strokeWidths 등) |
| **@refineui/utilities** | `packages/utilities/` | React 유틸리티 (dom, version 등) |
| **@refineui/version** | `packages/version/` | 버전 유틸리티 |

---

## 정책: packages는 그대로

- **구조 변경 없음**: `packages/` 내부 패키지 추가·삭제·이동은 하지 않습니다.
- **의존성**: `pnpm-workspace.yaml`과 각 패키지의 `package.json` exports를 존중합니다.
- **AI 작업 범위**: 프롬프트 가이드에서 요청하는 작업은 기존 패키지 **내부** 수정에 한정됩니다 (예: `packages/react` 내 컴포넌트 추가, `packages/tokens` 토큰 수정).

---

## 참고

- 워크스페이스 정의: `pnpm-workspace.yaml`
- 루트 설정: `package.json`, `tsconfig.base.json`, `tsconfig.json`
