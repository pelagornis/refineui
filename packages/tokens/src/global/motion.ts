import type { FoundationMotionTokens } from "../types";

/**
 * Foundation motion primitives — raw duration / easing / scale / distance steps.
 * Semantic roles live in `semantic/interaction.ts` and must reference these values
 * (do not invent ms, curves, or scales at the semantic or component layer).
 *
 * Naming: value-based keys (`duration150`, `scale98`), same idea as `foundationSize160`.
 */
export const motion: FoundationMotionTokens = {
    duration: {
        duration0: "0ms",
        duration150: "150ms",
        duration180: "180ms",
        duration200: "200ms",
        duration240: "240ms",
        duration260: "260ms",
        duration280: "280ms",
        duration320: "320ms",
        duration380: "380ms",
        duration800: "800ms",
        duration1500: "1500ms",
    },
    easing: {
        /** Material-style standard decelerate */
        easingStandard: "cubic-bezier(0.2, 0, 0, 1)",
        /** Emphasized spring-ish settle */
        easingEmphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
        /** Large panel / drawer slide */
        easingPanel: "cubic-bezier(0.32, 0.72, 0, 1)",
        /** Content cross-fade / height morph */
        easingContent: "cubic-bezier(0.4, 0, 0.2, 1)",
        easingLinear: "linear",
        easingEaseOut: "ease-out",
        easingEaseInOut: "ease-in-out",
    },
    scale: {
        scale96: "0.96",
        scale98: "0.98",
        scale115: "1.15",
    },
    distance: {
        /** Small float offset (enter / pressed nudge) — 4px */
        distance4: "4px",
    },
};
