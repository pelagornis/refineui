import { spacings } from "../global/spacings";
import { strokeWidths } from "../global/strokeWidths";
import type { SemanticPalettePairFor, SemanticPalettePairsOf } from "../types";
import { paletteColorCssVar } from "../internal/color";
import type { PaletteColors } from "../types";

/** Focus ring palette pairs — `:focus-visible` contract (not `:focus`). */
export const SEMANTIC_FOCUS_PAIRS = {
    ringColor: { light: "neutral750", dark: "neutral350" },
} as const satisfies SemanticPalettePairsOf<PaletteColors>;

export type SemanticFocusName = keyof typeof SEMANTIC_FOCUS_PAIRS;

export const semanticFocus = {
    ring: {
        color: {
            light: paletteColorCssVar(SEMANTIC_FOCUS_PAIRS.ringColor.light),
            dark: paletteColorCssVar(SEMANTIC_FOCUS_PAIRS.ringColor.dark),
        },
        width: strokeWidths.strokeWidthThick,
        offset: spacings.sizeXXXSmall,
        style: "solid" as const,
    },
} as const;

export type SemanticFocusRing = (typeof semanticFocus)["ring"];
