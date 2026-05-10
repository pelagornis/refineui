/**
 * Foundation Alias/Color — Pelagornis RefineUI Foundation Variables.
 * Light / Dark map to `PaletteColors` keys; CSS resolves `var(--refineui-color-*)`.
 *
 * `surfaceOverlay` is raw RGBA scrim in Foundation (not a global alias).
 *
 * Pair map typing follows `SemanticPalettePairsOf<PaletteColors>` in `types.ts`.
 */
import { paletteColorCssVar } from "@refineui/utilities";
import type {
    PaletteColors,
    SemanticColorModePair,
    SemanticPalettePairFor,
    SemanticPalettePairsOf,
} from "../types";

export const SEMANTIC_PALETTE_PAIRS = {
    backgroundBrandActive: { light: "neutralBlack", dark: "primaryLightGray" },
    backgroundBrandDisabled: { light: "neutral150", dark: "neutral650" },
    backgroundBrandHover: { light: "primaryDarkGray", dark: "primaryLightGray" },
    backgroundBrandStrong: { light: "primaryDarkGray", dark: "primaryGray" },
    backgroundBrandSubtle: { light: "primaryLightGray", dark: "neutral800" },
    backgroundBrand: { light: "primaryBlack", dark: "primaryGray" },
    backgroundDiscoveryHover: { light: "purple700", dark: "purple300" },
    backgroundDiscoverySubtle: { light: "purple100", dark: "purple900" },
    backgroundDiscovery: { light: "purple500", dark: "purple500" },
    backgroundErrorHover: { light: "red700", dark: "red300" },
    backgroundErrorSubtle: { light: "red100", dark: "red900" },
    backgroundError: { light: "red500", dark: "red500" },
    backgroundInfoHover: { light: "blue700", dark: "blue300" },
    backgroundInfoSubtle: { light: "blue100", dark: "blue900" },
    backgroundInfo: { light: "blue500", dark: "blue500" },
    backgroundPrimaryActive: { light: "neutral150", dark: "neutral800" },
    backgroundPrimaryHover: { light: "neutral100", dark: "neutral850" },
    backgroundPrimary: { light: "neutralWhite", dark: "neutral900" },
    backgroundSuccessHover: { light: "green700", dark: "green300" },
    backgroundSuccessSubtle: { light: "green100", dark: "green900" },
    backgroundSuccess: { light: "green500", dark: "green500" },
    backgroundSurfaceActive: { light: "neutral150", dark: "neutral700" },
    backgroundSurfaceDisabled: { light: "neutral150", dark: "neutral850" },
    backgroundSurfaceHover: { light: "neutral100", dark: "neutral750" },
    backgroundSurfaceSelected: { light: "neutral200", dark: "neutral650" },
    backgroundSurface: { light: "neutralWhite", dark: "neutral800" },
    backgroundWarningHover: { light: "yellow500", dark: "yellow200" },
    backgroundWarningSubtle: { light: "yellow100", dark: "yellow900" },
    backgroundWarning: { light: "yellow300", dark: "yellow300" },
    borderDefault: { light: "neutral300", dark: "neutral650" },
    borderDisabled: { light: "neutral250", dark: "neutral700" },
    borderDiscovery: { light: "purple500", dark: "purple500" },
    borderError: { light: "red500", dark: "red500" },
    borderFocus: { light: "neutral750", dark: "neutral350" },
    borderHover: { light: "neutral500", dark: "neutral500" },
    borderInfo: { light: "blue500", dark: "blue500" },
    borderStrong: { light: "neutral450", dark: "neutral550" },
    borderSubtle: { light: "neutral200", dark: "neutral750" },
    borderSuccess: { light: "green500", dark: "green500" },
    borderWarning: { light: "yellow300", dark: "yellow300" },
    foregroundBrandStrong: { light: "neutralBlack", dark: "primaryLightGray" },
    foregroundBrand: { light: "primaryBlack", dark: "primaryGray" },
    foregroundDisabled: { light: "neutral400", dark: "neutral600" },
    foregroundDiscovery: { light: "purple700", dark: "purple200" },
    foregroundError: { light: "red700", dark: "red200" },
    foregroundInfo: { light: "blue700", dark: "blue200" },
    foregroundInversed: { light: "neutralWhite", dark: "primaryBlack" },
    foregroundLinkActive: { light: "blue900", dark: "blue200" },
    foregroundLinkHover: { light: "blue800", dark: "blue300" },
    foregroundLinkVisited: { light: "blue500", dark: "blue100" },
    foregroundLink: { light: "blue700", dark: "blue400" },
    foregroundOnBrand: { light: "neutralWhite", dark: "neutralBlack" },
    foregroundOnDiscovery: { light: "neutralWhite", dark: "neutralBlack" },
    foregroundOnError: { light: "neutralWhite", dark: "neutralBlack" },
    foregroundOnInfo: { light: "neutralWhite", dark: "neutralBlack" },
    foregroundOnSuccess: { light: "neutralWhite", dark: "neutralBlack" },
    foregroundOnWarning: { light: "neutralWhite", dark: "neutralBlack" },
    foregroundPlaceholder: { light: "neutral450", dark: "neutral500" },
    foregroundPrimaryHover: { light: "neutralBlack", dark: "neutral100" },
    foregroundPrimary: { light: "primaryBlack", dark: "neutralWhite" },
    foregroundSecondary: { light: "neutral600", dark: "neutral350" },
    foregroundSuccess: { light: "green700", dark: "green200" },
    foregroundTertiary: { light: "neutral500", dark: "neutral450" },
    foregroundWarning: { light: "yellow700", dark: "yellow200" },
    surfaceElevated: { light: "neutralWhite", dark: "neutral700" },
    surfaceInverse: { light: "neutralBlack", dark: "neutralWhite" },
    surfacePopover: { light: "neutralWhite", dark: "neutral750" },
    surfaceSunken: { light: "neutral150", dark: "neutral800" },
    surfaceTooltip: { light: "neutral750", dark: "neutral300" },
} as const satisfies SemanticPalettePairsOf<PaletteColors>;

