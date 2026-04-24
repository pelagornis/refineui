import type { SemanticInteractionTokens } from "../types";

/**
 * Foundation Alias/Interaction — durations, easing, scale, offsets.
 * React component motion and `refineui.css` should reference this map.
 */
export const semanticInteraction: SemanticInteractionTokens = {
    duration: {
        instant: "0ms",
        fast: "150ms",
        normal: "180ms",
        medium: "200ms",
        slow: "240ms",
        overlay: "280ms",
        panel: "320ms",
        accordionPanel: "380ms",
        accordionContent: "260ms",
        skeleton: "1500ms",
        spinner: "800ms",
    },
    easing: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        emphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
        panel: "cubic-bezier(0.32, 0.72, 0, 1)",
        content: "cubic-bezier(0.4, 0, 0.2, 1)",
        linear: "linear",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
    },
    scale: {
        dialogEnter: "0.96",
        buttonActive: "0.98",
        sliderThumbHover: "1.15",
    },
    distance: {
        float: "4px",
    },
};
