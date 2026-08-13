import { toKebab } from "./color";

export type SemanticTextTokenRef<TName extends string = string> = Readonly<{
    type: "semantic-text";
    name: TName;
}>;

export type FoundationTypographyTokenRef<TName extends string = string> = Readonly<{
    type: "foundation-typography";
    name: TName;
}>;

export function semanticTextToken<TName extends string>(name: TName): SemanticTextTokenRef<TName> {
    return { type: "semantic-text", name };
}

export function foundationTypographyToken<TName extends string>(
    name: TName,
): FoundationTypographyTokenRef<TName> {
    return { type: "foundation-typography", name };
}

/** Tailwind `@utility refineui-typo-*` class for a Foundation typography key (`body2`, `caption1`, …). */
export function foundationTypographyUtilityClass(foundationKey: string): string {
    return `refineui-typo-${toKebab(foundationKey)}`;
}

export function isSemanticTextTokenRef(value: unknown): value is SemanticTextTokenRef {
    if (typeof value !== "object" || value === null) return false;
    const candidate = value as Partial<SemanticTextTokenRef>;
    return candidate.type === "semantic-text" && typeof candidate.name === "string";
}
