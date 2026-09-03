/** Token-local color/CSS helpers — keeps `@refineui/tokens` independent of utilities. */

export function toKebab(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .replace(/([a-zA-Z])(\d)/g, "$1-$2")
        .toLowerCase();
}

export function paletteColorCssVar(name: string): string {
    return `var(--refineui-color-${toKebab(name)})`;
}

export function semanticColorCssVar(name: string): string {
    return `var(--refineui-color-alias-${toKebab(name)})`;
}

/** Convert hex to rgba (palette colors in shadow generation). */
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
