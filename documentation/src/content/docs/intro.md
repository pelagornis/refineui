---
title: RefineUI 소개
description: Pelagornis RefineUI Web Kit — 디자인 시스템 React 컴포넌트
---

# RefineUI 소개

**RefineUI**(`@refineui/react`)는 Figma **Pelagornis RefineUI Web Kit**과 **Foundation** 변수를 기준으로 만든 React 컴포넌트 라이브러리입니다. 색·간격·타이포는 **`@refineui/tokens`**에 맞추고, 상호작용(hover·focus 등)은 **`refineui.css`**로 보강합니다.

## 특징

- **Web Kit 정합** — 컴포넌트별로 Figma 노드·`docs/design-specs-web-kit.md`와 구현을 맞춤
- **토큰만 사용** — 컴포넌트 스타일은 `@refineui/tokens`의 `colors`, `spacings`, `typographys` 등으로 정의
- **접근성** — 폼 컨트롤·다이얼로그·토글 등에 ARIA·키보드 동작을 고려
- **CSS 한 번 import** — `refineui.css`로 버튼·입력·체크박스 등 공통 인터랙션 스타일 적용

## 요구 사항

- **React** 18 이상
- **react-dom** 18 이상 (클라이언트에서 컴포넌트 사용 시)

## 설치

모노레포가 아닌 앱에서 사용할 때 예시는 다음과 같습니다.

```bash
pnpm add @refineui/react @refineui/tokens
# 또는
npm install @refineui/react @refineui/tokens
```

## 스타일시트 (필수)

인터랙션(hover·active·focus-visible)과 일부 컴포넌트 기본 동작은 **전역 CSS**에 있습니다. 앱 진입점에서 한 번 불러옵니다.

```tsx
import "@refineui/react/refineui.css";
```

`Button`, `Input`, `Checkbox`, `Switch`, `Dropdown` 항목 등은 이 파일 없이도 렌더링되지만, **디자인 시스템과 동일한 호버/포커스**를 쓰려면 위 import가 필요합니다.

## 기본 사용

```tsx
import { Button, Input, Card } from "@refineui/react";
import "@refineui/react/refineui.css";

export function Example() {
  return (
    <Card>
      <Input placeholder="이메일" type="email" />
      <Button variant="primary" type="button">
        제출
      </Button>
    </Card>
  );
}
```

## 문서 구조

- **시작하기** — 이 페이지
- **컴포넌트** — 각 컴포넌트별 API·예시·라이브 Preview
- **가이드** — [프로젝트 구조](/guides/packages/), [CLI](/guides/cli/)

## Figma

- [Foundation (변수·토큰)](https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650)
- [Web Kit (컴포넌트)](https://www.figma.com/design/CxoaTfftpyh8ETDBamkkEK/Pelagornis-RefineUI-Web-Kit?node-id=7-6)

저장소 내 **`docs/design-specs-web-kit.md`**에 구현 기준 스펙 요약이 있습니다.
