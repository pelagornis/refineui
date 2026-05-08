/**
 * 시맨틱 elevation — 단계 이름(`shadow2` …)마다 라이트/다크용 글로벌 그림자 한 쌍.
 * Figma: `Elevation/Light/Shadow N` → `shadows.shadowNLight`, `Elevation/Dark/Shadow N` → `shadows.shadowNDark`
 *
 * Foundation: https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation
 */
import { shadows } from "../global/shadows";
import type { SemanticShadowElevationTokens } from "../types";

/** `semanticShadows.shadow2.light` / `.dark` — 글로벌 `shadows`를 테마별로 고름 */
export const semanticShadows: SemanticShadowElevationTokens = {
    shadow2: { light: shadows.shadow2Light, dark: shadows.shadow2Dark },
    shadow4: { light: shadows.shadow4Light, dark: shadows.shadow4Dark },
    shadow8: { light: shadows.shadow8Light, dark: shadows.shadow8Dark },
    shadow16: { light: shadows.shadow16Light, dark: shadows.shadow16Dark },
    shadow24: { light: shadows.shadow24Light, dark: shadows.shadow24Dark },
    shadow32: { light: shadows.shadow32Light, dark: shadows.shadow32Dark },
    shadow64: { light: shadows.shadow64Light, dark: shadows.shadow64Dark },
};