export type SemanticPaletteName = keyof typeof SEMANTIC_PALETTE_PAIRS;

/** Legacy row shape: [aliasTail, lightKey, darkKey | "__RGBA__"] (surfaceOverlay only) */
export const SEMANTIC_COLOR_ROWS = [
    ...(Object.entries(SEMANTIC_PALETTE_PAIRS) as [
        SemanticPaletteName,
        SemanticPalettePairFor<PaletteColors>,
    ][]).map(([name, { light, dark }]) => [name, light, dark] as const),
    ["surfaceOverlay", "__RGBA__", "__RGBA__"] as const,
] as const;

export type SemanticColorName = SemanticPaletteName | "surfaceOverlay";

/** Foundation surfaceOverlay (Overlay and Modal) — raw RGBA */
export const surfaceOverlayRgba = {
    light: "rgba(0, 0, 0, 0.2)",
    dark: "rgba(0, 0, 0, 0.6)",
} as const;

function buildSemanticColors(): Record<SemanticColorName, SemanticColorModePair> {
    const out = {} as Record<SemanticColorName, SemanticColorModePair>;
    for (const name of Object.keys(SEMANTIC_PALETTE_PAIRS) as SemanticPaletteName[]) {
        const { light, dark } = SEMANTIC_PALETTE_PAIRS[name];
        out[name] = {
            light: paletteColorCssVar(light),
            dark: paletteColorCssVar(dark),
        };
    }
    out.surfaceOverlay = { light: surfaceOverlayRgba.light, dark: surfaceOverlayRgba.dark };
    return out;
}

/** Semantic colors — values are CSS var(--refineui-color-*) or rgba(...) */
export const semanticColors: Record<SemanticColorName, SemanticColorModePair> = buildSemanticColors();
