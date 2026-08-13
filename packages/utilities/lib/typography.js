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
export {
  foundationTypographyToken,
  foundationTypographyUtilityClass,
  isSemanticTextTokenRef,
  semanticTextToken
};
