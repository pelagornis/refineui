---
title: 프로젝트 구조
description: RefineUI monorepo 패키지와 빌드
---

# 프로젝트 구조

RefineUI는 **pnpm workspace** 기준 monorepo입니다. 루트에서 스크립트를 실행하면 패키지가 순서대로
빌드됩니다.

## 디렉터리 개요

| 경로                 | 역할                                                         |
| -------------------- | ------------------------------------------------------------ |
| `packages/tokens`    | `@refineui/tokens` — TS 토큰 + `pnpm build` 시 `css-variables` / `tailwind-theme` 생성; Tailwind 유틸 접두사 `refineui-*` |
| `packages/react`     | `@refineui/react` — UI 컴포넌트 + `refineui.css`             |
| `packages/utilities` | `@refineui/utilities` — 공용 유틸                            |
| `documentation`      | Astro + Starlight 기반 **이 사이트**                         |
| `examples`           | 예제 앱(있을 경우)                                           |

## 패키지 의존 관계

- `@refineui/react`는 **`@refineui/tokens`**, **`@refineui/utilities`**, **`@refineui/web-icons`**에
  의존합니다.
- 앱에서 컴포넌트만 쓸 때는 보통 **`@refineui/react`**와 **`@refineui/tokens`**(토큰을 직접 쓸 때)를
  설치합니다.

## Tailwind

- **다른 프로젝트**: 글로벌 CSS에 `@import "@refineui/tokens/tailwind.css";` (Tailwind v4 + `peerDependencies`의 `tailwindcss`).
- **이 monorepo 문서 사이트**: Vite alias 없이 `global.css`가 `packages/tokens/tailwind.css`를 상대 경로로 불러옵니다.
- **클래스 예**: `bg-refineui-neutral-500`, `p-refineui-size-medium` — `:root` 변수는 그대로 `var(--refineui-*)`.

## 빌드

저장소 루트에서:

```bash
pnpm install
pnpm build
```

순서는 **`tokens` → `react`** 입니다 (`package.json`의 `build` 스크립트).

## 문서 사이트

```bash
pnpm docs        # 개발 서버
pnpm docs:build  # 정적 빌드 (tokens + react 빌드 포함)
```

## 스펙 단일 소스

- Figma **Foundation**·**Web Kit**은 디자인 단일 소스입니다.
- 구현·문서와의 대조 표는 저장소의 `docs/web-kit-component-audit.md`,
  `docs/design-specs-web-kit.md`를 참고하세요.
