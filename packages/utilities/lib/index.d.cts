import * as React from 'react';
import { CSSProperties, Ref, ReactNode, ReactElement } from 'react';

declare const motionDurations: {
    readonly instant: "var(--refineui-motion-duration-instant)";
    readonly fast: "var(--refineui-motion-duration-fast)";
    readonly normal: "var(--refineui-motion-duration-normal)";
    readonly slow: "var(--refineui-motion-duration-slow)";
    readonly toast: "var(--refineui-motion-duration-panel)";
};
declare const motionEasings: {
    readonly standard: "var(--refineui-motion-easing-standard)";
    readonly emphasized: "var(--refineui-motion-easing-emphasized)";
    readonly linear: "var(--refineui-motion-easing-linear)";
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

type SemanticColorTokenRef<TName extends string = string> = Readonly<{
    type: "semantic";
    name: TName;
}>;
type PaletteColorTokenRef<TName extends string = string> = Readonly<{
    type: "palette";
    name: TName;
}>;
type ColorTokenRef = SemanticColorTokenRef | PaletteColorTokenRef;
type ColorTokenValue = ColorTokenRef | string;
declare function toKebab(str: string): string;
declare function semanticColorToken<TName extends string>(name: TName): SemanticColorTokenRef<TName>;
declare function paletteColorToken<TName extends string>(name: TName): PaletteColorTokenRef<TName>;
declare function semanticColorCssVar(name: string): string;
declare function paletteColorCssVar(name: string): string;
declare function resolveColorToken(token: ColorTokenRef): string;
declare function isColorTokenRef(value: unknown): value is ColorTokenRef;
declare function resolveColorTokenValue<T extends string>(value: T): T;
declare function resolveColorTokenValue(value: ColorTokenRef): string;
/**
 * Convert hex to rgba (e.g. palette colors)
 */
declare function hexToRgba(hex: string, alpha: number): string;
/** Build a box-shadow string from dimensions (x y blur spread) + colors */
declare function shadowWithColor(keyDim: string, ambientDim: string, keyColor: string, ambientColor: string): string;

type Booleanish = boolean | "true" | "false";
declare const dataAttr: (guard: boolean | undefined) => "" | undefined;
declare const ariaAttr: (guard: boolean | undefined) => Booleanish | undefined;
type DataAttr = {
    [key in `data-${string}`]?: string | undefined;
};
type WithoutRef<T> = Omit<T, "ref">;
declare const elementProps: (props: React.HTMLAttributes<HTMLElement> & DataAttr) => WithoutRef<React.HTMLAttributes<HTMLElement>>;
declare const inputProps: (props: React.InputHTMLAttributes<HTMLInputElement> & DataAttr) => WithoutRef<React.InputHTMLAttributes<HTMLInputElement>>;
declare const labelProps: (props: React.LabelHTMLAttributes<HTMLLabelElement> & DataAttr) => WithoutRef<React.LabelHTMLAttributes<HTMLLabelElement>>;
declare const buttonProps: (props: React.ButtonHTMLAttributes<HTMLButtonElement> & DataAttr) => WithoutRef<React.ButtonHTMLAttributes<HTMLButtonElement>>;
declare const imgProps: (props: React.ImgHTMLAttributes<HTMLImageElement> & DataAttr) => WithoutRef<React.ImgHTMLAttributes<HTMLImageElement>>;

/**
 * Root document scroll lock with ref-counting for nested overlays.
 *
 * Radix often uses `react-remove-scroll` with portals/focus scope.
 * RefineUI locks only document `overflow`/`position` without extra dependencies.
 */
/**
 * Block background (document) scroll while menus/modals are open.
 * @returns Release function — call on unmount/close
 */
declare function acquireBodyScrollLock(): () => void;

declare function composeRefs<T>(...refs: (Ref<T> | undefined)[]): (instance: T | null) => void;
/** Radix `useComposedRefs` — stable ref callback when merging cloneElement + forwardRef */
declare function useComposedRefs<T>(...refs: (Ref<T> | undefined)[]): (instance: T | null) => void;
/** @deprecated Prefer `composeRefs` */
declare const composeRef: typeof composeRefs;

/**
 * Resolve a single mergeable child so events/refs attach to one element.
 * (Unwraps one Fragment layer; otherwise returns `null` — caller supplies a default button/span wrapper.)
 */
declare function getMergeableTriggerChild(children: ReactNode): ReactElement | null;

type SemanticTextTokenRef<TName extends string = string> = Readonly<{
    type: "semantic-text";
    name: TName;
}>;
type FoundationTypographyTokenRef<TName extends string = string> = Readonly<{
    type: "foundation-typography";
    name: TName;
}>;
declare function semanticTextToken<TName extends string>(name: TName): SemanticTextTokenRef<TName>;
declare function foundationTypographyToken<TName extends string>(name: TName): FoundationTypographyTokenRef<TName>;
/** Tailwind `@utility refineui-typo-*` class for a Foundation typography key (`body2`, `caption1`, …). */
declare function foundationTypographyUtilityClass(foundationKey: string): string;
declare function isSemanticTextTokenRef(value: unknown): value is SemanticTextTokenRef;

export { type AnimationStyleOptions, type ColorTokenRef, type ColorTokenValue, type FoundationTypographyTokenRef, type MotionDuration, type MotionEasing, type MotionPresetName, type PaletteColorTokenRef, type SemanticColorTokenRef, type SemanticTextTokenRef, type TransitionStyleOptions, acquireBodyScrollLock, ariaAttr, buttonProps, composeRef, composeRefs, createAnimationStyle, createTransitionStyle, dataAttr, elementProps, foundationTypographyToken, foundationTypographyUtilityClass, getMergeableTriggerChild, getReducedMotionQuery, hexToRgba, imgProps, inputProps, isColorTokenRef, isSemanticTextTokenRef, labelProps, motionDurations, motionEasings, motionKeyframesCss, motionMsToNumber, motionPresets, paletteColorCssVar, paletteColorToken, resolveColorToken, resolveColorTokenValue, semanticColorCssVar, semanticColorToken, semanticTextToken, shadowWithColor, toKebab, useComposedRefs };
