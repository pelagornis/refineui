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
export {
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
};
