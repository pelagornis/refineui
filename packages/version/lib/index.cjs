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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  version: () => version
});
module.exports = __toCommonJS(index_exports);

// src/version.ts
var packagesCache = {};
var _win = void 0;
try {
  _win = window;
} catch (e) {
}
function version(packageName, packageVersion) {
  if (typeof _win !== "undefined") {
    const packages = _win.__packages__ = _win.__packages__ || {};
    if (!packages[packageName] || !packagesCache[packageName]) {
      packagesCache[packageName] = packageVersion;
      const versions = packages[packageName] = packages[packageName] || [];
      versions.push(packageVersion);
    }
  }
}

// src/index.ts
version("@refineui/version", "1.0.0");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  version
});
