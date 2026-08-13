import type { CSSProperties } from "react";

export const motionDurations = {
    // Resolve via `@refineui/tokens` CSS (Foundation → semanticInteraction roles)
    instant: "var(--refineui-motion-duration-instant)",
    fast: "var(--refineui-motion-duration-fast)",
    normal: "var(--refineui-motion-duration-normal)",
    slow: "var(--refineui-motion-duration-slow)",
    toast: "var(--refineui-motion-duration-panel)",
} as const;

export const motionEasings = {
    standard: "var(--refineui-motion-easing-standard)",
    emphasized: "var(--refineui-motion-easing-emphasized)",
    linear: "var(--refineui-motion-easing-linear)",
} as const;

export type MotionDuration = keyof typeof motionDurations;
export type MotionEasing = keyof typeof motionEasings;

export type MotionPresetName =
    | "fadeIn"
    | "fadeOut"
    | "fadeInUp"
    | "fadeInDown"
    | "scaleIn"
    | "scaleOut";

type MotionPreset = Readonly<{
    keyframes: string;
    duration: MotionDuration;
    easing: MotionEasing;
    fillMode?: CSSProperties["animationFillMode"];
}>;

export const motionPresets: Readonly<Record<MotionPresetName, MotionPreset>> = {
    fadeIn: { keyframes: "refineui-fade-in", duration: "normal", easing: "standard", fillMode: "both" },
    fadeOut: { keyframes: "refineui-fade-out", duration: "normal", easing: "standard", fillMode: "both" },
    fadeInUp: { keyframes: "refineui-fade-in-up", duration: "normal", easing: "standard", fillMode: "both" },
    fadeInDown: { keyframes: "refineui-fade-in-down", duration: "normal", easing: "standard", fillMode: "both" },
    scaleIn: { keyframes: "refineui-scale-in", duration: "normal", easing: "emphasized", fillMode: "both" },
    scaleOut: { keyframes: "refineui-scale-out", duration: "normal", easing: "emphasized", fillMode: "both" },
} as const;

export type AnimationStyleOptions = Readonly<{
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

export function createAnimationStyle(options: AnimationStyleOptions): CSSProperties {
    const preset = motionPresets[options.preset];
    const duration = options.duration ?? preset.duration;
    const easing = options.easing ?? preset.easing;

    if (options.reduceMotion) {
        return {
            animationName: "none",
            animationDuration: motionDurations.instant,
            animationDelay: "0ms",
        };
    }

    return {
        animationName: preset.keyframes,
        animationDuration:
            typeof duration === "string" && duration in motionDurations
                ? motionDurations[duration as MotionDuration]
                : duration,
        animationTimingFunction:
            typeof easing === "string" && easing in motionEasings
                ? motionEasings[easing as MotionEasing]
                : easing,
        animationDelay: `${Math.max(0, options.delayMs ?? 0)}ms`,
        animationIterationCount: options.iterationCount ?? 1,
        animationDirection: options.direction ?? "normal",
        animationPlayState: options.playState ?? "running",
        animationFillMode: options.fillMode ?? preset.fillMode ?? "both",
    };
}

export type TransitionStyleOptions = Readonly<{
    properties: string | readonly string[];
    duration?: MotionDuration | string;
    easing?: MotionEasing | string;
    delayMs?: number;
    reduceMotion?: boolean;
}>;

export function createTransitionStyle(options: TransitionStyleOptions): CSSProperties {
    const duration = options.duration ?? "fast";
    const easing = options.easing ?? "standard";
    const props = (Array.isArray(options.properties) ? options.properties.join(", ") : options.properties) as string;

    if (options.reduceMotion) {
        return {
            transitionProperty: props,
            transitionDuration: motionDurations.instant,
            transitionTimingFunction: motionEasings.linear,
            transitionDelay: "0ms",
        };
    }

    return {
        transitionProperty: props,
        transitionDuration:
            typeof duration === "string" && duration in motionDurations
                ? motionDurations[duration as MotionDuration]
                : duration,
        transitionTimingFunction:
            typeof easing === "string" && easing in motionEasings
                ? motionEasings[easing as MotionEasing]
                : easing,
        transitionDelay: `${Math.max(0, options.delayMs ?? 0)}ms`,
    };
}

export function getReducedMotionQuery(): string {
    return "@media (prefers-reduced-motion: reduce)";
}

/** "180ms" -> 180 */
export function motionMsToNumber(value: string): number {
    if (value.endsWith("ms")) return Number.parseFloat(value.slice(0, -2)) || 0;
    if (value.endsWith("s")) return (Number.parseFloat(value.slice(0, -1)) || 0) * 1000;
    return Number.parseFloat(value) || 0;
}

/**
 * Optional CSS you can include once in a global stylesheet.
 * If you use `createAnimationStyle`, ensure these keyframes exist.
 */
export const motionKeyframesCss = `
@keyframes refineui-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes refineui-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes refineui-fade-in-up {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes refineui-fade-in-down {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes refineui-scale-in {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes refineui-scale-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.98); }
}
`;
