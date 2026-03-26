# Pelagornis RefineUI Web Kit — Design Specs (구현 기준)

**Figma Web Kit:** https://www.figma.com/design/CxoaTfftpyh8ETDBamkkEK/Pelagornis-RefineUI-Web-Kit?node-id=7-6  
**Foundation:** https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650

> ⚠️ Figma MCP 인증이 필요한 경우, `get_design_context` / `get_variable_defs`로 Figma에서 직접 스펙을 가져올 수 있습니다.  
> 아래 스펙은 `packages/react` 구현과 `packages/tokens`를 기반으로 Figma Web Kit에 맞춰 정합된 값입니다.

---

## 1. Button

| 속성 | sm | md | lg |
|------|----|----|-----|
| **minHeight** | 32px | 40px | 48px |
| **padding** | 0 10px (sizeMedium) | 0 16px (sizeLarge) | 0 20px (sizeXLarge) |
| **borderRadius** | 6px (roundedMedium) | 6px | 6px |
| **typography** | body3 (14px/20px) | body2 (14px/20px) | body1 (16px/24px) |

### Variants

| Variant | border | shadow |
|---------|--------|--------|
| primary | none | shadow2Light |
| secondary | none | shadow2Light |
| **outline** | **2px solid primaryBlack** | shadow2Light |
| ghost | none | shadow2Light |
| danger | none | shadow2Light |

---

## 2. Input / Select / Textarea

| 속성 | Input | Select | Textarea |
|------|-------|--------|----------|
| **minHeight** | 40px | 40px | 80px (min) |
| **padding** | 0 10px (sizeMedium) | 0 10px (sizeMedium) | 10px (sizeMedium) |
| **borderRadius** | 6px (roundedMedium) | 6px | 6px |
| **border** | strokeWidthThin solid neutral300 | strokeWidthThin solid neutral300 | strokeWidthThin solid neutral300 |
| **error border** | strokeWidthThin solid red500 | strokeWidthThin solid red500 | strokeWidthThin solid red500 |
| **typography** | body2 (14px/20px Medium) | body2 | body2 |

---

## 3. Badge

| 속성 | 값 |
|------|-----|
| **padding** | 4px 6px (sizeXXSmall sizeSmall) |
| **borderRadius** | 4px (roundedSmall) |
| **typography** | caption1 (12px/16px) |

### Variants

| Variant | background | color |
|---------|------------|-------|
| default | primaryBlack | neutralWhite |
| neutral | neutral200 | primaryBlack |
| success | green200 | green900 |
| warning | yellow200 | yellow900 |
| danger | red200 | red900 |

---

## 4. Alert — Figma Web Kit

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

## 5. Card

| 속성 | elevated | outlined |
|------|----------|----------|
| **padding** | 16px (sizeLarge) | 16px |
| **borderRadius** | 8px (roundedLarge) | 8px |
| **shadow** | shadow8Light | none |
| **border** | none | 1px solid neutral300 |

---

## 6. Accordion — Web Kit node-id=7-6

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

## 7. Switch / Toggle

| 속성 | 값 |
|------|-----|
| **width** | 44px |
| **height** | 24px |
| **padding** | 2px |
| **borderRadius** | 9999px (roundedCircle) |
| **thumb width** | 20px |
| **thumb height** | 20px |
| **thumb borderRadius** | 9999px (roundedCircle) |
| **checked bg** | primaryBlack |
| **unchecked bg** | neutral300 |
| **thumb bg** | neutralWhite |

---

## 8. Spacing (packages/tokens)

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

## 9. Typography (packages/tokens) — Foundation node-id=1-650

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

## 10. Border Radius (packages/tokens)

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

## 11. Stroke Width (packages/tokens)

| 토큰 | 값 |
|------|-----|
| strokeWidthNone | 0 |
| strokeWidthThin | 1px |
| strokeWidthThick | 2px |
| strokeWidthThicker | 4px |
| strokeWidthThickest | 6px |

---

## 12. Shadow (packages/tokens)

- **Button**: `shadow2Light` (key + ambient)
- **Card (elevated)**: `shadow8Light`

Shadow 레벨: shadow2, shadow4, shadow8, shadow16, shadow24, shadow32, shadow64  
각 레벨별: Lighter, Light, (default), Dark, Darker

---

## 13. Color (주요 사용)

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

## JSON 요약 (구현 참조용)

```json
{
  "button": {
    "sizes": {
      "sm": { "minHeight": 32, "padding": "0 10px", "borderRadius": "6px" },
      "md": { "minHeight": 40, "padding": "0 16px", "borderRadius": "6px" },
      "lg": { "minHeight": 48, "padding": "0 20px", "borderRadius": "6px" }
    },
    "outline": { "borderWidth": "2px", "borderColor": "primaryBlack" },
    "shadow": "shadow2Light"
  },
  "input": {
    "minHeight": 40,
    "padding": "0 10px",
    "borderRadius": "6px",
    "border": "1px solid neutral300"
  },
  "badge": {
    "padding": "4px 6px",
    "borderRadius": "4px"
  },
  "card": {
    "padding": "16px",
    "borderRadius": "8px",
    "elevated": { "shadow": "shadow8Light" },
    "outlined": { "border": "1px solid neutral300" }
  },
  "switch": {
    "width": 44,
    "height": 24,
    "thumbSize": { "width": 20, "height": 20 }
  }
}
```
