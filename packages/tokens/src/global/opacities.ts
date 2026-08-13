/**
 * Shared opacity scale — keys follow `strokeWidth*` / `size*` prefix style.
 */
export const opacities = {
    opacityFull: "1",
    opacityDisabled: "0.5",
    /** Ghost button hover wash (dark) — same alpha as `overlays.ghostButtonHoverDark` */
    opacityGhostHover: "0.08",
} as const;
