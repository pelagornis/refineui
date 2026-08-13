import { opacities } from "./opacities";

/**
 * Overlay helpers (static snapshots for JS).
 * In CSS, `--refineui-overlay-backdrop` tracks `var(--refineui-color-alias-surface-overlay)`.
 */
export const overlays = {
    /** Light-mode scrim snapshot — keep in sync with `surfaceOverlayRgba.light` */
    backdrop: "rgba(0, 0, 0, 0.2)",
    /** Dark Ghost button hover */
    ghostButtonHoverDark: `rgba(255, 255, 255, ${opacities.opacityGhostHover})`,
} as const;
