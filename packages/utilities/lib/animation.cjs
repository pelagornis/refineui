"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/animation.ts
var animation_exports = {};
__export(animation_exports, {
  createAnimationStyle: () => createAnimationStyle,
  createTransitionStyle: () => createTransitionStyle,
  getReducedMotionQuery: () => getReducedMotionQuery,
  motionDurations: () => motionDurations,
  motionEasings: () => motionEasings,
  motionKeyframesCss: () => motionKeyframesCss,
  motionMsToNumber: () => motionMsToNumber,
  motionPresets: () => motionPresets
});
module.exports = __toCommonJS(animation_exports);
var motionDurations = {
  // Keep in sync with @refineui/tokens semanticInteraction.duration
  instant: "0ms",
  fast: "150ms",
  normal: "180ms",
  slow: "240ms",
  toast: "320ms"
};
var motionEasings = {
  // Keep in sync with @refineui/tokens semanticInteraction.easing
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
  linear: "linear"
};
var motionPresets = {
  fadeIn: { keyframes: "refineui-fade-in", duration: "normal", easing: "standard", fillMode: "both" },
  fadeOut: { keyframes: "refineui-fade-out", duration: "normal", easing: "standard", fillMode: "both" },
  fadeInUp: { keyframes: "refineui-fade-in-up", duration: "normal", easing: "standard", fillMode: "both" },
  fadeInDown: { keyframes: "refineui-fade-in-down", duration: "normal", easing: "standard", fillMode: "both" },
  scaleIn: { keyframes: "refineui-scale-in", duration: "normal", easing: "emphasized", fillMode: "both" },
  scaleOut: { keyframes: "refineui-scale-out", duration: "normal", easing: "emphasized", fillMode: "both" }
};
function createAnimationStyle(options) {
  const preset = motionPresets[options.preset];
  const duration = options.duration ?? preset.duration;
  const easing = options.easing ?? preset.easing;
  if (options.reduceMotion) {
    return {
      animationName: "none",
      animationDuration: motionDurations.instant,
      animationDelay: "0ms"
    };
  }
  return {
    animationName: preset.keyframes,
    animationDuration: typeof duration === "string" && duration in motionDurations ? motionDurations[duration] : duration,
    animationTimingFunction: typeof easing === "string" && easing in motionEasings ? motionEasings[easing] : easing,
    animationDelay: `${Math.max(0, options.delayMs ?? 0)}ms`,
    animationIterationCount: options.iterationCount ?? 1,
    animationDirection: options.direction ?? "normal",
    animationPlayState: options.playState ?? "running",
    animationFillMode: options.fillMode ?? preset.fillMode ?? "both"
  };
}
function createTransitionStyle(options) {
  const duration = options.duration ?? "fast";
  const easing = options.easing ?? "standard";
  const props = Array.isArray(options.properties) ? options.properties.join(", ") : options.properties;
  if (options.reduceMotion) {
    return {
      transitionProperty: props,
      transitionDuration: motionDurations.instant,
      transitionTimingFunction: motionEasings.linear,
      transitionDelay: "0ms"
    };
  }
  return {
    transitionProperty: props,
    transitionDuration: typeof duration === "string" && duration in motionDurations ? motionDurations[duration] : duration,
    transitionTimingFunction: typeof easing === "string" && easing in motionEasings ? motionEasings[easing] : easing,
    transitionDelay: `${Math.max(0, options.delayMs ?? 0)}ms`
  };
}
function getReducedMotionQuery() {
  return "@media (prefers-reduced-motion: reduce)";
}
function motionMsToNumber(value) {
  if (value.endsWith("ms")) return Number.parseFloat(value.slice(0, -2)) || 0;
  if (value.endsWith("s")) return (Number.parseFloat(value.slice(0, -1)) || 0) * 1e3;
  return Number.parseFloat(value) || 0;
}
var motionKeyframesCss = `
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createAnimationStyle,
  createTransitionStyle,
  getReducedMotionQuery,
  motionDurations,
  motionEasings,
  motionKeyframesCss,
  motionMsToNumber,
  motionPresets
});
