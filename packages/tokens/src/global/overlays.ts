import { colors } from "./colors";

function hexToRgba(hex: string, alpha: number): string {
    const h = hex.replace("#", "");
    const r = h.length === 3 ? Number.parseInt(h[0]! + h[0]!, 16) : Number.parseInt(h.slice(0, 2), 16);
    const g = h.length === 3 ? Number.parseInt(h[1]! + h[1]!, 16) : Number.parseInt(h.slice(2, 4), 16);
    const b = h.length === 3 ? Number.parseInt(h[2]! + h[2]!, 16) : Number.parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Dialog / Drawer 스크rim — 요청 스펙 알파 ~0.25 (primaryBlack) */
export const overlays = {
    backdrop: hexToRgba(colors.neutralBlack, 0.25),
    /** `data-theme="dark"` Ghost 버튼 호버 — `refineui.css` */
    ghostButtonHoverDark: "rgba(255, 255, 255, 0.08)",
} as const;
