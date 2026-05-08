import * as React from 'react';
import { CSSProperties, Ref, ReactNode, ReactElement } from 'react';

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
 * hex → rgba 변환 (palette 색상 등)
 */
declare function hexToRgba(hex: string, alpha: number): string;
/** dimension(x y blur spread) + color로 box-shadow 문자열 생성 */
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
 * 루트 문서 스크롤 잠금 — 여러 오버레이가 겹칠 때 refCount로 안전하게 해제.
 *
 * Radix Primitives는 보통 `react-remove-scroll` 등으로 포털·포커스 스코프와 함께 처리합니다.
 * RefineUI는 외부 패키지 추가 없이 동일한 ref-count 패턴으로 문서 `overflow`/`position`만 잠급니다.
 */
/**
 * 메뉴·모달 등이 열렸을 때 배경(문서) 스크롤을 막습니다.
 * @returns 해제 함수 — 반드시 언마운트/닫힐 때 호출
 */
declare function acquireBodyScrollLock(): () => void;

declare function composeRefs<T>(...refs: (Ref<T> | undefined)[]): (instance: T | null) => void;
/** Radix `useComposedRefs` — cloneElement·forwardRef 조합 시 안정적인 ref 콜백 */
declare function useComposedRefs<T>(...refs: (Ref<T> | undefined)[]): (instance: T | null) => void;
/** 하위 호환 별칭 — `composeRefs` 사용 권장 */
declare const composeRef: typeof composeRefs;

/**
 * 트리거에 이벤트·ref 등을 한 엘리먼트에만 합성하기 위한 단일 자식 확인.
 * (Fragment 한 겹만 풀며, 그 외 패턴은 `null` → 호출부에서 기본 래퍼 버튼/스팬 사용.)
 */
declare function getMergeableTriggerChild(children: ReactNode): ReactElement | null;

export { type AnimationStyleOptions, type ColorTokenRef, type ColorTokenValue, type MotionDuration, type MotionEasing, type MotionPresetName, type PaletteColorTokenRef, type SemanticColorTokenRef, type TransitionStyleOptions, acquireBodyScrollLock, ariaAttr, buttonProps, composeRef, composeRefs, createAnimationStyle, createTransitionStyle, dataAttr, elementProps, getMergeableTriggerChild, getReducedMotionQuery, hexToRgba, imgProps, inputProps, isColorTokenRef, labelProps, motionDurations, motionEasings, motionKeyframesCss, motionMsToNumber, motionPresets, paletteColorCssVar, paletteColorToken, resolveColorToken, resolveColorTokenValue, semanticColorCssVar, semanticColorToken, shadowWithColor, toKebab, useComposedRefs };
