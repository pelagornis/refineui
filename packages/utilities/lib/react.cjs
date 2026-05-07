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

// src/react.ts
var react_exports = {};
__export(react_exports, {
  acquireBodyScrollLock: () => acquireBodyScrollLock,
  composeRef: () => composeRef,
  composeRefs: () => composeRefs,
  getMergeableTriggerChild: () => getMergeableTriggerChild,
  useComposedRefs: () => useComposedRefs
});
module.exports = __toCommonJS(react_exports);

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
  composeRef,
  composeRefs,
  getMergeableTriggerChild,
  useComposedRefs
});
