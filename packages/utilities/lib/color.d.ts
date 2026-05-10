type SemanticColorTokenRef<TName extends string = string> = Readonly<{
    type: "semantic";
    name: TName;
}>;
type PaletteColorTokenRef<TName extends string = string> = Readonly<{
    type: "palette";
    name: TName;
}>;
type ColorTokenRef = SemanticColorTokenRef | PaletteColorTokenRef;
type ColorTokenValue = ColorTokenRef | string;
declare function toKebab(str: string): string;
declare function semanticColorToken<TName extends string>(name: TName): SemanticColorTokenRef<TName>;
declare function paletteColorToken<TName extends string>(name: TName): PaletteColorTokenRef<TName>;
declare function semanticColorCssVar(name: string): string;
declare function paletteColorCssVar(name: string): string;
declare function resolveColorToken(token: ColorTokenRef): string;
declare function isColorTokenRef(value: unknown): value is ColorTokenRef;
declare function resolveColorTokenValue<T extends string>(value: T): T;
declare function resolveColorTokenValue(value: ColorTokenRef): string;
/**
 * Convert hex to rgba (e.g. palette colors)
 */
declare function hexToRgba(hex: string, alpha: number): string;
/** Build a box-shadow string from dimensions (x y blur spread) + colors */
declare function shadowWithColor(keyDim: string, ambientDim: string, keyColor: string, ambientColor: string): string;

export { type ColorTokenRef, type ColorTokenValue, type PaletteColorTokenRef, type SemanticColorTokenRef, hexToRgba, isColorTokenRef, paletteColorCssVar, paletteColorToken, resolveColorToken, resolveColorTokenValue, semanticColorCssVar, semanticColorToken, shadowWithColor, toKebab };
