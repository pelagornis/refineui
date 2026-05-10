/**
 * Semantic elevation — one global shadow pair per step name (`shadow2` …) for light/dark.
 * Figma: `Elevation/Light/Shadow N` → `shadows.shadowNLight`, `Elevation/Dark/Shadow N` → `shadows.shadowNDark`
 *
 * Foundation: https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation
 */
import { shadows } from "../global/shadows";
import type { SemanticShadowElevationTokens } from "../types";

/** `semanticShadows.shadow2.light` / `.dark` — pick global `shadows` per theme */
export const semanticShadows: SemanticShadowElevationTokens = {
    shadow2: { light: shadows.shadow2Light, dark: shadows.shadow2Dark },
    shadow4: { light: shadows.shadow4Light, dark: shadows.shadow4Dark },
    shadow8: { light: shadows.shadow8Light, dark: shadows.shadow8Dark },
    shadow16: { light: shadows.shadow16Light, dark: shadows.shadow16Dark },
    shadow24: { light: shadows.shadow24Light, dark: shadows.shadow24Dark },
    shadow32: { light: shadows.shadow32Light, dark: shadows.shadow32Dark },
    shadow64: { light: shadows.shadow64Light, dark: shadows.shadow64Dark },
};
