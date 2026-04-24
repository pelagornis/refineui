import { CSSProperties } from 'react';

declare const motionDurations: {
    readonly instant: "0ms";
    readonly fast: "150ms";
    readonly normal: "180ms";
    readonly slow: "240ms";
    readonly toast: "320ms";
};
declare const motionEasings: {
    readonly standard: "cubic-bezier(0.2, 0, 0, 1)";
    readonly emphasized: "cubic-bezier(0.16, 1, 0.3, 1)";
    readonly linear: "linear";
};
type MotionDuration = keyof typeof motionDurations;
type MotionEasing = keyof typeof motionEasings;
type MotionPresetName = "fadeIn" | "fadeOut" | "fadeInUp" | "fadeInDown" | "scaleIn" | "scaleOut";
type MotionPreset = Readonly<{
    keyframes: string;
    duration: MotionDuration;
    easing: MotionEasing;
    fillMode?: CSSProperties["animationFillMode"];
}>;
declare const motionPresets: Readonly<Record<MotionPresetName, MotionPreset>>;
type AnimationStyleOptions = Readonly<{
    preset: MotionPresetName;
    duration?: MotionDuration | string;
    easing?: MotionEasing | string;
    delayMs?: number;
    iterationCount?: CSSProperties["animationIterationCount"];
    direction?: CSSProperties["animationDirection"];
    playState?: CSSProperties["animationPlayState"];
    fillMode?: CSSProperties["animationFillMode"];
    reduceMotion?: boolean;
}>;
declare function createAnimationStyle(options: AnimationStyleOptions): CSSProperties;
type TransitionStyleOptions = Readonly<{
    properties: string | readonly string[];
    duration?: MotionDuration | string;
    easing?: MotionEasing | string;
    delayMs?: number;
    reduceMotion?: boolean;
}>;
declare function createTransitionStyle(options: TransitionStyleOptions): CSSProperties;
declare function getReducedMotionQuery(): string;
/** "180ms" -> 180 */
declare function motionMsToNumber(value: string): number;
/**
 * Optional CSS you can include once in a global stylesheet.
 * If you use `createAnimationStyle`, ensure these keyframes exist.
 */
declare const motionKeyframesCss = "\n@keyframes refineui-fade-in {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n@keyframes refineui-fade-out {\n  from { opacity: 1; }\n  to { opacity: 0; }\n}\n@keyframes refineui-fade-in-up {\n  from { opacity: 0; transform: translateY(4px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n@keyframes refineui-fade-in-down {\n  from { opacity: 0; transform: translateY(-4px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n@keyframes refineui-scale-in {\n  from { opacity: 0; transform: scale(0.98); }\n  to { opacity: 1; transform: scale(1); }\n}\n@keyframes refineui-scale-out {\n  from { opacity: 1; transform: scale(1); }\n  to { opacity: 0; transform: scale(0.98); }\n}\n";

export { type AnimationStyleOptions, type MotionDuration, type MotionEasing, type MotionPresetName, type TransitionStyleOptions, createAnimationStyle, createTransitionStyle, getReducedMotionQuery, motionDurations, motionEasings, motionKeyframesCss, motionMsToNumber, motionPresets };
