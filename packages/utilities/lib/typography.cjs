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

// src/typography.ts
var typography_exports = {};
__export(typography_exports, {
  foundationTypographyToken: () => foundationTypographyToken,
  foundationTypographyUtilityClass: () => foundationTypographyUtilityClass,
  isSemanticTextTokenRef: () => isSemanticTextTokenRef,
  semanticTextToken: () => semanticTextToken
});
module.exports = __toCommonJS(typography_exports);

// src/color.ts
function toKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-zA-Z])(\d)/g, "$1-$2").toLowerCase();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  foundationTypographyToken,
  foundationTypographyUtilityClass,
  isSemanticTextTokenRef,
  semanticTextToken
});
