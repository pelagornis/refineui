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

// src/color.ts
var color_exports = {};
__export(color_exports, {
  hexToRgba: () => hexToRgba,
  isColorTokenRef: () => isColorTokenRef,
  paletteColorCssVar: () => paletteColorCssVar,
  paletteColorToken: () => paletteColorToken,
  resolveColorToken: () => resolveColorToken,
  resolveColorTokenValue: () => resolveColorTokenValue,
  semanticColorCssVar: () => semanticColorCssVar,
  semanticColorToken: () => semanticColorToken,
  shadowWithColor: () => shadowWithColor,
  toKebab: () => toKebab
});
module.exports = __toCommonJS(color_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hexToRgba,
  isColorTokenRef,
  paletteColorCssVar,
  paletteColorToken,
  resolveColorToken,
  resolveColorTokenValue,
  semanticColorCssVar,
  semanticColorToken,
  shadowWithColor,
  toKebab
});
