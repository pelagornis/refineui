---
title: RefineUI 소개
description: Pelagornis RefineUI Web Kit — 디자인 시스템 컴포넌트 라이브러리
---

# RefineUI 소개

**Pelagornis RefineUI Web Kit**는 Figma 디자인 시스템을 기반으로 한 React 컴포넌트 라이브러리입니다.

## 특징

- **32개 컴포넌트** — Accordion, Button, Card, Dialog, Input 등
- **토큰 기반** — `@refineui/tokens`로 일관된 색상, 간격, 타이포그래피
- **접근성** — ARIA, 키보드 네비게이션 지원

## 설치

```bash
pnpm add @refineui/react @refineui/tokens
```

## 사용 예시

```tsx
import { Button, Input, Card } from "@refineui/react";

function App() {
  return (
    <Card>
      <Input placeholder="이메일" />
      <Button variant="primary">제출</Button>
    </Card>
  );
}
```

## Figma

- [Foundation](https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation)
- [Web Kit](https://www.figma.com/design/CxoaTfftpyh8ETDBamkkEK/Pelagornis-RefineUI-Web-Kit)
