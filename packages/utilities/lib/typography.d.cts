type SemanticTextTokenRef<TName extends string = string> = Readonly<{
    type: "semantic-text";
    name: TName;
}>;
type FoundationTypographyTokenRef<TName extends string = string> = Readonly<{
    type: "foundation-typography";
    name: TName;
}>;
declare function semanticTextToken<TName extends string>(name: TName): SemanticTextTokenRef<TName>;
declare function foundationTypographyToken<TName extends string>(name: TName): FoundationTypographyTokenRef<TName>;
/** Tailwind `@utility refineui-typo-*` class for a Foundation typography key (`body2`, `caption1`, …). */
declare function foundationTypographyUtilityClass(foundationKey: string): string;
declare function isSemanticTextTokenRef(value: unknown): value is SemanticTextTokenRef;

export { type FoundationTypographyTokenRef, type SemanticTextTokenRef, foundationTypographyToken, foundationTypographyUtilityClass, isSemanticTextTokenRef, semanticTextToken };
