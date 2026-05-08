import { hexToRgba } from "@refineui/utilities";
import { colors } from "./colors";

/** Dialog / Drawer 스크rim — 요청 스펙 알파 ~0.25 (primaryBlack) */
export const overlays = {
    backdrop: hexToRgba(colors.neutralBlack, 0.25),
    /** `data-theme="dark"` Ghost 버튼 호버 — `refineui.css` */
    ghostButtonHoverDark: "rgba(255, 255, 255, 0.08)",
} as const;
