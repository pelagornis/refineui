/** Foundation Alias/Color — Light/Dark CSS values (`var(--refineui-color-*)`, etc.) */
export type SemanticColorModePair = { light: string; dark: string };

/**
 * Design tokens for Palettet Color
 */
export type PaletteColors = {
    // Primary Color
    primaryLightGray: string;
    primaryGray: string;
    primaryDarkGray: string;
    primaryBlack: string;
    // Neutral Color
    neutralWhite: string;
    neutral100: string;
    neutral150: string;
    neutral200: string;
    neutral250: string;
    neutral300: string;
    neutral350: string;
    neutral400: string;
    neutral450: string;
    neutral500: string;
    neutral550: string;
    neutral600: string;
    neutral650: string;
    neutral700: string;
    neutral750: string;
    neutral800: string;
    neutral850: string;
    neutral900: string;
    neutral950: string;
    neutralBlack: string;
    // Red Color
    red100: string;
    red200: string;
    red300: string;
    red400: string;
    red500: string;
    red600: string;
    red700: string;
    red800: string;
    red900: string;
    red1000: string;
    // Orange Color
    orange100: string;
    orange200: string;
    orange300: string;
    orange400: string;
    orange500: string;
    orange600: string;
    orange700: string;
    orange800: string;
    orange900: string;
    orange1000: string;
    // Yellow Color
    yellow100: string;
    yellow200: string;
    yellow300: string;
    yellow400: string;
    yellow500: string;
    yellow600: string;
    yellow700: string;
    yellow800: string;
    yellow900: string;
    yellow1000: string;
    // Lime Color
    lime100: string;
    lime200: string;
    lime300: string;
    lime400: string;
    lime500: string;
    lime600: string;
    lime700: string;
    lime800: string;
    lime900: string;
    lime1000: string;
    //Green Color
    green100: string;
    green200: string;
    green300: string;
    green400: string;
    green500: string;
    green600: string;
    green700: string;
    green800: string;
    green900: string;
    green1000: string;
    // Teal Color
    teal100: string;
    teal200: string;
    teal300: string;
    teal400: string;
    teal500: string;
    teal600: string;
    teal700: string;
    teal800: string;
    teal900: string;
    teal1000: string;
    // Blue Color
    blue100: string;
    blue200: string;
    blue300: string;
    blue400: string;
    blue500: string;
    blue600: string;
    blue700: string;
    blue800: string;
    blue900: string;
    blue1000: string;
    // Purple Color
    purple100: string;
    purple200: string;
    purple300: string;
    purple400: string;
    purple500: string;
    purple600: string;
    purple700: string;
    purple800: string;
    purple900: string;
    purple1000: string;
    // Magenta Color
    magenta100: string;
    magenta200: string;
    magenta300: string;
    magenta400: string;
    magenta500: string;
    magenta600: string;
    magenta700: string;
    magenta800: string;
    magenta900: string;
    magenta1000: string;
};

/**
 * Foundation Alias/Color — palette token names for Light and Dark.
 * @typeParam P — palette map type (defaults align with `PaletteColors` / `global/colors`)
 */
export type SemanticPalettePairFor<P extends Record<string, string>> = {
    light: keyof P;
    dark: keyof P;
};

/** Alias name → full map of Light/Dark pairs */
export type SemanticPalettePairsOf<P extends Record<string, string>> = Readonly<
    Record<string, SemanticPalettePairFor<P>>
>;

/** Single alias pair for `PaletteColors` (most common in implementations) */
export type SemanticPalettePair = SemanticPalettePairFor<PaletteColors>;

/**
 * Shadow color (Figma Variables — Lighter ~ Darker, per Key/Ambient)
 * Foundation: ambient lighter, ambient light, ambient, ambient dark, ambient darker
 */
