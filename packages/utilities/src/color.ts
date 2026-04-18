export type SemanticColorTokenRef<TName extends string = string> = Readonly<{
    type: "semantic";
    name: TName;
}>;

export type PaletteColorTokenRef<TName extends string = string> = Readonly<{
    type: "palette";
    name: TName;
}>;

export type ColorTokenRef = SemanticColorTokenRef | PaletteColorTokenRef;
export type ColorTokenValue = ColorTokenRef | string;

export function toKebab(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/([a-zA-Z])(\d)/g, "$1-$2")
        .toLowerCase();
}

export function semanticColorToken<TName extends string>(name: TName): SemanticColorTokenRef<TName> {
    return { type: "semantic", name };
}

export function paletteColorToken<TName extends string>(name: TName): PaletteColorTokenRef<TName> {
    return { type: "palette", name };
}

export function semanticColorCssVar(name: string): string {
    return `var(--refineui-color-alias-${toKebab(name)})`;
}

export function paletteColorCssVar(name: string): string {
    return `var(--refineui-color-${toKebab(name)})`;
}

export function resolveColorToken(token: ColorTokenRef): string {
    return token.type === "semantic" ? semanticColorCssVar(token.name) : paletteColorCssVar(token.name);
}

export function isColorTokenRef(value: unknown): value is ColorTokenRef {
    if (typeof value !== "object" || value === null) return false;
    const candidate = value as Partial<ColorTokenRef>;
    if (candidate.type !== "semantic" && candidate.type !== "palette") return false;
    return typeof candidate.name === "string";
}

export function resolveColorTokenValue<T extends string>(value: T): T;
export function resolveColorTokenValue(value: ColorTokenRef): string;
export function resolveColorTokenValue(value: ColorTokenValue): string {
    return typeof value === "string" ? value : resolveColorToken(value);
}

/**
 * hex → rgba 변환 (palette 색상 등)
 */
export function hexToRgba(hex: string, alpha: number): string {
    const h = hex.replace("#", "");
    const r =
        h.length === 3
            ? parseInt(h[0] + h[0], 16)
            : parseInt(h.slice(0, 2), 16);
    const g =
        h.length === 3
            ? parseInt(h[1] + h[1], 16)
            : parseInt(h.slice(2, 4), 16);
    const b =
        h.length === 3
            ? parseInt(h[2] + h[2], 16)
            : parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** dimension(x y blur spread) + color로 box-shadow 문자열 생성 */
export function shadowWithColor(
    keyDim: string,
    ambientDim: string,
    keyColor: string,
    ambientColor: string
): string {
    return `${keyDim} ${keyColor}, ${ambientDim} ${ambientColor}`;
}
