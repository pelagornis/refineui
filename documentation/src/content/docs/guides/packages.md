---
title: 프로젝트 구조
description: packages/ 구조 및 정책
---

# 프로젝트 구조

RefineUI는 monorepo로 구성되어 있습니다.

## packages/

| 패키지 | 설명 |
|--------|------|
| `@refineui/tokens` | 디자인 토큰 (colors, spacings, typographys 등) |
| `@refineui/react` | React 컴포넌트 |
| `@refineui/utilities` | 유틸리티 함수 |
| `@refineui/theme` | 테마 설정 |

## 빌드

```bash
pnpm build
```

`tokens` → `react` 순서로 빌드됩니다.