export type ShadowColorTokens = {
    shadowColorKeyLighter: string;
    shadowColorKeyLight: string;
    shadowColorKey: string;
    shadowColorKeyDark: string;
    shadowColorKeyDarker: string;
    shadowColorAmbientLighter: string;
    shadowColorAmbientLight: string;
    shadowColorAmbient: string;
    shadowColorAmbientDark: string;
    shadowColorAmbientDarker: string;
};

/**
 * Key + Ambient shadow pair (Material Design 3 / Figma Variables shape)
 * - key: directional shadow (y offset, smaller blur)
 * - ambient: soft diffuse shadow (larger blur)
 */
export type ShadowLevel = {
    key: string;
    ambient: string;
};

/**
 * Elevation shadows — 1:1 with Figma `Elevation/Light/Shadow N` · `Elevation/Dark/Shadow N`.
 * Two tokens per step only (`*Light` / `*Dark`); no intermediate `shadow2` / Lighter / Darker expansion.
 * Color ramps live in `shadowColors` (`Global/Shadows/Key *`, `Ambient *`).
 * Usage: box-shadow: ${toBoxShadow(level)}
 */
export type ShadowTokens = {
    shadow2Light: ShadowLevel;
    shadow2Dark: ShadowLevel;
    shadow4Light: ShadowLevel;
    shadow4Dark: ShadowLevel;
    shadow8Light: ShadowLevel;
    shadow8Dark: ShadowLevel;
    shadow16Light: ShadowLevel;
    shadow16Dark: ShadowLevel;
    shadow24Light: ShadowLevel;
    shadow24Dark: ShadowLevel;
    shadow32Light: ShadowLevel;
    shadow32Dark: ShadowLevel;
    shadow64Light: ShadowLevel;
    shadow64Dark: ShadowLevel;
};

/**
 * Semantic elevation shadows — `ShadowLevel` per UI theme (Light/Dark).
 * Foundation: Elevation/Light and Elevation/Dark map to `shadowNLight` / `shadowNDark` globals.
 */
export type SemanticShadowElevationPair = {
    light: ShadowLevel;
    dark: ShadowLevel;
};

/** Semantic elevation steps (Figma Shadow 2 / 4 / … / 64) */
export type SemanticShadowElevationName =
    | "shadow2"
    | "shadow4"
    | "shadow8"
    | "shadow16"
    | "shadow24"
    | "shadow32"
    | "shadow64";

/** Semantic elevation name → per-theme ShadowLevel (`semanticShadows`) */
export type SemanticShadowElevationTokens = Record<SemanticShadowElevationName, SemanticShadowElevationPair>;

/**
 * Design tokens for stroke width
 */
export type StrokeWidthTokens = {
    strokeWidthNone: string;
    strokeWidthHairline: string;
    strokeWidthThin: string;
    strokeWidthThick: string;
    strokeWidthThicker: string;
    strokeWidthThickest: string;
};

/**
 * Design tokens for border radius
 */
export type BorderRadiusTokens = {
    roundedNone: string;
    roundedXSmall: string;
    roundedSmall: string;
    roundedMedium: string;
    roundedLarge: string;
    roundedXLarge: string;
    roundedXXLarge: string;
    roundedCircle: string;
};

/**
 * Design tokens for spacing size
 */
export type SpacingTokens = {
    sizeNone: string;
    sizeXXXSmall: string;
    sizeXXSmall: string;
    sizeXSmall: string;
    sizeSmall: string;
    sizeMedium: string;
    sizeLarge: string;
    sizeXLarge: string;
    sizeXXLarge: string;
    sizeXXXLarge: string;
};

/**
 * Foundation motion primitives (`global/motion.ts`).
 * Value-based steps only — no UI role names.
 */
export type FoundationMotionTokens = {
    duration: {
        duration0: string;
        duration150: string;
        duration180: string;
        duration200: string;
        duration240: string;
        duration260: string;
        duration280: string;
        duration320: string;
        duration380: string;
        duration800: string;
        duration1500: string;
    };
    easing: {
        easingStandard: string;
        easingEmphasized: string;
        easingPanel: string;
        easingContent: string;
        easingLinear: string;
        easingEaseOut: string;
        easingEaseInOut: string;
    };
    scale: {
        scale96: string;
        scale98: string;
        scale115: string;
    };
    distance: {
        distance4: string;
    };
};

