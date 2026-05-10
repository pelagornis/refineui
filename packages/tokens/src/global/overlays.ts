import { hexToRgba } from "@refineui/utilities";
import { colors } from "./colors";

/** Dialog / Drawer scrim — spec alpha ~0.25 (primaryBlack) */
export const overlays = {
    backdrop: hexToRgba(colors.neutralBlack, 0.25),
    /** `data-theme="dark"` Ghost button hover — `refineui.css` */
    ghostButtonHoverDark: "rgba(255, 255, 255, 0.08)",
} as const;
