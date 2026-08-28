import { motion } from "../global/motion";
import type { SemanticInteractionTokens } from "../types";

/**
 * Semantic motion roles — meaning layer over Foundation `motion`.
 *
 * UI, `@refineui/utilities` CSS helpers, and `refineui.css` should prefer these
 * role names (fast / press / panel…), not raw Foundation steps.
 *
 * Flow: Foundation `motion` → `semanticInteraction` → CSS `--refineui-motion-*`
 *       (and component JS that reads resolved ms strings).
 */
export const semanticInteraction: SemanticInteractionTokens = {
    duration: {
        instant: motion.duration.duration0,
        fast: motion.duration.duration150,
        normal: motion.duration.duration180,
        medium: motion.duration.duration200,
        slow: motion.duration.duration240,
        overlay: motion.duration.duration280,
        panel: motion.duration.duration320,
        accordionPanel: motion.duration.duration380,
        accordionContent: motion.duration.duration260,
        toastEnter: motion.duration.duration280,
        toastLeave: motion.duration.duration200,
        skeleton: motion.duration.duration1500,
        spinner: motion.duration.duration800,
    },
    easing: {
        standard: motion.easing.easingStandard,
        emphasized: motion.easing.easingEmphasized,
        panel: motion.easing.easingPanel,
        content: motion.easing.easingContent,
        linear: motion.easing.easingLinear,
        easeOut: motion.easing.easingEaseOut,
        easeInOut: motion.easing.easingEaseInOut,
    },
    scale: {
        /** Dialog / modal enter under-scale */
        enter: motion.scale.scale96,
        /** Pressed control squash (Button, Slider thumb active, …) */
        press: motion.scale.scale98,
        /** Hover grow (Slider thumb, …) */
        hoverGrow: motion.scale.scale115,
        /** Component aliases — same Foundation steps as role keys above */
        dialogEnter: motion.scale.scale96,
        buttonActive: motion.scale.scale98,
        sliderThumbHover: motion.scale.scale115,
    },
    distance: {
        float: motion.distance.distance4,
    },
};
