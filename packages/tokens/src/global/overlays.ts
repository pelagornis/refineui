import { colors } from "./colors";

function hexToRgba(hex: string, alpha: number): string {
    const h = hex.replace("#", "");
    const r = h.length === 3 ? Number.parseInt(h[0]! + h[0]!, 16) : Number.parseInt(h.slice(0, 2), 16);
    const g = h.length === 3 ? Number.parseInt(h[1]! + h[1]!, 16) : Number.parseInt(h.slice(2, 4), 16);
    const b = h.length === 3 ? Number.parseInt(h[2]! + h[2]!, 16) : Number.parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Dialog / Drawer 스크rim — Foundation primaryBlack 계열 알파와 동등한 가독성 */
export const overlays = {
    backdrop: hexToRgba(colors.neutralBlack, 0.5),
} as const;
