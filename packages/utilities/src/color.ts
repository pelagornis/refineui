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
