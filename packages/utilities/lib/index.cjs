"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  acquireBodyScrollLock: () => acquireBodyScrollLock,
  ariaAttr: () => ariaAttr,
  buttonProps: () => buttonProps,
  composeRef: () => composeRef,
  composeRefs: () => composeRefs,
  createAnimationStyle: () => createAnimationStyle,
  createTransitionStyle: () => createTransitionStyle,
  dataAttr: () => dataAttr,
  elementProps: () => elementProps,
  getMergeableTriggerChild: () => getMergeableTriggerChild,
  getReducedMotionQuery: () => getReducedMotionQuery,
  hexToRgba: () => hexToRgba,
  imgProps: () => imgProps,
  inputProps: () => inputProps,
  isColorTokenRef: () => isColorTokenRef,
  labelProps: () => labelProps,
  motionDurations: () => motionDurations,
  motionEasings: () => motionEasings,
  motionKeyframesCss: () => motionKeyframesCss,
  motionMsToNumber: () => motionMsToNumber,
  motionPresets: () => motionPresets,
  paletteColorCssVar: () => paletteColorCssVar,
  paletteColorToken: () => paletteColorToken,
  resolveColorToken: () => resolveColorToken,
  resolveColorTokenValue: () => resolveColorTokenValue,
  semanticColorCssVar: () => semanticColorCssVar,
  semanticColorToken: () => semanticColorToken,
  shadowWithColor: () => shadowWithColor,
  toKebab: () => toKebab,
  useComposedRefs: () => useComposedRefs
});
module.exports = __toCommonJS(index_exports);

// src/animation.ts
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

// src/color.ts
function toKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([a-zA-Z])(\d)/g, "$1-$2").toLowerCase();
}
function semanticColorToken(name) {
  return { type: "semantic", name };
}
function paletteColorToken(name) {
  return { type: "palette", name };
}
function semanticColorCssVar(name) {
  return `var(--refineui-color-alias-${toKebab(name)})`;
}
function paletteColorCssVar(name) {
  return `var(--refineui-color-${toKebab(name)})`;
}
function resolveColorToken(token) {
  return token.type === "semantic" ? semanticColorCssVar(token.name) : paletteColorCssVar(token.name);
}
function isColorTokenRef(value) {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value;
  if (candidate.type !== "semantic" && candidate.type !== "palette") return false;
  return typeof candidate.name === "string";
}
function resolveColorTokenValue(value) {
  return typeof value === "string" ? value : resolveColorToken(value);
}
function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = h.length === 3 ? parseInt(h[0] + h[0], 16) : parseInt(h.slice(0, 2), 16);
  const g = h.length === 3 ? parseInt(h[1] + h[1], 16) : parseInt(h.slice(2, 4), 16);
  const b = h.length === 3 ? parseInt(h[2] + h[2], 16) : parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function shadowWithColor(keyDim, ambientDim, keyColor, ambientColor) {
  return `${keyDim} ${keyColor}, ${ambientDim} ${ambientColor}`;
}

// src/dom.ts
var dataAttr = (guard) => {
  return guard ? "" : void 0;
};
var ariaAttr = (guard) => {
  return guard ? "true" : void 0;
};
var elementProps = (props) => props;
var inputProps = (props) => props;
var labelProps = (props) => props;
var buttonProps = (props) => props;
var imgProps = (props) => props;

// src/bodyScrollLock.ts
var lockCount = 0;
var bodyOverflow = "";
var htmlOverflow = "";
var bodyPosition = "";
var bodyTop = "";
var bodyWidth = "";
var lockedScrollY = 0;
function applyLock() {
  if (typeof document === "undefined") return;
  lockedScrollY = window.scrollY;
  bodyOverflow = document.body.style.overflow;
  htmlOverflow = document.documentElement.style.overflow;
  bodyPosition = document.body.style.position;
  bodyTop = document.body.style.top;
  bodyWidth = document.body.style.width;
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.width = "100%";
}
function releaseLock() {
  if (typeof document === "undefined") return;
  document.body.style.overflow = bodyOverflow;
  document.documentElement.style.overflow = htmlOverflow;
  document.body.style.position = bodyPosition;
  document.body.style.top = bodyTop;
  document.body.style.width = bodyWidth;
  window.scrollTo(0, lockedScrollY);
}
function acquireBodyScrollLock() {
  if (typeof document === "undefined") return () => {
  };
  lockCount += 1;
  if (lockCount === 1) applyLock();
  return () => {
    lockCount -= 1;
    if (lockCount <= 0) {
      lockCount = 0;
      releaseLock();
    }
  };
}

// src/composeRefs.ts
var React = __toESM(require("react"), 1);
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref != null) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (instance) => refs.forEach((ref) => setRef(ref, instance));
}
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs);
}
var composeRef = composeRefs;

// src/mergeTriggerChild.ts
var import_react = require("react");
function getMergeableTriggerChild(children) {
  let node;
  try {
    node = import_react.Children.only(children);
  } catch {
    return null;
  }
  if (!(0, import_react.isValidElement)(node)) return null;
  if (node.type === import_react.Fragment) {
    const inner = import_react.Children.toArray(node.props.children);
    if (inner.length !== 1 || !(0, import_react.isValidElement)(inner[0])) return null;
    return inner[0];
  }
  return node;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  acquireBodyScrollLock,
  ariaAttr,
  buttonProps,
  composeRef,
  composeRefs,
  createAnimationStyle,
  createTransitionStyle,
  dataAttr,
  elementProps,
  getMergeableTriggerChild,
  getReducedMotionQuery,
  hexToRgba,
  imgProps,
  inputProps,
  isColorTokenRef,
  labelProps,
  motionDurations,
  motionEasings,
  motionKeyframesCss,
  motionMsToNumber,
  motionPresets,
  paletteColorCssVar,
  paletteColorToken,
  resolveColorToken,
  resolveColorTokenValue,
  semanticColorCssVar,
  semanticColorToken,
  shadowWithColor,
  toKebab,
  useComposedRefs
});
