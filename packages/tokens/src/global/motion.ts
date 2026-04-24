import type { MotionTokens } from "../types";
import { semanticInteraction } from "../semantic/interaction";

/** 다이얼로그·버튼·슬라이더 등 공통 스케일 — React 인라인·`refineui.css`와 동기 */
export const motion: MotionTokens = {
    dialogEnterScale: semanticInteraction.scale.dialogEnter,
    buttonActiveScale: semanticInteraction.scale.buttonActive,
    sliderThumbHoverScale: semanticInteraction.scale.sliderThumbHover,
};
