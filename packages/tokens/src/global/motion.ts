import type { MotionTokens } from "../types";
import { semanticInteraction } from "../semantic/interaction";

/** Shared scales for dialog, button, slider, etc. — synced with React inline styles and `refineui.css` */
export const motion: MotionTokens = {
    dialogEnterScale: semanticInteraction.scale.dialogEnter,
    buttonActiveScale: semanticInteraction.scale.buttonActive,
    sliderThumbHoverScale: semanticInteraction.scale.sliderThumbHover,
};
