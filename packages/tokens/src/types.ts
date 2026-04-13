/** Foundation Alias/Color — Light·Dark별 CSS 값 (`var(--refineui-color-*)` 등) */
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
 * Foundation Alias/Color — Light·Dark가 각각 가리키는 팔레트 토큰 이름.
 * @typeParam P — 팔레트 맵 타입(기본 구현은 `PaletteColors` / `global/colors`와 동기)
 */
export type SemanticPalettePairFor<P extends Record<string, string>> = {
    light: keyof P;
    dark: keyof P;
};

/** Alias 이름 → Light/Dark 페어 전체 맵 */
export type SemanticPalettePairsOf<P extends Record<string, string>> = Readonly<
    Record<string, SemanticPalettePairFor<P>>
>;

/** `PaletteColors` 전용 단일 Alias 페어 (구현에서 가장 많이 씀) */
export type SemanticPalettePair = SemanticPalettePairFor<PaletteColors>;

/**
 * Shadow color (Figma Variables — Lighter ~ Darker, Key/Ambient별)
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
 * Key + Ambient shadow pair (Material Design 3 / Figma Variables 구조)
 * - key: 방향성 있는 그림자 (y offset, 작은 blur)
 * - ambient: 부드럽게 퍼지는 그림자 (큰 blur)
 */
export type ShadowLevel = {
    key: string;
    ambient: string;
};

/**
 * Design tokens for shadow levels (Lighter ~ Darker, key + ambient)
 * 사용: box-shadow: ${key}, ${ambient}
 */
export type ShadowTokens = {
    shadow2Lighter: ShadowLevel;
    shadow2Light: ShadowLevel;
    shadow2: ShadowLevel;
    shadow2Dark: ShadowLevel;
    shadow2Darker: ShadowLevel;
    shadow4Lighter: ShadowLevel;
    shadow4Light: ShadowLevel;
    shadow4: ShadowLevel;
    shadow4Dark: ShadowLevel;
    shadow4Darker: ShadowLevel;
    shadow8Lighter: ShadowLevel;
    shadow8Light: ShadowLevel;
    shadow8: ShadowLevel;
    shadow8Dark: ShadowLevel;
    shadow8Darker: ShadowLevel;
    shadow16Lighter: ShadowLevel;
    shadow16Light: ShadowLevel;
    shadow16: ShadowLevel;
    shadow16Dark: ShadowLevel;
    shadow16Darker: ShadowLevel;
    shadow24Lighter: ShadowLevel;
    shadow24Light: ShadowLevel;
    shadow24: ShadowLevel;
    shadow24Dark: ShadowLevel;
    shadow24Darker: ShadowLevel;
    shadow32Lighter: ShadowLevel;
    shadow32Light: ShadowLevel;
    shadow32: ShadowLevel;
    shadow32Dark: ShadowLevel;
    shadow32Darker: ShadowLevel;
    shadow64Lighter: ShadowLevel;
    shadow64Light: ShadowLevel;
    shadow64: ShadowLevel;
    shadow64Dark: ShadowLevel;
    shadow64Darker: ShadowLevel;
};

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
    sizeXXSmall: string;
    sizeXSmall: string;
    sizeSmall: string;
    sizeMedium: string;
    sizeLarge: string;
    sizeXLarge: string;
    sizeXXLarge: string;
    sizeXXXLarge: string;
};

/** 모션·스케일 문자열 — CSS `transform` 등과 공유 */
export type MotionTokens = {
    dialogEnterScale: string;
    buttonActiveScale: string;
    sliderThumbHoverScale: string;
};

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