/**
 * Semantic motion roles (`semantic/interaction.ts`) — resolved Foundation strings.
 * Prefer role keys (`press`, `fast`, `panel`) in new code; component scale aliases
 * (`buttonActive`, …) mirror the same Foundation steps for existing CSS vars.
 */
export type SemanticInteractionTokens = {
    duration: {
        instant: string;
        fast: string;
        normal: string;
        medium: string;
        slow: string;
        overlay: string;
        panel: string;
        accordionPanel: string;
        accordionContent: string;
        skeleton: string;
        spinner: string;
    };
    easing: {
        standard: string;
        emphasized: string;
        panel: string;
        content: string;
        linear: string;
        easeOut: string;
        easeInOut: string;
    };
    scale: {
        enter: string;
        press: string;
        hoverGrow: string;
        dialogEnter: string;
        buttonActive: string;
        sliderThumbHover: string;
    };
    distance: {
        float: string;
    };
};

/** @deprecated Use `FoundationMotionTokens` — kept for older imports. */
export type MotionTokens = FoundationMotionTokens;

/**
 * Design tokens for font
 */

export type FontSizeTokens = {
  fontSize100: string;
  fontSize200: string;
  fontSize300: string;
  fontSize400: string;
  fontSize500: string;
  fontSize600: string;
  fontSize700: string;
  fontSize800: string;
  fontSize900: string;
  fontSize1000: string;
};

export type LineHeightTokens = {
  lineHeight100: string;
  lineHeight200: string;
  lineHeight300: string;
  lineHeight400: string;
  lineHeight500: string;
  lineHeight600: string;
  lineHeight700: string;
  lineHeight800: string;
  lineHeight900: string;
  lineHeight1000: string;
};

export type FontWeightTokens = {
  fontWeightRegular: string;
  fontWeightMedium: string;
  fontWeightSemibold: string;
  fontWeightBold: string;
  fontWeightHeavy: string;
};

export type TextAlignment =
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'unset'
  | 'center'
  | 'end'
  | 'start'
  | 'justify'
  | 'left'
  | 'match-parent'
  | 'right';

export type TextAlignments = {
  start: TextAlignment;
  center: TextAlignment;
  end: TextAlignment;
  justify: TextAlignment;
};

export type FontFamilyTokens = {
  fontFamily: string;
};

export type TypographyStyle = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
};

/**
 * Design tokens for typography
 */

export type TypographyStyles = {
  heading1: TypographyStyle;
  heading2: TypographyStyle;
  heading3: TypographyStyle;
  heading4: TypographyStyle;
  title1: TypographyStyle;
  title2: TypographyStyle;
  title3: TypographyStyle;
  subTitle1: TypographyStyle;
  subTitle2: TypographyStyle;
  body1: TypographyStyle;
  body2: TypographyStyle;
  body3: TypographyStyle;
  body4: TypographyStyle;
  caption1: TypographyStyle;
  caption2: TypographyStyle;
  caption3: TypographyStyle;
};

/**
 * Design tokens for z-index groups and levels
 */
export type ZIndexTokens = {
  zIndexBackground?: string;
  zIndexContent?: string;
  zIndexOverlay?: string;
  zIndexPopup?: string;
  zIndexMessages?: string;
  zIndexFloating?: string;
  zIndexPriority?: string;
  zIndexDebug?: string;
};

export type Theme = FontSizeTokens &
    FontFamilyTokens &
    FontWeightTokens &
    LineHeightTokens &
    PaletteColors &
    ShadowColorTokens &
    ShadowTokens &
    StrokeWidthTokens &
    BorderRadiusTokens &
    SpacingTokens &
    TypographyStyles &
    ZIndexTokens;
