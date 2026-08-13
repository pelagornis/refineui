// src/animation.ts
var motionDurations = {
  // Resolve via `@refineui/tokens` CSS (Foundation → semanticInteraction roles)
  instant: "var(--refineui-motion-duration-instant)",
  fast: "var(--refineui-motion-duration-fast)",
  normal: "var(--refineui-motion-duration-normal)",
  slow: "var(--refineui-motion-duration-slow)",
  toast: "var(--refineui-motion-duration-panel)"
};
var motionEasings = {
  standard: "var(--refineui-motion-easing-standard)",
  emphasized: "var(--refineui-motion-easing-emphasized)",
  linear: "var(--refineui-motion-easing-linear)"
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
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-zA-Z])(\d)/g, "$1-$2").toLowerCase();
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
import * as React from "react";
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
import { Children, Fragment, isValidElement } from "react";
function getMergeableTriggerChild(children) {
  let node;
  try {
    node = Children.only(children);
  } catch {
    return null;
  }
  if (!isValidElement(node)) return null;
  if (node.type === Fragment) {
    const inner = Children.toArray(node.props.children);
    if (inner.length !== 1 || !isValidElement(inner[0])) return null;
    return inner[0];
  }
  return node;
}

// src/typography.ts
function semanticTextToken(name) {
  return { type: "semantic-text", name };
}
function foundationTypographyToken(name) {
  return { type: "foundation-typography", name };
}
function foundationTypographyUtilityClass(foundationKey) {
  return `refineui-typo-${toKebab(foundationKey)}`;
}
function isSemanticTextTokenRef(value) {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value;
  return candidate.type === "semantic-text" && typeof candidate.name === "string";
}
export {
  acquireBodyScrollLock,
  ariaAttr,
  buttonProps,
  composeRef,
  composeRefs,
  createAnimationStyle,
  createTransitionStyle,
  dataAttr,
  elementProps,
  foundationTypographyToken,
  foundationTypographyUtilityClass,
  getMergeableTriggerChild,
  getReducedMotionQuery,
  hexToRgba,
  imgProps,
  inputProps,
  isColorTokenRef,
  isSemanticTextTokenRef,
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
  semanticTextToken,
  shadowWithColor,
  toKebab,
  useComposedRefs
};
